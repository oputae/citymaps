/**
 * Raster diamond marker for MapLibre symbol layers — geometric, high contrast on busy maps.
 * Browser-only (uses Canvas 2D).
 */
export const POSTER_PIN_IMAGE_ID = "cv_poster_pin_mark";

const LOGICAL_W = 72;
const LOGICAL_H = 88;
const DPR = 2;

function diamondPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  tipY: number,
  topY: number,
  beltY: number,
  halfW: number,
): void {
  ctx.beginPath();
  ctx.moveTo(cx, tipY);
  ctx.lineTo(cx + halfW, beltY);
  ctx.lineTo(cx, topY);
  ctx.lineTo(cx - halfW, beltY);
  ctx.closePath();
}

/**
 * Faceted diamond: dark outer bezel (poster stroke) + accent body + light rim + top highlight.
 * `icon-anchor: bottom` places the bottom tip on the coordinate.
 */
export function rasterizeClassyMapPin(fillHex: string, strokeHex: string): ImageData | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = LOGICAL_W * DPR;
  canvas.height = LOGICAL_H * DPR;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.scale(DPR, DPR);
  ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

  const cx = LOGICAL_W / 2;
  const tipY = LOGICAL_H - 5;
  const beltY = 46;

  // Outer shell — reads as silhouette against roads / land tints
  diamondPath(ctx, cx, tipY, 10, beltY, 28);
  ctx.fillStyle = strokeHex;
  ctx.fill();

  // Inner gem
  diamondPath(ctx, cx, tipY, 24, beltY, 18);
  ctx.fillStyle = fillHex;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.35;
  ctx.lineJoin = "miter";
  ctx.stroke();

  // Slight inner shadow on lower facets (readability)
  ctx.save();
  ctx.beginPath();
  diamondPath(ctx, cx, tipY, 24, beltY, 18);
  ctx.clip();
  const g = ctx.createLinearGradient(cx, 24, cx, tipY);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.65, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = g;
  ctx.fillRect(cx - 22, 20, 44, tipY - 18);
  ctx.restore();

  // Top facet glint
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, 24);
  ctx.lineTo(cx + 9, 38);
  ctx.lineTo(cx - 4, 38);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.fill();
  ctx.restore();

  return ctx.getImageData(0, 0, LOGICAL_W * DPR, LOGICAL_H * DPR);
}

export function posterPinImagePixelRatio(): number {
  return DPR;
}
