const Feedback = require("../model/feedback-Model")

const submitFeedback = async (req, res) => {
  try {
    const { category, title, description } = req.body
    if (!category || !title || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }
    const attachments = Array.isArray(req.files) ? req.files.map((f) => `/uploads/${f.filename}`) : []
    const submittedBy = req.userInfo?.id || null
    const fb = await Feedback.create({ category, title, description, submittedBy, attachments })
    return res.status(201).json({ success: true, data: fb })
  } catch (error) {
    console.error("submitFeedback error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = { submitFeedback }
