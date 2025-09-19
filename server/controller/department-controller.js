const Report = require("../model/report-Model")
const User = require("../model/user-Model")

// Update report status (for department admins and workers)
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params
    const { status, resolutionDetails, assignedToId } = req.body
    const userId = req.user.id

    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    // Check if user has permission to update this report
    if (req.user.role === "department-admin") {
      if (report.department !== req.user.department) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Report not in your department.",
        })
      }
    } else if (req.user.role === "worker") {
      if (report.assignedTo?.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Report not assigned to you.",
        })
      }
    }

    // Update report fields
    if (status) report.status = status
    if (resolutionDetails) report.resolutionDetails = resolutionDetails
    if (assignedToId && req.user.role === "department-admin") {
      // Verify assigned user exists and is in same department
      const assignedUser = await User.findById(assignedToId)
      if (!assignedUser || assignedUser.department !== req.user.department) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user",
        })
      }
      report.assignedTo = assignedToId
    }

    if (status === "resolved") {
      report.resolvedAt = new Date()
    }

    await report.save()

    const updatedReport = await Report.findById(reportId)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email department")

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    })
  } catch (error) {
    console.error("Update report status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    })
  }
}

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const filter = { department: req.user.department }
    if (req.user.assignedDistrict) {
      filter.district = req.user.assignedDistrict
    }

    const [totalReports, pendingReports, inProgressReports, resolvedReports, criticalReports] = await Promise.all([
      Report.countDocuments(filter),
      Report.countDocuments({ ...filter, status: "pending" }),
      Report.countDocuments({ ...filter, status: "in-progress" }),
      Report.countDocuments({ ...filter, status: "resolved" }),
      Report.countDocuments({ ...filter, urgencylevel: "critical" }),
    ])

    res.status(200).json({
      success: true,
      data: {
        total: totalReports,
        pending: pendingReports,
        inProgress: inProgressReports,
        resolved: resolvedReports,
        critical: criticalReports,
        department: req.user.department,
        district: req.user.assignedDistrict || "All Districts",
      },
    })
  } catch (error) {
    console.error("Department stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    })
  }
}

// Get workers in department
const getDepartmentWorkers = async (req, res) => {
  try {
    const filter = {
      role: "worker",
      department: req.user.department,
      isActive: true,
      accountVerified: true,
    }

    if (req.user.assignedDistrict) {
      filter.assignedDistrict = req.user.assignedDistrict
    }

    const workers = await User.find(filter).select("fullname email phone assignedDistrict").sort({ fullname: 1 })

    res.status(200).json({
      success: true,
      data: workers,
    })
  } catch (error) {
    console.error("Get department workers error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
      error: error.message,
    })
  }
}

const getAvailableWorkers = async (req, res) => {
  try {
    const filter = {
      role: "worker",
      department: req.user.department,
      isActive: true,
      accountVerified: true,
    }

    if (req.user.assignedDistrict) {
      filter.assignedDistrict = req.user.assignedDistrict
    }

    // Get all workers in the department
    const allWorkers = await User.find(filter).select("fullname email phone assignedDistrict")

    // Get workers who are currently assigned to active reports
    const busyWorkers = await Report.aggregate([
      {
        $match: {
          status: { $in: ["pending", "in-progress"] },
          assignedTo: { $exists: true, $ne: null },
          department: req.user.department,
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          activeReports: { $sum: 1 },
          reports: { $push: { _id: "$_id", status: "$status", urgencylevel: "$urgencylevel" } },
        },
      },
    ])

    // Create a map of busy workers with their workload
    const busyWorkerMap = new Map()
    busyWorkers.forEach((worker) => {
      busyWorkerMap.set(worker._id.toString(), {
        activeReports: worker.activeReports,
        reports: worker.reports,
      })
    })

    // Categorize workers by availability
    const availableWorkers = []
    const busyWorkersInfo = []

    allWorkers.forEach((worker) => {
      const workerId = worker._id.toString()
      const workload = busyWorkerMap.get(workerId)

      if (!workload || workload.activeReports === 0) {
        // Worker is completely free
        availableWorkers.push({
          ...worker.toObject(),
          status: "available",
          activeReports: 0,
        })
      } else {
        // Worker has active assignments
        busyWorkersInfo.push({
          ...worker.toObject(),
          status: "busy",
          activeReports: workload.activeReports,
          reports: workload.reports,
        })
      }
    })

    res.status(200).json({
      success: true,
      data: {
        available: availableWorkers,
        busy: busyWorkersInfo,
        summary: {
          totalWorkers: allWorkers.length,
          availableCount: availableWorkers.length,
          busyCount: busyWorkersInfo.length,
        },
      },
    })
  } catch (error) {
    console.error("Get available workers error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch available workers",
      error: error.message,
    })
  }
}

