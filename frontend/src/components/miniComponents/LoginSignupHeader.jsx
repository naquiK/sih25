import { NavLink } from "react-router-dom";

export default function LoginSignupHeader() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Logo + Title Bar */}
      <div className="w-full bg-white shadow-sm border-b py-4">
        <div className="text-center">
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

      {/* Tabs - Segmented control */}
      <div className="flex w-[500px] mb-6 mt-4 rounded-full border bg-white shadow-sm overflow-hidden">
        <NavLink
          to="/Login"
          className={({ isActive }) =>
            `flex-1 text-center py-2 font-medium transition ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Citizen Login
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `flex-1 text-center py-2 font-medium transition ${
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          New Registration
        </NavLink>
      </div>
    </div>
  );
}
