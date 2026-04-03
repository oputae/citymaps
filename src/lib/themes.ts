/**
 * Curated map-poster palettes (original names + colors — not third-party theme sets).
 * `swatches` are ordered for the picker strip: background → land → major lines → minor/detail → accent.
 */
export type PosterThemeColors = {
  background: string;
  water: string;
  lines: string;
  linesMuted: string;
  buildingFill: string;
  title: string;
  subtitle: string;
  coords: string;
  vignetteEnd: string;
};

export type MapTheme = {
  id: string;
  name: string;
  description: string;
  swatches: readonly [string, string, string, string, string];
  poster: PosterThemeColors;
};

export const MAP_THEMES: MapTheme[] = [
  {
    id: "clay-studio",
    name: "Clay studio",
    description: "Warm stone and terracotta — soft daylight on old walls.",
    swatches: ["#2a1f1a", "#5c3d2e", "#c4a484", "#e8dcc8", "#8b5a3c"],
    poster: {
      background: "#2a1f1a",
      water: "#4a3528",
      lines: "#e8dcc8",
      linesMuted: "#c4a484",
      buildingFill: "rgba(196, 164, 132, 0.25)",
      title: "#f5ebe0",
      subtitle: "#a89080",
      coords: "#8b7355",
      vignetteEnd: "rgba(32, 24, 18, 0.9)",
    },
  },
  {
    id: "deep-harbor",
    name: "Deep harbor",
    description: "Ink navy base with cool cyan routes — crisp, editorial.",
    swatches: ["#070b12", "#0f172a", "#38bdf8", "#64748b", "#e2e8f0"],
    poster: {
      background: "#070b12",
      water: "#1e3a5f",
      lines: "#7dd3fc",
      linesMuted: "#38bdf8",
      buildingFill: "rgba(148, 163, 184, 0.22)",
      title: "#e0f2fe",
      subtitle: "#94a3b8",
      coords: "#64748b",
      vignetteEnd: "rgba(4, 8, 16, 0.88)",
    },
  },
  {
    id: "signal",
    name: "Signal",
    description: "High contrast neons on black — night city energy.",
    swatches: ["#050508", "#1a1033", "#22d3ee", "#e879f9", "#f472b6"],
    poster: {
      background: "#050508",
      water: "#1e1b4b",
      lines: "#22d3ee",
      linesMuted: "#e879f9",
      buildingFill: "rgba(244, 114, 182, 0.15)",
      title: "#f0abfc",
      subtitle: "#a78bfa",
      coords: "#818cf8",
      vignetteEnd: "rgba(5, 5, 12, 0.92)",
    },
  },
  {
    id: "wine-stone",
    name: "Wine & stone",
    description: "Burgundy depth with chalk neutrals — gallery quiet.",
    swatches: ["#1c1218", "#3d1f2b", "#9f1239", "#d4d4d8", "#fafaf9"],
    poster: {
      background: "#1c1218",
      water: "#3d1f2b",
      lines: "#fda4af",
      linesMuted: "#fb7185",
      buildingFill: "rgba(212, 212, 216, 0.12)",
      title: "#fef2f2",
      subtitle: "#d4d4d8",
      coords: "#a1a1aa",
      vignetteEnd: "rgba(20, 12, 16, 0.9)",
    },
  },
  {
    id: "ember",
    name: "Ember",
    description: "Charcoal with molten amber routes — warm and bold.",
    swatches: ["#0c0a09", "#1c1917", "#f59e0b", "#ea580c", "#fcd34d"],
    poster: {
      background: "#0c0a09",
      water: "#292524",
      lines: "#fcd34d",
      linesMuted: "#f59e0b",
      buildingFill: "rgba(251, 191, 36, 0.12)",
      title: "#fffbeb",
      subtitle: "#d6d3d1",
      coords: "#a8a29e",
      vignetteEnd: "rgba(12, 10, 8, 0.9)",
    },
  },
  {
    id: "crimson-study",
    name: "Crimson study",
    description: "Deep red ink on cream paper — literary, dramatic.",
    swatches: ["#0f0f0f", "#1a1a1a", "#dc2626", "#f5f5f4", "#e7e5e4"],
    poster: {
      background: "#0f0f0f",
      water: "#262626",
      lines: "#fca5a5",
      linesMuted: "#ef4444",
      buildingFill: "rgba(245, 245, 244, 0.08)",
      title: "#fef2f2",
      subtitle: "#d6d3d1",
      coords: "#a8a29e",
      vignetteEnd: "rgba(8, 8, 8, 0.88)",
    },
  },
  {
    id: "moss-alley",
    name: "Moss alley",
    description: "Forest greens and mist — calm, outdoorsy.",
    swatches: ["#0f1711", "#1a2e22", "#4ade80", "#86efac", "#bbf7d0"],
    poster: {
      background: "#0f1711",
      water: "#14532d",
      lines: "#bbf7d0",
      linesMuted: "#4ade80",
      buildingFill: "rgba(134, 239, 172, 0.14)",
      title: "#ecfccb",
      subtitle: "#a3e635",
      coords: "#65a30d",
      vignetteEnd: "rgba(12, 20, 14, 0.9)",
    },
  },
  {
    id: "bronze-wire",
    name: "Bronze wire",
    description: "Metallic browns and graphite — machined, refined.",
    swatches: ["#1c1410", "#3d2f26", "#d4a574", "#78716c", "#a8a29e"],
    poster: {
      background: "#1c1410",
      water: "#44403c",
      lines: "#d4a574",
      linesMuted: "#a8a29e",
      buildingFill: "rgba(168, 162, 158, 0.18)",
      title: "#fafaf9",
      subtitle: "#a8a29e",
      coords: "#78716c",
      vignetteEnd: "rgba(20, 16, 12, 0.9)",
    },
  },
  {
    id: "dune-quiet",
    name: "Dune quiet",
    description: "Bleached sand and taupe — minimal desert calm.",
    swatches: ["#292524", "#44403c", "#d6d3d1", "#e7e5e4", "#fafaf9"],
    poster: {
      background: "#292524",
      water: "#57534e",
      lines: "#fafaf9",
      linesMuted: "#d6d3d1",
      buildingFill: "rgba(231, 229, 228, 0.12)",
      title: "#fafaf9",
      subtitle: "#d6d3d1",
      coords: "#a8a29e",
      vignetteEnd: "rgba(28, 25, 23, 0.85)",
    },
  },
  {
    id: "drafting-desk",
    name: "Drafting desk",
    description: "Blueprint blues and drafting white — technical, precise.",
    swatches: ["#0c1929", "#172554", "#93c5fd", "#e2e8f0", "#ffffff"],
    poster: {
      background: "#0c1929",
      water: "#1e3a8a",
      lines: "#e2e8f0",
      linesMuted: "#93c5fd",
      buildingFill: "rgba(147, 197, 253, 0.15)",
      title: "#f8fafc",
      subtitle: "#94a3b8",
      coords: "#64748b",
      vignetteEnd: "rgba(8, 16, 32, 0.88)",
    },
  },
];

export function getThemeById(id: string): MapTheme | undefined {
  return MAP_THEMES.find((t) => t.id === id);
}

export const DEFAULT_THEME_ID = "clay-studio";
