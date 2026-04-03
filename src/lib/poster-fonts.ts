export type PosterFontOption = {
  id: string;
  label: string;
  /** CSS font-family stack (first face should match a loaded Google font). */
  cssFamily: string;
};

export const POSTER_FONT_OPTIONS: PosterFontOption[] = [
  { id: "geist", label: "Default (Geist)", cssFamily: "var(--font-geist-sans), system-ui, sans-serif" },
  { id: "space-grotesk", label: "Space Grotesk", cssFamily: "var(--font-poster-space), system-ui, sans-serif" },
  { id: "outfit", label: "Outfit", cssFamily: "var(--font-poster-outfit), system-ui, sans-serif" },
  { id: "libre-baskerville", label: "Libre Baskerville", cssFamily: "var(--font-poster-libre), Georgia, serif" },
  { id: "dm-serif", label: "DM Serif Display", cssFamily: "var(--font-poster-dm), Georgia, serif" },
];

export const DEFAULT_POSTER_FONT_ID = "geist";

export function getPosterFontById(id: string): PosterFontOption {
  return POSTER_FONT_OPTIONS.find((f) => f.id === id) ?? POSTER_FONT_OPTIONS[0]!;
}
