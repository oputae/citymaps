import type { PosterThemeColors } from "@/lib/themes";

export type PosterChromeExportOptions = {
  theme: PosterThemeColors;
  posterText: boolean;
  city: string;
  country: string;
  coords: string;
  credits: boolean;
  /** CSS font stack (may include `var(--font-*)` — resolved via computed style). */
  fontFamily: string;
};

/** Expand `var(--font-…)` to real family names for Canvas fillText. */
function resolveCanvasFontFamily(cssFontStack: string): string {
  if (typeof document === "undefined") return "system-ui, sans-serif";
  const el = document.createElement("span");
  el.style.cssText = "position:absolute;left:-9999px;visibility:hidden;font-family:" + cssFontStack;
  document.body.appendChild(el);
  const resolved = getComputedStyle(el).fontFamily;
  document.body.removeChild(el);
  return resolved || "system-ui, sans-serif";
}

/**
 * Map canvas (any pixel size) → output W×H PNG data URL with the same overlays as the live poster shell:
 * multiply tint, radial vignette, optional bottom gradient + type (matches PosterChrome).
 */
export async function compositePosterPngDataUrl(
  mapCanvas: HTMLCanvasElement,
  outW: number,
  outH: number,
  chrome: PosterChromeExportOptions,
): Promise<string> {
  await document.fonts.ready;

  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  ctx.drawImage(mapCanvas, 0, 0, outW, outH);

  const { theme } = chrome;

  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = theme.background;
  ctx.globalCompositeOperation = "multiply";
  ctx.fillRect(0, 0, outW, outH);
  ctx.restore();

  const cx = outW * 0.5;
  const cy = outH * 0.42;
  const r = Math.max(outW, outH) * 0.92;
  const vig = ctx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(0.22, "rgba(0,0,0,0)");
  vig.addColorStop(1, theme.vignetteEnd);
  ctx.save();
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, outW, outH);
  ctx.restore();

  if (chrome.posterText) {
    drawPosterChromeText(ctx, outW, outH, chrome, resolveCanvasFontFamily(chrome.fontFamily));
  }

  return out.toDataURL("image/png");
}

function drawPosterChromeText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  chrome: PosterChromeExportOptions,
  fontFamily: string,
) {
  const { theme, city, country, coords, credits } = chrome;
  const title = (city || "City").toUpperCase();
  const subtitle = (country || "").trim();

  const padBottom = h * (32 / 1120);
  const band = h * 0.42;

  const g = ctx.createLinearGradient(0, h - band, 0, h);
  const bg = theme.background;
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.58, hexWithAlpha(bg, 0.9));
  g.addColorStop(1, bg);
  ctx.fillStyle = g;
  ctx.fillRect(0, h - band, w, band);

  const titleSize = Math.round(Math.max(18, Math.min(h * 0.038, w * 0.06)));
  const subSize = Math.round(Math.max(11, h * 0.012));
  const coordSize = Math.round(Math.max(10, h * 0.011));
  const credSize = Math.round(Math.max(9, h * 0.008));
  const lineGap = h * 0.008;

  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  let y = h - padBottom;

  if (credits) {
    ctx.font = `500 ${credSize}px ${fontFamily}`;
    ctx.fillStyle = withOpacity(theme.coords, 0.75);
    ctx.letterSpacing = `${credSize * 0.06}px`;
    ctx.fillText("Map data © OpenStreetMap", w / 2, y);
    ctx.letterSpacing = "0px";
    y -= credSize + lineGap * 1.5;
  }

  ctx.font = `400 ${coordSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.fillStyle = theme.coords;
  ctx.letterSpacing = "0px";
  ctx.fillText(coords, w / 2, y);
  y -= coordSize + lineGap * 1.2;

  if (subtitle) {
    ctx.font = `500 ${subSize}px ${fontFamily}`;
    ctx.fillStyle = theme.subtitle;
    ctx.letterSpacing = `${subSize * 0.16}px`;
    ctx.fillText(subtitle.toUpperCase(), w / 2, y);
    ctx.letterSpacing = "0px";
    y -= subSize + lineGap * 1.5;
  }

  ctx.font = `500 ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = theme.title;
  ctx.letterSpacing = `${titleSize * 0.2}px`;
  ctx.fillText(title, w / 2, y);
  ctx.letterSpacing = "0px";
}

function hexWithAlpha(hex: string, alpha: number): string {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function withOpacity(color: string, opacity: number): string {
  const m = color.trim().match(/^#?([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1]!, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  }
  const rgba = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (rgba) {
    return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${opacity})`;
  }
  return color;
}
