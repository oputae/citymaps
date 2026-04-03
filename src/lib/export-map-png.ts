import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * Renders the map at the requested pixel size and triggers a PNG download.
 */
export function downloadMapPng(
  map: MapLibreMap,
  width: number,
  height: number,
  filename: string,
): Promise<void> {
  const container = map.getContainer();
  const prev = {
    width: container.style.width,
    height: container.style.height,
  };

  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  map.resize();

  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      try {
        const canvas = map.getCanvas();
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        a.click();
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        container.style.width = prev.width;
        container.style.height = prev.height;
        map.resize();
      }
    };

    map.once("idle", finish);
  });
}
