const Report = require("../model/report-Model")
const User = require("../model/user-Model") // Added User model import
const cloudinary = require("../config/cloudinary")
const fs = require("fs")

const createReport = async (req, res) => {
  try {
    const { category, description, location, latitude, longitude, urgencylevel, district } = req.body
    const userId = req.userInfo.id // From auth middleware

    // Validate required fields
    if (!category || !location || !urgencylevel) {
      return res.status(400).json({
        success: false,
        message: "Category, location, and urgency level are required",
      })
    }

    // Check if either description or voice is provided
    if (!description && !req.files?.voice) {
      return res.status(400).json({
        success: false,
        message: "Either description or voice recording is required",
      })
    }

    // Check if image is provided
    if (!req.files?.image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const reportDistrict = district || user.District || user.district || "unknown"

    console.log(` DEBUG - User district info:`, {
      userDistrict: user.District,
      userDistrictLower: user.district,
      providedDistrict: district,
      finalDistrict: reportDistrict,
    })

    let imgResult, voiceResult

    // Upload image to cloudinary
    try {
      imgResult = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "civic-reports/images",
        resource_type: "image",
      })

      // Delete local file after upload
      fs.unlinkSync(req.files.image[0].path)
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      })
    }

    // Upload voice if provided
    if (req.files?.voice) {
      try {
        voiceResult = await cloudinary.uploader.upload(req.files.voice[0].path, {
          folder: "civic-reports/voice",
          resource_type: "video", // Cloudinary uses 'video' for audio files
        })

        // Delete local file after upload
        fs.unlinkSync(req.files.voice[0].path)
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload voice recording",
          error: error.message,
        })
      }
    }

    // Create report object
    const reportData = {
      category,
      reportedBy: userId,
      description: description || null,
      location,
      district: reportDistrict,
      imgurl: imgResult.secure_url,
      imgpublicId: imgResult.public_id,
      urgencylevel,
    }

    // Add coordinates if provided
    if (latitude && longitude) {
      reportData.coordinates = {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      }
    }

    // Add voice data if uploaded
    if (voiceResult) {
      reportData.voiceurl = voiceResult.secure_url
      reportData.voicepublicId = voiceResult.public_id
    }

    console.log(` DEBUG - Report data before save:`, {
      category: reportData.category,
      district: reportData.district,
      department: reportData.department || "will be auto-assigned",
    })

    // Create and save report (department will be auto-assigned by pre-save middleware)
    const newReport = new Report(reportData)
    await newReport.save()

    console.log(`DEBUG - Report saved successfully:`, {
      id: newReport._id,
      category: newReport.category,
      department: newReport.department,
      district: newReport.district,
    })

    try {
      console.log(
        ` Attempting to assign report to department: ${newReport.department} in district: ${user.District}`,
      )

      const departmentAdmin = await User.findOne({
        role: "department-admin",
        department: newReport.department,
        assignedDistrict: user.District,
        isActive: true,
        accountVerified: true,
      })

      if (departmentAdmin) {
        newReport.assignedTo = departmentAdmin._id
        newReport.status = "in-progress"
        await newReport.save()

        console.log(` Report successfully assigned to ${departmentAdmin.fullname} (${departmentAdmin.email})`)

       
      } else {
        console.log(
          `No available department admin found for department: ${newReport.department} in district: ${user.District}`,
        )

        // Try to assign to state admin as fallback
        const stateAdmin = await User.findOne({
          role: "state-admin",
          isActive: true,
          accountVerified: true,
        })

        if (stateAdmin) {
          newReport.assignedTo = stateAdmin._id
          newReport.status = "pending"
          await newReport.save()
          console.log(` Report escalated to state admin: ${stateAdmin.fullname}`)
        }
      }
    } catch (assignError) {
      console.log(` Could not auto-assign to department admin: ${assignError.message}`)
      // Continue without assignment - report remains pending
    }

    // Populate user details for response
    await newReport.populate("reportedBy", "fullname email phone District")
    await newReport.populate("assignedTo", "fullname email department")

    res.status(201).json({
      success: true,
      message: `Report filed successfully and automatically routed to ${newReport.department} department`,
      data: {
        ...newReport.toObject(),
        routingInfo: {
          category: newReport.category,
          assignedDepartment: newReport.department,
          autoRouted: true,
        },
      },
    })
  } catch (error) {
    console.error("Error creating report:", error)

    console.log(` DEBUG - Full error details:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })

    // Clean up uploaded files if error occurs
    if (req.files?.image) {
      try {
        fs.unlinkSync(req.files.image[0].path)
      } catch (e) {}
    }
    if (req.files?.voice) {
      try {
        fs.unlinkSync(req.files.voice[0].path)
      } catch (e) {}
    }

    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    })
  }
}

const getUserReports = async (req, res) => {
  try {
    const userId = req.userInfo.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reports = await Report.find({ reportedBy: userId })
      .populate("reportedBy", "name email phone")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalReports = await Report.countDocuments({ reportedBy: userId })

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReports / limit),
        totalReports,
        hasNext: page < Math.ceil(totalReports / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching user reports:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    })
  }
}

const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params
    const userId = req.userInfo.id

    const report = await Report.findOne({
      _id: reportId,
      reportedBy: userId,
    })
      .populate("reportedBy", "name email phone")
      .populate("assignedTo", "name email")

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    res.status(200).json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("Error fetching report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    })
  }
}

const updateReport = async (req, res) => {
  try {
    const { reportId } = req.params
    const { description, urgencylevel } = req.body
    const userId = req.userInfo.id

    const report = await Report.findOne({
      _id: reportId,
      reportedBy: userId,
      status: "pending", // Only pending reports can be updated
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or cannot be updated",
      })
    }

    // Update allowed fields
    if (description !== undefined) report.description = description
    if (urgencylevel !== undefined) report.urgencylevel = urgencylevel

    await report.save()

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    })
  } catch (error) {
    console.error("Error updating report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    })
  }
}

const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params
    const userId = req.userInfo.id

    const report = await Report.findOne({
      _id: reportId,
      reportedBy: userId,
      status: "pending",
    })

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or cannot be deleted",
      })
    }

    // Delete files from cloudinary
    if (report.imgpublicId) {
      await cloudinary.uploader.destroy(report.imgpublicId)
    }
    if (report.voicepublicId) {
      await cloudinary.uploader.destroy(report.voicepublicId, { resource_type: "video" })
    }

    await Report.findByIdAndDelete(reportId)

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    })
  }
}

const getAllReportsForAdmin = async (req, res) => {
  try {
    const { department, district, status, urgencylevel, page = 1, limit = 10 } = req.query

    // Build filter based on user role
    const filter = {}

    if (req.user.role === "department-admin") {
      filter.department = req.user.department
      if (req.user.assignedDistrict) {
        filter.district = req.user.assignedDistrict
      }
    } else if (req.user.role === "district-admin") {
      filter.district = req.user.assignedDistrict
    }
    // state-admin can see all reports (no additional filters)

    // Apply query filters
    if (department && department !== "all") filter.department = department
    if (district && district !== "all") filter.district = district
    if (status && status !== "all") filter.status = status
    if (urgencylevel && urgencylevel !== "all") filter.urgencylevel = urgencylevel

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const reports = await Report.find(filter)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const totalReports = await Report.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalReports / Number.parseInt(limit)),
          totalReports,
          hasNext: Number.parseInt(page) < Math.ceil(totalReports / Number.parseInt(limit)),
          hasPrev: Number.parseInt(page) > 1,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching admin reports:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    })
  }
}

module.exports = {
  createReport,
  getUserReports,
  getReportById,
  updateReport,
  deleteReport,
  getAllReportsForAdmin,
}
