import React from "react";

interface ProgressBarProps {
  position: "left" | "right" | "center";
  value: number;
  label: string;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  position,
  value,
  label,
  color,
}) => {
  const getProgressBarPositionClasses = () => {
    switch (position) {
      case "left":
        return "absolute left-0 bottom-28 flex flex-col items-center z-10";
      case "right":
        return "absolute right-0 bottom-28 flex flex-col items-center z-10";
      case "center":
        return "absolute bottom-28 z-10 w-[50vw] ml-[25vw] flex justify-center items-center";
      default:
        return "";
    }
  };

  return (
    <div className={getProgressBarPositionClasses()}>
      {/* Bar container logic */}
      {position === "center" ? (
        <div className="relative w-[100%] bg-gray-700 rounded-full h-8">
          <div
            className="absolute bg-[#ff0005] h-[100%]"
            style={{
              width: `${Math.abs(value / 2)}%`,
              left: value >= 0 ? "50%" : `calc(50% - ${Math.abs(value / 2)}%)`,
              borderRadius:
                value >= 0 ? "0px 50px 50px 0px" : "50px 0px 0px 50px",
            }}
          ></div>
          {/* Display label inside the bar */}
          <p className="absolute inset-0 flex items-center justify-center text-white">
            {label}
          </p>
        </div>
      ) : (
        <>
          {/* Vertical bars for throttle and brake */}
          <div className="relative h-[50vh] w-8 bg-gray-700 rounded-full">
            <div
              className="absolute w-[100%] rounded-full"
              style={{ height: `${value}%`, bottom: 0, backgroundColor: color }}
            ></div>
          </div>
          <p className="mt-3 text-white">{label}</p>
        </>
      )}
    </div>
  );
};

export default ProgressBar;
