import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../component/Logo";
import PageBackground from "../component/PageBackground";
import { LiquidMetalButton } from "@/components/ui/LiquidMetalButton";
import { CameraGlassFrame } from "@/components/ui/CameraGlassFrame";
import { saveData } from "../utils/localStorageDB";
import { composeLabeledPhoto } from "../utils/composeLabeledPhoto";
import { uploadPhotoForSoftCopy } from "../utils/uploadPhoto";
import {
  detectFaces,
  initializeFaceDetector,
} from "../utils/faceDetector";
import { cropPrimaryFace } from "../utils/cropPrimaryFace";

const AVATAR_PATH_MESSAGES = {
  NO_FACE: "Please position one face in the camera and retake the photo.",
  FACE_TOO_SMALL: "Please move closer to the camera and retake the photo.",
  AMBIGUOUS_MULTIPLE_FACES:
    "Only one person should be close to the camera. Please retake the photo.",
  DETECTOR_FAILURE: "Could not check the photo. Please retake the photo.",
  UNSAFE_CROP:
    "Only one person should be close to the camera. Please retake the photo.",
};

function Capture() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [swapImage, setSwapImage] = useState(null);
  const [swapCropReason, setSwapCropReason] = useState(null);
  const [isCheckingPhoto, setIsCheckingPhoto] = useState(false);
  const [columns, setColumns] = useState([]);
  const canvasRef = useRef(null);
  const captureIdRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isProcessingOriginal, setIsProcessingOriginal] = useState(false);

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
          videoRef.current.srcObject = stream;

          const handleCanPlay = () => {
            videoRef.current.removeEventListener("canplay", handleCanPlay);
            setVideoStream(stream);
            resolve();
          };

          videoRef.current.addEventListener("canplay", handleCanPlay);

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
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.load();
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

  const continueWithAvatar = () => {
    if (isCheckingPhoto || isProcessingOriginal) return;
    if (!swapImage) return;

    saveData("capturedImage", swapImage);
    navigate("/avatar");
  };

  const useOriginalPhoto = async () => {
    if (!capturedImage || isProcessingOriginal) return;

    try {
      setIsProcessingOriginal(true);
      stopVideo();

      const labeledImage = await composeLabeledPhoto(capturedImage);
      saveData("capturedImage", capturedImage);
      saveData("labeledOriginalImage", labeledImage);

      // Upload so QR can use a real http URL (same as swap.php result_url)
      const softCopyUrl = await uploadPhotoForSoftCopy(labeledImage);
      if (softCopyUrl) {
        saveData("softCopyUrl", softCopyUrl);
      }

      navigate("/preview", {
        state: {
          // Soft-copy http URL for display/QR when available
          resultUrl: softCopyUrl || labeledImage,
          softCopyUrl: softCopyUrl || null,
          // Always keep local labeled JPEG for PrintNode (reliable print)
          printUrl: labeledImage,
          mode: "original",
        },
      });
    } catch (error) {
      console.error("Error creating labeled original photo:", error);
    } finally {
      setIsProcessingOriginal(false);
    }
  };

  useEffect(() => {
    initializeFaceDetector().catch((error) => {
      console.error("Face detector preload failed:", error);
    });
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const canvas = canvasRef.current;
      if (videoRef.current && canvas) {
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);

        const captureId = ++captureIdRef.current;
        setSwapImage(null);
        setSwapCropReason(null);
        setIsCheckingPhoto(true);

        void (async () => {
          try {
            const detection = await detectFaces(canvas);
            if (captureId !== captureIdRef.current) return;
            if (!detection.ok) {
              setSwapImage(null);
              setSwapCropReason(detection.reason);
              return;
            }

            const crop = cropPrimaryFace({
              faces: detection.faces,
              sourceCanvas: canvas,
              imageWidth: canvas.width,
              imageHeight: canvas.height,
            });
            if (captureId !== captureIdRef.current) return;
            if (crop.ok) {
              setSwapImage(crop.cropDataUrl);
              setSwapCropReason(null);
            } else {
              setSwapImage(null);
              setSwapCropReason(crop.reason);
            }
          } catch (error) {
            console.error("Error checking captured photo:", error);
            if (captureId !== captureIdRef.current) return;
            setSwapImage(null);
            setSwapCropReason("DETECTOR_FAILURE");
          } finally {
            if (captureId === captureIdRef.current) {
              setIsCheckingPhoto(false);
            }
          }
        })();
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

  const avatarPathMessage = swapCropReason
    ? AVATAR_PATH_MESSAGES[swapCropReason] ||
      AVATAR_PATH_MESSAGES.DETECTOR_FAILURE
    : null;

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-evenly items-center overflow-hidden">
      <PageBackground />

      <div className="flex flex-col justify-evenly items-center w-full flex-1 relative z-[2] text-white px-4 py-4">
        <div className="w-full">
          <Logo
            onBack={() => {
              stopVideo();
              navigate("/instruction");
            }}
            backDisabled={loading || isProcessingOriginal}
          />
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <CameraGlassFrame>
          {!capturedImage ? (
            <video
              ref={videoRef}
              className="w-full max-w-2xl min-h-[45vh] object-cover bg-black"
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
              className="w-full max-w-2xl min-h-[45vh] object-cover"
            />
          )}
          {countdown && (
            <div className="flex absolute inset-0 z-10 justify-center items-center bg-black/50">
              <p className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F758B] to-[#9CB8C8] animate-ping">
                {countdown}
              </p>
            </div>
          )}
        </CameraGlassFrame>

        <div className="flex flex-col items-center gap-3 mt-6 w-full max-w-[90vw] px-2">
          {!capturedImage ? (
            <LiquidMetalButton
              label={loading ? "Capturing..." : "Click to Capture"}
              large
              onClick={captureImage}
              disabled={loading}
              labelClassName="uppercase tracking-widest font-extrabold"
            />
          ) : (
            <>
              {avatarPathMessage && (
                <p className="max-w-[90vw] text-center text-white text-[clamp(0.9rem,2.4vw,1.25rem)] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                  {avatarPathMessage}
                </p>
              )}
              <div className="flex items-center justify-center gap-3 w-full">
                <LiquidMetalButton
                  label={
                    isProcessingOriginal ? "Preparing..." : "Use Original Photo"
                  }
                  onClick={useOriginalPhoto}
                  disabled={isProcessingOriginal}
                  className="min-w-0 flex-1 max-w-[44%] px-3 py-3 text-[clamp(0.75rem,2.6vw,1.15rem)] rounded-xl ring-offset-2"
                  labelClassName="uppercase tracking-wide font-extrabold whitespace-normal text-center leading-tight"
                />

                <LiquidMetalButton
                  label={
                    isCheckingPhoto ? "Checking photo..." : "Continue with Avatar"
                  }
                  onClick={continueWithAvatar}
                  disabled={
                    isProcessingOriginal || isCheckingPhoto || !swapImage
                  }
                  className="min-w-0 flex-1 max-w-[44%] px-3 py-3 text-[clamp(0.75rem,2.6vw,1.15rem)] rounded-xl ring-offset-2"
                  labelClassName="uppercase tracking-wide font-extrabold whitespace-normal text-center leading-tight"
                />
              </div>

              <LiquidMetalButton
                label={isRestarting ? "Starting..." : "Retake"}
                onClick={async () => {
                  if (isRestarting || isProcessingOriginal) return;
                  captureIdRef.current += 1;
                  setIsRestarting(true);
                  try {
                    setCapturedImage(null);
                    setSwapImage(null);
                    setSwapCropReason(null);
                    setIsCheckingPhoto(false);
                    await stopVideoAndClear();
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    await startCamera();
                  } catch (error) {
                    console.error("Error restarting camera:", error);
                  } finally {
                    setIsRestarting(false);
                  }
                }}
                disabled={isRestarting || isProcessingOriginal}
                className="px-8 py-3 text-[clamp(0.75rem,2.6vw,1.15rem)] rounded-xl ring-offset-2"
                labelClassName="uppercase tracking-wide font-extrabold"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Capture;
