type Row = { label: string; value: string };

type Props = {
  rows: Row[];
  className?: string;
};

export function SettingsSummary({ rows, className = "" }: Props) {
  return (
    <aside
      className={`rounded-2xl border border-sky-500/15 bg-canvas-raised/60 p-4 shadow-panel backdrop-blur-xl ${className}`}
      aria-label="Current settings summary"
    >
      <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-zinc-400">
        <span className="inline-block h-1.5 w-1.5 animate-shimmer rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
        At a glance
      </p>
      <dl className="space-y-2">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-2 transition-colors hover:border-sky-500/20"
          >
            <dt className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{label}</dt>
            <dd className="mt-0.5 text-xs font-semibold leading-snug text-zinc-100">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
