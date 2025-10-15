const mongoose = require("mongoose")

const pointsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    village: { type: String, required: true },
    points: { type: Number, default: 0 },
    action: { type: String, enum: ["report"], default: "report" },
  },
  { timestamps: true },
)

module.exports = mongoose.model("GoodCitizenPoint", pointsSchema)
