const getStateDashboard = async (req, res) => {
  try {
    // naive filter by state code if needed later
    const code = (req.query.code || "JH").toUpperCase()

    // Static data aligned with frontend StateDashboard.jsx
    const stateData = {
      North: {
        header: {
          title: "Jharkhand State Dashboard",
          subtitle: "District-wise monitoring and performance tracking",
          overall: 59,
          districts: 24,
          totalVillages: 580,
          certified: 18,
          inProgress: 175,
          budgetUsed: 63,
        },
        performance: [
          { district: "Ranchi", certified: 18, progress: 12 },
          { district: "Dhanbad", certified: 16, progress: 10 },
          { district: "Giridih", certified: 10, progress: 8 },
          { district: "Hazaribagh", certified: 9, progress: 7 },
          { district: "Bokaro", certified: 12, progress: 9 },
          { district: "Deoghar", certified: 8, progress: 6 },
          { district: "Dumka", certified: 7, progress: 5 },
        ],
        monthlyTrend: [
          { m: "Aug", certified: 280, projects: 240 },
          { m: "Sep", certified: 300, projects: 255 },
          { m: "Oct", certified: 315, projects: 270 },
          { m: "Nov", certified: 328, projects: 285 },
          { m: "Dec", certified: 340, projects: 300 },
        ],
        serviceGaps: [
          { name: "Healthcare", val: 86, pct: "80%" },
          { name: "Roads", val: 75, pct: "62%" },
          { name: "Water", val: 52, pct: "42%" },
          { name: "Education", val: 45, pct: "29%" },
          { name: "Electricity", val: 28, pct: "15%" },
        ],
        rankings: [
          { rank: 1, name: "Ranchi", meta: "45 villages · 2 certified", score: 68, tag: "Good" },
          { rank: 2, name: "Dhanbad", meta: "38 villages · 1 certified", score: 62, tag: "Good" },
          { rank: 3, name: "Bokaro", meta: "42 villages · 2 certified", score: 71, tag: "Excellent" },
          { rank: 4, name: "Giridih", meta: "34 villages · 2 certified", score: 54, tag: "Needs Focus" },
          { rank: 5, name: "Hazaribagh", meta: "40 villages · 2 certified", score: 51, tag: "Needs Focus" },
          { rank: 6, name: "East Singhbhum", meta: "28 villages · 2 certified", score: 65, tag: "Good" },
          { rank: 7, name: "Deoghar", meta: "29 villages · 1 certified", score: 60, tag: "Good" },
          { rank: 8, name: "Dumka", meta: "26 villages · 0 certified", score: 57, tag: "Needs Focus" },
        ],
      },
      South: {
        header: {
          title: "Jharkhand State Dashboard",
          subtitle: "District-wise monitoring and performance tracking",
          overall: 61,
          districts: 20,
          totalVillages: 520,
          certified: 21,
          inProgress: 160,
          budgetUsed: 65,
        },
        performance: [
          { district: "Ranchi", certified: 16, progress: 13 },
          { district: "Khunti", certified: 12, progress: 9 },
          { district: "Simdega", certified: 9, progress: 8 },
          { district: "Gumla", certified: 10, progress: 9 },
          { district: "Lohardaga", certified: 7, progress: 6 },
        ],
        monthlyTrend: [
          { m: "Aug", certified: 260, projects: 230 },
          { m: "Sep", certified: 275, projects: 242 },
          { m: "Oct", certified: 292, projects: 257 },
          { m: "Nov", certified: 305, projects: 270 },
          { m: "Dec", certified: 318, projects: 282 },
        ],
        serviceGaps: [
          { name: "Healthcare", val: 74, pct: "72%" },
          { name: "Roads", val: 68, pct: "60%" },
          { name: "Water", val: 50, pct: "44%" },
          { name: "Education", val: 39, pct: "26%" },
          { name: "Electricity", val: 31, pct: "18%" },
        ],
        rankings: [
          { rank: 1, name: "Ranchi", meta: "42 villages · 2 certified", score: 66, tag: "Good" },
          { rank: 2, name: "Gumla", meta: "31 villages · 2 certified", score: 63, tag: "Good" },
          { rank: 3, name: "Khunti", meta: "24 villages · 1 certified", score: 60, tag: "Good" },
          { rank: 4, name: "Simdega", meta: "26 villages · 1 certified", score: 58, tag: "Needs Focus" },
          { rank: 5, name: "Lohardaga", meta: "22 villages · 0 certified", score: 55, tag: "Needs Focus" },
        ],
      },
      East: {
        header: {
          title: "Jharkhand State Dashboard",
          subtitle: "District-wise monitoring and performance tracking",
          overall: 58,
          districts: 18,
          totalVillages: 470,
          certified: 17,
          inProgress: 150,
          budgetUsed: 61,
        },
        performance: [
          { district: "East Singhbhum", certified: 14, progress: 10 },
          { district: "Saraikela", certified: 8, progress: 6 },
          { district: "Jamshedpur", certified: 10, progress: 9 },
          { district: "Ghatsila", certified: 7, progress: 6 },
          { district: "Chaibasa", certified: 6, progress: 5 },
        ],
        monthlyTrend: [
          { m: "Aug", certified: 245, projects: 215 },
          { m: "Sep", certified: 260, projects: 228 },
          { m: "Oct", certified: 272, projects: 240 },
          { m: "Nov", certified: 288, projects: 255 },
          { m: "Dec", certified: 300, projects: 268 },
        ],
        serviceGaps: [
          { name: "Healthcare", val: 70, pct: "69%" },
          { name: "Roads", val: 64, pct: "58%" },
          { name: "Water", val: 48, pct: "41%" },
          { name: "Education", val: 35, pct: "23%" },
          { name: "Electricity", val: 26, pct: "14%" },
        ],
        rankings: [
          { rank: 1, name: "East Singhbhum", meta: "28 villages · 2 certified", score: 65, tag: "Good" },
          { rank: 2, name: "Saraikela", meta: "25 villages · 1 certified", score: 62, tag: "Good" },
          { rank: 3, name: "Jamshedpur", meta: "26 villages · 2 certified", score: 60, tag: "Good" },
          { rank: 4, name: "Ghatsila", meta: "20 villages · 1 certified", score: 57, tag: "Needs Focus" },
          { rank: 5, name: "Chaibasa", meta: "19 villages · 0 certified", score: 54, tag: "Needs Focus" },
        ],
      },
      West: {
        header: {
          title: "Jharkhand State Dashboard",
          subtitle: "District-wise monitoring and performance tracking",
          overall: 57,
          districts: 16,
          totalVillages: 440,
          certified: 15,
          inProgress: 140,
          budgetUsed: 60,
        },
        performance: [
          { district: "Palamu", certified: 8, progress: 7 },
          { district: "Garhwa", certified: 7, progress: 6 },
          { district: "Latehar", certified: 6, progress: 6 },
          { district: "Lohardaga", certified: 5, progress: 5 },
          { district: "Gumla", certified: 7, progress: 6 },
        ],
        monthlyTrend: [
          { m: "Aug", certified: 230, projects: 205 },
          { m: "Sep", certified: 244, projects: 218 },
          { m: "Oct", certified: 255, projects: 230 },
          { m: "Nov", certified: 268, projects: 242 },
          { m: "Dec", certified: 280, projects: 255 },
        ],
        serviceGaps: [
          { name: "Healthcare", val: 65, pct: "63%" },
          { name: "Roads", val: 60, pct: "56%" },
          { name: "Water", val: 44, pct: "39%" },
          { name: "Education", val: 33, pct: "22%" },
          { name: "Electricity", val: 25, pct: "13%" },
        ],
        rankings: [
          { rank: 1, name: "Palamu", meta: "24 villages · 1 certified", score: 61, tag: "Good" },
          { rank: 2, name: "Garhwa", meta: "22 villages · 1 certified", score: 59, tag: "Needs Focus" },
          { rank: 3, name: "Latehar", meta: "19 villages · 1 certified", score: 58, tag: "Needs Focus" },
          { rank: 4, name: "Lohardaga", meta: "18 villages · 0 certified", score: 56, tag: "Needs Focus" },
          { rank: 5, name: "Gumla", meta: "20 villages · 1 certified", score: 55, tag: "Needs Focus" },
        ],
      },
      Central: {
        header: {
          title: "Jharkhand State Dashboard",
          subtitle: "District-wise monitoring and performance tracking",
          overall: 60,
          districts: 22,
          totalVillages: 500,
          certified: 19,
          inProgress: 165,
          budgetUsed: 62,
        },
        performance: [
          { district: "Ranchi", certified: 17, progress: 12 },
          { district: "Ramgarh", certified: 10, progress: 8 },
          { district: "Bokaro", certified: 12, progress: 10 },
          { district: "Khunti", certified: 8, progress: 7 },
          { district: "Hazaribagh", certified: 9, progress: 8 },
        ],
        monthlyTrend: [
          { m: "Aug", certified: 250, projects: 230 },
          { m: "Sep", certified: 265, projects: 245 },
          { m: "Oct", certified: 280, projects: 258 },
          { m: "Nov", certified: 296, projects: 272 },
          { m: "Dec", certified: 312, projects: 286 },
        ],
        serviceGaps: [
          { name: "Healthcare", val: 72, pct: "70%" },
          { name: "Roads", val: 66, pct: "59%" },
          { name: "Water", val: 49, pct: "43%" },
          { name: "Education", val: 37, pct: "24%" },
          { name: "Electricity", val: 27, pct: "13%" },
        ],
        rankings: [
          { rank: 1, name: "Ranchi", meta: "45 villages · 2 certified", score: 67, tag: "Good" },
          { rank: 2, name: "Bokaro", meta: "42 villages · 2 certified", score: 66, tag: "Good" },
          { rank: 3, name: "Ramgarh", meta: "29 villages · 1 certified", score: 62, tag: "Good" },
          { rank: 4, name: "Khunti", meta: "24 villages · 1 certified", score: 60, tag: "Good" },
          { rank: 5, name: "Hazaribagh", meta: "31 villages · 2 certified", score: 59, tag: "Needs Focus" },
        ],
      },
    }

    // potential filtering per state code left as is
    return res.json(stateData)
  } catch (err) {
    console.error("[v0] getStateDashboard error:", err)
    return res.status(500).json({ message: "Failed to load state dashboard" })
  }
}

module.exports = { getStateDashboard }
