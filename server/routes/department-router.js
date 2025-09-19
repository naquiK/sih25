
const express = require("express")
const router = express.Router()
const { departmentAdminMiddleware, anyAdminMiddleware } = require("../middleware/admin-middleware")
const {
  updateReportStatus,
  getDepartmentStats,
  getDepartmentWorkers,
  getAvailableWorkers,
  assignWorkerToReport,
  getWorkerWorkload,
} = require("../controller/department-controller")

// Department admin routes
router.use(anyAdminMiddleware)

router.put("/reports/:reportId/status", updateReportStatus)
router.get("/stats", getDepartmentStats)
router.get("/workers", departmentAdminMiddleware, getDepartmentWorkers)

// Get available workers (shows busy and available workers)
router.get("/workers/available", departmentAdminMiddleware, getAvailableWorkers)

// Assign worker to a specific report
router.post("/reports/:reportId/assign-worker", departmentAdminMiddleware, assignWorkerToReport)

// Get specific worker's workload and performance
router.get("/workers/:workerId/workload", getWorkerWorkload)

module.exports = router
