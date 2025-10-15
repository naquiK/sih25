const getDistricts = async (req, res) => {
  try {
    const state = (req.query.state || "JH").toUpperCase()

    const districts = [
      {
        id: "ranchi",
        name: "Ranchi District",
        stateLine: "Jharkhand · Tehsil-wise village monitoring",
        totalTehsils: 18,
        totalVillages: 45,
        certified: 8,
        inProgress: 18,
        districtScore: 68,
        performance: [
          { tehsil: "Kanke", certified: 3, progress: 2 },
          { tehsil: "Bundu", certified: 2, progress: 2 },
          { tehsil: "Ormanjhi", certified: 1, progress: 2 },
          { tehsil: "Silli", certified: 3, progress: 1 },
          { tehsil: "Tamar", certified: 1, progress: 1 },
          { tehsil: "Ratu", certified: 1, progress: 2 },
          { tehsil: "Mandar", certified: 0, progress: 2 },
          { tehsil: "Angara", certified: 3, progress: 2 },
        ],
        rankings: [
          { rank: 1, name: "Kanke", meta: "8 villages · 2 certified", score: 72 },
          { rank: 2, name: "Bundu", meta: "6 villages · 2 certified", score: 75 },
          { rank: 3, name: "Ormanjhi", meta: "5 villages · 1 certified", score: 68 },
          { rank: 4, name: "Silli", meta: "7 villages · 1 certified", score: 65 },
          { rank: 5, name: "Tamar", meta: "6 villages · 1 certified", score: 70 },
          { rank: 6, name: "Ratu", meta: "9 villages · 1 certified", score: 66 },
          { rank: 7, name: "Mandar", meta: "6 villages · 0 certified", score: 58 },
          { rank: 8, name: "Angara", meta: "6 villages · 0 certified", score: 60 },
        ],
      },
      {
        id: "dhanbad",
        name: "Dhanbad District",
        stateLine: "Jharkhand · Tehsil-wise village monitoring",
        totalTehsils: 12,
        totalVillages: 38,
        certified: 6,
        inProgress: 14,
        districtScore: 64,
        performance: [
          { tehsil: "Dhanbad", certified: 2, progress: 2 },
          { tehsil: "Govindpur", certified: 1, progress: 3 },
          { tehsil: "Baliapur", certified: 2, progress: 1 },
          { tehsil: "Topchanchi", certified: 1, progress: 2 },
          { tehsil: "Tundi", certified: 0, progress: 2 },
          { tehsil: "Baghmara", certified: 0, progress: 3 },
          { tehsil: "Nirsa", certified: 0, progress: 2 },
        ],
        rankings: [
          { rank: 1, name: "Dhanbad", meta: "7 villages · 2 certified", score: 69 },
          { rank: 2, name: "Baliapur", meta: "5 villages · 2 certified", score: 66 },
          { rank: 3, name: "Govindpur", meta: "6 villages · 1 certified", score: 63 },
          { rank: 4, name: "Topchanchi", meta: "4 villages · 1 certified", score: 60 },
          { rank: 5, name: "Baghmara", meta: "8 villages · 0 certified", score: 57 },
          { rank: 6, name: "Tundi", meta: "4 villages · 0 certified", score: 55 },
          { rank: 7, name: "Nirsa", meta: "4 villages · 0 certified", score: 54 },
        ],
      },
      {
        id: "bokaro",
        name: "Bokaro District",
        stateLine: "Jharkhand · Tehsil-wise village monitoring",
        totalTehsils: 10,
        totalVillages: 32,
        certified: 5,
        inProgress: 12,
        districtScore: 62,
        performance: [
          { tehsil: "Chandankiyari", certified: 1, progress: 2 },
          { tehsil: "Chas", certified: 2, progress: 2 },
          { tehsil: "Bermo", certified: 1, progress: 2 },
          { tehsil: "Gomia", certified: 1, progress: 1 },
          { tehsil: "Kasmar", certified: 0, progress: 2 },
          { tehsil: "Nawadih", certified: 0, progress: 3 },
        ],
        rankings: [
          { rank: 1, name: "Chas", meta: "6 villages · 2 certified", score: 68 },
          { rank: 2, name: "Bermo", meta: "5 villages · 1 certified", score: 64 },
          { rank: 3, name: "Gomia", meta: "4 villages · 1 certified", score: 63 },
          { rank: 4, name: "Chandankiyari", meta: "6 villages · 1 certified", score: 60 },
          { rank: 5, name: "Kasmar", meta: "5 villages · 0 certified", score: 56 },
          { rank: 6, name: "Nawadih", meta: "6 villages · 0 certified", score: 55 },
        ],
      },
    ]

    return res.json(districts)
  } catch (err) {
    console.error("[v0] getDistricts error:", err)
    return res.status(500).json({ message: "Failed to load districts" })
  }
}

module.exports = { getDistricts }
