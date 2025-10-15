"use client"

import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ProgressBar from "./miniComponents/ProgressBar"
import axios from "../config/axios"

export default function EmailVerification() {
  // 📩 Get email passed from Signup via React Router state
  const location = useLocation()
  const navigate = useNavigate()
  const passedEmail = location.state?.email || ""

  const [email] = useState(passedEmail)
  const [progress, setProgress] = useState(33)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleContinue = async () => {
    if (!otp) {
      toast.error("Please enter the verification code")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("/api/v1/auth/otpverify", { email, verificationCode: otp })
      if (response.data.success) {
        setProgress(66)
        toast.success("Email verified successfully!")
        // Redirect to next step or login
        navigate("/login", { replace: true })
      } else {
        toast.error(response.data.message || "Verification failed")
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    try {
      setResendLoading(true)
      const response = await axios.post("/api/v1/auth/resend-otp", { email })
      if (response.data.success) {
        toast.success("New verification code sent to your email")
      } else {
        toast.error(response.data.message || "Failed to send new code")
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to send new code")
      console.error("Resend OTP error:", e)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Citizen Registration</h1>
          <p className="text-gray-500 mt-1">Step 2 of 3: Email Verification</p>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <ProgressBar progress={progress} />

          <div className="flex justify-between text-sm mt-2 text-gray-500">
            <span
              className={
                progress >= 0
                  ? "bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold"
                  : ""
              }
            >
              Personal Info
            </span>
            <span
              className={
                progress >= 33
                  ? "bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold"
                  : ""
              }
            >
              Email Verification
            </span>
            <span
              className={
                progress >= 66
                  ? "bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold"
                  : ""
              }
            >
              Aadhar Linking
            </span>
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="email">
              📧
            </span>
            Verify Email Address
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p>
              <span className="font-medium">Email Address:</span>{" "}
              <span className="text-blue-700 font-medium">{email}</span>
            </p>
            <p className="mt-1 text-gray-600">
              We will send a 6-digit verification code to this email address. Please ensure you have access to this
              email.
            </p>
          </div>

          {/* OTP Input */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border rounded-md px-3 py-2 text-center text-lg tracking-widest font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleSendCode}
              disabled={resendLoading}
              className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition
                ${resendLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
            <button
              onClick={handleContinue}
              disabled={loading || !otp}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
                 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
                 transition ${loading || !otp ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify & Continue →'}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Make sure to check your spam folder if you don’t see the email
          </p>

          <NavLink to="/signup" className="block mt-4 text-blue-600 text-center text-sm hover:underline">
            ← Back to Registration Form
          </NavLink>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-500 space-y-2">
          <p>
            Email verification helps secure your account and enables important notifications.
            <br />
            This process is required for all government portal registrations.
          </p>
          <p>
            All information provided will be verified through government databases.
            <br />
            Registration may take 24-48 hours for approval.
          </p>
          <p>
            © 2024 Government of Jharkhand | Department of Higher and Technical Education
            <br />• Help • Contact • Accessibility
          </p>
        </div>
      </div>
    </div>
  )
}
