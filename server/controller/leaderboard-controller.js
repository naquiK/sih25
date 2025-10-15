const GoodCitizenPoint = require("../model/points-Model")
const User = require("../model/user-Model")

function getPeriodWindow(period = "week") {
  const now = new Date()
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { start, end }
  }
  // default week: Monday 00:00 to next Monday
  const day = now.getDay() || 7 // Sunday as 7
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (day - 1))
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

// GET /api/v1/leaderboards/citizens?period=week|month&scope=village|district|state&village=...&district=...&state=...
exports.getCitizenLeaderboard = async (req, res) => {
  try {
    const { period = "week", scope = "village", village, district, state } = req.query
    const { start, end } = getPeriodWindow(period)

    const match = { createdAt: { $gte: start, $lt: end } }
    if (scope === "village" && village) match.village = village
    // For district/state scope, we need user location info; join with users
    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$user",
          points: { $sum: "$points" },
          village: { $first: "$village" },
        },
      },
      { $sort: { points: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]

    let results = await GoodCitizenPoint.aggregate(pipeline)

    // filter by district/state if requested
    if (scope === "district" && district) {
      results = results.filter((r) => (r.user?.District || r.user?.district) === district)
    } else if (scope === "state" && state) {
      results = results.filter((r) => (r.user?.state || "").toLowerCase() === state.toLowerCase())
    }

    const out = results.map((r, idx) => ({
      rank: idx + 1,
      name: r.user?.fullname || "Citizen",
      issues: Math.round(r.points / 20),
      points: r.points,
      village: r.village,
    }))

    res.json({ data: out })
  } catch (err) {
    console.error("[v0] citizen leaderboard error:", err)
    res.status(500).json({ message: "Failed to load citizen leaderboard" })
  }
}

// GET /api/v1/leaderboards/villages?period=week|month&scope=district|state&district=...&state=...
exports.getVillageLeaderboard = async (req, res) => {
  try {
    const { period = "week", scope = "district", district, state } = req.query
    const { start, end } = getPeriodWindow(period)

    const pipeline = [
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: "$village",
          points: { $sum: "$points" },
        },
      },
      { $sort: { points: -1 } },
      { $limit: 20 },
    ]

    let results = await GoodCitizenPoint.aggregate(pipeline)

    // Apply district/state filter by joining villages
    if (scope === "district" || scope === "state") {
      const Village = require("../model/village-Model")
      const villages = await Village.find(scope === "district" ? { district } : state ? { state } : {}).lean()
      const allowed = new Set(villages.map((v) => v.name))
      results = results.filter((r) => allowed.has(r._id))
    }

    const out = results.map((r, idx) => ({
      rank: idx + 1,
      name: r._id,
      points: r.points,
    }))

    res.json({ data: out })
  } catch (err) {
    console.error("[v0] village leaderboard error:", err)
    res.status(500).json({ message: "Failed to load village leaderboard" })
  }
}
