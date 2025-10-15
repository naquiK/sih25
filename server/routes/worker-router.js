const express = require("express")
const authMiddleware = require("../middleware/auth-middleware")
const { summary, notifications, tasks } = require("../controller/worker-controller")

const router = express.Router()

router.get("/summary", authMiddleware, summary)
router.get("/notifications", authMiddleware, notifications)
router.get("/tasks", authMiddleware, tasks)

module.exports = router
 