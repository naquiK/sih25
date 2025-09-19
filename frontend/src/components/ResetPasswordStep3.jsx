import { KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ForgotPasswordLayout from "../components/miniComponents/ForgorPasswordLayout.jsx";

export default function ResetPasswordStep3() {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Password validation
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  // Strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "red" };
    if (strength === 3 || strength === 4) return { label: "Medium", color: "yellow" };
    if (strength === 5) return { label: "Strong", color: "green" };
    return { label: "", color: "gray" };
  };

  const strength = getPasswordStrength(form.newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(form.newPassword)) {
      setError("Password must meet all the requirements listed below.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    alert("✅ Password has been reset successfully!");
    navigate("/Login");
  };

  return (
    <ForgotPasswordLayout stepTitle="Step 3: Set your new password">
      <div className="space-y-6">
        {/* OTP Verified Box */}
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>OTP verified successfully! You can now set a new password.</span>
        </div>

        {/* Step 3 Box */}
        <div className="border rounded-lg p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength Meter */}
              {form.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-1/3 rounded ${strength.color === "red" || strength.color === "yellow" || strength.color === "green" ? `bg-${strength.color}-500` : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`h-2 w-1/3 rounded ${strength.color === "yellow" || strength.color === "green" ? `bg-${strength.color}-500` : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`h-2 w-1/3 rounded ${strength.color === "green" ? "bg-green-500" : "bg-gray-200"}`}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 text-${strength.color}-600 font-medium`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter new password"
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside">
                <li>At least 8 characters</li>
                <li>One uppercase and one lowercase letter</li>
                <li>One number and one special character</li>
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Save New Password
            </button>
          </form>
        </div>
      </div>
    </ForgotPasswordLayout>
  );
}
