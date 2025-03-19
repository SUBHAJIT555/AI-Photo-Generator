import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "../component/Logo";
import { saveData } from "../utils/localStorageDB";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import BGImage from "../assets/logo/BG.jpg";

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
      className="flex flex-col items-center w-full h-screen justify-evenly"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <Logo />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="relative flex items-center justify-center w-3/4">
        {!capturedImage ? (
          <video
            ref={videoRef}
            className="w-full max-w-2xl bg-black shadow-lg rounded-2xl"
            autoPlay
            muted
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-2xl border-4 border-white shadow-lg rounded-2xl"
          />
        )}
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
            <p className="font-bold text-white text-9xl animate-ping">
              {countdown}
            </p>
          </div>
        )}
      </div>
      <div className="flex mt-8 gap-x-10">
        {!capturedImage ? (
          <button
            onClick={captureImage}
            disabled={loading}
            className={`relative px-14 py-3 text-white rounded-full shadow-lg transition-all duration-300 overflow-hidden z-[2] tracking-tight capitalize border-2 border-transparent 
    ${
      loading
        ? "bg-indigo-400 cursor-not-allowed opacity-50"
        : "bg-indigo-600 hover:bg-indigo-800 hover:border-indigo-300 hover:shadow-[0_0_20px_rgba(99,102,241,1)] active:scale-95"
    }`}
          >
            {/* Sparkles */}
            {!loading && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute block bg-white rounded-full opacity-50"
                    style={{
                      width: `${Math.random() * 4 + 2}px`,
                      height: `${Math.random() * 4 + 2}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `sparkle-animation ${
                        Math.random() * 3 + 2
                      }s linear infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Button Text */}
            <span className="text-[1.2rem] tracking-widest">
              {loading ? "Capturing..." : "Capture"}
            </span>

            {/* Magical Styles */}
            <style>
              {`
      @keyframes sparkle-animation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
      }
    `}
            </style>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                startCamera();
                setCapturedImage(null);
              }}
              className="relative px-10 py-3 text-white bg-gray-600 rounded-full shadow-lg transition-all duration-300 overflow-hidden z-[2] tracking-tight capitalize border-2 border-transparent 
    hover:bg-gray-800 hover:border-gray-300 hover:shadow-[0_0_20px_rgba(156,163,175,1)] active:scale-95"
            >
              {/* Sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute block bg-white rounded-full opacity-50"
                    style={{
                      width: `${Math.random() * 4 + 2}px`,
                      height: `${Math.random() * 4 + 2}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `sparkle-animation ${
                        Math.random() * 3 + 2
                      }s linear infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Button Text */}
              <span className="text-[1.2rem]">Retake</span>

              {/* Magical Styles */}
              <style>
                {`
      @keyframes sparkle-animation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
      }
    `}
              </style>
            </button>

            <button
              onClick={submitImage}
              className="relative px-10 py-3 text-white bg-blue-600 rounded-full shadow-lg transition-all duration-300 overflow-hidden z-[2] tracking-tight capitalize border-2 border-transparent 
    hover:bg-blue-800 hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,1)] active:scale-95"
            >
              {/* Sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute block bg-white rounded-full opacity-50"
                    style={{
                      width: `${Math.random() * 4 + 2}px`,
                      height: `${Math.random() * 4 + 2}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `sparkle-animation ${
                        Math.random() * 3 + 2
                      }s linear infinite`,
                    }}
                  />
                ))}
              </div>

              {/* Button Text */}
              <span className="text-[1.2rem]">Submit</span>

              {/* Magical Styles */}
              <style>
                {`
      @keyframes sparkle-animation {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(300%, -50%) scale(0.5); opacity: 0; }
      }
    `}
              </style>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Capture;
