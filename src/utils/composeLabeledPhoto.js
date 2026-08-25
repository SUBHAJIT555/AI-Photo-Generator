import topBorder from "../Lables/topBorder.png";
import bottomBorder from "../Lables/BottomBorder.png";

/** Final strip size matching public/avatars/*.png */
export const OUTPUT_WIDTH = 1182;
export const OUTPUT_HEIGHT = 1773;
export const TOP_HEIGHT = 210;
export const BOTTOM_HEIGHT = 281;
export const PHOTO_HEIGHT = OUTPUT_HEIGHT - TOP_HEIGHT - BOTTOM_HEIGHT; // 1282

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * Builds a branded photo strip matching public/avatars size (1182x1773):
 * [top label 210] + [photo 1282] + [bottom label 281]
 */
export async function composeLabeledPhoto(photoSrc) {
  const [photo, top, bottom] = await Promise.all([
    loadImage(photoSrc),
    loadImage(topBorder),
    loadImage(bottomBorder),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = "#003087";
  ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

  ctx.drawImage(top, 0, 0, OUTPUT_WIDTH, TOP_HEIGHT);
  drawCover(ctx, photo, 0, TOP_HEIGHT, OUTPUT_WIDTH, PHOTO_HEIGHT);

  // Keep a small blue safe pad under the footer so print doesn't clip the text
  const BOTTOM_SAFE_PAD = 24;
  ctx.drawImage(
    bottom,
    0,
    TOP_HEIGHT + PHOTO_HEIGHT,
    OUTPUT_WIDTH,
    BOTTOM_HEIGHT - BOTTOM_SAFE_PAD
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

export { topBorder, bottomBorder };
