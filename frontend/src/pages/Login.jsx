"use client"

import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import LoginSignupHeader from "../components/miniComponents/LoginSignupHeader"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import axios from "../config/axios"
import { jwtDecode } from "jwt-decode"

export default function Login() {
  const [captcha, setCaptcha] = useState(Math.floor(1000 + Math.random() * 9000).toString())
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: "",
    password: "",
    captchaInput: "",
    remember: false,
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // ✅ Refresh captcha
  const refreshCaptcha = () => {
    setCaptcha(Math.floor(1000 + Math.random() * 9000).toString())
  }

  // ✅ Handle form submit (no refresh)
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload

    if (form.captchaInput !== captcha) {
      toast.error("Invalid captcha!")
      return
    }

    try {
      setLoading(true)
      const isEmail = form.username.includes("@")

      const res = await axios.post("/api/v1/auth/login", {
        ...(isEmail ? { email: form.username } : { phone: form.username }),
        password: form.password,
      })

      const data = res.data

      if (data?.success && data?.token) {
        localStorage.setItem("authToken", data.token)
        const user = jwtDecode(data.token)
        localStorage.setItem("user", JSON.stringify(user))
        if (user.villageName) {
          localStorage.setItem("userVillage", user.villageName)
        }

        toast.success(`Welcome, ${user.name || "User"}!`)

        // ✅ Role-based navigation
        switch (user.role) {
          case "citizen":
            navigate("/CitizenDashboard", { replace: true })
            break

          case "village-admin":
            navigate(`/village/${user.villageName || "dashboard"}`, { replace: true })
            break

          case "tehsil-admin":
            navigate("/TehsilDashboard", { replace: true }) // fixed path casing
            break

          case "district-admin":
            navigate("/DistrictDashboard", { replace: true })
            break

          case "department-admin":
            navigate("/DistrictDashboard", { replace: true }) // send to district overview (adjust later if needed)
            break

          case "worker":
            navigate("/WorkerDashboard", { replace: true })
            break

          case "state-admin":
            navigate("/StateDashboard", { replace: true })
            break

          default:
            navigate("/CitizenDashboard", { replace: true })
        }
      } else {
        toast.error(data?.message || "Invalid credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error(err?.response?.data?.message || "Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hello flex flex-col items-center min-h-screen bg-gray-100 p-0">
      <LoginSignupHeader />

      <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] mt-4">
        <h3 className="text-lg font-semibold text-center text-green-700 mb-2">Sign in to Citizen Portal</h3>
        <p className="text-sm text-gray-500 text-center mb-6">Access your government services securely</p>

        {/* ✅ Form (no refresh) */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium">
              Email or Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              className="w-full border p-2 rounded"
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-sm font-medium">
              Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 my-2">
              <span className="px-4 py-2 border rounded-md bg-gray-50 font-bold text-lg">{captcha}</span>
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={refreshCaptcha}
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              name="captchaInput"
              value={form.captchaInput}
              onChange={handleChange}
              placeholder="Enter the code shown above"
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              Remember me
            </label>
            <NavLink to="/ForgotPass" className="text-blue-600 hover:underline">
              Forgot Password?
            </NavLink>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium w-full justify-center transition
              text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          New to the portal?{" "}
          <NavLink to="/signup" className="text-green-600 font-semibold">
            Register as new citizen
          </NavLink>
        </p>
        <p className="text-xs text-gray-500 mt-4 text-center">
          © 2025 Government of India | Digital Governance Initiative
        </p>
      </div>
    </div>
  )
}
