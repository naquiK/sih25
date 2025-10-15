const getTehsils = async (req, res) => {
  try {
    const district = (req.query.district || "ranchi").toLowerCase()

    const tehsils = [
      {
        id: "kanke",
        name: "Kanke Tehsil",
        district: "Ranchi, Jharkhand",
        totalVillages: 8,
        certified: 2,
        inProgress: 3,
        needsWork: 3,
        totalScore: 72,
        villages: [
          { id: "sonbarsa", name: "Sonbarsa", population: 2430, sc: "68%", readiness: 67, status: "In Progress" },
          { id: "khohari", name: "Khohari", population: 1800, sc: "72%", readiness: 85, status: "Certified" },
          { id: "parasati", name: "Parasati", population: 1560, sc: "60%", readiness: 78, status: "In Progress" },
          { id: "phithorya", name: "Phithorya", population: 1600, sc: "70%", readiness: 88, status: "Certified" },
          { id: "baritau", name: "Baritau", population: 1800, sc: "63%", readiness: 54, status: "Needs Work" },
          { id: "namkum", name: "Namkum", population: 1900, sc: "64%", readiness: 48, status: "Needs Work" },
          { id: "mandar", name: "Mandar", population: 1720, sc: "62%", readiness: 72, status: "In Progress" },
          { id: "muthu", name: "Muthu", population: 1540, sc: "74%", readiness: 42, status: "Needs Work" },
        ],
      },
      {
        id: "burmu",
        name: "Burmu Tehsil",
        district: "Ranchi, Jharkhand",
        totalVillages: 6,
        certified: 1,
        inProgress: 2,
        needsWork: 3,
        totalScore: 64,
        villages: [
          { id: "arahanga", name: "Arahanga", population: 1900, sc: "61%", readiness: 66, status: "In Progress" },
          { id: "chanho", name: "Chanho", population: 2100, sc: "57%", readiness: 58, status: "Needs Work" },
          { id: "silli", name: "Silli", population: 2300, sc: "62%", readiness: 71, status: "In Progress" },
          { id: "burmu-v", name: "Burmu (HQ)", population: 2500, sc: "60%", readiness: 79, status: "Certified" },
          { id: "boria", name: "Boria", population: 1400, sc: "65%", readiness: 43, status: "Needs Work" },
          { id: "hedar", name: "Hedar", population: 1580, sc: "59%", readiness: 55, status: "Needs Work" },
        ],
      },
      {
        id: "oramanjhi",
        name: "Ormanjhi Tehsil",
        district: "Ranchi, Jharkhand",
        totalVillages: 7,
        certified: 2,
        inProgress: 3,
        needsWork: 2,
        totalScore: 69,
        villages: [
          { id: "angara", name: "Angara", population: 1760, sc: "58%", readiness: 72, status: "In Progress" },
          { id: "kumhari", name: "Kumhari", population: 1620, sc: "63%", readiness: 61, status: "Needs Work" },
          { id: "pithoria", name: "Pithoria", population: 2000, sc: "55%", readiness: 86, status: "Certified" },
          { id: "sikidiri", name: "Sikidiri", population: 1490, sc: "66%", readiness: 45, status: "Needs Work" },
          { id: "ratu", name: "Ratu", population: 2600, sc: "52%", readiness: 83, status: "Certified" },
          { id: "tatisilwai", name: "Tatisilwai", population: 1710, sc: "60%", readiness: 67, status: "In Progress" },
          { id: "rahe", name: "Rahe", population: 1320, sc: "64%", readiness: 57, status: "In Progress" },
        ],
      },
    ]

    return res.json(tehsils)
  } catch (err) {
    console.error("[v0] getTehsils error:", err)
    return res.status(500).json({ message: "Failed to load tehsils" })
  }
}

module.exports = { getTehsils }
