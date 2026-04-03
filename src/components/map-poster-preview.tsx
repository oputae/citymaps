"use client";

import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE_URL } from "@/lib/map-config";
import { applyLayerToggles, type LayerToggles } from "@/lib/map-layers";
import { syncPosterPinLayer, type PosterPinLngLat } from "@/lib/map-pin";
import { applyPosterThemeToMap } from "@/lib/map-theme-paint";
import type { MapTheme } from "@/lib/themes";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef } from "react";
import { PosterChrome, type PosterChromeProps } from "./poster-chrome";

type Bounds = [[number, number], [number, number]];

export type MapPosterPreviewProps = PosterChromeProps & {
  aspectW: number;
  aspectH: number;
  bounds: Bounds | null;
  layerToggles: LayerToggles;
  /** Full theme for vector map paint (roads, water, land, labels). */
  vectorTheme: MapTheme;
  onReady: (map: maplibregl.Map) => void;
  /** Map canvas pin (GeoJSON circle — included in PNG export). */
  pin?: PosterPinLngLat | null;
  /** When true, the next map click sets `pin` via `onPinPlaced`. */
  pinDropMode?: boolean;
  onPinPlaced?: (lngLat: PosterPinLngLat) => void;
  /** Large center map vs compact column */
  variant?: "hero" | "compact";
};

export function MapPosterPreview({
  aspectW,
  aspectH,
  bounds,
  layerToggles,
  vectorTheme,
  onReady,
  pin = null,
  pinDropMode = false,
  onPinPlaced,
  theme,
  variant = "hero",
  ...chrome
}: MapPosterPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleReadyRef = useRef(false);
  const initOnce = useRef(false);
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;
  const vectorThemeRef = useRef(vectorTheme);
  vectorThemeRef.current = vectorTheme;
  const layerTogglesRef = useRef(layerToggles);
  layerTogglesRef.current = layerToggles;
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const onReadyStable = useCallback(
    (map: maplibregl.Map) => {
      onReady(map);
    },
    [onReady],
  );

  useEffect(() => {
    if (!wrapRef.current || initOnce.current) return;
    initOnce.current = true;

    const map = new maplibregl.Map({
      container: wrapRef.current,
      style: MAP_STYLE_URL,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 0,
      bearing: 0,
      canvasContextAttributes: {
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
      },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    map.on("error", (e) => {
      console.error("[map]", e.error);
    });

    map.on("load", () => {
      styleReadyRef.current = true;
      try {
        applyPosterThemeToMap(map, vectorThemeRef.current);
        applyLayerToggles(map, layerTogglesRef.current);
        syncPosterPinLayer(
          map,
          pinRef.current,
          themeRef.current,
          vectorThemeRef.current.swatches[4] ?? themeRef.current.lines,
        );
      } catch {
        /* ignore */
      }
      const b = boundsRef.current;
      requestAnimationFrame(() => {
        map.resize();
        requestAnimationFrame(() => {
          map.resize();
          if (b) {
            map.fitBounds(b, { padding: 40, duration: 0, maxZoom: 15 });
          }
          map.triggerRepaint();
          onReadyStable(map);
          window.setTimeout(() => {
            map.resize();
            map.triggerRepaint();
          }, 100);
        });
      });
    });

    const ro = new ResizeObserver(() => {
      map.resize();
    });
    const shell = wrapRef.current.parentElement;
    if (shell) ro.observe(shell);
    ro.observe(wrapRef.current);

    return () => {
      ro.disconnect();
      styleReadyRef.current = false;
      initOnce.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current) return;
    try {
      applyPosterThemeToMap(map, vectorTheme);
      applyLayerToggles(map, layerToggles);
      syncPosterPinLayer(map, pin ?? null, theme, vectorTheme.swatches[4] ?? theme.lines);
    } catch {
      /* ignore */
    }
  }, [layerToggles, vectorTheme, pin, theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current || !pinDropMode || !onPinPlaced) return;
    const onClick = (e: maplibregl.MapMouseEvent) => {
      onPinPlaced({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    };
    map.on("click", onClick);
    map.getCanvas().style.cursor = "crosshair";
    return () => {
      map.off("click", onClick);
      map.getCanvas().style.cursor = "";
    };
  }, [pinDropMode, onPinPlaced]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current || !bounds) return;
    map.fitBounds(bounds, { padding: 40, duration: 900, maxZoom: 15 });
  }, [bounds]);

  /** Padding-bottom % = h/w — in-flow shim so height isn’t 0 when all layers are absolute (fixes map “sliver”). */
  const ratioPadPct = (aspectH / aspectW) * 100;

  const shellClass =
    variant === "hero"
      ? "relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-poster ring-2 ring-sky-500/25 ring-offset-2 ring-offset-canvas"
      : "animate-float-slow relative w-full max-w-[min(100%,420px)] overflow-hidden rounded-2xl shadow-poster ring-2 ring-sky-500/25 ring-offset-2 ring-offset-canvas";

  return (
    <div className={shellClass}>
      <div className="w-full" style={{ paddingBottom: `${ratioPadPct}%` }} aria-hidden />
      <div className="absolute inset-0">
        <div ref={wrapRef} className="absolute inset-0 z-0 bg-[#0c1220]" />

        <div
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-multiply"
          style={{ backgroundColor: theme.background, opacity: 0.04 }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(ellipse 88% 78% at 50% 42%, transparent 22%, ${theme.vignetteEnd} 100%)`,
            opacity: 0.26,
          }}
          aria-hidden
        />

        <PosterChrome theme={theme} {...chrome} />
      </div>
    </div>
  );
}

