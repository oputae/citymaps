import type { PosterThemeColors } from "@/lib/themes";

export type PosterChromeProps = {
  theme: PosterThemeColors;
  posterText: boolean;
  overlay: boolean;
  city: string;
  country: string;
  coords: string;
  credits: boolean;
  fontFamily: string;
};

/** Typography + grain overlay over the live map (export preview). */
export function PosterChrome({
  theme,
  posterText,
  overlay,
  city,
  country,
  coords,
  credits,
  fontFamily,
}: PosterChromeProps) {
  const title = (city || "City").toUpperCase();
  const subtitle = country || "";

  return (
    <>
      {overlay && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
      {posterText && (
        <div
          className="absolute inset-x-0 bottom-0 z-[2] px-5 pb-6 pt-16 text-center sm:px-7 sm:pb-8 sm:pt-20"
          style={{
            background: `linear-gradient(to top, ${theme.background} 0%, ${theme.background}e6 42%, transparent 100%)`,
            fontFamily,
          }}
        >
          <p
            className="text-[clamp(0.95rem,3.2vw,1.4rem)] font-medium tracking-[0.22em]"
            style={{ color: theme.title }}
          >
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.18em] sm:text-[10px]" style={{ color: theme.subtitle }}>
              {subtitle}
            </p>
          ) : null}
          <p className="mt-1 font-mono text-[9px] sm:text-[10px]" style={{ color: theme.coords }}>
            {coords}
          </p>
          {credits ? (
            <p className="mt-2 text-[7px] font-medium uppercase tracking-wider opacity-75 sm:mt-3 sm:text-[8px]" style={{ color: theme.coords }}>
              Map data © OpenStreetMap
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}
