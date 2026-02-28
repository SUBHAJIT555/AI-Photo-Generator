import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import { ShinyButton } from "./shiny-button";
import { saveData } from "../utils/localStorageDB";

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
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-evenly items-center overflow-hidden">
      {/* Dashed grid - same as Instruction */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(to right, #FF5900 1px, transparent 1px),
        linear-gradient(to bottom, #FF5900 1px, transparent 1px)
      `,
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 0",
          opacity: 0.3,
          maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Orange glow - same as Instruction */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #FF5900 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 py-4">
      <Logo />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="flex relative justify-center items-center w-fit max-w-[90vw] rounded-3xl ring-1 ring-offset-8 ring-neutral-300">
        {!capturedImage ? (
          <video
            ref={videoRef}
            className="w-full max-w-2xl min-h-[45vh] object-cover bg-black rounded-3xl shadow-lg"
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
            className="w-full max-w-2xl min-h-[45vh] object-cover rounded-3xl border-4 border-white shadow-lg"
          />
        )}
        {countdown && (
          <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-50 rounded-3xl">
            <p className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff5900] to-[#df8859] animate-ping ">
              {countdown}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-x-10 mt-8">
        {!capturedImage ? (
          <ShinyButton
            onClick={loading ? undefined : captureImage}
            className={loading ? "opacity-50 pointer-events-none" : ""}
          >
            {loading ? "Capturing..." : "Click to Capture"}
          </ShinyButton>
        ) : (
          <>
            <ShinyButton
              onClick={async () => {
                if (isRestarting) return;
                setIsRestarting(true);
                try {
                  setCapturedImage(null);
                  await stopVideoAndClear();
                  await new Promise((resolve) => setTimeout(resolve, 200));
                  await startCamera();
                } catch (error) {
                  console.error("Error restarting camera:", error);
                } finally {
                  setIsRestarting(false);
                }
              }}
              className={isRestarting ? "opacity-75 pointer-events-none" : ""}
            >
              {isRestarting ? "Starting..." : "Retake"}
            </ShinyButton>

            <ShinyButton onClick={submitImage}>Submit</ShinyButton>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

export default Capture;
