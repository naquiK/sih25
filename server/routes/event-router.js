const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth-middleware")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const { createEvent, listEvents } = require("../controller/event-controller")

router.get("/events", listEvents)
router.post("/events", auth, upload.single("banner"), createEvent)

module.exports = router
