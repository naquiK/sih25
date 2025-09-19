const Report = require("../model/report-Model")
const User = require("../model/user-Model")

// Get all reports with filtering options
const getAllReports = async (req, res) => {
  try {
    const {
      department,
      district,
      status,
      urgencylevel,
      category,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    // Build filter object
    const filter = {}
    if (department && department !== "all") filter.department = department
    if (district && district !== "all") filter.district = district
    if (status && status !== "all") filter.status = status
    if (urgencylevel && urgencylevel !== "all") filter.urgencylevel = urgencylevel
    if (category && category !== "all") filter.category = category

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get reports with population
    const reports = await Report.find(filter)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email department")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const totalReports = await Report.countDocuments(filter)
    const totalPages = Math.ceil(totalReports / Number.parseInt(limit))

    // Get statistics
    const stats = await getReportStatistics(filter)

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalReports,
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
        },
        statistics: stats,
      },
    })
  } catch (error) {
    console.error("Get all reports error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    })
  }
}

// Get report statistics
const getReportStatistics = async (filter = {}) => {
  try {
    const [
      totalReports,
      pendingReports,
      inProgressReports,
      resolvedReports,
      criticalReports,
      departmentStats,
      districtStats,
    ] = await Promise.all([
      Report.countDocuments(filter),
      Report.countDocuments({ ...filter, status: "pending" }),
      Report.countDocuments({ ...filter, status: "in-progress" }),
      Report.countDocuments({ ...filter, status: "resolved" }),
      Report.countDocuments({ ...filter, urgencylevel: "critical" }),
      Report.aggregate([
        { $match: filter },
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Report.aggregate([
        { $match: filter },
        { $group: { _id: "$district", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ])

    return {
      total: totalReports,
      pending: pendingReports,
      inProgress: inProgressReports,
      resolved: resolvedReports,
      critical: criticalReports,
      byDepartment: departmentStats,
      byDistrict: districtStats,
    }
  } catch (error) {
    console.error("Statistics error:", error)
    return {}
  }
}

// Get reports by department
const getReportsByDepartment = async (req, res) => {
  try {
    const { department } = req.params
    const { page = 1, limit = 10, status, urgencylevel, district } = req.query

    const filter = { department }
    if (status && status !== "all") filter.status = status
    if (urgencylevel && urgencylevel !== "all") filter.urgencylevel = urgencylevel
    if (district && district !== "all") filter.district = district

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const reports = await Report.find(filter)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const totalReports = await Report.countDocuments(filter)
    const totalPages = Math.ceil(totalReports / Number.parseInt(limit))

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalReports,
        },
      },
    })
  } catch (error) {
    console.error("Get reports by department error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch department reports",
      error: error.message,
    })
  }
}

// Get reports by district
const getReportsByDistrict = async (req, res) => {
  try {
    const { district } = req.params
    const { page = 1, limit = 10, status, urgencylevel, department } = req.query

    const filter = { district }
    if (status && status !== "all") filter.status = status
    if (urgencylevel && urgencylevel !== "all") filter.urgencylevel = urgencylevel
    if (department && department !== "all") filter.department = department

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const reports = await Report.find(filter)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const totalReports = await Report.countDocuments(filter)
    const totalPages = Math.ceil(totalReports / Number.parseInt(limit))

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalReports,
        },
      },
    })
  } catch (error) {
    console.error("Get reports by district error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch district reports",
      error: error.message,
    })
  }
}

// Assign report to department admin or worker
const assignReport = async (req, res) => {
  try {
    const { reportId } = req.params
    const { assignedToId, priority } = req.body

    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    // Verify the assigned user exists and has appropriate role
    const assignedUser = await User.findById(assignedToId)
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      })
    }

    if (!["department-admin", "worker"].includes(assignedUser.role)) {
      return res.status(400).json({
        success: false,
        message: "Can only assign to department admin or worker",
      })
    }

    // Update report
    report.assignedTo = assignedToId
    report.status = "in-progress"
    if (priority) report.priority = priority

    await report.save()

    const updatedReport = await Report.findById(reportId)
      .populate("reportedBy", "fullname email phone")
      .populate("assignedTo", "fullname email department")

    res.status(200).json({
      success: true,
      message: "Report assigned successfully",
      data: updatedReport,
    })
  } catch (error) {
    console.error("Assign report error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to assign report",
      error: error.message,
    })
  }
}

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { timeframe = "month" } = req.query

    let dateFilter = {}
    const now = new Date()

    switch (timeframe) {
      case "week":
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } }
        break
      case "month":
        dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } }
        break
      case "year":
        dateFilter = { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } }
        break
    }

    const analytics = await getReportStatistics(dateFilter)

    // Get trend data
    const trendData = await Report.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ])

    res.status(200).json({
      success: true,
      data: {
        analytics,
        trends: trendData,
      },
    })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    })
  }
}

// Get all departments and districts for filters
const getFiltersData = async (req, res) => {
  try {
    const [departments, districts, categories, urgencyLevels, statuses] = await Promise.all([
      Report.distinct("department"),
      Report.distinct("district"),
      Report.distinct("category"),
      Report.distinct("urgencylevel"),
      Report.distinct("status"),
    ])

    res.status(200).json({
      success: true,
      data: {
        departments,
        districts,
        categories,
        urgencyLevels,
        statuses,
      },
    })
  } catch (error) {
    console.error("Get filters data error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch filter options",
      error: error.message,
    })
  }
}

module.exports = {
  getAllReports,
  getReportsByDepartment,
  getReportsByDistrict,
  assignReport,
  getDashboardAnalytics,
  getFiltersData,
}
