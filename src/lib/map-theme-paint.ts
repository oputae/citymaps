import type { Map as MapLibreMap } from "maplibre-gl";
import type { MapTheme } from "@/lib/themes";

/** MapLibre zoom interpolation — flatter than Liberty so arterials do not swamp the grid. */
type ZoomInterpolated = [
  "interpolate",
  ["exponential", number],
  ["zoom"],
  ...Array<number | string>,
];

const POSTER_WIDTH_ARTERIAL: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  5,
  0,
  7,
  0.22,
  10,
  0.75,
  12,
  1.35,
  14,
  2,
  16,
  2.75,
  18,
  3.5,
  20,
  4.5,
];

const POSTER_WIDTH_ARTERIAL_CASING: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  5,
  0,
  7,
  0.4,
  10,
  1.15,
  12,
  2,
  14,
  3,
  16,
  4,
  18,
  5,
  20,
  6.2,
];

const POSTER_WIDTH_LINK: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  12.5,
  0,
  13,
  0.45,
  14,
  0.9,
  16,
  1.7,
  20,
  3.4,
];

const POSTER_WIDTH_LINK_CASING: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  12,
  0.2,
  13,
  0.9,
  14,
  1.6,
  16,
  2.6,
  20,
  4.8,
];

const POSTER_WIDTH_MID: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  6.5,
  0,
  8,
  0.3,
  10,
  0.75,
  12,
  1.35,
  14,
  2.1,
  16,
  3,
  20,
  5.5,
];

const POSTER_WIDTH_MID_CASING: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  8,
  0.5,
  10,
  1,
  12,
  1.9,
  14,
  2.8,
  16,
  3.8,
  20,
  6.5,
];

/** Slightly earlier / heavier minor grid vs Liberty so residential mesh stays readable next to thinned arterials. */
const POSTER_WIDTH_MINOR: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  12.5,
  0,
  13,
  0.35,
  14,
  1.6,
  15,
  2.6,
  16,
  3.8,
  18,
  6,
  20,
  9.5,
];

const POSTER_WIDTH_MINOR_CASING: ZoomInterpolated = [
  "interpolate",
  ["exponential", 1.12],
  ["zoom"],
  12,
  0.15,
  13,
  0.55,
  14,
  2.2,
  16,
  4,
  20,
  12,
];

function safeSetPaint(map: MapLibreMap, layerId: string, prop: string, value: unknown): void {
  if (!map.getLayer(layerId)) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic layer paint keys across fill/line/symbol
    map.setPaintProperty(layerId, prop as any, value);
  } catch {
    /* layer may not support property (e.g. pattern fills) */
  }
}

/** Liberty / OpenMapTiles road line buckets (stroke color). */
function roadLineBucket(id: string): "casing" | "major" | "mid" | "minor" | "rail" | null {
  if (/one_way|arrow|area_pattern|pattern$/i.test(id)) return null;
  if (!/^(road|tunnel|bridge)_/.test(id)) return null;
  if (/casing/.test(id)) return "casing";
  if (/rail|hatching/.test(id)) return "rail";
  if (/motorway|trunk_primary/.test(id)) return "major";
  if (/secondary_tertiary/.test(id)) return "mid";
  return "minor";
}

type RoadWidthBucket =
  | "arterial"
  | "arterialCasing"
  | "link"
  | "linkCasing"
  | "mid"
  | "midCasing"
  | "minor"
  | "minorCasing";

function posterRoadWidthBucket(id: string): RoadWidthBucket | null {
  if (/one_way|arrow|area_pattern|pattern$/i.test(id)) return null;
  if (!/^(road|tunnel|bridge)_/.test(id)) return null;
  if (/rail|hatching/.test(id)) return null;

  const casing = /casing/.test(id);
  if (casing) {
    if (/(motorway|trunk_primary)_casing$/.test(id)) return "arterialCasing";
    if (/motorway_link_casing$|_link_casing$/.test(id)) return "linkCasing";
    if (/secondary_tertiary_casing/.test(id)) return "midCasing";
    return "minorCasing";
  }

  if (/(^|_)(motorway|trunk_primary)$/.test(id)) return "arterial";
  if (/motorway_link$|_link$/.test(id)) return "link";
  if (/secondary_tertiary$/.test(id)) return "mid";
  return "minor";
}

