"use client";

import { useLayoutEffect, useState } from "react";

const QUERY = "(min-width: 1280px)";

/** xl matches Tailwind `xl:` — sidebar + two-column studio layout. */
export function useIsXl(): boolean {
  const [xl, setXl] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setXl(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return xl;
}
