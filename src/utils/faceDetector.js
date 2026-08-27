/**
 * Frontend face detection is for the normal kiosk UX only.
 * It is NOT a security boundary. A client can still POST a full group photo
 * to swap.php. If we control that API, it should also validate that `source`
 * contains one acceptable face (or apply the same largest-face rules).
 *
 * V1 loads WASM + BlazeFace from CDN. Production can later self-host:
 *   /mediapipe/wasm  and  /models/blaze_face_short_range.tflite
 */
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export const MEDIAPIPE_CONFIG = {
  packageVersion: "1.0.1",
  wasmPath:
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm",
  modelPath:
    "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
  initTimeoutMs: 10000,
};

let detector = null;
let detectorPromise = null;

function withTimeout(promise, ms, message) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

async function createDetector() {
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmPath);
  return FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MEDIAPIPE_CONFIG.modelPath,
    },
    runningMode: "IMAGE",
  });
}

export function initializeFaceDetector() {
  if (detector) {
    return Promise.resolve(detector);
  }

  if (!detectorPromise) {
    detectorPromise = createDetector()
      .then((instance) => {
        detector = instance;
        return instance;
      })
      .catch((error) => {
        detectorPromise = null;
        throw error;
      });
  }

  return withTimeout(
    detectorPromise,
    MEDIAPIPE_CONFIG.initTimeoutMs,
    "Face detector initialization timed out"
  );
}

export async function detectFaces(image) {
  try {
    const instance = await initializeFaceDetector();
    const result = instance.detect(image);
    const faces = (result?.detections || [])
      .map((detection) => {
        const box = detection.boundingBox || {};
        return {
          x: box.originX ?? 0,
          y: box.originY ?? 0,
          width: box.width ?? 0,
          height: box.height ?? 0,
        };
      })
      .filter((face) => face.width > 0 && face.height > 0);

    return { ok: true, faces, reason: null };
  } catch (error) {
    console.error("Face detection failed:", error);
    return { ok: false, faces: [], reason: "DETECTOR_FAILURE" };
  }
}
