import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden my-4">
      <div
        className="bg-green-600 h-5 text-white text-xs font-semibold flex items-center justify-center transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
