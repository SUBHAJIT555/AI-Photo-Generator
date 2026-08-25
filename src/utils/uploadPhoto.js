import axios from "axios";

function getUploadEndpoints() {
  const apiBase = import.meta.env.VITE_API_URL || "";
  const normalized = apiBase
    ? apiBase.endsWith("/")
      ? apiBase
      : `${apiBase}/`
    : "";

  const endpoints = [];
  if (normalized) {
    endpoints.push(`${normalized}upload.php`);
  }
  // Same-origin upload (Vite dev middleware or public/upload.php in production)
  endpoints.push("/upload.php");

  return endpoints;
}

/**
 * Uploads labeled original photo and returns a public http URL for QR soft copy.
 * Same response shape as swap.php: { data: { result_url } }
 */
export async function uploadPhotoForSoftCopy(dataUrl) {
  const endpoints = getUploadEndpoints();

  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(
        endpoint,
        { source: dataUrl },
        { timeout: 90000 }
      );

      const url =
        response.data?.data?.result_url ||
        response.data?.result_url ||
        response.data?.url ||
        null;

      if (typeof url === "string" && /^https?:\/\//i.test(url)) {
        return url;
      }
    } catch (error) {
      console.warn(`Upload failed via ${endpoint}:`, error?.message || error);
    }
  }

  return null;
}
