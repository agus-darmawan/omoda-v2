import React from "react";

interface DashboardInfoProps {
  value: string;
  label: string;
  color: string;
  large?: boolean;
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({
  value,
  label,
  color,
  large = false,
}) => {
  return (
    <div className="bg-black px-5 flex flex-col items-center justify-center h-[6rem] border border-zinc-100/50 shadow-2xl backdrop-blur-lg rounded-lg">
      <h1
        className={`font-bold ${large ? "text-[3rem]" : "text-2xl"}`}
        style={{ color }}
      >
        {value}
      </h1>
      <p className="text-lg">{label}</p>
    </div>
  );
};

export default DashboardInfo;
