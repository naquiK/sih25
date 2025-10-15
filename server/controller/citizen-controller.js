const Report = require("../model/report-Model")

const citizenDashboard = async (req, res) => {
  try {
    const userId = req.userInfo?.id
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const issues = await Report.find({ reportedBy: userId }).sort({ createdAt: -1 }).limit(50)

    const stats = {
      myReports: issues.length,
      resolved: issues.filter((i) => i.status === "resolved").length,
      avgResponseDays: 2.5, // placeholder; could compute from timestamps
    }

    const issuesOut = issues.map((r) => ({
      id: r._id,
      title: r.title || r.category,
      desc: r.description,
      location: r.location || r.village || r.district || "Unknown",
      category: r.category,
      status:
        r.status === "in-progress"
          ? "In Progress"
          : r.status === "resolved"
            ? "Resolved"
            : r.status === "pending"
              ? "Open"
              : "Under Review",
      updated: r.updatedAt?.toISOString().slice(0, 10),
    }))

    return res.status(200).json({ success: true, data: { stats, issues: issuesOut } })
  } catch (e) {
    console.error("citizenDashboard error:", e)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = { citizenDashboard }
