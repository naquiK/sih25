const express = require("express")
const {
  createReport,
  getUserReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controller/report-controller")

const { uploadReportFiles } = require("../middleware/upload-middleware")
const authMiddleware = require("../middleware/auth-middleware")

const router = express.Router()

router.post("/create", authMiddleware, uploadReportFiles, createReport)

router.get("/my-reports", authMiddleware, getUserReports)

router.get("/:reportId", authMiddleware, getReportById)

router.put("/:reportId", authMiddleware, updateReport)

router.delete("/:reportId", authMiddleware, deleteReport)

module.exports = router
