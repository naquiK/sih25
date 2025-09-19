const CATEGORY_DEPARTMENT_MAPPING = {
  // Water and Sewerage
  watersupply: {
    department: "water-supply",
    description: "Water supply issues, shortage, quality problems",
  },
  "water-leakage": {
    department: "water-supply",
    description: "Water pipe leaks, burst pipes, water wastage",
  },
  sewerage: {
    department: "water-supply",
    description: "Sewerage blockage, overflow, drainage issues",
  },

  // Electricity and Power
  streetlight: {
    department: "electricity",
    description: "Street light not working, damaged fixtures",
  },
  "electricity-outage": {
    department: "electricity",
    description: "Power cuts, electrical faults, transformer issues",
  },

  // Transportation
  traficlight: {
    department: "transportation",
    description: "Traffic signal malfunctions, timing issues",
  },
  "public-transport": {
    department: "transportation",
    description: "Bus stops, public transport issues",
  },

  // Public Works and Infrastructure
  "road-damage": {
    department: "public-works",
    description: "Potholes, road cracks, damaged pavements",
  },
  "building-permit": {
    department: "public-works",
    description: "Illegal construction, building violations",
  },

  // Sanitation and Waste Management
  garbage: {
    department: "sanitation",
    description: "Garbage collection, waste disposal, cleanliness",
  },

  // Emergency Services
  "fire-emergency": {
    department: "fire-department",
    description: "Fire hazards, emergency response needed",
  },
  "law-order": {
    department: "police",
    description: "Law and order issues, security concerns",
  },

  // Public Services
  healthcare: {
    department: "health",
    description: "Public health issues, medical facilities",
  },
  education: {
    department: "education",
    description: "School infrastructure, educational facilities",
  },

  // Default
  other: {
    department: "municipal-corporation",
    description: "General civic issues not covered in other categories",
  },
}

const getDepartmentByCategory = (category) => {
  const mapping = CATEGORY_DEPARTMENT_MAPPING[category]
  return mapping ? mapping.department : "municipal-corporation"
}

const getCategoryDescription = (category) => {
  const mapping = CATEGORY_DEPARTMENT_MAPPING[category]
  return mapping ? mapping.description : "General civic issue"
}

const getAllCategoryMappings = () => {
  return CATEGORY_DEPARTMENT_MAPPING
}

module.exports = {
  CATEGORY_DEPARTMENT_MAPPING,
  getDepartmentByCategory,
  getCategoryDescription,
  getAllCategoryMappings,
}
