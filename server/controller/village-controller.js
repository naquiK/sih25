const Village = require("../model/village-Model")
const User = require("../model/user-Model")
const mongoose = require("mongoose")

const listVillages = async (_req, res) => {
  try {
    const villages = await Village.find({}, "name district sarpanch policeStation hospital school")
    // Seed minimal if empty (dev convenience)
    if (villages.length === 0) {
      await Village.insertMany([
        { name: "Rampur", district: "Ranchi", sarpanch: "Sarpanch A" },
        { name: "Sultanpur", district: "Ranchi", sarpanch: "Sarpanch B" },
        { name: "Kheda", district: "Ranchi", sarpanch: "Sarpanch C" },
      ])
    }
    const out = await Village.find({}, "name district sarpanch policeStation hospital school")
    return res.status(200).json({ success: true, data: out })
  } catch (error) {
    console.error("listVillages error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const upsertVillage = async (req, res) => {
  try {
    const { name, district, sarpanch, policeStation, hospital, school, ...rest } = req.body
    if (!name) return res.status(400).json({ success: false, message: "name is required" })
    const doc = await Village.findOneAndUpdate(
      { name },
      { name, district, sarpanch, policeStation, hospital, school, ...rest },
      { upsert: true, new: true },
    )
    return res.status(200).json({ success: true, data: doc })
  } catch (error) {
    console.error("upsertVillage error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const getVillageSummary = async (req, res) => {
  try {
    const { id } = req.params
    let doc = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await Village.findById(id)
    }
    if (!doc) {
      // allow name as identifier (case-insensitive)
      doc = await Village.findOne({ name: new RegExp(`^${id}$`, "i") })
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: "Village not found" })
    }

    const summary = {
      villageName: doc.name,
      location: `${doc.district || "Unknown District"}${doc.meta?.block ? ` · ${doc.meta.block} Block` : ""}`,
      readiness: typeof doc.meta?.readiness === "number" ? doc.meta.readiness : 67,
      population: doc.population || doc.meta?.population,
      households: doc.meta?.households,
      scHouseholds: doc.meta?.scHouseholds,
      literacyRate: doc.meta?.literacyRate,
      employment: doc.meta?.employment,
    }

    return res.status(200).json(summary)
  } catch (error) {
    console.error("getVillageSummary error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const upsertVillageDetails = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body || {}

    // Allow updating by ObjectId or by name
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { name: new RegExp(`^${id}$`, "i") }

    // Merge meta if provided
    const set = { ...payload }
    if (payload.meta) {
      set.meta = { ...(payload.meta || {}) }
    }

    const doc = await Village.findOneAndUpdate(query, set, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })

    return res.status(200).json({ success: true, data: doc })
  } catch (error) {
    console.error("upsertVillageDetails error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const listVillageWorkers = async (req, res) => {
  try {
    const { id } = req.params
    const workers = await User.find({
      role: "worker",
      villageName: new RegExp(`^${id}$`, "i"),
      isActive: true,
      accountVerified: true,
    }).select("fullname email phone villageName department assignedDistrict")

    return res.status(200).json({ success: true, data: workers })
  } catch (error) {
    console.error("listVillageWorkers error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const getVillageDetails = async (req, res) => {
  try {
    const { id } = req.params
    let doc = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await Village.findById(id)
    }
    if (!doc) {
      doc = await Village.findOne({ name: new RegExp(`^${id}$`, "i") })
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: "Village not found" })
    }

    return res.status(200).json({ success: true, data: doc })
  } catch (error) {
    console.error("[v0] getVillageDetails error:", error?.message || error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = {
  listVillages,
  upsertVillage,
  getVillageSummary,
  upsertVillageDetails,
  listVillageWorkers,
  getVillageDetails,
}
