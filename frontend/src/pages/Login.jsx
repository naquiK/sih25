import { NavLink,useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginSignupHeader from "../components/miniComponents/LoginSignupHeader";

export default function Login() {
  const [captcha, setCaptcha] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [form, setForm] = useState({
    username: "",
    password: "",
    captchaInput: "",
    remember: false,
  });
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.captchaInput !== captcha) {
      alert("Invalid captcha!");
      return;
    }
    alert(`Logged in as ${form.username}`);
    navigate("/CitizenDashboard");
    fetch("/api/login", { method: "POST", body: JSON.stringify(formData) })
      .then(res => res.json())
      .then(data => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        switch (data.user.role) {
          case "citizen":
            navigate("/CitizenDashboard");
            break;
          case "state-admin":
            navigate("/state-dashboard");
            break;
          case "district-admin":
            navigate("/district-dashboard");
            break;
          case "pwd-department-admin":
            navigate("/RoadDepartment");
            break;
          case "worker":
            navigate("/worker-dashboard");
            break;
          default:
            navigate("/login");
        }
      }
    });
  };

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(newCaptcha);
  };

  return (
    <div className="hello flex flex-col items-center min-h-screen bg-gray-100 p-0">
      {/* Header Section */}
      
      <LoginSignupHeader />

      {/* Login Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-[400px]">
        <h3 className="text-lg font-semibold text-center text-green-700 flex items-center justify-center gap-2 mb-2">
          <span>Sign in to Citizen Portal</span>
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Access your government services securely
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium">
              Phone Number/Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your phone number or email"
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-sm font-medium">
              Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 my-2">
              <span className="px-4 py-2 border rounded-md bg-gray-50 font-bold text-lg">
                {captcha}
              </span>
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
            <NavLink
              to="/ForgotPass"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md text-lg hover:bg-green-700 transition"
          >
            Sign In
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
          © 2024 Government of India | Digital Governance Initiative
        </p>
      </div>
    </div>
  );
}
