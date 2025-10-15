const express = require("express")
const router = express.Router()
const { getDistricts } = require("../controller/district-controller")

// GET /api/v1/districts?state=JH
router.get("/", getDistricts)

module.exports = router
