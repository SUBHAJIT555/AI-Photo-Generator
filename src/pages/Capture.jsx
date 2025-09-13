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
  const [isRestarting, setIsRestarting] = useState(false);

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
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        return new Promise((resolve) => {
          // Set the stream
          videoRef.current.srcObject = stream;

          // Wait for both metadata and first frame to be ready
          const handleCanPlay = () => {
            videoRef.current.removeEventListener("canplay", handleCanPlay);
            setVideoStream(stream);
            resolve();
          };

          videoRef.current.addEventListener("canplay", handleCanPlay);

          // Fallback timeout
          setTimeout(() => {
            videoRef.current.removeEventListener("canplay", handleCanPlay);
            setVideoStream(stream);
            resolve();
          }, 2000);
        });
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

  const stopVideoAndClear = useCallback(async () => {
    return new Promise((resolve) => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }

      if (videoRef.current) {
        // Pause first, then clear
        videoRef.current.pause();
        videoRef.current.srcObject = null;

        // Force a repaint and wait for the video element to fully clear
        videoRef.current.load();

        // Wait for the video element to be completely cleared
        setTimeout(resolve, 100);
      } else {
        resolve();
      }
    });
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
            playsInline
            style={{
              opacity: isRestarting ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
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
            <p className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-ping font-grotesk">
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
              text={isRestarting ? "Starting..." : "Retake"}
              onClick={async () => {
                if (isRestarting) return;

                setIsRestarting(true);

                try {
                  // Reset the captured image first
                  setCapturedImage(null);

                  // Stop and clear the current video stream completely
                  await stopVideoAndClear();

                  // Wait a bit more for complete cleanup
                  await new Promise((resolve) => setTimeout(resolve, 200));

                  // Start the camera again and wait for it to be ready
                  await startCamera();
                } catch (error) {
                  console.error("Error restarting camera:", error);
                } finally {
                  setIsRestarting(false);
                }
              }}
              className={`${
                isRestarting
                  ? "bg-gray-500 opacity-75 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
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
