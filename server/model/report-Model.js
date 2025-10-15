const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "watersupply",
        "streetlight",
        "garbage",
        "water-leakage",
        "traficlight",
        "road-damage",
        "sewerage",
        "electricity-outage",
        "public-transport",
        "healthcare",
        "education",
        "law-order",
        "fire-emergency",
        "building-permit",
        "other",
      ],
      required: [true, "Category is required"],
    },
    department: {
      type: String,
      enum: [
        "water-supply",
        "electricity",
        "sanitation",
        "transportation",
        "public-works",
        "health",
        "education",
        "police",
        "fire-department",
        "municipal-corporation",
        "other",
      ],
      required: false,
    },
    district: {
      type: String,
      required: false, // make optional (controller sets default 'Unknown')
      default: "Unknown",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow anonymous report if not logged in
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false, // optional; we also have village
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    imgurl: {
      type: String,
      required: false, // not required anymore
    },
    imgpublicId: {
      type: String,
      required: false, // not required anymore
    },
    voiceurl: { type: String },
    voicepublicId: { type: String },
    urgencylevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: [true, "Urgency level is required"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: Number,
      default: function () {
        const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 }
        return priorityMap[this.urgencylevel] || 1
      },
    },
    resolutionDetails: { type: String },
    resolvedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    title: { type: String },
    village: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true },
)

reportSchema.pre("save", function (next) {
  const toSlug = (s = "") =>
    String(s)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

  if (this.category) this.category = toSlug(this.category)
  if (this.urgencylevel) this.urgencylevel = toSlug(this.urgencylevel)

  if (!this.description && !this.voiceurl) {
    const error = new Error("Either description or voice recording is required")
    error.name = "ValidationError"
    return next(error)
  }

  if (!this.department) {
    const categoryToDepartment = {
      watersupply: "water-supply",
      "water-leakage": "water-supply",
      sewerage: "water-supply",
      streetlight: "electricity",
      "electricity-outage": "electricity",
      traficlight: "transportation",
      "public-transport": "transportation",
      "road-damage": "public-works",
      "building-permit": "public-works",
      garbage: "sanitation",
      "fire-emergency": "fire-department",
      "law-order": "police",
      healthcare: "health",
      education: "education",
      other: "municipal-corporation",
    }
    this.department = categoryToDepartment[this.category] || "municipal-corporation"
  }

  next()
})

let GoodCitizenPoint
try {
  GoodCitizenPoint = require("./points-Model")
} catch {
  // model may not be loaded yet during hot reload; skip awarding
}

reportSchema.post("save", async (doc, next) => {
  try {
    if (!GoodCitizenPoint) return next()
    // award 20 points to the reporting citizen; village derived from report.village
    if (doc.reportedBy) {
      await GoodCitizenPoint.create({
        user: doc.reportedBy,
        village: doc.village || "Unknown",
        points: 20,
        action: "report",
      })
    }
    next()
  } catch (err) {
    console.error("[v0] award points failed:", err?.message)
    next() // do not block report creation
  }
})

module.exports = mongoose.model("Report", reportSchema)
