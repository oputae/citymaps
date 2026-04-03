type Props = {
  exportDpi: number;
  onExportDpiChange: (dpi: number) => void;
};

export function SettingsPanel({ exportDpi, onExportDpiChange }: Props) {
  return (
    <div className="w-full max-w-md pb-28">
      <header className="mb-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          Studio <span className="text-gradient-brand">settings</span>
        </h2>
        <p className="mt-2 text-sm font-medium text-zinc-400">
          Print sizes use DPI below; digital presets ignore DPI and use fixed pixel dimensions.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-canvas-raised/50 p-5 ring-1 ring-sky-500/10">
        <div>
          <label htmlFor="export-dpi" className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            Print export DPI
          </label>
          <div className="flex items-center gap-4">
            <input
              id="export-dpi"
              type="range"
              min={150}
              max={600}
              step={50}
              value={exportDpi}
              onChange={(e) => onExportDpiChange(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-sky-400"
            />
            <span className="w-14 font-mono text-sm text-sky-200">{exportDpi}</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">300 is a good default for photo-lab prints.</p>
        </div>
      </div>
    </div>
  );
}
