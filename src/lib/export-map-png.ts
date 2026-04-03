import type { Map as MapLibreMap } from "maplibre-gl";
import {
  compositePosterPngDataUrl,
  type PosterChromeExportOptions,
} from "@/lib/export-poster-canvas";

export type { PosterChromeExportOptions };

/**
 * Renders the map at the requested pixel size and triggers a PNG download.
 * Re-fits the same geographic bounds as the on-screen view after resizing so the
 * export matches the poster frame (resize alone keeps center+zoom and changes the
 * visible lat/lng extent when dimensions change).
 *
 * With `chrome`, composites multiply tint, vignette, and bottom poster type like the live preview.
 */
export function downloadMapPng(
  map: MapLibreMap,
  width: number,
  height: number,
  filename: string,
  chrome?: PosterChromeExportOptions,
): Promise<void> {
  const container = map.getContainer();
  const visibleBounds = map.getBounds();
  const prev = {
    width: container.style.width,
    height: container.style.height,
  };

  const restorePreview = () => {
    container.style.width = prev.width;
    container.style.height = prev.height;
    map.resize();
    map.fitBounds(visibleBounds, { padding: 0, duration: 0 });
  };

  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  map.resize();
  map.fitBounds(visibleBounds, { padding: 0, duration: 0 });

  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      void (async () => {
        try {
          const mapCanvas = map.getCanvas();
          const dataUrl = chrome
            ? await compositePosterPngDataUrl(mapCanvas, width, height, chrome)
            : mapCanvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = filename;
          a.click();
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          restorePreview();
        }
      })();
    };

    map.once("idle", finish);
  });
}
