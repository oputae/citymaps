export type ExportCategoryId = "print" | "social" | "wallpaper" | "web";

export type PhysicalPreset = {
  id: string;
  category: ExportCategoryId;
  name: string;
  kind: "physical";
  unit: "cm" | "in";
  width: number;
  height: number;
};

export type PixelPreset = {
  id: string;
  category: ExportCategoryId;
  name: string;
  kind: "pixel";
  widthPx: number;
  heightPx: number;
};

export type ExportPreset = PhysicalPreset | PixelPreset;

export const EXPORT_CATEGORY_LABELS: Record<ExportCategoryId, string> = {
  print: "Print",
  social: "Social",
  wallpaper: "Wallpaper",
  web: "Web",
};

/** Presets are factual output sizes; groupings follow common design/print workflows. */
export const EXPORT_PRESETS: ExportPreset[] = [
  // —— Print (physical, portrait-first for posters) ——
  {
    id: "a3-portrait",
    category: "print",
    name: "A3 portrait",
    kind: "physical",
    unit: "cm",
    width: 29.7,
    height: 42,
  },
  {
    id: "a4-portrait",
    category: "print",
    name: "A4 portrait",
    kind: "physical",
    unit: "cm",
    width: 21,
    height: 29.7,
  },
  {
    id: "a5-portrait",
    category: "print",
    name: "A5 portrait",
    kind: "physical",
    unit: "cm",
    width: 14.8,
    height: 21,
  },
  {
    id: "letter-us-portrait",
    category: "print",
    name: "US Letter portrait",
    kind: "physical",
    unit: "in",
    width: 8.5,
    height: 11,
  },
  {
    id: "us-4x6",
    category: "print",
    name: "4 × 6 in (photo)",
    kind: "physical",
    unit: "in",
    width: 4,
    height: 6,
  },
  {
    id: "us-5x7",
    category: "print",
    name: "5 × 7 in (photo)",
    kind: "physical",
    unit: "in",
    width: 5,
    height: 7,
  },
  {
    id: "us-8x10",
    category: "print",
    name: "8 × 10 in (photo)",
    kind: "physical",
    unit: "in",
    width: 8,
    height: 10,
  },
  {
    id: "us-11x14",
    category: "print",
    name: "11 × 14 in (poster)",
    kind: "physical",
    unit: "in",
    width: 11,
    height: 14,
  },

  // —— Social (pixels) ——
  {
    id: "ig-square",
    category: "social",
    name: "Instagram square",
    kind: "pixel",
    widthPx: 1080,
    heightPx: 1080,
  },
  {
    id: "ig-portrait",
    category: "social",
    name: "Instagram portrait",
    kind: "pixel",
    widthPx: 1080,
    heightPx: 1350,
  },
  {
    id: "story-916",
    category: "social",
    name: "Story (9:16)",
    kind: "pixel",
    widthPx: 1080,
    heightPx: 1920,
  },
  {
    id: "linkedin-post",
    category: "social",
    name: "LinkedIn post",
    kind: "pixel",
    widthPx: 1200,
    heightPx: 627,
  },
  {
    id: "linkedin-cover",
    category: "social",
    name: "LinkedIn cover",
    kind: "pixel",
    widthPx: 1584,
    heightPx: 396,
  },
  {
    id: "pinterest-pin",
    category: "social",
    name: "Pinterest pin",
    kind: "pixel",
    widthPx: 1000,
    heightPx: 1500,
  },
  {
    id: "reddit-169",
    category: "social",
    name: "Reddit post (16:9)",
    kind: "pixel",
    widthPx: 1200,
    heightPx: 675,
  },
  {
    id: "reddit-banner",
    category: "social",
    name: "Reddit banner",
    kind: "pixel",
    widthPx: 1920,
    heightPx: 256,
  },
  {
    id: "twitter-header",
    category: "social",
    name: "Twitter / X header",
    kind: "pixel",
    widthPx: 1500,
    heightPx: 500,
  },
  {
    id: "youtube-thumb",
    category: "social",
    name: "YouTube thumbnail",
    kind: "pixel",
    widthPx: 1280,
    heightPx: 720,
  },

  // —— Wallpaper / devices ——
  {
    id: "wall-fhd",
    category: "wallpaper",
    name: "Desktop Full HD",
    kind: "pixel",
    widthPx: 1920,
    heightPx: 1080,
  },
  {
    id: "wall-4k",
    category: "wallpaper",
    name: "Desktop 4K",
    kind: "pixel",
    widthPx: 3840,
    heightPx: 2160,
  },
  {
    id: "wall-ultrawide",
    category: "wallpaper",
    name: "Desktop ultrawide",
    kind: "pixel",
    widthPx: 3440,
    heightPx: 1440,
  },
  {
    id: "iphone-15-pro",
    category: "wallpaper",
    name: "iPhone 15 Pro",
    kind: "pixel",
    widthPx: 1179,
    heightPx: 2556,
  },
  {
    id: "iphone-15-pro-max",
    category: "wallpaper",
    name: "iPhone 15 Pro Max",
    kind: "pixel",
    widthPx: 1290,
    heightPx: 2796,
  },
  {
    id: "galaxy-s24-ultra",
    category: "wallpaper",
    name: "Galaxy S24 Ultra",
    kind: "pixel",
    widthPx: 1440,
    heightPx: 3120,
  },
  {
    id: "ipad-pro-11",
    category: "wallpaper",
    name: 'iPad Pro 11"',
    kind: "pixel",
    widthPx: 1668,
    heightPx: 2388,
  },
  {
    id: "ipad-pro-129",
    category: "wallpaper",
    name: 'iPad Pro 12.9"',
    kind: "pixel",
    widthPx: 2048,
    heightPx: 2732,
  },

  // —— Web ——
  {
    id: "web-hero",
    category: "web",
    name: "Hero banner",
    kind: "pixel",
    widthPx: 1440,
    heightPx: 600,
  },
  {
    id: "web-blog",
    category: "web",
    name: "Blog featured",
    kind: "pixel",
    widthPx: 1200,
    heightPx: 630,
  },
  {
    id: "web-dashboard",
    category: "web",
    name: "Dashboard card",
    kind: "pixel",
    widthPx: 1280,
    heightPx: 960,
  },
];

export function getPresetById(id: string): ExportPreset | undefined {
  return EXPORT_PRESETS.find((p) => p.id === id);
}

export function formatPresetDimensions(p: ExportPreset): string {
  if (p.kind === "physical") {
    const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    return `${fmt(p.width)} × ${fmt(p.height)} ${p.unit}`;
  }
  return `${p.widthPx} × ${p.heightPx} px`;
}

/** Width / height for aspect preview (any positive numbers). */
export function presetAspectRatio(p: ExportPreset): number {
  if (p.kind === "physical") return p.width / p.height;
  return p.widthPx / p.heightPx;
}
