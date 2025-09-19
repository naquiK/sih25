import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function EmailVerification() {
  // 📩 Get email passed from Signup via React Router state
  const location = useLocation();
  const passedEmail = location.state?.email || "";

  const [email] = useState(passedEmail);
  const [progress, setProgress] = useState(33);
  const [otp, setOtp] = useState("");

  const handleSendCode = () => {
    alert(`Verification code sent to ${email}`);
  };

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
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 bg-green-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2 text-gray-500">
            <span className={progress >= 0 ? "text-green-600 font-semibold" : ""}>
              Personal Info
            </span>
            <span className={progress >= 33 ? "text-green-600 font-semibold" : ""}>
              Email Verification
            </span>
            <span className={progress >= 66 ? "text-green-600 font-semibold" : ""}>
              Aadhar Linking
            </span>
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="email">📧</span>
            Verify Email Address
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p>
              <span className="font-medium">Email Address:</span>{" "}
              <span className="text-blue-700 font-medium">{email}</span>
            </p>
            <p className="mt-1 text-gray-600">
              We will send a 6-digit verification code to this email address.
              Please ensure you have access to this email.
            </p>
          </div>

          {/* OTP Input */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
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
            <NavLink
              to="/AadharCard"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Verify & Continue →
            </NavLink>
            <button
              onClick={handleSendCode}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Resend Code
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Make sure to check your spam folder if you don’t see the email
          </p>

          <NavLink
            to="/signup"
            className="block mt-4 text-blue-600 text-center text-sm hover:underline"
          >
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
  );
}
