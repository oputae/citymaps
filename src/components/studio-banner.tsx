/** Full-width masthead above the entire studio (sidebar + canvas + summary). */
export function StudioBanner() {
  return (
    <header className="relative z-20 shrink-0 border-b border-sky-500/20 bg-gradient-to-b from-[#0a101c]/98 via-canvas/92 to-canvas/85 px-4 py-4 shadow-[0_1px_0_rgba(56,189,248,0.08)] backdrop-blur-xl sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-[min(100%,1920px)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-4">
        <div className="min-w-0" aria-hidden />
        <div className="flex min-w-0 flex-col items-center justify-center text-center">
          <h1 className="font-display text-base font-extrabold uppercase tracking-[0.2em] text-zinc-50 drop-shadow-[0_0_28px_rgba(56,189,248,0.12)] sm:text-xl sm:tracking-[0.24em] md:text-2xl md:tracking-[0.28em]">
            City Vibe Maps
          </h1>
          <p className="mt-1 max-w-sm text-[9px] font-medium uppercase leading-relaxed tracking-[0.18em] text-zinc-500 sm:text-[10px] sm:tracking-[0.22em]">
            Posters from real places
          </p>
        </div>
        <nav className="flex min-w-0 items-center justify-end gap-2" aria-label="Site links">
          <span className="hidden text-[11px] font-semibold text-zinc-600 xl:inline" title="Project docs in README">
            Docs
          </span>
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-200"
          >
            OSM
          </a>
        </nav>
      </div>
    </header>
  );
}
