"use client"

import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import ProgressBar from "../components/miniComponents/ProgressBar.jsx"
import LoginSignupHeader from "../components/miniComponents/LoginSignupHeader.jsx"
import { toast } from "react-toastify"
import axios from "../config/axios"

const Signup = () => {
  const navigate = useNavigate()
  const [Captcha, setCaptcha] = useState(Math.floor(1000 + Math.random() * 9000).toString())
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  // Central form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    villageName: "",
    tehsil: "",
    district: "",
    pin: "",
    captchaInput: "",
    agreeTerms: false,
    agreeData: false,
  })

  const ResetCaptcha = () => {
    setCaptcha(Math.floor(1000 + Math.random() * 9000).toString())
  }

  // Generic handler for all inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.fatherName || !formData.dob || 
        !formData.gender || !formData.mobile || !formData.email || !formData.password || 
        !formData.villageName || !formData.tehsil || !formData.district || !formData.pin) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    if (!formData.agreeTerms || !formData.agreeData) {
      toast.error("Please accept the terms and privacy policy")
      return
    }

    if (formData.captchaInput !== Captcha) {
      toast.error("Captcha does not match!")
      return
    }

    try {
      setLoading(true)
      const payload = {
        fullname: `${formData.firstName} ${formData.lastName}`.trim(),
        fathername: formData.fatherName,
        phone: formData.mobile,
        dateOfBirth: formData.dob,
        District: formData.district,
        tehsil: formData.tehsil,
        villageName: formData.villageName,
        gender: formData.gender,
        pincode: formData.pin,
        email: formData.email,
        password: formData.password,
      }
      
      const response = await axios.post("/api/v1/auth/register", payload)
      
      if (response.data.success) {
        toast.success("Registration successful. OTP sent to your email.")
        setProgress(33)
        // Navigate to email verification page with email in state
        navigate("/VerifyEmail", { state: { email: formData.email } })
        return true
      } else {
        toast.error(response.data.message || "Registration failed")
        return false
      }
    } catch (err) {
      console.error("[v0] register error:", err?.response?.data || err.message)
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-0">
      {/* Header */}
      <LoginSignupHeader />

      {/* Signup Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-[600px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-green-700 font-semibold text-xl">Citizen Registration</h2>
          <p className="text-sm text-gray-600">Step 1 of 3: Personal Information</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar progress={progress} />
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select gender</option>
                  <option>male</option>
                  <option>female</option>
                  <option>prefer Not to Say</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-4">Contact & Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Village Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="villageName"
                  value={formData.villageName}
                  onChange={handleChange}
                  placeholder="Enter your village name"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Tehsil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleChange}
                  placeholder="Enter your tehsil"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option>Select District</option>
                  <option>Bokaro</option>
                  <option>Chatra</option>
                  <option>Deoghar</option>
                  <option>Dhanbad</option>
                  <option>Dumka</option>
                  <option>East Singhbhum</option>
                  <option>Garhwa</option>
                  <option>Giridih</option>
                  <option>Godda</option>
                  <option>Gumla</option>
                  <option>Hazaribagh</option>
                  <option>Jamtara</option>
                  <option>Khunti</option>
                  <option>Koderma</option>
                  <option>Latehar</option>
                  <option>Lohardaga</option>
                  <option>Pakur</option>
                  <option>Palamu</option>
                  <option>Ramgarh</option>
                  <option>Ranchi</option>
                  <option>Sahibganj</option>
                  <option>Seraikela-Kharsawan</option>
                  <option>Simdega</option>
                  <option>West Singhbhum</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="Enter 6-digit PIN"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              {/* Captcha */}
              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Captcha <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 my-2">
                  <span className="px-4 py-2 border rounded-md bg-gray-50 font-bold text-lg">{Captcha}</span>
                  <button
                    type="button"
                    onClick={ResetCaptcha}
                    className="px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition"
                  >
                    Refresh
                  </button>
                </div>
                <input
                  type="text"
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  placeholder="Enter the code shown above"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 text-sm text-gray-700">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
              />
              I agree to the <NavLink className="text-blue-600">Terms & Conditions</NavLink> and{" "}
              <NavLink className="text-blue-600">Privacy Policy</NavLink>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeData"
                checked={formData.agreeData}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
              />
              I consent to the collection and processing of my personal data
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <NavLink to="/login" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
              ← Back to Login
            </NavLink>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
                 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
                 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Processing..." : "Register & Continue →"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          © 2024 Government of India | Digital Governance Initiative
        </p>
      </div>
    </div>
  )
}

export default Signup
