const express = require("express")
const {
  registration,
  verifyOtp,
  login,
  forgetPassword,
  forgetPasswordVerification,
  resetPassword,
} = require("../controller/user-controller")
const authMiddleware = require("../middleware/auth-middleware")
const router = express.Router()

router.post("/register", registration)
router.post("/otpverify", verifyOtp)
router.post("/resend-otp", registration) // Reuse registration to resend OTP
router.post("/login", login)
router.post("/forget-password", forgetPassword)
router.post("/forget-password-verification", authMiddleware, forgetPasswordVerification)
router.post("/reset-password", authMiddleware, resetPassword)

module.exports = router
