const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed for image field"), false)
    }
  } else if (file.fieldname === "voice") {
    // Accept only audio files
    if (file.mimetype.startsWith("audio/") || file.mimetype === "video/mp4" || file.mimetype === "video/webm") {
      cb(null, true)
    } else {
      cb(new Error("Only audio files are allowed for voice field"), false)
    }
  } else {
    cb(new Error("Unexpected field"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB for voice files
    files: 2, // Allow up to 2 files (image + voice)
  },
  fileFilter: fileFilter,
})

module.exports = {
  uploadReportFiles: upload.fields([
    { name: "image", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  upload,
}
 