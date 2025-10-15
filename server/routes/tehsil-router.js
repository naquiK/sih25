const express = require("express")
const router = express.Router()
const { getTehsils } = require("../controller/tehsil-controller")

// GET /api/v1/tehsils?district=ranchi
router.get("/", getTehsils)

module.exports = router
