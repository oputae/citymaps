"use client";

import { IconDownload } from "@/components/icons";
import { ExportSizePicker } from "@/components/export-size-picker";
import { GeocodeAutocomplete } from "@/components/geocode-autocomplete";
import { LayersPanel } from "@/components/layers-panel";
import { MapPosterPreview } from "@/components/map-poster-preview";
import { SettingsPanel } from "@/components/settings-panel";
import { SettingsSummary } from "@/components/settings-summary";
import { Sidebar } from "@/components/sidebar";
import { StudioBanner } from "@/components/studio-banner";
import { StylePanel, type StylePanelState } from "@/components/style-panel";
import { ThemePicker } from "@/components/theme-picker";
import { formatLatLng } from "@/lib/coords";
import type { PosterPinLngLat } from "@/lib/map-pin";
import { clampExportSize, presetToExportPixels } from "@/lib/export-dimensions";
import { downloadMapPng } from "@/lib/export-map-png";
import { fetchGeocodeResults } from "@/lib/geocode-fetch";
import {
  displayCity,
  displayCountry,
  hitToBounds,
  type NominatimHit,
} from "@/lib/geocode-types";
import { lngLatInsideBounds } from "@/lib/geo-bounds";
import type { LayerToggles } from "@/lib/map-layers";
import { DEFAULT_BOUNDS } from "@/lib/map-config";
import {
  EXPORT_CATEGORY_LABELS,
  type ExportPreset,
  formatPresetDimensions,
  getPresetById,
} from "@/lib/export-presets";
import { getPosterFontById } from "@/lib/poster-fonts";
import { useIsXl } from "@/lib/use-is-xl";
import { DEFAULT_THEME_ID, MAP_THEMES, getThemeById } from "@/lib/themes";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function aspectFromPreset(p: ExportPreset): { w: number; h: number } {
  if (p.kind === "physical") return { w: p.width, h: p.height };
  return { w: p.widthPx, h: p.heightPx };
}

const defaultStyle: StylePanelState = {
  posterText: true,
  overlay: true,
  city: "Maplewood",
  country: "United States",
  fontId: "geist",
  credits: true,
};

const defaultLayers: LayerToggles = { roads: true, water: true, labels: true };

