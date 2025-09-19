const express = require("express")
const router = express.Router()
const stateAdminMiddleware = require("../middleware/state-admin-middleware")
const {
  getAllReports,
  getReportsByDepartment,
  getReportsByDistrict,
  assignReport,
  getDashboardAnalytics,
  getFiltersData,
} = require("../controller/state-admin-controller")

// Apply state admin middleware to all routes
router.use(stateAdminMiddleware)

// Dashboard and analytics routes
router.get("/dashboard/analytics", getDashboardAnalytics)
router.get("/filters", getFiltersData)

// Reports management routes
router.get("/reports", getAllReports)
router.get("/reports/department/:department", getReportsByDepartment)
router.get("/reports/district/:district", getReportsByDistrict)
router.put("/reports/:reportId/assign", assignReport)

module.exports = router
