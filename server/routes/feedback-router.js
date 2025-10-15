const express = require("express")
const path = require("path")
const multer = require("multer")
const { submitFeedback } = require("../controller/feedback-controller")
const authMiddleware = require("../middleware/auth-middleware")

const router = express.Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"))
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"))
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024, files: 5 } })

router.post("/", authMiddleware, upload.array("files", 5), submitFeedback)

module.exports = router
