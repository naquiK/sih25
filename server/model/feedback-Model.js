const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: String }],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Feedback", feedbackSchema)
