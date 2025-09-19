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
      required: [true, "District is required"],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    coordinates: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },
    imgurl: {
      type: String,
      required: true,
    },
    imgpublicId: {
      type: String,
      required: true,
    },
    voiceurl: {
      type: String,
      required: false,
    },
    voicepublicId: {
      type: String,
      required: false,
    },
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
    resolutionDetails: {
      type: String,
      required: false,
    },
    resolvedAt: {
      type: Date,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

reportSchema.pre("save", function (next) {
  console.log(` DEBUG - Pre-save middleware triggered:`, {
    category: this.category,
    currentDepartment: this.department,
    district: this.district,
  })

  if (!this.description && !this.voiceurl) {
    const error = new Error("Either description or voice recording is required")
    error.name = "ValidationError"
    return next(error)
  }

  if (!this.department) {
    const categoryToDepartment = {
      // Water related issues
      watersupply: "water-supply",
      "water-leakage": "water-supply",
      sewerage: "water-supply",

      // Electricity related issues
      streetlight: "electricity",
      "electricity-outage": "electricity",

      // Transportation related issues
      traficlight: "transportation",
      "public-transport": "transportation",

      // Public works and infrastructure
      "road-damage": "public-works",
      "building-permit": "public-works",

      // Sanitation related issues
      garbage: "sanitation",

      // Emergency services
      "fire-emergency": "fire-department",
      "law-order": "police",

      // Public services
      healthcare: "health",
      education: "education",

      // Default fallback
      other: "municipal-corporation",
    }

    this.department = categoryToDepartment[this.category] || "municipal-corporation"

    console.log(
      `REPORT ROUTING: Category '${this.category}' automatically routed to department '${this.department}' in district '${this.district}'`,
    )
  }

  if (!this.department) {
    console.error(` ERROR - Department assignment failed for category: ${this.category}`)
    const error = new Error("Department assignment failed")
    error.name = "ValidationError"
    return next(error)
  }

  console.log(`DEBUG - Pre-save validation complete:`, {
    category: this.category,
    department: this.department,
    district: this.district,
    hasDescription: !!this.description,
    hasVoice: !!this.voiceurl,
  })

  next()
})

module.exports = mongoose.model("Report", reportSchema)