function widthForPosterRoadBucket(b: RoadWidthBucket): ZoomInterpolated {
  switch (b) {
    case "arterial":
      return POSTER_WIDTH_ARTERIAL;
    case "arterialCasing":
      return POSTER_WIDTH_ARTERIAL_CASING;
    case "link":
      return POSTER_WIDTH_LINK;
    case "linkCasing":
      return POSTER_WIDTH_LINK_CASING;
    case "mid":
      return POSTER_WIDTH_MID;
    case "midCasing":
      return POSTER_WIDTH_MID_CASING;
    case "minor":
      return POSTER_WIDTH_MINOR;
    case "minorCasing":
      return POSTER_WIDTH_MINOR_CASING;
  }
}

/**
 * Recolors OpenFreeMap Liberty vector layers to match the poster theme.
 * Reference apps often swap full styles; we tint the live basemap so the canvas — not just chrome — follows the palette.
 */
export function applyPosterThemeToMap(map: MapLibreMap, theme: MapTheme): void {
  const p = theme.poster;
  const land = theme.swatches[1];

  safeSetPaint(map, "background", "background-color", p.background);
  safeSetPaint(map, "natural_earth", "raster-opacity", 0);

  safeSetPaint(map, "water", "fill-color", p.water);
  for (const wid of ["waterway_tunnel", "waterway_river", "waterway_other"]) {
    safeSetPaint(map, wid, "line-color", p.water);
  }

  const landFillIds = [
    "park",
    "landuse_residential",
    "landcover_wood",
    "landcover_grass",
    "landcover_ice",
    "landuse_pitch",
    "landuse_track",
    "landuse_cemetery",
    "landcover_sand",
    "aeroway_fill",
    "landuse_hospital",
    "landuse_school",
  ];
  for (const id of landFillIds) {
    safeSetPaint(map, id, "fill-color", land);
  }
  safeSetPaint(map, "park_outline", "line-color", land);

  safeSetPaint(map, "building", "fill-color", p.buildingFill);
  safeSetPaint(map, "building", "fill-outline-color", p.linesMuted);
  safeSetPaint(map, "building-3d", "fill-extrusion-color", p.buildingFill);

  for (const bid of ["boundary_3", "boundary_2", "boundary_disputed"]) {
    safeSetPaint(map, bid, "line-color", p.linesMuted);
    safeSetPaint(map, bid, "line-opacity", 0.35);
  }

  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    if (layer.type !== "line") continue;
    const bucket = roadLineBucket(layer.id);
    if (!bucket) continue;
    if (bucket === "casing") safeSetPaint(map, layer.id, "line-color", p.background);
    else if (bucket === "major") safeSetPaint(map, layer.id, "line-color", p.lines);
    else if (bucket === "mid") safeSetPaint(map, layer.id, "line-color", p.linesMuted);
    else if (bucket === "minor" || bucket === "rail") safeSetPaint(map, layer.id, "line-color", p.linesMuted);
  }

  for (const layer of layers) {
    if (layer.type !== "line") continue;
    const wBucket = posterRoadWidthBucket(layer.id);
    if (!wBucket) continue;
    safeSetPaint(map, layer.id, "line-width", widthForPosterRoadBucket(wBucket));
  }

  for (const aid of ["aeroway_runway", "aeroway_taxiway"]) {
    safeSetPaint(map, aid, "line-color", p.linesMuted);
  }

  for (const layer of layers) {
    if (layer.type !== "symbol") continue;
    if (!/(label|highway-name|water_name|poi_r|poi_transit|airport|highway-shield|road_shield)/.test(layer.id)) {
      continue;
    }
    safeSetPaint(map, layer.id, "text-color", p.lines);
    safeSetPaint(map, layer.id, "text-halo-color", p.background);
    safeSetPaint(map, layer.id, "text-halo-width", 1.25);
    safeSetPaint(map, layer.id, "text-halo-blur", 0.25);
  }
}
