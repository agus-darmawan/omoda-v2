"use client";
import { useEffect, useState } from "react";
import WebRTC from "@/components/WebRTC";
import RosComponent from "@/components/ROSComponents";
import DashboardInfo from "@/components/DashboardInfo";
import ProgressBar from "@/components/ProgressBar";
import ROSConnectionIndicator from "@/components/ROSConnectionIndicator";
import {
  calculateAverageSpeed,
  getSpeedHistory,
  formatElapsedTime,
} from "@/lib/utils";

export default function HomePage() {
  const d = new Date();
  const fullhour = d.toTimeString().slice(0, 5);
  const fullDate = `${d.toLocaleString("default", {
    month: "short",
  })} ${d.getDate()} of ${d.getFullYear()}`;

  const [ElapsedTime, setElapsedTime] = useState(900000);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(250);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [leftRight, setLeftRight] = useState(0);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);

  const { connected, joyData } = RosComponent();

  useEffect(() => {
    const savedDistance = localStorage.getItem("distance") || "800";
    const savedElapsedTime = localStorage.getItem("ElapsedTime") || "900000";
    const savedSpeedData = getSpeedHistory();

    setDistance(parseFloat(savedDistance));
    setElapsedTime(parseInt(savedElapsedTime, 10));
    setAverageSpeed(calculateAverageSpeed(savedSpeedData));
  }, []);

  useEffect(() => {
    localStorage.setItem("distance", distance.toString());
    localStorage.setItem("ElapsedTime", ElapsedTime.toString());
    localStorage.setItem("speedData", JSON.stringify(getSpeedHistory()));
  }, [distance, ElapsedTime, speed]);

  useEffect(() => {
    if (joyData) {
      const newLeftRight = joyData.axes[0] * 100;
      const newThrottle = joyData.axes[1] * 100;
      const newBrake = joyData.axes[2] * 100;

      setLeftRight(newLeftRight);
      setThrottle(newThrottle);
      setBrake(newBrake);

      const newSpeed = (newThrottle / 100) * 50;
      setSpeed(newSpeed);
    }
  }, [joyData]);

  return (
    <main className="relative bg-black h-screen">
      <h1 className="text-[#ff0005] text-2xl font-bold mx-auto text-center pt-5">
        OMODA DASHBOARD
      </h1>
      <ROSConnectionIndicator connected={connected} />
      <div className="scale-y-75 scale-x-95 z-10 relative -top-20 rounded-lg">
        <WebRTC />
      </div>
      <ProgressBar
        position="center"
        value={leftRight}
        label={
          leftRight > 0 ? `Right ${leftRight}` : `Left ${Math.abs(leftRight)}`
        }
        color="#ff0005"
      />
      <ProgressBar
        position="left"
        value={throttle}
        label={`${throttle}% Throttle`}
        color="#ff0005"
      />
      <ProgressBar
        position="right"
        value={brake}
        label={`${brake}% Brake`}
        color="#00ff00"
      />
      <div className="absolute bottom-0 h-28 text-white gap-5 flex w-full py-5 items-center justify-center">
        <DashboardInfo
          value={fullhour}
          label={fullDate}
          color="#ff0005"
          large
        />
        <DashboardInfo
          value={`${speed.toFixed(2)} km/h`}
          label="SPEED"
          color="#00ff00"
        />
        <DashboardInfo
          value={`${distance} km`}
          label="DISTANCE TRAVELED"
          color="#00ff00"
        />
        <DashboardInfo
          value={formatElapsedTime(ElapsedTime)}
          label="TRAVEL TIME"
          color="#00ff00"
        />
        <DashboardInfo
          value={`${averageSpeed} km/h`}
          label="AVERAGE SPEED"
          color="#00ff00"
        />
      </div>
    </main>
  );
}
