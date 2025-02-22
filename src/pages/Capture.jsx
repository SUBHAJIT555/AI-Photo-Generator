import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "../component/Logo";
import { saveData } from "../utils/localStorageDB";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

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
    console.log(devices);
    const cols = [];
    devices.forEach((device) => {
      if (device.kind === "videoinput") {
        cols.push({
          label: device.label,
          deviceId: device.deviceId,
        });
      }
    });
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
      console.log("Camera started");
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  }, []);

  const stopVideo = useCallback(() => {
    console.log("Stopping video");
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      setVideoStream(null);
    }
  }, [videoStream]);

  const captureImage = () => {
    setLoading(true);
    setCountdown(5);
  };

  const submitImage = () => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    setVideoStream(null);
  }
  saveData("capturedImage", capturedImage);
  navigate("/avatar");
};


  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Capture the image
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const image = canvasRef.current.toDataURL("image/png");
        setCapturedImage(image);
      }
      setLoading(false);
      setCountdown(null);
      stopVideo();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, stopVideo]);

  useEffect(() => {
    console.log("Mounting");
    getDevices();
    return () => {
      stopVideo();
    };
  }, [stopVideo]);

  // Automatically start the camera if available.
  useEffect(() => {
    if (columns.length > 0 && !videoStream) {
      startCamera();
    }
  }, [columns, videoStream, startCamera]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 justify-evenly">
      <Logo />

      {/* Hidden canvas for capturing the image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Video Stream Section */}
      {!capturedImage ? (
        <div className="flex flex-col items-center py-2">
          <div className="relative">
            <video
              ref={videoRef}
              className="bg-black shadow-lg rounded-2xl"
              autoPlay
              muted
              style={{ width: "100%", height: "100%"}}
            />
            {countdown && (
              <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
                <p className="font-bold text-white animate-ping text-9xl">
                  {countdown}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center mt-8">
            {/* Fallback: if videoStream hasn't started and no camera is found, show a message */}
            {!videoStream ? (
              columns.length > 0 ? (
                <button
                  onClick={startCamera}
                  className="px-5 py-3 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-zinc-700 hover:bg-zinc-900 hover:border-zinc-200"
                >
                  Start Camera
                </button>
              ) : (
                <p className="text-zinc-200">No Camera Found</p>
              )
            ) : (
              <button
                disabled={loading}
                onClick={captureImage}
                className={cn(
                  "capitalize text-zinc-200 tracking-tight font-light bg-zinc-700 py-3 px-5 rounded-full border-2 border-transparent hover:bg-zinc-900 hover:border-zinc-200",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? "Capturing..." : "Click here to capture"}
              </button>
            )}
          </div>
        </div>
      ) : (
        // Captured Image Section
        <div className="flex flex-col items-center py-2">
          <img
            src={capturedImage}
            alt="Captured"
            className="border-4 border-white shadow-lg rounded-2xl"
            style={{ width: "640px", height: "480px" }}
          />
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                startCamera();
                setCapturedImage(null);
              }}
              className="px-5 py-2 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-zinc-700 hover:bg-zinc-900 hover:border-zinc-200"
            >
              Retake
            </button>

            <button
              onClick={submitImage}
              className="px-5 py-2 font-light tracking-tight capitalize border-2 border-transparent rounded-full text-zinc-200 bg-zinc-700 hover:bg-zinc-900 hover:border-zinc-200"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Capture;
