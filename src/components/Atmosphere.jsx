import React from "react";
import { TIME_OF_DAY } from "../styles/theme";

/**
 * Atmosphere — a soft radial wash that sits behind hero content. The gradient
 * is theme-specific (dark / light / japandi); other themes return null and we
 * skip rendering. Faded out at the bottom so it doesn't blend hard into the
 * card area below.
 *
 * Place inside a `position: relative` parent and put the foreground content
 * above with `zIndex: 1`. The wash is non-interactive (`pointer-events: none`).
 *
 * @param {string} themeKey  — one of the theme keys ("dark", "light", "japandi", ...)
 * @param {string} time      — time-of-day key ("dawn" / "morning" / "afternoon" / "evening" / "night")
 * @param {number} intensity — 0..1 multiplier on the gradient opacity
 */
export function Atmosphere({ themeKey, time, intensity = 1 }) {
  const period = TIME_OF_DAY[time];
  if (!period) return null;
  const gradient = period.gradient(themeKey);
  if (!gradient) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "70%",
        pointerEvents: "none",
        backgroundImage: gradient,
        opacity: intensity,
        zIndex: 0,
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
    />
  );
}
