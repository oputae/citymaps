import type { LayerToggles } from "@/lib/map-layers";
import { Toggle } from "./ui/toggle";

type Props = {
  value: LayerToggles;
  onChange: (next: LayerToggles) => void;
};

export function LayersPanel({ value, onChange }: Props) {
  const patch = (partial: Partial<LayerToggles>) => onChange({ ...value, ...partial });

  return (
    <div className="w-full max-w-md pb-28">
      <header className="mb-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          Map <span className="text-gradient-brand">layers</span>
        </h2>
        <p className="mt-2 text-sm font-medium text-zinc-400">
          Best-effort toggles for the vector style — depends on layer IDs in the current style.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-canvas-raised/50 p-5 ring-1 ring-sky-500/10">
        <Toggle id="layer-roads" label="Roads & transit" checked={value.roads} onChange={(roads) => patch({ roads })} />
        <Toggle id="layer-water" label="Water" checked={value.water} onChange={(water) => patch({ water })} />
        <Toggle id="layer-labels" label="Labels & places" checked={value.labels} onChange={(labels) => patch({ labels })} />
      </div>
    </div>
  );
}
