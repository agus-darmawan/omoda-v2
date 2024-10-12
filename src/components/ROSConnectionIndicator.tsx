import React from "react";

interface ROSConnectionIndicatorProps {
  connected: boolean;
}

const ROSConnectionIndicator: React.FC<ROSConnectionIndicatorProps> = ({
  connected,
}) => {
  return (
    <div className="absolute top-5 right-5">
      <div
        className={`px-4 py-2 text-white rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {connected ? "ROS Connected" : "ROS Disconnected"}
      </div>
    </div>
  );
};

export default ROSConnectionIndicator;
