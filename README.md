# City Vibe Maps

A personal **poster studio** for turning real geography into print-ready art: search a place, style the frame, export a PNG. Built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **MapLibre GL**, and a cool, blue-forward UI.

This is an **independent project**. The idea of “search a place → style a poster → export” exists in other open tools; one well-known example is [**TerraInk (terraink)**](https://github.com/yousifamanuel/terraink), which helped validate the concept and inspired the *category* of app — **this repository is not a fork** and does not reuse TerraInk’s code, branding, or assets. Thanks to that community for the inspiration.

---

## Map data & services

- **Map data:** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL).
- **Tiles / style:** Vector tiles are loaded from **[OpenFreeMap](https://openfreemap.org/)** using a public **Liberty**-style endpoint (`https://tiles.openfreemap.org/styles/liberty` — see [`src/lib/map-config.ts`](src/lib/map-config.ts)). OpenFreeMap’s own terms and attribution apply; keep their credit visible in the app and on exports when required.
- **Search (geocoding):** Results come from the **[Nominatim](https://nominatim.org/)** API via a small **Next.js route** ([`src/app/api/geocode/route.ts`](src/app/api/geocode/route.ts)) so requests use an identifiable `User-Agent` and stay off the client’s direct traffic to the public endpoint. Follow [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/) (caching, rate limits, attribution).
- **Renderer:** [MapLibre GL](https://maplibre.org/) (BSD / compatible license per upstream).

---

## Requirements

- **Node.js** 18.18+ or 20+ (see [Next.js 15 system requirements](https://nextjs.org/docs/app/getting-started/installation)).

---

## Development

Search uses **debounced type-ahead** against the local `/api/geocode` proxy (Nominatim). The proxy requests **`dedupe=0`** so Nominatim returns separate OSM matches instead of collapsing near-duplicates into a single row (richer suggestion lists). Keep queries reasonable; it’s meant for personal use.

```bash
npm install
npm run dev
```

`npm run dev` runs Next with **Turbopack**. Open the URL Next prints (usually [http://localhost:3000](http://localhost:3000)).

```bash
npm run lint
npm run build
npm start
```

---

## Deploy (e.g. Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel. The repo includes [`vercel.json`](vercel.json) with `"framework": "nextjs"` so Vercel treats the app as **Next.js** (not a static site).
3. In **Project → Settings → General → Build & Development Settings**, confirm:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (repository root — **not** `src`)
   - **Build Command:** `next build` (or leave default)
   - **Output Directory:** **leave empty** — do not set `out` or `.next` unless you know you need a custom static export. A wrong output folder often shows as **404 NOT_FOUND** even when the build succeeds.
4. **Git → Production Branch** should match your default branch (e.g. **`main`**), or production URLs may not point at your latest deploy.
5. **Environment variables:** none are required for the current code path. See [`.env.example`](.env.example) for optional keys you might add later (Mapbox, analytics, etc.). Set those only in **Vercel → Project → Settings → Environment Variables** — never commit real secrets.

If you still see Vercel’s **404 NOT_FOUND** page, open the **latest deployment** in the dashboard and use the **Visit** link there (avoids typos or stale bookmarks). See Vercel’s [NOT_FOUND](https://vercel.com/docs/errors/NOT_FOUND) and [404 deployment guide](https://vercel.com/guides/why-is-my-deployed-project-giving-404).

---

## Features (current)

- **Studio layout** — sidebar navigation (Location, Theme, Style, Layers, Export) with a sticky map preview on large screens.
- **Live map preview** — MapLibre + OSM-derived vector tiles; default demo viewport is **Maplewood, NJ** so the first paint shows real data without waiting on search.
- **Vector theming** — Liberty layers are recolored to match each poster palette (water, land, roads, labels), with **flattened road widths** so highways do not overwhelm smaller streets at poster zooms. **Clay studio** is the default theme and appears first in the theme list.
- **Theme + poster chrome** — typography options, optional grain and overlay, credits line, city/country labels.
- **Location pin**
  - From the **Location** panel: address type-ahead uses the same Nominatim proxy but **prefers results inside the current poster bounds** (`bounded=1` → then `bounded=0` with viewbox → then global if empty). The **top Search** field remains **worldwide**.
  - **Place pin on map** — click the map to drop the pin when that mode is active.
  - The on-map marker is a **diamond / gem silhouette** (canvas-drawn: dark bezel from poster stroke, accent fill, light edge + highlight) plus a soft **halo circle**, as a MapLibre **symbol** for clean **PNG export** (not an HTML overlay).
- **Export** — presets grouped as **Print**, **Social**, **Wallpaper**, and **Web** (physical sizes + pixel dimensions); print exports use DPI from Settings with a safe upper clamp for the browser.
- **Layer toggles** (roads / water / labels) — best-effort; depends on layer IDs in the active style.

---

## Ethics & attribution

- Keep **OSM**, **Nominatim**, **tile host**, and **MapLibre** attribution honest in the UI and in exported artwork.
- This project is for **personal / learning** use unless you add your own compliance review for heavier traffic.

---

## License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE).

You may replace the copyright line in `LICENSE` with your legal name or GitHub handle when you publish.
