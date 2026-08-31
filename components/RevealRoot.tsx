"use client";

import { useEffect, type ReactNode } from "react";

/** Adds `.is-visible` to every `.reveal` element on mount, driving the staggered fade-in in globals.css. */
export default function RevealRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return <>{children}</>;
}
