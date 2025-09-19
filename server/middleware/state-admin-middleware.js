const jwt = require("jsonwebtoken")
const User = require("../model/user-Model")

const stateAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      })
    }

    if (user.role !== "state-admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. State admin privileges required.",
      })
    }

    if (!user.isActive || !user.accountVerified) {
      return res.status(403).json({
        success: false,
        message: "Account is not active or verified.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("State admin middleware error:", error)
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

module.exports = stateAdminMiddleware
