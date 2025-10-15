"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ForgotPasswordLayout from "../components/miniComponents/ForgorPasswordLayout"
import RecoveryOptions from "../components/miniComponents/RecoveryOptions"
import { toast } from "react-toastify"
import axios from "../config/axios"

export default function ResetViaEmail() {
  const [captcha, setCaptcha] = useState(Math.floor(1000 + Math.random() * 9000).toString())
  const [form, setForm] = useState({ email: "", captchaInput: "" })
  const navigate = useNavigate()

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const refreshCaptcha = () => setCaptcha(Math.floor(1000 + Math.random() * 9000).toString())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.captchaInput !== captcha) {
      toast.error("Captcha does not match!")
      return
    }
    try {
      const { data } = await axios.post("/api/v1/auth/forget-password", { email: form.email })
      if (data?.token) {
        sessionStorage.setItem("resetTokenStep1", data.token)
      }
      toast.success(`OTP sent to ${form.email}`)
      navigate("/ResetViaEmailStep2", { state: { email: form.email } })
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP")
    }
  }

  return (
    <ForgotPasswordLayout stepTitle="Step 1: Choose Recovery Method">
      {/* Step 1 options (reusable) */}
      <RecoveryOptions />

      {/* Divider separating Step1 and Step2 */}
      <hr className="my-4 border-t border-gray-200" />

      {/* Step 2 form (email + captcha) */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-medium text-gray-800 mb-3">Step 2: Verify Email</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter your Email Address <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your registered email"
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Captcha <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-2 my-2">
              <span className="px-4 py-2 border rounded-md bg-gray-50 font-bold text-lg">{captcha}</span>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>

            <input
              name="captchaInput"
              value={form.captchaInput}
              onChange={handleChange}
              required
              placeholder="Enter the code shown above"
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Send OTP
          </button>
        </form>
      </div>
    </ForgotPasswordLayout>
  )
}
