const validator = require("validator")

const validateReportData = (data) => {
  const errors = []

  // Validate category
  const validCategories = [
    "watersupply",
    "streetlight",
    "garbage",
    "water-leakage",
    "traficlight",
    "road-damage",
    "other",
  ]
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push("Invalid category. Must be one of: " + validCategories.join(", "))
  }

  // Validate urgency level
  const validUrgencyLevels = ["low", "medium", "high", "critical"]
  if (!data.urgencylevel || !validUrgencyLevels.includes(data.urgencylevel)) {
    errors.push("Invalid urgency level. Must be one of: " + validUrgencyLevels.join(", "))
  }

  // Validate location
  if (!data.location || data.location.trim().length < 5) {
    errors.push("Location must be at least 5 characters long")
  }

  // Validate coordinates if provided
  if (data.latitude && !validator.isFloat(data.latitude.toString(), { min: -90, max: 90 })) {
    errors.push("Invalid latitude. Must be between -90 and 90")
  }

  if (data.longitude && !validator.isFloat(data.longitude.toString(), { min: -180, max: 180 })) {
    errors.push("Invalid longitude. Must be between -180 and 180")
  }

  // Validate description length if provided
  if (data.description && data.description.length > 1000) {
    errors.push("Description cannot exceed 1000 characters")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

const validateFileType = (file, allowedTypes) => {
  return allowedTypes.some((type) => file.mimetype.startsWith(type))
}

const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

module.exports = {
  validateReportData,
  validateFileType,
  validateFileSize,
}
