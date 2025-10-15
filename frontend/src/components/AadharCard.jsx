import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import ProgressBar from "./miniComponents/ProgressBar";

export default function AadharLinking() {
  const [progress, setProgress] = useState(66); // step 3 begins at 66%
  const [aadhar, setAadhar] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (aadhar.length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhar number.");
      return;
    }
    toast.success(`OTP sent to mobile linked with Aadhar ${aadhar}`);
  };

  const handleComplete = () => {
    setProgress(100);
    toast.success("Registration Completed!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-green-700">
            Citizen Registration
          </h2>
          <p className="text-gray-600 mt-1">Step 3 of 3: Aadhar Linking</p>
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

        {/* Aadhar Linking Section */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              🔒 Link Aadhar
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Link your Aadhar for enhanced verification and access to more services.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-sm">
            <p>• Access to all government services</p>
            <p>• Faster document verification</p>
            <p>• Enhanced account security</p>
            <p>• Digital identity verification</p>
          </div>

          {/* Aadhar Input */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aadhar Number *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={12}
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="Enter 12-digit Aadhar number"
              className="flex-1 border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleSendOtp}
              className="bg-blue-500 text-white px-5 rounded-md hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </div>

          {/* OTP Input */}
          {aadhar.length === 12 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border rounded-md px-3 py-2 text-center tracking-widest font-semibold focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6">
          <NavLink
            to="/Login"
            onClick={handleComplete}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
                 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
                 transition"
          >
            Complete Registration
          </NavLink>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          All information provided will be verified through government databases. <br />
          Registration may take 24-48 hours for approval.
        </p>
        <p className="text-xs text-gray-400 text-center mt-2">
          © 2024 Government of Jharkhand | Department of Higher and Technical Education
          <br />• Help • Contact • Accessibility
        </p>
      </div>
    </div>
  );
}
