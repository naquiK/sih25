const express = require("express")
const {
  listVillages,
  upsertVillage,
  getVillageSummary,
  upsertVillageDetails,
  listVillageWorkers,
  getVillageDetails,
} = require("../controller/village-controller")
const { anyAdminMiddleware } = require("../middleware/admin-middleware")
const authMiddleware = require("../middleware/auth-middleware")

const router = express.Router()

router.get("/", listVillages)
router.get("/:id/summary", getVillageSummary)
router.get("/:id/workers", authMiddleware, listVillageWorkers)
router.post("/:id/details", anyAdminMiddleware, upsertVillageDetails)

// village admin/district/state admins can upsert (create or update by name)
router.post("/", anyAdminMiddleware, upsertVillage)

// GET /:id for FE call `/api/v1/villages/${villageName}`
router.get("/:id", getVillageDetails)

module.exports = router
