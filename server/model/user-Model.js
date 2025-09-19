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
    address: {
      type: String,
      required: [true, "Address is required"],
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
      enum: ["citizen", "state-admin", "department-admin", "district-admin", "worker"],
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
        return this.role !== "citizen" && this.role !== "state-admin"
      },
    },
    assignedDistrict: {
      type: String,
      required: function () {
        return this.role === "district-admin" || this.role === "worker"
      },
    },
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
