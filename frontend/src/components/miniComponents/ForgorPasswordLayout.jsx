import { NavLink } from "react-router-dom";
import { Key } from "lucide-react";

export default function ForgotPasswordLayout({ title, subtitle, stepTitle, children }) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <img
            src="/jharkhand-logo.png"
            alt="Jharkhand Gov Logo"
            className="w-14 mx-auto mb-2"
          />
          <h2 className="text-xl font-bold">JHARKHAND CIVIC PORTAL</h2>
          <p className="text-sm text-gray-600">
            Crowdsourced Issue Reporting System
          </p>
          <p className="text-xs text-gray-500">🔒 Secure • Verified • Trusted</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md px-4 mt-8">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold text-lg">
              <Key className="w-5 h-5" />
              <span>{title || "Reset Your Password"}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {subtitle || "Follow the steps below to reset your password securely"}
            </p>
          </div>

          {/* Inner Box */}
          <div className="rounded-lg border border-gray-200 p-4 bg-white">
            {stepTitle && (
              <h3 className="text-base font-medium text-gray-800 mb-4">
                {stepTitle}
              </h3>
            )}

            {/* Children (unique form per step) */}
            <div>{children}</div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <NavLink
              to="/login"
              className="text-gray-600 hover:underline flex items-center justify-center gap-1"
            >
              ← Back to Sign In
            </NavLink>
          </div>

          {/* Support */}
          <p className="text-xs text-gray-500 text-center mt-4">
            For additional support, contact:{" "}
            <a href="mailto:support@gov.portal" className="text-blue-600">
              support@gov.portal
            </a>
            <br />
            This is a secure government portal
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        © 2024 Government of Jharkhand | Department of Higher and Technical
        Education
        <br />
        • Help • Contact • Accessibility
      </p>
    </div>
  );
}
