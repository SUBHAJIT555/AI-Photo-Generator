import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "../component/Logo";
import AnimatedButton from "../component/AnimatedButton";
import { saveData } from "../utils/localStorageDB";
import { useNavigate } from "react-router-dom";
import BGImage from "../assets/logo/BG.webp";

function Capture() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [columns, setColumns] = useState([]);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cols = devices
      .filter((device) => device.kind === "videoinput")
      .map((device) => ({ label: device.label, deviceId: device.deviceId }));
    setColumns(cols);
  }

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setVideoStream(stream);
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  }, [videoStream]);

  const stopVideoAndClear = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    // Clear the video element's srcObject to prevent visual glitches
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoStream]);

  const captureImage = () => {
    setLoading(true);
    setCountdown(5);
  };

  const submitImage = () => {
    stopVideo();
    saveData("capturedImage", capturedImage);
    navigate("/avatar");
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas to the same size as the video frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);
      }
      setLoading(false);
      setCountdown(null);
      stopVideo();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, stopVideo]);

  useEffect(() => {
    getDevices();
    return () => stopVideo();
  }, [stopVideo]);

  useEffect(() => {
    if (columns.length > 0 && !videoStream) {
      startCamera();
    }
  }, [columns, videoStream, startCamera]);

  return (
    <div
      className="flex flex-col justify-evenly items-center w-full h-screen"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <Logo />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="flex relative justify-center items-center w-3/4">
        {!capturedImage ? (
          <video
            ref={videoRef}
            className="w-full max-w-2xl bg-black rounded-2xl shadow-lg"
            autoPlay
            muted
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-2xl rounded-2xl border-4 border-white shadow-lg"
          />
        )}
        {countdown && (
          <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-50 rounded-2xl">
            <p className="text-9xl font-bold text-white animate-ping font-grotesk">
              {countdown}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-x-10 mt-8">
        {!capturedImage ? (
          <AnimatedButton
            text={loading ? "Capturing..." : "Capture"}
            onClick={captureImage}
            className={loading ? "opacity-50 cursor-not-allowed" : ""}
          />
        ) : (
          <>
            <AnimatedButton
              text="Retake"
              onClick={async () => {
                // Reset the captured image first
                setCapturedImage(null);

                // Stop the current video stream and clear the video element
                stopVideoAndClear();

                // Wait a bit longer for the stream to fully stop before restarting
                setTimeout(() => {
                  startCamera();
                }, 300);
              }}
              className="bg-gray-600 hover:bg-gray-700"
            />

            <AnimatedButton
              text="Submit"
              onClick={submitImage}
              className="bg-blue-600 hover:bg-blue-700"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Capture;
