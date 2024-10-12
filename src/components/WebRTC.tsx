"use client";
import React, { useEffect, useRef, useState } from "react";

interface MediaDeviceInfo {
  deviceId: string;
  label: string;
}

const WebRTC: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || "Unnamed Camera",
        }));

      setDevices(videoDevices);

      const obsCamera = videoDevices.find((device) =>
        device.label.includes("OBS")
      );
      if (obsCamera) {
        setSelectedDeviceId(obsCamera.deviceId);
        startVideoStream(obsCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
        startVideoStream(videoDevices[0].deviceId);
      }
    } catch (error) {
      setErrorMessage("Unable to access media devices.");
      console.error("Error fetching media devices:", error);
    }
  };

  const startVideoStream = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        "Unable to start video stream. Please check permissions and try again."
      );
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    getCameras();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        console.log("Camera access granted.");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(function (error) {
        console.error("Camera access denied:", error);
        setErrorMessage(
          "Unable to access the camera. Please check permissions."
        );
      });
  }, []);

  return (
    <div className="mx-auto relative z-10 ">
      {devices.length > 0 && (
        <div className="mb-1 absolute z-10 hidden" style={{ width: "100px" }}>
          <label
            htmlFor="cameraSelect"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Camera:
          </label>
          <div id="cameraSelect">
            {devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => {
                  setSelectedDeviceId(device.deviceId);
                  startVideoStream(device.deviceId);
                }}
                className="block w-full text-left text-xs p-1 mb-1 border border-gray-300 rounded-md focus:outline-none"
              >
                {device.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative w-full h-[100vh] bg-gray-900 rounded-md overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default WebRTC;
