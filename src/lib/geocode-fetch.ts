import type { NominatimHit } from "@/lib/geocode-types";
import type { LngLatBounds } from "@/lib/geo-bounds";
import { nominatimViewboxParam } from "@/lib/geo-bounds";

async function geocodeGet(params: URLSearchParams, signal?: AbortSignal): Promise<NominatimHit[]> {
  const res = await fetch(`/api/geocode?${params.toString()}`, { signal });
  if (!res.ok) return [];
  const data = (await res.json()) as NominatimHit[] | { error?: string };
  return Array.isArray(data) ? data : [];
}

/**
 * `/api/geocode` with optional poster-bounds bias.
 * `mapFirst`: bounded=1 → bounded=0 with viewbox → global (matches pin type-ahead).
 */
export async function fetchGeocodeResults(
  q: string,
  limit: number,
  options: {
    signal?: AbortSignal;
    biasBounds?: LngLatBounds | null;
    mapFirst?: boolean;
  } = {},
): Promise<NominatimHit[]> {
  const { signal, biasBounds = null, mapFirst = false } = options;
  const qt = q.trim();
  const lim = String(Math.min(40, Math.max(1, limit)));

  if (mapFirst && biasBounds) {
    const vb = nominatimViewboxParam(biasBounds);
    let list = await geocodeGet(
      new URLSearchParams({ q: qt, limit: lim, viewbox: vb, bounded: "1" }),
      signal,
    );
    if (list.length === 0) {
      list = await geocodeGet(
        new URLSearchParams({ q: qt, limit: lim, viewbox: vb, bounded: "0" }),
        signal,
      );
    }
    if (list.length === 0) {
      list = await geocodeGet(new URLSearchParams({ q: qt, limit: lim }), signal);
    }
    return list;
  }

  if (biasBounds) {
    const vb = nominatimViewboxParam(biasBounds);
    return geocodeGet(new URLSearchParams({ q: qt, limit: lim, viewbox: vb, bounded: "0" }), signal);
  }

  return geocodeGet(new URLSearchParams({ q: qt, limit: lim }), signal);
}
