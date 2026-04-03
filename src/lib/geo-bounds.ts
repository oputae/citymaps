/** [[west, south], [east, north]] in WGS84 — same shape as Nominatim boundingbox corners. */
export type LngLatBounds = [[number, number], [number, number]];

/** Nominatim viewbox: min lon, max lat, max lon, min lat. */
export function nominatimViewboxParam(bounds: LngLatBounds): string {
  const [[w, s], [e, n]] = bounds;
  return `${w},${n},${e},${s}`;
}

export function lngLatInsideBounds(lng: number, lat: number, bounds: LngLatBounds): boolean {
  const [[w, s], [e, n]] = bounds;
  const minX = Math.min(w, e);
  const maxX = Math.max(w, e);
  const minY = Math.min(s, n);
  const maxY = Math.max(s, n);
  return lng >= minX && lng <= maxX && lat >= minY && lat <= maxY;
}
