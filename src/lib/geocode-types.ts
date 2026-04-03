export type NominatimHit = {
  /** Stable id from Nominatim — use for list keys when present. */
  place_id?: number;
  osm_type?: string;
  osm_id?: number;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

export function hitToBounds(hit: NominatimHit): [[number, number], [number, number]] {
  const [south, north, west, east] = hit.boundingbox.map(Number);
  return [
    [west, south],
    [east, north],
  ];
}

export function displayCity(hit: NominatimHit): string {
  const a = hit.address;
  if (!a) return "";
  return a.city || a.town || a.village || a.hamlet || a.county || "";
}

export function displayCountry(hit: NominatimHit): string {
  return hit.address?.country ?? "";
}
