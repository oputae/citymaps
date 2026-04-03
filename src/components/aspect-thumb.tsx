/**
 * Small frame-within-frame graphic hinting at aspect ratio.
 */
export function AspectThumb({ ratio }: { ratio: number }) {
  const max = 36;
  let w: number;
  let h: number;
  if (ratio >= 1) {
    w = max;
    h = max / ratio;
  } else {
    h = max;
    w = max * ratio;
  }

  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-sky-500/5 shadow-inner"
      aria-hidden
    >
      <div
        className="rounded-md bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-500 shadow-sm ring-1 ring-white/25"
        style={{ width: w, height: h }}
      />
    </div>
  );
}
