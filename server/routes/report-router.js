const express = require("express")
const multer = require("multer")
const path = require("path")
const {
  createReport,
  getUserReports,
  getAllReportsForAdmin,
  getUnassignedReportsByVillage,
  // assign and status may exist in controller; keep imports if implemented
  // assignReport,
  // updateStatus,
} = require("../controller/report-controller")
const authMiddleware = require("../middleware/auth-middleware")
const { anyAdminMiddleware } = require("../middleware/admin-middleware")

const router = express.Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"))
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024, files: 5 } })

const uploadFields = upload.fields([
  { name: "photos", maxCount: 5 },
  { name: "voice", maxCount: 1 },
])

// citizen scoped
router.get("/my", authMiddleware, getUserReports)
router.post("/", authMiddleware, uploadFields, createReport)

// admin listings
router.get("/admin", anyAdminMiddleware, getAllReportsForAdmin)

router.get("/unassigned", authMiddleware, getUnassignedReportsByVillage)

// keep assign/status only if implemented in controller
// router.patch("/:id/assign", anyAdminMiddleware, assignReport)
// router.patch("/:id/status", anyAdminMiddleware, updateStatus)

module.exports = router
