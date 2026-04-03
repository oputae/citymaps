import {
  IconLayers,
  IconLayout,
  IconPalette,
  IconPin,
  IconSettings,
  IconSliders,
} from "./icons";

const items = [
  { id: "location", label: "Location", Icon: IconPin },
  { id: "theme", label: "Theme", Icon: IconPalette },
  { id: "layout", label: "Layout", Icon: IconLayout },
  { id: "style", label: "Style", Icon: IconSliders },
  { id: "layers", label: "Layers", Icon: IconLayers },
] as const;

type SidebarProps = {
  activeId: string;
  onSelect?: (id: string) => void;
  onSettingsClick?: () => void;
};

export function Sidebar({ activeId, onSelect, onSettingsClick }: SidebarProps) {
  return (
    <nav
      className="relative z-[11] flex w-[76px] shrink-0 flex-col items-center border-r border-white/[0.06] bg-canvas-raised/45 py-6 backdrop-blur-xl"
      aria-label="Editor sections"
    >
      <div className="mb-8 hidden text-[9px] font-extrabold uppercase tracking-[0.28em] text-gradient-brand sm:block">
        Studio
      </div>
      <ul className="flex flex-1 flex-col gap-1.5">
        {items.map(({ id, label, Icon }) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect?.(id)}
                className={`group flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-b from-sky-500/25 via-cyan-500/10 to-transparent text-white shadow-glow-sm ring-1 ring-sky-400/40"
                    : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200 hover:ring-1 hover:ring-white/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}
                />
                <span className="max-w-[68px] text-center text-[9px] font-bold uppercase leading-tight tracking-wide">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => onSettingsClick?.()}
        className={`mt-auto flex flex-col items-center gap-1 rounded-2xl px-2 py-3 transition-all ${
          activeId === "settings"
            ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/40"
            : "text-zinc-500 hover:bg-white/[0.06] hover:text-sky-200/90 hover:ring-1 hover:ring-sky-400/25"
        }`}
        aria-label="Settings"
      >
        <IconSettings className="h-5 w-5" />
        <span className="text-[9px] font-bold uppercase tracking-wide">Settings</span>
      </button>
    </nav>
  );
}
