const router = require("express").Router()
const { getCitizenLeaderboard, getVillageLeaderboard } = require("../controller/leaderboard-controller")

router.get("/citizens", getCitizenLeaderboard)
router.get("/villages", getVillageLeaderboard)

module.exports = router
