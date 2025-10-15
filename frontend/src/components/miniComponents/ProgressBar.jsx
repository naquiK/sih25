import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden my-4">
      <div
        className="h-5 text-white text-xs font-semibold flex items-center justify-center transition-all duration-500 ease-in-out bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
