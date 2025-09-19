import { NavLink } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export default function RecoveryOptions({ className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <NavLink
        to="/ResetViaEmail"
        className={({ isActive }) =>
          `w-full flex items-center gap-3 p-4 rounded-md transition ${
            isActive
              ? "border-2 border-green-600 bg-green-50"
              : "border border-gray-300 hover:bg-gray-50"
          }`
        }
      >
        <Mail className="w-5 h-5 text-gray-600" />
        <div className="text-left">
          <p className="font-medium text-gray-800">Email Address</p>
          <p className="text-sm text-gray-500">Reset via registered email</p>
        </div>
      </NavLink>

      <NavLink
        to="/ResetViaPhone"
        className={({ isActive }) =>
          `w-full flex items-center gap-3 p-4 rounded-md transition ${
            isActive
              ? "border-2 border-green-600 bg-green-50"
              : "border border-gray-300 hover:bg-gray-50"
          }`
        }
      >
        <Phone className="w-5 h-5 text-gray-600" />
        <div className="text-left">
          <p className="font-medium text-gray-800">Phone Number</p>
          <p className="text-sm text-gray-500">Reset via registered mobile</p>
        </div>
      </NavLink>
    </div>
  );
}