export default function StudioPage() {
  const isXl = useIsXl();
  const [activeNav, setActiveNav] = useState("location");
  const [selectedPresetId, setSelectedPresetId] = useState("us-8x10");
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [style, setStyle] = useState<StylePanelState>(defaultStyle);
  const [layerToggles, setLayerToggles] = useState<LayerToggles>(defaultLayers);
  const [exportDpi, setExportDpi] = useState(300);
  const [searchQuery, setSearchQuery] = useState("Maplewood, New Jersey");
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(DEFAULT_BOUNDS);
  const [lat, setLat] = useState(40.7312);
  const [lng, setLng] = useState(-74.2735);
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [locationPin, setLocationPin] = useState<PosterPinLngLat | null>(null);
  const [pinDropMode, setPinDropMode] = useState(false);
  const [pinAddressQuery, setPinAddressQuery] = useState("");
  const [pinGeocoding, setPinGeocoding] = useState(false);
  const [pinGeoError, setPinGeoError] = useState<string | null>(null);
  const [pinOffPosterHint, setPinOffPosterHint] = useState<string | null>(null);

  const mapRef = useRef<MapLibreMap | null>(null);
  const mapHeroRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);

  const handleMapReady = useCallback((map: MapLibreMap) => {
    mapRef.current = map;
    setMapReady(true);
  }, []);

  const handlePinPlaced = useCallback((lngLat: PosterPinLngLat) => {
    setLocationPin(lngLat);
    setPinDropMode(false);
    setPinOffPosterHint(null);
  }, []);

  const applyPinGeocodeHit = useCallback(
    (hit: NominatimHit) => {
      const lngN = Number(hit.lon);
      const latN = Number(hit.lat);
      setPinGeoError(null);
      setLocationPin({ lng: lngN, lat: latN });
      setPinDropMode(false);
      setPinAddressQuery(hit.display_name);
      if (bounds && !lngLatInsideBounds(lngN, latN, bounds)) {
        setPinOffPosterHint(
          "This place is outside your current poster map area. Use Search to move the map here, or place the pin on the canvas so it lines up with your frame.",
        );
      } else {
        setPinOffPosterHint(null);
      }
    },
    [bounds],
  );

  async function handlePinAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = pinAddressQuery.replace(/\s+/g, " ").trim();
    if (q.length < 2) return;
    setPinGeoError(null);
    setPinGeocoding(true);
    try {
      const data = await fetchGeocodeResults(q, 10, {
        biasBounds: bounds,
        mapFirst: bounds != null,
      });
      if (data.length === 0) {
        setPinGeoError("No match — try a fuller address or choose a suggestion from the list.");
        return;
      }
      applyPinGeocodeHit(data[0]!);
    } catch {
      setPinGeoError("Lookup didn’t go through — check your connection and try again.");
    } finally {
      setPinGeocoding(false);
    }
  }

  useEffect(() => {
    if (!isXl) return;
    editorPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeNav, isXl]);

  const applyGeocodeHit = useCallback((hit: NominatimHit) => {
    setSearchQuery(hit.display_name);
    setBounds(hitToBounds(hit));
    setLat(Number(hit.lat));
    setLng(Number(hit.lon));
    setStyle((s) => ({
      ...s,
      city: displayCity(hit) || s.city,
      country: displayCountry(hit) || s.country,
    }));
  }, []);

  useEffect(() => {
    if (!locationPin) {
      setPinOffPosterHint(null);
      return;
    }
    if (!bounds) {
      setPinOffPosterHint(null);
      return;
    }
    if (!lngLatInsideBounds(locationPin.lng, locationPin.lat, bounds)) {
      setPinOffPosterHint(
        "This place is outside your current poster map area. Use Search to move the map here, or place the pin on the canvas so it lines up with your frame.",
      );
    } else {
      setPinOffPosterHint(null);
    }
  }, [bounds, locationPin]);

  const preset = useMemo(() => {
    return getPresetById(selectedPresetId) ?? getPresetById("us-8x10")!;
  }, [selectedPresetId]);

  const theme = useMemo(() => getThemeById(themeId) ?? getThemeById(DEFAULT_THEME_ID)!, [themeId]);

  const { w: aw, h: ah } = aspectFromPreset(preset);
  const posterFont = getPosterFontById(style.fontId);

  const coordStr = useMemo(() => formatLatLng(lat, lng), [lat, lng]);

  const summaryRows = useMemo(
    () => [
      {
        label: "Location",
        value: [style.city, style.country].filter(Boolean).join(", ") || "—",
      },
      { label: "Theme", value: theme.name },
      {
        label: "Output",
        value: `${EXPORT_CATEGORY_LABELS[preset.category]} · ${preset.name}`,
      },
      { label: "Dimensions", value: formatPresetDimensions(preset) },
      {
        label: "Pin",
        value: locationPin ? formatLatLng(locationPin.lat, locationPin.lng) : "None",
      },
      { label: "Coordinates", value: `${lat.toFixed(4)}, ${lng.toFixed(4)}` },
    ],
    [preset, style.city, style.country, theme.name, lat, lng, locationPin],
  );

  const showSizePicker = activeNav === "layout";
  const showThemePicker = activeNav === "theme";
  const showStylePanel = activeNav === "style";
  const showLayersPanel = activeNav === "layers";
  const showSettingsPanel = activeNav === "settings";

  const posterProps = {
    aspectW: aw,
    aspectH: ah,
    theme: theme.poster,
    posterText: style.posterText,
    overlay: style.overlay,
    city: style.city,
    country: style.country,
    coords: coordStr,
    credits: style.credits,
    fontFamily: posterFont.cssFamily,
  };

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setGeoError(null);
    setGeocoding(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as NominatimHit[] | { error?: string };
      if (!Array.isArray(data) || data.length === 0) {
        setGeoError("No matches — try another spelling or a broader place name.");
        return;
      }
      applyGeocodeHit(data[0]!);
    } catch {
      setGeoError("Search didn’t go through — check your connection and try again.");
    } finally {
      setGeocoding(false);
    }
  }

  function handleRecenter() {
    const map = mapRef.current;
    if (!map || !bounds) return;
    map.fitBounds(bounds, { padding: 48, duration: 800, maxZoom: 15 });
  }

  function scrollToMap() {
    mapHeroRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleExport() {
    const map = mapRef.current;
    if (!map) return;
    setExporting(true);
    try {
      let { w, h } = presetToExportPixels(preset, exportDpi);
      const c = clampExportSize(w, h);
      w = c.w;
      h = c.h;
      if (c.scaled) {
        console.warn("[export] Dimensions capped for browser limits");
      }
      const slug = style.city?.replace(/\s+/g, "-").toLowerCase() || "poster";
      await downloadMapPng(map, w, h, `city-vibe-maps-${slug}-${preset.id}.png`);
    } catch (err) {
      console.error(err);
      setGeoError("Export didn’t finish — try a smaller preset or lower DPI in Settings.");
    } finally {
      setExporting(false);
    }
  }

  function renderMainPanel() {
    if (showSizePicker) {
      return (
        <ExportSizePicker
          narrow={isXl}
          selectedId={selectedPresetId}
          onSelect={setSelectedPresetId}
        />
      );
    }
    if (showThemePicker) {
      return (
        <ThemePicker narrow={isXl} themes={MAP_THEMES} selectedId={themeId} onSelect={setThemeId} />
      );
    }
    if (showStylePanel) {
      return <StylePanel value={style} onChange={setStyle} />;
    }
    if (showLayersPanel) {
      return <LayersPanel value={layerToggles} onChange={setLayerToggles} />;
    }
    if (showSettingsPanel) {
      return <SettingsPanel exportDpi={exportDpi} onExportDpiChange={setExportDpi} />;
    }
    return (
      <div className="max-w-xl space-y-5">
        <div className="rounded-2xl border border-white/[0.06] bg-canvas-raised/30 p-5 text-sm leading-relaxed text-zinc-400">
          <p className="font-display text-base font-bold text-zinc-200">Start with a place</p>
          <p className="mt-2">
            We open on <span className="text-zinc-300">Maplewood, NJ</span> as a live demo. The top search is{" "}
            <span className="text-zinc-300">worldwide</span> (OpenStreetMap / Nominatim). Choose a suggestion or hit Search,
            then pan and zoom inside the frame. <span className="text-sky-300">Recenter</span> jumps back to your last
            search area.
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-canvas-raised/30 p-5 text-sm leading-relaxed text-zinc-400">
          <p className="font-display text-base font-bold text-zinc-200">Mark a spot</p>
          <p className="mt-2">
            Drop a pin for a home, venue, or any landmark. On the map it shows a{" "}
            <span className="text-zinc-300">diamond marker</span> (dark bezel + accent gem, crisp for print) with a soft glow,
            filled from your theme accent. It paints on the map canvas (included in PNG), not as a floating HTML pin. Pin address
            type-ahead <span className="text-zinc-300">starts inside your current poster bounds</span> (strict), then
            relaxes to the same area with a softer match, then worldwide if needed — the top search bar stays global.
            Pick a suggestion or <span className="text-zinc-300">Set pin</span>, or use{" "}
            <span className="text-zinc-300">Place pin on map</span> and click the canvas.
          </p>
          <form
            onSubmit={handlePinAddressSubmit}
            className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4"
          >
            <label htmlFor="pin-address-input" className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">
              Pin from address
            </label>
            <div className="flex flex-col gap-2">
              <GeocodeAutocomplete
                multiline
                suggestionsPlacement="above"
                biasBounds={bounds}
                suggestionBias={bounds ? "map_first" : "none"}
                inputId="pin-address-input"
                value={pinAddressQuery}
                onChange={(v) => {
                  setPinAddressQuery(v);
                  setPinGeoError(null);
                }}
                onPick={applyPinGeocodeHit}
                geocoding={pinGeocoding}
                suggestionsListId="geocode-suggestions-pin"
                inputAriaLabel="Address or place for map pin"
                placeholder="Street, venue, or place name…"
              />
              <button
                type="submit"
                disabled={pinGeocoding || pinAddressQuery.trim().length < 2}
                className="w-full rounded-2xl border border-sky-500/35 bg-sky-500/15 px-4 py-3 text-xs font-bold uppercase tracking-wide text-sky-100 transition-all hover:bg-sky-500/25 disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:self-start"
              >
                {pinGeocoding ? "…" : "Set pin"}
              </button>
            </div>
            {pinGeoError ? (
              <p className="text-xs text-amber-300/90" role="alert">
                {pinGeoError}
              </p>
            ) : null}
            {pinOffPosterHint ? (
              <p className="text-pretty text-xs leading-relaxed text-cyan-200/85" role="status">
                {pinOffPosterHint}
              </p>
            ) : null}
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={pinDropMode}
              onClick={() => setPinDropMode((v) => !v)}
              className={`rounded-2xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                pinDropMode
                  ? "border-sky-400/50 bg-sky-500/20 text-sky-100 shadow-glow-sm"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-sky-400/30 hover:text-white"
              }`}
            >
              {pinDropMode ? "Click map to place…" : "Place pin on map"}
            </button>
            <button
              type="button"
              disabled={!locationPin}
              onClick={() => {
                setLocationPin(null);
                setPinAddressQuery("");
                setPinGeoError(null);
                setPinOffPosterHint(null);
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-300 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-35"
            >
              Clear pin
            </button>
          </div>
          {pinDropMode ? (
            <p className="mt-3 text-xs text-sky-300/90">Click anywhere on the poster map to set the pin. Press the button again to cancel.</p>
          ) : null}
          {locationPin && !pinDropMode ? (
            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              {formatLatLng(locationPin.lat, locationPin.lng)}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-studio-stage relative flex min-h-screen flex-col">
      <div className="bg-studio-grid" aria-hidden />
      <div
        className="pointer-events-none fixed -left-32 top-1/4 h-72 w-72 rounded-full bg-sky-500/18 blur-[100px] animate-drift"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-24 bottom-1/4 h-64 w-64 rounded-full bg-cyan-500/12 blur-[90px] animate-drift [animation-delay:-6s]"
        aria-hidden
      />

      <StudioBanner />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col xl:flex-row">
        <Sidebar
          activeId={activeNav}
          onSelect={setActiveNav}
          onSettingsClick={() => setActiveNav("settings")}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col xl:flex-row">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-10">
            <div className="mx-auto w-full max-w-4xl space-y-5 self-center">
            <form
              onSubmit={handleSearch}
              className="relative z-20 isolate mb-1 flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <GeocodeAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onPick={(hit) => {
                  setGeoError(null);
                  applyGeocodeHit(hit);
                }}
                geocoding={geocoding}
              />
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <button
                  type="submit"
                  disabled={geocoding}
                  className="rounded-2xl border border-sky-500/35 bg-sky-500/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-sky-100 transition-all hover:bg-sky-500/25 disabled:opacity-50"
                >
                  {geocoding ? "…" : "Search"}
                </button>
                <button
                  type="button"
                  onClick={handleRecenter}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-sky-400/30 hover:text-white hover:shadow-glow-sm"
                >
                  Recenter
                </button>
                <button
                  type="button"
                  onClick={scrollToMap}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-cyan-400/30 hover:text-white hover:shadow-glow-cyan"
                >
                  Canvas
                </button>
              </div>
            </form>
            {geoError ? (
              <p className="text-sm text-amber-300/90" role="alert">
                {geoError}
              </p>
            ) : null}

            <div ref={mapHeroRef} className="relative z-0 flex flex-col gap-2">
              <div className="max-w-3xl space-y-1">
                <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">Poster canvas</p>
                <p className="text-pretty text-[11px] leading-relaxed text-zinc-600">
                  OpenStreetMap vectors are recolored per theme (water, land, roads, labels), then a light tint and
                  vignette. Poster type sits on top. An optional pin from Location (address or map click) draws on the
                  canvas too — your PNG matches this frame.
                </p>
              </div>
              <MapPosterPreview
                {...posterProps}
                vectorTheme={theme}
                bounds={bounds}
                layerToggles={layerToggles}
                pin={locationPin}
                pinDropMode={pinDropMode}
                onPinPlaced={handlePinPlaced}
                onReady={handleMapReady}
                variant="hero"
              />
            </div>

            {!isXl ? <div className="pb-40">{renderMainPanel()}</div> : null}
            </div>
          </main>

          <aside className="relative z-20 flex w-full shrink-0 flex-col gap-4 border-t border-white/[0.08] bg-canvas/20 p-4 pb-40 backdrop-blur-md xl:sticky xl:top-24 xl:h-[calc(100dvh-6rem)] xl:w-[min(380px,34vw)] xl:max-w-md xl:overflow-y-auto xl:border-l xl:border-t-0 xl:pb-36">
            <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">At a glance</p>
            <p className="text-xs text-zinc-600">
              {isXl
                ? "The left rail switches Theme, Layout, Style, and Layers in this column — the center canvas updates live."
                : "On a large screen, those controls move here next to the summary. The canvas is what you export."}
            </p>
            <SettingsSummary rows={summaryRows} className="mt-1" />
            {isXl ? (
              <div
                ref={editorPanelRef}
                className="relative z-10 min-h-0 border-t border-white/[0.08] pt-4"
                role="region"
                aria-label="Active editor panel"
              >
                {renderMainPanel()}
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex justify-end p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:pb-6 xl:pr-[max(1.25rem,calc(min(380px,34vw)+1.5rem))]">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || !mapReady}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 px-7 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-[0_10px_40px_-8px_rgba(14,165,233,0.45),0_8px_24px_-6px_rgba(34,211,238,0.25)] transition-all hover:scale-[1.04] hover:shadow-[0_14px_48px_-6px_rgba(56,189,248,0.35)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          <IconDownload className="h-4 w-4" />
          {exporting ? "Saving PNG…" : "Download PNG"}
        </button>
      </div>

      <footer className="relative z-10 border-t border-white/[0.06] bg-canvas/30 px-4 py-3 text-center text-[10px] text-zinc-500 backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:px-6">
        <span>
          <span className="text-zinc-600">City Vibe Maps</span>
          {" · "}
          Map data ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="text-zinc-400 underline-offset-2 transition-colors hover:text-sky-300 hover:underline"
          >
            OpenStreetMap
          </a>
          . Tile host & licenses: README.
        </span>
        <span className="mt-1 block font-mono text-sky-400/80 sm:mt-0">v0.2.2</span>
      </footer>
    </div>
  );
}
