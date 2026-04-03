import { POSTER_FONT_OPTIONS } from "@/lib/poster-fonts";
import { Toggle } from "./ui/toggle";

export type StylePanelState = {
  posterText: boolean;
  overlay: boolean;
  city: string;
  country: string;
  fontId: string;
  credits: boolean;
};

type Props = {
  value: StylePanelState;
  onChange: (next: StylePanelState) => void;
};

export function StylePanel({ value, onChange }: Props) {
  const patch = (partial: Partial<StylePanelState>) => onChange({ ...value, ...partial });

  return (
    <div className="w-full max-w-md pb-28">
      <header className="mb-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          Type <span className="text-gradient-brand">&amp;</span> chrome
        </h2>
        <p className="mt-2 text-sm font-medium text-zinc-400">
          Words, grain, and the little things that make a poster feel alive.
        </p>
      </header>

      <div className="space-y-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-canvas-raised/80 to-sky-950/20 p-5 shadow-inner shadow-sky-500/5 ring-1 ring-sky-500/10">
        <Toggle
          id="poster-text"
          label="Poster text"
          checked={value.posterText}
          onChange={(posterText) => patch({ posterText })}
        />
        <Toggle id="overlay" label="Overlay layer" checked={value.overlay} onChange={(overlay) => patch({ overlay })} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="display-city" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-500">
              Display city
            </label>
            <input
              id="display-city"
              type="text"
              value={value.city}
              onChange={(e) => patch({ city: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:border-sky-400/40 focus:ring-2 focus:ring-cyan-400/15"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="display-country" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-500">
              Display country
            </label>
            <input
              id="display-country"
              type="text"
              value={value.country}
              onChange={(e) => patch({ country: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-600 focus:border-sky-400/40 focus:ring-2 focus:ring-cyan-400/15"
              placeholder="Country or region"
            />
          </div>
        </div>

        <div>
          <label htmlFor="poster-font" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            Font
          </label>
          <div className="relative">
            <select
              id="poster-font"
              value={value.fontId}
              onChange={(e) => patch({ fontId: e.target.value })}
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/20 py-2.5 pl-3 pr-10 text-sm text-zinc-100 outline-none transition-[border-color,box-shadow] focus:border-sky-400/40 focus:ring-2 focus:ring-cyan-400/15"
            >
              {POSTER_FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden>
              ▾
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <Toggle
            id="include-credits"
            label="Include credits"
            checked={value.credits}
            onChange={(credits) => patch({ credits })}
          />
          <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">
            Shout-out to the mappers — keeps credits on the art where they belong.
          </p>
        </div>
      </div>
    </div>
  );
}
