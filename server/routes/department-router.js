const express = require("express")
const authMiddleware = require("../middleware/auth-middleware")
const { getAvailableWorkers, assignWorkerToReport, getWorkerWorkload } = require("../controller/department-controller")

const router = express.Router()

router.get("/workers/available", authMiddleware, getAvailableWorkers)
router.get("/workers/:workerId/workload", authMiddleware, getWorkerWorkload)
router.post("/reports/:reportId/assign", authMiddleware, assignWorkerToReport)

module.exports = router
