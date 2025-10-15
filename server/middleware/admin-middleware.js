const jwt = require("jsonwebtoken")
const User = require("../model/user-Model")

// Middleware for department admin access
const departmentAdminMiddleware = async (req, res, next) => {
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

    if (!["department-admin", "state-admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Department admin or higher privileges required.",
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
    console.error("Department admin middleware error:", error)
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

// Middleware for district admin access
const districtAdminMiddleware = async (req, res, next) => {
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

    if (!["district-admin", "state-admin"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. District admin or higher privileges required.",
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
    console.error("District admin middleware error:", error)
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

// Middleware for any admin level access
const anyAdminMiddleware = async (req, res, next) => {
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

    if (!["state-admin", "department-admin", "district-admin", "village-admin", "worker"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
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
    console.error("Admin middleware error:", error)
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    })
  }
}

module.exports = {
  departmentAdminMiddleware,
  districtAdminMiddleware,
  anyAdminMiddleware,
}
