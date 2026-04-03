"use client";

import type { NominatimHit } from "@/lib/geocode-types";
import { fetchGeocodeResults } from "@/lib/geocode-fetch";
import type { LngLatBounds } from "@/lib/geo-bounds";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onPick: (hit: NominatimHit) => void;
  geocoding: boolean;
  /** Max results from `/api/geocode` (Nominatim may still return fewer). */
  suggestionLimit?: number;
  /** Distinct list id when multiple comboboxes exist on the page (a11y). */
  suggestionsListId?: string;
  inputId?: string;
  inputAriaLabel?: string;
  placeholder?: string;
  /** Wrapped textarea — better for long Nominatim display names in narrow sidebars. */
  multiline?: boolean;
  /** Open the suggestion panel above the field (avoids covering controls below). */
  suggestionsPlacement?: "below" | "above";
  /**
   * When set with `suggestionBias="map_first"`, searches prefer matches inside the poster bounds
   * (Nominatim viewbox + bounded), then relaxes if needed.
   */
  biasBounds?: LngLatBounds | null;
  /** `map_first`: bounded=1 → bounded=0 → global. `none`: world search. */
  suggestionBias?: "none" | "map_first";
  onSuggestionsOpenChange?: (open: boolean) => void;
};

const DEBOUNCE_MS = 380;
const MIN_CHARS = 2;

/**
 * Debounced suggestions via `/api/geocode` (Nominatim). Polite use: debounce + min length.
 */
export function GeocodeAutocomplete({
  value,
  onChange,
  onPick,
  geocoding,
  suggestionLimit = 15,
  suggestionsListId = "geocode-suggestions",
  inputId,
  inputAriaLabel = "Search location",
  placeholder = "City, neighborhood, or address…",
  multiline = false,
  suggestionsPlacement = "below",
  biasBounds = null,
  suggestionBias = "none",
  onSuggestionsOpenChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NominatimHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const blurCloseRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const suggestAbortRef = useRef<AbortController | null>(null);
  const fetchGenRef = useRef(0);

  const setOpenTracked = useCallback(
    (next: boolean) => {
      setOpen(next);
      onSuggestionsOpenChange?.(next);
    },
    [onSuggestionsOpenChange],
  );

  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (q.trim().length < MIN_CHARS) {
        suggestAbortRef.current?.abort();
        suggestAbortRef.current = null;
        fetchGenRef.current += 1;
        setLoading(false);
        setItems([]);
        setOpenTracked(false);
        return;
      }
      suggestAbortRef.current?.abort();
      const ac = new AbortController();
      suggestAbortRef.current = ac;
      const gen = ++fetchGenRef.current;
      setLoading(true);
      try {
        const lim = Math.min(40, Math.max(1, suggestionLimit));
        const list = await fetchGeocodeResults(q, lim, {
          signal: ac.signal,
          biasBounds: biasBounds ?? null,
          mapFirst: suggestionBias === "map_first",
        });
        if (fetchGenRef.current !== gen) return;

        setItems(list);
        setOpenTracked(list.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (fetchGenRef.current === gen) setItems([]);
      } finally {
        if (fetchGenRef.current === gen) setLoading(false);
      }
    },
    [suggestionLimit, biasBounds, suggestionBias, setOpenTracked],
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(value);
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(debounceRef.current);
      suggestAbortRef.current?.abort();
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenTracked(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      cancelBlurClose();
    };
  }, [setOpenTracked]);

  function selectHit(hit: NominatimHit) {
    onPick(hit);
    setOpenTracked(false);
    setItems([]);
  }

  function cancelBlurClose() {
    if (blurCloseRef.current) {
      clearTimeout(blurCloseRef.current);
      blurCloseRef.current = undefined;
    }
  }

  function scheduleClose() {
    cancelBlurClose();
    blurCloseRef.current = globalThis.setTimeout(() => setOpenTracked(false), 180);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      selectHit(items[activeIndex]!);
    } else if (e.key === "Escape") {
      setOpenTracked(false);
    }
  }

  const fieldClass =
    "w-full rounded-2xl border border-white/[0.1] bg-canvas-raised/80 pl-4 pr-11 text-sm text-zinc-100 shadow-inner shadow-sky-500/5 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:border-sky-400/45 focus:shadow-glow-sm focus:ring-2 focus:ring-cyan-400/20";

  const sharedFieldProps = {
    id: inputId,
    role: "combobox" as const,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onKeyDown,
    onFocus: () => {
      cancelBlurClose();
      if (value.trim().length >= MIN_CHARS && items.length > 0) setOpenTracked(true);
    },
    onBlur: scheduleClose,
    placeholder,
    autoComplete: "off" as const,
    autoCorrect: "off" as const,
    spellCheck: false,
    "aria-label": inputAriaLabel,
    "aria-autocomplete": "list" as const,
    "aria-expanded": open,
    "aria-controls": suggestionsListId,
    "aria-haspopup": "listbox" as const,
    title: value.trim().length > 0 ? value : undefined,
  };

  const panelPositionClass =
    suggestionsPlacement === "above"
      ? "bottom-[calc(100%+8px)] top-auto"
      : "top-[calc(100%+8px)]";

  return (
    <div ref={wrapRef} className="relative z-30 w-full flex-1">
      {multiline ? (
        <textarea
          {...sharedFieldProps}
          rows={2}
          aria-multiline="true"
          className={`${fieldClass} min-h-[4.25rem] resize-none py-2.5 leading-snug`}
        />
      ) : (
        <input
          {...sharedFieldProps}
          type="text"
          inputMode="search"
          className={`${fieldClass} py-3`}
        />
      )}
      <div
        className={`pointer-events-none absolute right-3 flex items-center gap-2 text-[10px] text-zinc-600 ${
          multiline ? "top-2.5" : "top-1/2 -translate-y-1/2"
        }`}
      >
        {loading || geocoding ? <span className="animate-pulse">…</span> : null}
      </div>

      {open && items.length > 0 ? (
        <div
          className={`absolute left-0 right-0 z-[140] overflow-hidden rounded-xl border border-white/20 bg-zinc-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.95)] ${panelPositionClass}`}
          onMouseDown={cancelBlurClose}
        >
          <div className="border-b border-white/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Suggestions
          </div>
          <ul
            id={suggestionsListId}
            role="listbox"
            className="max-h-[min(17rem,42vh)] overflow-y-auto py-0.5"
          >
            {items.map((hit, i) => (
              <li
                key={
                  hit.place_id != null
                    ? `p-${hit.place_id}`
                    : `${hit.osm_type ?? "x"}-${hit.osm_id ?? "x"}-${hit.lat}-${hit.lon}-${i}`
                }
                role="option"
                aria-selected={i === activeIndex}
              >
                <button
                  type="button"
                  title={hit.display_name}
                  className={`w-full px-2.5 py-1.5 text-left text-xs leading-tight transition-colors ${
                    i === activeIndex ? "bg-sky-500/25 text-white" : "text-zinc-200 hover:bg-white/5"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectHit(hit)}
                >
                  <span className="block truncate">{hit.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
