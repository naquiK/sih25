const Report = require("../model/report-Model")
const User = require("../model/user-Model")
const sendEmail = require("../utils/sendEmail")

// Update report status (for department admins and workers)
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params
    const { status, resolutionDetails, assignedToId } = req.body
    const userId = req.userInfo.id

    const report = await Report.findById(reportId)
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }
 
    // Check if user has permission to update this report 
    if (req.userInfo.role === "department-admin") {
      if (report.department !== req.userInfo.department) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Report not in your department.",
        })
      }
    } else if (req.userInfo.role === "worker") {
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
    if (assignedToId && req.userInfo.role === "department-admin") {
      // Verify assigned user exists and is in same department
      const assignedUser = await User.findById(assignedToId)
      if (!assignedUser || assignedUser.department !== req.userInfo.department) {
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
    const filter = { department: req.userInfo.department }
    if (req.userInfo.assignedDistrict) {
      filter.district = req.userInfo.assignedDistrict
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
        department: req.userInfo.department,
        district: req.userInfo.assignedDistrict || "All Districts",
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
      department: req.userInfo.department,
      isActive: true,
      accountVerified: true,
    }

    if (req.userInfo.assignedDistrict) {
      filter.assignedDistrict = req.userInfo.assignedDistrict
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
      department: req.userInfo.department,
      isActive: true,
      accountVerified: true,
    }

    if (req.userInfo.assignedDistrict) {
      filter.assignedDistrict = req.userInfo.assignedDistrict
    }

    // Get all workers in the department
    const allWorkers = await User.find(filter).select("fullname email phone assignedDistrict")

    // Get workers who are currently assigned to active reports
    const busyWorkers = await Report.aggregate([
      {
        $match: {
          status: { $in: ["pending", "in-progress"] },
          assignedTo: { $exists: true, $ne: null },
          department: req.userInfo.department,
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
    const role = req.userInfo
    console.log(role)
    if (req.userInfo.role !== "department-admin" && req.userInfo.role !== "state-admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only department admins can assign workers.",
      })
    }

    // For department admin, check if report belongs to their department
    // if (req.userInfo.role === "department-admin" && report.department !== req.userInfo.department) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Report not in your department.",
    //   })
    // }

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

    // if (worker.department !== report.department) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Worker is not in the same department as the report",
    //   })
    // }

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
 

    await report.save()

    // Get the updated report with populated fields
    const updatedReport = await Report.findById(reportId)
      .populate("reportedBy", "fullname email phone District")
      .populate("assignedTo", "fullname email phone department assignedDistrict")

      const useremail = updatedReport.reportedBy.email
     const citizen = await User.findById(updatedReport.reportedBy._id)
const citizenName = citizen ? citizen.fullname : ""
const workers = await User.findById(workerId)
const workerName = workers ? workers.fullname : ""
const workeremail = workers ? workers.email : ""
      const summitedAt = updatedReport.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

      console.log(workerName)

      console.log(workeremail)
      const status =await updatedReport.status
      const department = await updatedReport.department 
      const district = await updatedReport.district
      const issueDescription = await updatedReport.issueDescription

      

      sendreportupdate(citizenName , reportId, department, district, status, workerName, useremail)
      sendtoWorker(workerName, reportId, department, district, issueDescription, summitedAt , workeremail)

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

async function sendreportupdate(citizenName , reportId, department, district, status, workerName , useremail){
   
    try {
            const message = generateEmailTemplate(citizenName , reportId, department, district, status, workerName )
            console.log(useremail)
            sendEmail({email:useremail , subject:"Your report update" , message})
     

        
        
    } catch (error) {
        console.log(error)
       
    }
    
}
async function sendtoWorker(workerName, reportId, department, district, issueDescription, submittedAt ,workeremail) {
   
    try {
            const message = generateEmailTemplateforworker(workerName, reportId, department, district, issueDescription, submittedAt)
            console.log(workeremail)
            sendEmail({email: workeremail , subject:"New Assignment" , message})
     

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"fail to send email to worker", 
            error:error.message
        })
    } 
}

function generateEmailTemplate(citizenName , reportId, department, district, status, workerName ){
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #0B5ED7; text-align: center;">Jharkhand Civic Portal - Worker Assigned</h2>
    
    <p style="font-size: 16px; color: #333;">Dear ${citizenName},</p>
    
    <p style="font-size: 16px; color: #333;">
      Good news! A field worker has been <strong>assigned</strong> to your reported issue.  
      Our team is now actively working to resolve the matter.
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
        <strong>Status:</strong> ${status}
      </p>
      <p style="margin: 6px 0; font-size: 15px; color: #555;">
        <strong>Assigned Worker:</strong> ${workerName}
      </p>

    </div>

    <p style="font-size: 16px; color: #333;">
      You can track live updates about your report and progress by clicking the button below:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="https://citizen.jharkhand.gov.in/reports/${reportId}" 
         style="display: inline-block; padding: 12px 24px; background-color: #0B5ED7; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
        Track Report
      </a>
    </div>

  
    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br>Jharkhand Civic Portal Team</p>
      <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
    </footer>
  </div>
`;

}

function generateEmailTemplateforworker(workerName, reportId, department, district, issueDescription, submittedAt) {
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



    <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br>Jharkhand Civic Portal Admin</p>
      <p style="font-size: 12px; color: #aaa;">This is an automated assignment notification. Please do not reply to this email.</p>
    </footer>
  </div>
`;

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

    // if (req.userInfo.role === "department-admin" && worker.department !== req.userInfo.department) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. Worker not in your department.",
    //   })
    // }

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
