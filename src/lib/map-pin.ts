import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import {
  POSTER_PIN_IMAGE_ID,
  posterPinImagePixelRatio,
  rasterizeClassyMapPin,
} from "@/lib/poster-pin-icon";
import type { PosterThemeColors } from "@/lib/themes";

export const POSTER_PIN_SOURCE_ID = "cv_poster_pin";
/** Soft glow under the marker. */
export const POSTER_PIN_HALO_LAYER_ID = "cv_poster_pin_halo";
/** Diamond symbol (bottom tip = coordinate). */
export const POSTER_PIN_SYMBOL_LAYER_ID = "cv_poster_pin_symbol";
/** @deprecated Renamed — use POSTER_PIN_SYMBOL_LAYER_ID. */
export const POSTER_PIN_LAYER_ID = POSTER_PIN_SYMBOL_LAYER_ID;
export const POSTER_PIN_RING_LAYER_ID = "cv_poster_pin_ring";
export const POSTER_PIN_SPARK_LAYER_ID = "cv_poster_pin_spark";

export type PosterPinLngLat = { lng: number; lat: number };

const LEGACY_CIRCLE_IDS = [
  "cv_poster_pin_ring",
  "cv_poster_pin_circle",
  "cv_poster_pin_spark",
] as const;

function pinFeatureCollection(pin: PosterPinLngLat | null): GeoJSON.FeatureCollection {
  if (pin == null) {
    return { type: "FeatureCollection", features: [] };
  }
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [pin.lng, pin.lat] },
      },
    ],
  };
}

function removeLegacyCirclePinLayers(map: MapLibreMap): void {
  for (const id of LEGACY_CIRCLE_IDS) {
    if (map.getLayer(id)) {
      try {
        map.removeLayer(id);
      } catch {
        /* ignore */
      }
    }
  }
}

function upsertPinRaster(map: MapLibreMap, fillHex: string, strokeHex: string): void {
  const imageData = rasterizeClassyMapPin(fillHex, strokeHex);
  if (!imageData) return;
  const pr = posterPinImagePixelRatio();
  if (map.hasImage(POSTER_PIN_IMAGE_ID)) {
    map.updateImage(POSTER_PIN_IMAGE_ID, imageData);
  } else {
    map.addImage(POSTER_PIN_IMAGE_ID, imageData, { pixelRatio: pr });
  }
}

function ensurePinLayers(map: MapLibreMap, poster: PosterThemeColors, accentHex: string): void {
  removeLegacyCirclePinLayers(map);
  upsertPinRaster(map, accentHex, poster.background);

  const haloPaint = {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 12, 13, 16, 16, 21, 20, 28],
    "circle-color": poster.lines,
    "circle-opacity": 0.48,
    "circle-blur": 0.85,
  } as Record<string, unknown>;

  const symbolLayer = {
    id: POSTER_PIN_SYMBOL_LAYER_ID,
    type: "symbol" as const,
    source: POSTER_PIN_SOURCE_ID,
    layout: {
      "icon-image": POSTER_PIN_IMAGE_ID,
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        0.38,
        13,
        0.48,
        16,
        0.58,
        20,
        0.72,
      ],
      "icon-anchor": "bottom",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "icon-padding": 0,
    },
    paint: {
      "icon-opacity": 0.98,
    },
  };

  if (!map.getLayer(POSTER_PIN_HALO_LAYER_ID)) {
    const beforeSymbol = map.getLayer(POSTER_PIN_SYMBOL_LAYER_ID) ? POSTER_PIN_SYMBOL_LAYER_ID : undefined;
    map.addLayer(
      {
        id: POSTER_PIN_HALO_LAYER_ID,
        type: "circle",
        source: POSTER_PIN_SOURCE_ID,
        paint: haloPaint as never,
      },
      beforeSymbol,
    );
  }

  if (!map.getLayer(POSTER_PIN_SYMBOL_LAYER_ID)) {
    map.addLayer(symbolLayer as never);
  }

  if (map.getLayer(POSTER_PIN_HALO_LAYER_ID)) {
    map.setPaintProperty(POSTER_PIN_HALO_LAYER_ID, "circle-color", poster.lines);
  }
}

/**
 * Diamond marker (raster symbol) + soft halo — drawn on the map canvas for PNG export.
 */
export function syncPosterPinLayer(
  map: MapLibreMap,
  pin: PosterPinLngLat | null,
  poster: PosterThemeColors,
  accentHex: string,
): void {
  const data = pinFeatureCollection(pin);

  try {
    if (!map.getSource(POSTER_PIN_SOURCE_ID)) {
      map.addSource(POSTER_PIN_SOURCE_ID, { type: "geojson", data });
      ensurePinLayers(map, poster, accentHex);
    } else {
      (map.getSource(POSTER_PIN_SOURCE_ID) as GeoJSONSource).setData(data);
      ensurePinLayers(map, poster, accentHex);
    }

    const vis = pin == null ? "none" : "visible";
    for (const id of [POSTER_PIN_HALO_LAYER_ID, POSTER_PIN_SYMBOL_LAYER_ID]) {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", vis);
      }
    }
  } catch {
    /* style not ready or layer race */
  }
}
