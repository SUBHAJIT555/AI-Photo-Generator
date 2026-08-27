export const MIN_FACE_WIDTH_RATIO = 0.15;
export const MIN_FACE_AREA_RATIO = 0.04;
export const AMBIGUOUS_AREA_RATIO = 1.5;
export const PAD_X_RATIO = 0.5;
export const PAD_TOP_RATIO = 0.7;
export const PAD_BOTTOM_RATIO = 0.4;

const BOX_EPS = 0.5;

function toRect(face) {
  return {
    left: face.x,
    top: face.y,
    right: face.x + face.width,
    bottom: face.y + face.height,
    width: face.width,
    height: face.height,
  };
}

function clampFaceToImage(face, imageWidth, imageHeight) {
  const left = Math.max(0, face.x);
  const top = Math.max(0, face.y);
  const right = Math.min(imageWidth, face.x + face.width);
  const bottom = Math.min(imageHeight, face.y + face.height);
  const width = right - left;
  const height = bottom - top;
  return {
    x: left,
    y: top,
    width,
    height,
    area: width * height,
  };
}

function clampCrop(crop, imageWidth, imageHeight) {
  return {
    left: Math.max(0, crop.left),
    top: Math.max(0, crop.top),
    right: Math.min(imageWidth, crop.right),
    bottom: Math.min(imageHeight, crop.bottom),
  };
}

function cropSize(crop) {
  return {
    width: crop.right - crop.left,
    height: crop.bottom - crop.top,
  };
}

function rectsIntersect(a, b) {
  return (
    a.left < b.right - BOX_EPS &&
    a.right > b.left + BOX_EPS &&
    a.top < b.bottom - BOX_EPS &&
    a.bottom > b.top + BOX_EPS
  );
}

function faceFullyInside(face, crop) {
  return (
    face.left + BOX_EPS >= crop.left &&
    face.top + BOX_EPS >= crop.top &&
    face.right - BOX_EPS <= crop.right &&
    face.bottom - BOX_EPS <= crop.bottom
  );
}

function fail(reason) {
  return { ok: false, cropDataUrl: null, reason };
}

function shrinkCropToExclude(crop, other, selected) {
  if (!rectsIntersect(crop, other)) {
    return crop;
  }

  const selectedCx = selected.left + selected.width / 2;
  const selectedCy = selected.top + selected.height / 2;
  const otherCx = other.left + other.width / 2;
  const otherCy = other.top + other.height / 2;
  const dx = otherCx - selectedCx;
  const dy = otherCy - selectedCy;

  const next = { ...crop };
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx > 0) {
      next.right = Math.min(next.right, other.left);
    } else {
      next.left = Math.max(next.left, other.right);
    }
  } else if (dy > 0) {
    next.bottom = Math.min(next.bottom, other.top);
  } else {
    next.top = Math.max(next.top, other.bottom);
  }

  const { width, height } = cropSize(next);
  if (width <= 0 || height <= 0 || !faceFullyInside(selected, next)) {
    return null;
  }

  return next;
}

function tryMakeSquare(crop, selected, others, imageWidth, imageHeight) {
  const { width, height } = cropSize(crop);
  if (Math.abs(width - height) < 1) {
    return crop;
  }

  const size = Math.max(width, height);
  const cx = (crop.left + crop.right) / 2;
  const cy = (crop.top + crop.bottom) / 2;
  const next = clampCrop(
    {
      left: cx - size / 2,
      right: cx + size / 2,
      top: cy - size / 2,
      bottom: cy + size / 2,
    },
    imageWidth,
    imageHeight
  );

  if (!faceFullyInside(selected, next)) {
    return crop;
  }
  if (others.some((other) => rectsIntersect(next, other))) {
    return crop;
  }

  return next;
}

function validateCrop(crop, selected, others, imageWidth, imageHeight) {
  const { width, height } = cropSize(crop);
  if (width <= 1 || height <= 1) {
    return false;
  }
  if (width > imageWidth || height > imageHeight) {
    return false;
  }
  if (!faceFullyInside(selected, crop)) {
    return false;
  }
  if (width + BOX_EPS < selected.width || height + BOX_EPS < selected.height) {
    return false;
  }
  if (others.some((other) => rectsIntersect(crop, other))) {
    return false;
  }
  return true;
}

function cropToDataUrl(sourceCanvas, crop) {
  const { width, height } = cropSize(crop);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(width));
  out.height = Math.max(1, Math.round(height));
  const ctx = out.getContext("2d");
  if (!ctx) {
    return null;
  }
  ctx.drawImage(
    sourceCanvas,
    crop.left,
    crop.top,
    width,
    height,
    0,
    0,
    out.width,
    out.height
  );
  return out.toDataURL("image/png");
}

export function cropPrimaryFace({ faces, sourceCanvas, imageWidth, imageHeight }) {
  if (!imageWidth || !imageHeight || !sourceCanvas) {
    return fail("UNSAFE_CROP");
  }

  if (!faces?.length) {
    return fail("NO_FACE");
  }

  const sorted = faces
    .map((face) => clampFaceToImage(face, imageWidth, imageHeight))
    .filter((face) => face.width > 0 && face.height > 0)
    .sort((a, b) => b.area - a.area);

  if (!sorted.length) {
    return fail("NO_FACE");
  }

  if (sorted.length >= 2) {
    const ratio = sorted[0].area / sorted[1].area;
    if (ratio < AMBIGUOUS_AREA_RATIO) {
      return fail("AMBIGUOUS_MULTIPLE_FACES");
    }
  }

  const selected = sorted[0];
  const imageArea = imageWidth * imageHeight;
  if (
    selected.width < imageWidth * MIN_FACE_WIDTH_RATIO ||
    selected.area < imageArea * MIN_FACE_AREA_RATIO
  ) {
    return fail("FACE_TOO_SMALL");
  }

  const selectedRect = toRect(selected);
  const others = sorted.slice(1).map(toRect);

  let crop = clampCrop(
    {
      left: selected.x - selected.width * PAD_X_RATIO,
      right: selected.x + selected.width * (1 + PAD_X_RATIO),
      top: selected.y - selected.height * PAD_TOP_RATIO,
      bottom: selected.y + selected.height * (1 + PAD_BOTTOM_RATIO),
    },
    imageWidth,
    imageHeight
  );

  if (!faceFullyInside(selectedRect, crop)) {
    return fail("UNSAFE_CROP");
  }

  for (const other of others) {
    let guard = 0;
    while (rectsIntersect(crop, other) && guard < 8) {
      const shrunk = shrinkCropToExclude(crop, other, selectedRect);
      if (
        !shrunk ||
        (shrunk.left === crop.left &&
          shrunk.right === crop.right &&
          shrunk.top === crop.top &&
          shrunk.bottom === crop.bottom)
      ) {
        return fail("UNSAFE_CROP");
      }
      crop = shrunk;
      guard += 1;
    }
    if (rectsIntersect(crop, other)) {
      return fail("UNSAFE_CROP");
    }
  }

  crop = tryMakeSquare(crop, selectedRect, others, imageWidth, imageHeight);

  if (!validateCrop(crop, selectedRect, others, imageWidth, imageHeight)) {
    return fail("UNSAFE_CROP");
  }

  const cropDataUrl = cropToDataUrl(sourceCanvas, crop);
  if (!cropDataUrl) {
    return fail("UNSAFE_CROP");
  }

  return { ok: true, cropDataUrl, reason: null };
}
