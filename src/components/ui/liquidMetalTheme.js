export const FAB_TEAL = {
  light: "#5E8FA3",
  base: "#4F758B",
  dark: "#3A5868",
  deeper: "#2D454F",
};

export const LIQUID_METAL_STYLE_ID = "shader-canvas-style-liquid-metal";

export function hexToVec4(hex, alpha = 1) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b, alpha];
}

export function ensureLiquidMetalStyles() {
  if (document.getElementById(LIQUID_METAL_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = LIQUID_METAL_STYLE_ID;
  style.textContent = `
    .shader-container-liquid-metal canvas {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: inherit !important;
    }
    @keyframes liquid-metal-ripple {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.6;
      }
      100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export function createLiquidMetalUniforms(shape = 1) {
  return {
    u_colorBack: hexToVec4(FAB_TEAL.deeper, 1),
    u_colorTint: hexToVec4(FAB_TEAL.base, 0.92),
    u_repetition: 4,
    u_softness: 0.5,
    u_shiftRed: 0.15,
    u_shiftBlue: 0.45,
    u_distortion: 0,
    u_contour: 0,
    u_angle: 45,
    u_scale: 8,
    u_shape: shape,
    u_offsetX: 0.1,
    u_offsetY: -0.1,
  };
}
