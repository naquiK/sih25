const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    village: { type: mongoose.Schema.Types.ObjectId, ref: "Village", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    eventDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    audience: { type: String },
    registration: {
      required: { type: Boolean, default: false },
      maxParticipants: Number,
      deadline: String,
    },
    contact: {
      organization: String,
      person: String,
      phone: String,
      email: String,
    },
    tags: [{ type: String }],
    bannerUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Event", eventSchema)
