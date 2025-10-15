const Event = require("../model/event-Model")
const cloudinary = require("../config/cloudinary")

async function createEvent(req, res) {
  try {
    const { village, data } = req.body
    const payload = typeof data === "string" ? JSON.parse(data) : data
    const doc = {
      ...payload,
      village,
      createdBy: req.userInfo?.id || null,
    }
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: "events" })
      doc.bannerUrl = upload.secure_url
    }
    const ev = await Event.create(doc)
    res.json({ success: true, event: ev })
  } catch (e) {
    console.error("[v0] createEvent error", e)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

async function listEvents(req, res) {
  try {
    const { village } = req.query
    const q = village ? { village } : {}
    const events = await Event.find(q).sort({ createdAt: -1 })
    res.json({ success: true, events })
  } catch (e) {
    console.error("[v0] listEvents error", e)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

module.exports = { createEvent, listEvents }
