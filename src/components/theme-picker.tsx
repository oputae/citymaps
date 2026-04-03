import type { MapTheme } from "@/lib/themes";

type Props = {
  themes: MapTheme[];
  selectedId: string;
  onSelect: (id: string) => void;
  narrow?: boolean;
};

export function ThemePicker({ themes, selectedId, onSelect, narrow }: Props) {
  const current = themes.find((t) => t.id === selectedId) ?? themes[0];

  return (
    <div className={`w-full ${narrow ? "max-w-full pb-12" : "max-w-2xl pb-28"}`}>
      <header
        className={`mb-6 flex items-start justify-between gap-4 ${narrow ? "flex-col" : ""}`}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-zinc-500">Vibes</p>
          <h2 className="font-display mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">
            {current?.name}
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">{current?.description}</p>
        </div>
        <button
          type="button"
          className="shrink-0 self-end rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-sky-400/35 hover:text-sky-200 hover:shadow-glow-sm sm:self-start"
          aria-label="Customize palette (coming soon)"
          title="Customize palette (coming soon)"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <ul className="flex flex-col gap-2.5" role="listbox" aria-label="Map themes">
        {themes.map((theme) => {
          const active = theme.id === selectedId;
          return (
            <li key={theme.id}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onSelect(theme.id)}
                className={`flex w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                  narrow ? "flex-col items-stretch" : "items-stretch gap-0"
                } ${
                  active
                    ? "card-studio-selected ring-0 sm:scale-[1.01]"
                    : "card-studio card-studio-hover border-white/[0.08] bg-canvas-raised/40"
                }`}
              >
                <span
                  className={`flex items-center px-3 py-2.5 text-[11px] font-extrabold uppercase leading-snug tracking-wide text-zinc-50 sm:px-4 sm:py-3.5 sm:text-[12px] ${
                    narrow ? "w-full border-b border-white/10" : "min-w-[120px] max-w-[40%] sm:min-w-[140px]"
                  }`}
                >
                  {theme.name}
                </span>
                <span className={`flex min-h-[44px] flex-1 sm:min-h-[52px] ${narrow ? "" : "border-l border-white/10"}`}>
                  {theme.swatches.map((hex) => (
                    <span
                      key={hex}
                      className="min-h-[44px] flex-1 transition-transform duration-300 hover:brightness-110 sm:min-h-[52px] md:min-h-[58px]"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
