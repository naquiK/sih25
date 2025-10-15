const express = require("express")
const { citizenDashboard } = require("../controller/citizen-controller")
const authMiddleware = require("../middleware/auth-middleware")

const router = express.Router()

router.get("/dashboard", authMiddleware, citizenDashboard)

module.exports = router
