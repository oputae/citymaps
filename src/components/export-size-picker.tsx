import type { ExportCategoryId, ExportPreset } from "@/lib/export-presets";
import {
  EXPORT_CATEGORY_LABELS,
  EXPORT_PRESETS,
  formatPresetDimensions,
  presetAspectRatio,
} from "@/lib/export-presets";
import { AspectThumb } from "./aspect-thumb";

const ORDER: ExportCategoryId[] = ["print", "social", "wallpaper", "web"];

function groupByCategory(presets: ExportPreset[]): Map<ExportCategoryId, ExportPreset[]> {
  const map = new Map<ExportCategoryId, ExportPreset[]>();
  for (const id of ORDER) map.set(id, []);
  for (const p of presets) {
    map.get(p.category)!.push(p);
  }
  return map;
}

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  /** Right-rail mode: single column + clipped text (viewport `lg` still breaks nested grids). */
  narrow?: boolean;
};

export function ExportSizePicker({ selectedId, onSelect, narrow }: Props) {
  const groups = groupByCategory(EXPORT_PRESETS);

  return (
    <div className={`w-full ${narrow ? "max-w-full pb-12" : "max-w-4xl pb-28"}`}>
      <header className="mb-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          Output <span className="text-gradient-brand">size</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm font-medium text-zinc-400">
          Prints, feeds, wallpapers, banners — pick a canvas and run with it.
        </p>
      </header>

      <div className="space-y-10">
        {ORDER.map((cat) => {
          const list = groups.get(cat)!;
          if (list.length === 0) return null;
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h3
                id={`cat-${cat}`}
                className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-zinc-400"
              >
                <span className="h-px w-6 bg-gradient-to-r from-sky-400 to-cyan-300" aria-hidden />
                {EXPORT_CATEGORY_LABELS[cat]}
              </h3>
              <ul
                className={
                  narrow
                    ? "grid grid-cols-1 gap-2.5"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                }
              >
                {list.map((preset) => {
                  const selected = preset.id === selectedId;
                  const ratio = presetAspectRatio(preset);
                  return (
                    <li key={preset.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelect(preset.id)}
                        className={`card-studio card-studio-hover w-full overflow-hidden text-left ${
                          narrow
                            ? "flex flex-col items-stretch gap-2 px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3"
                            : "flex min-h-[4.25rem] items-center gap-4 px-4 py-3"
                        } ${selected ? "card-studio-selected" : ""}`}
                      >
                        <div className={narrow ? "flex shrink-0 justify-center sm:justify-start" : ""}>
                          <AspectThumb ratio={ratio} />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="text-balance break-words text-[12px] font-extrabold uppercase leading-snug tracking-wide text-zinc-50 sm:text-[13px]">
                            {preset.name}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500 sm:text-[11px]">
                            {formatPresetDimensions(preset)}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
