const express = require("express")
const router = express.Router()
const { getStateDashboard } = require("../controller/state-controller")

// GET /api/v1/state?code=JH
router.get("/", getStateDashboard)

module.exports = router
