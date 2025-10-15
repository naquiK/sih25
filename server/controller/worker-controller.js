const Report = require("../model/report-Model")

const summary = async (req, res) => {
  try {
    const userId = req.userInfo?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
    const assigned = await Report.find({ assignedTo: userId })
    const activeTasks = assigned.filter((r) => r.status === "in-progress" || r.status === "pending").length
    const overdue = 0 // compute if due dates exist
    const villagesAssigned = new Set(assigned.map((r) => r.village || r.location)).size
    return res
      .status(200)
      .json({ success: true, data: { activeTasks, overdue, villagesAssigned, syncStatus: "All Synced" } })
  } catch (e) {
    console.error("worker summary error:", e)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const notifications = async (req, res) => {
  try {
    const userId = req.userInfo?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
    // Basic notifications derived from recent assignments/updates
    const recents = await Report.find({ assignedTo: userId }).sort({ updatedAt: -1 }).limit(10)
    const out = recents.map((r, idx) => ({
      id: `N-${String(idx + 1).padStart(3, "0")}`,
      title: `Task "${r.title || r.category}" status: ${r.status}`,
      time: new Date(r.updatedAt || r.createdAt).toLocaleString(),
      icon: "info",
    }))
    return res.status(200).json({ success: true, data: out })
  } catch (e) {
    console.error("worker notifications error:", e)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const tasks = async (req, res) => {
  try {
    const userId = req.userInfo?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })
    const assigned = await Report.find({ assignedTo: userId }).sort({ updatedAt: -1 })

    const out = assigned.map((r) => ({
      id: String(r._id),
      title: r.title || r.category,
      village: r.village || r.location || "Unknown",
      distanceKm: 0,
      due: r.resolvedAt ? new Date(r.resolvedAt).toLocaleDateString() : "-",
      priority:
        r.urgencylevel === "high" || r.urgencylevel === "critical"
          ? "High"
          : r.urgencylevel === "medium"
            ? "Medium"
            : "Low",
      status:
        r.status === "in-progress"
          ? "In Progress"
          : r.status === "resolved"
            ? "Resolved"
            : r.status === "pending"
              ? "Pending"
              : "Pending",
      description: r.description || "",
      progress: r.status === "resolved" ? 100 : r.status === "in-progress" ? 50 : 0,
    }))

    return res.status(200).json({ success: true, data: out })
  } catch (e) {
    console.error("worker tasks error:", e)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = { summary, notifications, tasks }
