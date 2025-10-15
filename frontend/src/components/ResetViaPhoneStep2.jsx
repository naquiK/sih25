import { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import ForgotPasswordLayout from "../components/miniComponents/ForgorPasswordLayout";
import { toast } from "react-toastify";

export default function ResetViaPhoneStep2() {
  const location = useLocation();
  const phone = location.state?.phone || "your registered phone number";
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }
    toast.success(`OTP verified successfully for ${phone}`);
    navigate("/ResetPasswordStep3");
  };

  return (
    <ForgotPasswordLayout stepTitle="Step 2: Verify OTP">
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          We’ve sent a 6-digit OTP to your registered phone number:{" "}
          <span className="font-semibold text-blue-700">{phone}</span>.  
          Please enter it below to proceed.
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="mt-1 w-full p-2 border rounded-md text-center text-lg tracking-widest font-semibold focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-4">
          <NavLink
            to="/ResetViaPhone"
            className="text-gray-600 hover:underline flex items-center justify-center gap-1"
          >
            ← Back to Phone Step
          </NavLink>
        </div>
      </div>
    </ForgotPasswordLayout>
  );
}
