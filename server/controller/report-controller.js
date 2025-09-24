const Report = require("../model/report-Model")
const User = require("../model/user-Model") // Added User model import
const cloudinary = require("../config/cloudinary")
const fs = require("fs")
const sendEmail = require("../utils/sendEmail")

const createReport = async (req, res) => {
  try {
    const { category, description, location, latitude, longitude, urgencylevel, district } = req.body
    const userId = req.userInfo.id // From auth middleware
    const fullname = req.userInfo.fullname
    const email = req.userInfo.email
    const phone = req.userInfo.phone
    const verificationMethod = req.body.verificationMethod || "email"

  


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

    // Create and save report department will be auto-assigned by pre-save middleware
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

    const reportId = newReport._id
    const department = newReport.department
    const status = newReport.status
    const submittedAt = newReport.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    const DepartmentDistrict =  newReport.district
   
    sendreport(verificationMethod , fullname , reportId, department, DepartmentDistrict, status, submittedAt  , email , phone )

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
async function sendreport(verificationMethod , fullname , reportId, department, district, status, submittedAt  , email){
   
    try {
        if(verificationMethod==="email"){
            const message = generateEmailTemplate(fullname , reportId, department, district, status, submittedAt)
            sendEmail({email , subject:"Your report" , message})
     

        } 
        // else (verificationMethod === "text_message") {
            
        //     await client.messages.create({
        //       body: `Your verification code is ${fullname , reportId, department, district, status, submittedAt}.`,
        //       from: process.env.TWILIO_PHONE_NUMBER,
        //       to: phone,
        //     });
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"fail to send email",
            error:error.message
        })
    }
    
}

async function sendtoWorker(workerName, reportId, department, district, citizenName, citizenContact, issueDescription, submittedAt, districtHelpline, workerEmail) {
   
    try {
            const message = generateEmailTemplateforworker(workerName, reportId, department, district, citizenName, citizenContact, issueDescription, submittedAt, districtHelpline)
            sendEmail({email: workerEmail , subject:"New Assignment" , message})
     

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"fail to send email to worker",
            error:error.message
        })
    }
}

function generateEmailTemplate(fullname , reportId, department, district, status, submittedAt) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #0B5ED7; text-align: center;">Jharkhand Civic Portal - Report Received</h2>
    
    <p style="font-size: 16px; color: #333;">Dear ${fullname},</p>
    
    <p style="font-size: 16px; color: #333;">
      Thank you for reporting the issue. Your report has been successfully submitted and forwarded to the <strong>${department}</strong> in <strong>${district}</strong>.
    </p>

    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 6px; background-color: #fff;">
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Report ID:</strong> ${reportId}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Submitted:</strong> ${submittedAt}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Status:</strong> ${status}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Expected Response By:</strong> Within 72 hours
      </p>
    </div>

    <p style="font-size: 16px; color: #333;">
      You can track the progress of your report anytime by clicking the button below:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <a " 
         style="display: inline-block; padding: 12px 24px; background-color: #0B5ED7; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
        View Report
      </a>
    </div>


    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br>Jharkhand Civic Portal Team</p>
      <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
    </footer>
  </div>
`;

}

function generateEmailTemplateforworker(workerName, reportId, department, district, citizenName, citizenContact, issueDescription, submittedAt, districtHelpline) {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #0B5ED7; text-align: center;">Jharkhand Civic Portal - New Assignment</h2>
    
    <p style="font-size: 16px; color: #333;">Dear ${workerName},</p>
    
    <p style="font-size: 16px; color: #333;">
      You have been <strong>assigned</strong> a new civic issue report. Please review the details below and take the necessary action.
    </p>

    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 6px; background-color: #fff;">
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Report ID:</strong> ${reportId}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Department:</strong> ${department}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>District:</strong> ${district}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Issue Description:</strong><br>
        ${issueDescription}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Submitted On:</strong> ${submittedAt}
      </p>
    </div>

    <p style="font-size: 16px; color: #333;">
      Please log in to the worker portal to update the status and mark progress:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="https://worker.jharkhand.gov.in/assignments/${reportId}" 
         style="display: inline-block; padding: 12px 24px; background-color: #0B5ED7; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
        View Assignment
      </a>
    </div>

    <p style="font-size: 14px; color: #555;">
      Ensure timely updates so that the citizen stays informed about the progress.  
      For support, contact your supervisor or the district control room: <strong>${districtHelpline}</strong>.
    </p>

    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br>Jharkhand Civic Portal Admin</p>
      <p style="font-size: 12px; color: #aaa;">This is an automated assignment notification. Please do not reply to this email.</p>
    </footer>
  </div>
`;

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

    if (req.userInfo.role === "department-admin") {
      filter.department = req.userInfo.department
      if (req.userInfo.assignedDistrict) {
        filter.district = req.userInfo.assignedDistrict
      }
    } else if (req.userInfo.role === "district-admin") {
      filter.district = req.userInfo.assignedDistrict
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
