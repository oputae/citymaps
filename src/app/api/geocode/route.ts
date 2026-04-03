import type { NominatimHit } from "@/lib/geocode-types";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Proxy for Nominatim (server-side to respect usage policy and avoid browser CORS issues).
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return Response.json({ error: "Missing q" }, { status: 400 });
  }

  const limitRaw = req.nextUrl.searchParams.get("limit");
  /** Nominatim allows up to 40; keep client-side requests reasonable (see autocomplete). */
  const limit = Math.min(40, Math.max(1, Number(limitRaw) || 10));

  const viewbox = req.nextUrl.searchParams.get("viewbox")?.trim();
  const boundedRaw = req.nextUrl.searchParams.get("bounded");

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("addressdetails", "1");
  /** Default Nominatim dedupe=1 collapses split ways / near-duplicates — off for richer type-ahead lists. */
  url.searchParams.set("dedupe", "0");

  if (viewbox) {
    const parts = viewbox.split(",").map((p) => p.trim());
    if (parts.length === 4 && parts.every((p) => p.length > 0 && !Number.isNaN(Number(p)))) {
      url.searchParams.set("viewbox", parts.join(","));
      if (boundedRaw === "0" || boundedRaw === "1") {
        url.searchParams.set("bounded", boundedRaw);
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "CityVibeMaps/0.2.2 (personal poster studio; see project README for contact/repo)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json({ error: "Geocoder unavailable" }, { status: 502 });
  }

  const data = (await res.json()) as NominatimHit[];
  return Response.json(data);
}
