const mongoose = require("mongoose")

const villageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    district: { type: String, required: false },
    tehsil: { type: String, required: false }, // added
    state: { type: String, required: false }, // added
    sarpanch: { type: String, required: false },
    policeStation: { type: String, required: false },
    hospital: { type: String, required: false },
    school: { type: String, required: false },
    // Optional extended details to map Village Progress
    population: { type: Number, default: 0 },
    waterPoints: { type: Number, default: 0 },
    schoolsCount: { type: Number, default: 0 },
    healthCentersCount: { type: Number, default: 0 },
    roadsKm: { type: Number, default: 0 },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Village", villageSchema)
