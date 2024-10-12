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
  formatLamaJalan,
} from "@/lib/utils";

export default function HomePage() {
  // Date and Time for Dashboard
  const d = new Date();
  const fullhour = d.toTimeString().slice(0, 5);
  const fullDate = `${d.toLocaleString("default", {
    month: "short",
  })} ${d.getDate()} of ${d.getFullYear()}`;

  // State Variables
  const [lamaJalan, setLamaJalan] = useState(0); // in seconds
  const [speed, setSpeed] = useState(0); // Speed state (current speed)
  const [distance, setDistance] = useState(0); // Distance traveled
  const [averageSpeed, setAverageSpeed] = useState(0); // Average speed
  const [leftRight, setLeftRight] = useState(0); // Left-Right joystick value
  const [throttle, setThrottle] = useState(0); // Throttle joystick value
  const [brake, setBrake] = useState(0); // Brake joystick value
  const [speedHistory, setSpeedHistory] = useState<number[]>([]); // Store speed history

  // Get ROS Data (connected status and joystick data)
  const { connected, joyData } = RosComponent();

  // Increment time (lamaJalan) every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLamaJalan((prevLamaJalan) => prevLamaJalan + 1);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Update distance and average speed based on time and speed
  useEffect(() => {
    // Update distance based on current speed
    const newDistance = speed / 3600; // speed in km/h -> distance in km per second
    setDistance((prevDistance) => prevDistance + newDistance);

    // Add the new speed to the history array
    setSpeedHistory((prevHistory) => [...prevHistory, speed]);

    // Calculate average speed based on the speed history
    setAverageSpeed(calculateAverageSpeed([...speedHistory, speed]));
  }, [speed, lamaJalan]); // Recalculate every second based on speed

  // Load saved data from local storage on mount
  useEffect(() => {
    const savedDistance = localStorage.getItem("distance") || "0";
    const savedLamaJalan = localStorage.getItem("lamaJalan") || "0";
    const savedSpeedData = localStorage.getItem("speedData") || "[]";

    setDistance(parseFloat(savedDistance));
    setLamaJalan(parseInt(savedLamaJalan, 10));
    setAverageSpeed(calculateAverageSpeed(JSON.parse(savedSpeedData)));
  }, []);

  // Save data to local storage when distance, speed, or time changes
  useEffect(() => {
    localStorage.setItem("distance", distance.toFixed(2));
    localStorage.setItem("lamaJalan", lamaJalan.toString());
    localStorage.setItem("speedData", JSON.stringify(speedHistory));
  }, [distance, lamaJalan, speedHistory]);

  // Update throttle, brake, left-right, and speed based on joystick data
  useEffect(() => {
    if (joyData) {
      const newLeftRight = joyData.axes[0] * 100; // Assuming axes[0] for left/right (-100 to 100)
      const newThrottle = joyData.axes[1] * 100; // Assuming axes[1] for throttle (0 to 100)
      const newBrake = joyData.axes[2] * 100; // Assuming axes[2] for brake (0 to 100)

      setLeftRight(newLeftRight);
      setThrottle(newThrottle);
      setBrake(newBrake);

      // Update speed based on throttle
      const newSpeed = (newThrottle / 100) * 50; // Map throttle (0-100) to speed (0-50 km/h)
      setSpeed(newSpeed);
    }
  }, [joyData]);

  // Utility Functions
  const calculateAverageSpeed = (speedHistory: number[]) => {
    if (speedHistory.length === 0) return 0;
    const totalSpeed = speedHistory.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((totalSpeed / speedHistory.length).toFixed(2));
  };

  const formatLamaJalan = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

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
          value={`${distance.toFixed(2)} km`}
          label="DISTANCE TRAVELED"
          color="#00ff00"
        />
        <DashboardInfo
          value={formatLamaJalan(lamaJalan)}
          label="TRAVEL TIME"
          color="#00ff00"
        />
        <DashboardInfo
          value={`${averageSpeed.toFixed(2)} km/h`}
          label="AVERAGE SPEED"
          color="#00ff00"
        />
      </div>
    </main>
  );
}
