const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    fathername: {
      type: String,
      required: [true, "Father's Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Date of Birth is required"],
    },
    villageName: {
      type: String,
      required: function() { return this.role !== 'tehsil-admin'; },
    },
    address: {
      type: String,
      required: false,
    },
    District: {
      type: String,
      required: [true, "District is required"],
    },
    AadharCard: {
      type: String,
      unique: true,
      sparse: true, // ✅ allows many users without AadharCard
    },
    AadharCardVerified: {
      type: Boolean,
      default: false,
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    role: {
      type: String,
      enum: [
        "citizen",
        "state-admin",
        "department-admin",
        "district-admin",
        "worker",
        "village-admin",
        "super-admin",
        "country-admin",
        "tehsil-admin",
      ],
      default: "citizen",
    },
    department: {
      type: String,
      enum: [
        "water-supply",
        "electricity",
        "sanitation",
        "transportation",
        "public-works",
        "health",
        "education",
        "police",
        "fire-department",
        "municipal-corporation",
        "other",
      ],
      required: function () {
        // Department needed for department-admin/district-admin/worker only
        return ["department-admin", "district-admin", "worker"].includes(this.role)
      },
    },
    assignedDistrict: {
      type: String,
      required: function () {
        return this.role === "district-admin" || this.role === "worker"
      },
    },
    village: { type: String },
    tehsil: {
      type: String,
      required: [true, "Tehsil is required"],
    },
    state: { type: String },
    verificationMethod: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String, // ✅ store OTP as string to avoid mismatch
    },
    verificationCodeExpire: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, // ✅ auto-manages createdAt & updatedAt
)

module.exports = mongoose.model("User", userSchema)
