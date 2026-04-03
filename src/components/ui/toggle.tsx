type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  id: string;
  label: string;
};

export function Toggle({ checked, onChange, id, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${
          checked
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 shadow-glow-sm"
            : "bg-zinc-700 ring-1 ring-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "left-[calc(100%-1.625rem)] scale-100" : "left-0.5 scale-95"
          }`}
        />
      </button>
    </div>
  );
}