const assignWorkerToReport = async (req, res) => {
  try {
    const { reportId } = req.params
    const { workerId, priority } = req.body

    // Validate inputs
    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "Worker ID is required",
      })
    }

    // Find the report
    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    // Check if user has permission to assign workers to this report
    if (req.user.role !== "department-admin" && req.user.role !== "state-admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only department admins can assign workers.",
      })
    }

    // For department admin, check if report belongs to their department
    if (req.user.role === "department-admin" && report.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Report not in your department.",
      })
    }

    // Verify the worker exists and is in the same department
    const worker = await User.findById(workerId)
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      })
    }

    if (worker.role !== "worker") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a worker",
      })
    }

    if (worker.department !== report.department) {
      return res.status(400).json({
        success: false,
        message: "Worker is not in the same department as the report",
      })
    }

    if (!worker.isActive || !worker.accountVerified) {
      return res.status(400).json({
        success: false,
        message: "Worker is not active or verified",
      })
    }

    // Check worker's current workload
    const currentWorkload = await Report.countDocuments({
      assignedTo: workerId,
      status: { $in: ["pending", "in-progress"] },
    })

    // Update the report
    report.assignedTo = workerId
    report.status = "in-progress"
    if (priority) report.priority = priority

    await report.save()

    // Get the updated report with populated fields
    const updatedReport = await Report.findById(reportId)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email phone department assignedDistrict")

    res.status(200).json({
      success: true,
      message: "Worker assigned successfully",
      data: {
        report: updatedReport,
        workerWorkload: {
          previousActiveReports: currentWorkload,
          newActiveReports: currentWorkload + 1,
        },
      },
    })
  } catch (error) {
    console.error("Assign worker error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to assign worker",
      error: error.message,
    })
  }
}

const getWorkerWorkload = async (req, res) => {
  try {
    const { workerId } = req.params

    // Verify worker exists and belongs to the department
    const worker = await User.findById(workerId)
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      })
    }

    if (req.user.role === "department-admin" && worker.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker not in your department.",
      })
    }

    // Get worker's active reports
    const activeReports = await Report.find({
      assignedTo: workerId,
      status: { $in: ["pending", "in-progress"] },
    })
      .populate("reportedBy", "fullname phone")
      .sort({ priority: -1, createdAt: 1 })

    // Get worker's completed reports (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const completedReports = await Report.countDocuments({
      assignedTo: workerId,
      status: "resolved",
      resolvedAt: { $gte: thirtyDaysAgo },
    })

    // Calculate performance metrics
    const totalAssigned = await Report.countDocuments({
      assignedTo: workerId,
      createdAt: { $gte: thirtyDaysAgo },
    })

    const performanceRate = totalAssigned > 0 ? (completedReports / totalAssigned) * 100 : 0

    res.status(200).json({
      success: true,
      data: {
        worker: {
          id: worker._id,
          name: worker.fullname,
          email: worker.email,
          phone: worker.phone,
          department: worker.department,
          assignedDistrict: worker.assignedDistrict,
        },
        workload: {
          activeReports: activeReports.length,
          completedLast30Days: completedReports,
          totalAssignedLast30Days: totalAssigned,
          performanceRate: Math.round(performanceRate),
        },
        activeReportsList: activeReports,
      },
    })
  } catch (error) {
    console.error("Get worker workload error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch worker workload",
      error: error.message,
    })
  }
}

module.exports = {
  updateReportStatus,
  getDepartmentStats,
  getDepartmentWorkers,
  getAvailableWorkers,
  assignWorkerToReport,
  getWorkerWorkload,
}
