import type { ExportPreset } from "@/lib/export-presets";

/** Pixel size for export at given DPI (print) or exact pixels (digital). */
export function presetToExportPixels(preset: ExportPreset, dpi = 300): { w: number; h: number } {
  if (preset.kind === "pixel") {
    return { w: preset.widthPx, h: preset.heightPx };
  }
  if (preset.unit === "cm") {
    const inchW = preset.width / 2.54;
    const inchH = preset.height / 2.54;
    return { w: Math.round(inchW * dpi), h: Math.round(inchH * dpi) };
  }
  return { w: Math.round(preset.width * dpi), h: Math.round(preset.height * dpi) };
}

/** Avoid GPU / canvas limits in browsers. */
export function clampExportSize(w: number, h: number, maxEdge = 8192): { w: number; h: number; scaled: boolean } {
  const edge = Math.max(w, h);
  if (edge <= maxEdge) return { w, h, scaled: false };
  const scale = maxEdge / edge;
  return {
    w: Math.round(w * scale),
    h: Math.round(h * scale),
    scaled: true,
  };
}
