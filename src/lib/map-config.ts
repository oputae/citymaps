/** Vector style (OpenFreeMap hosts OSM-derived tiles; see README for attribution). */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export const DEFAULT_CENTER: [number, number] = [-74.2735, 40.7312];
export const DEFAULT_ZOOM = 12;

/**
 * Default viewport: Maplewood, NJ — cached bbox so first paint shows real map data
 * without waiting for a network search (good for cold loads / demos).
 */
export const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [-74.318, 40.708],
  [-74.228, 40.752],
];
