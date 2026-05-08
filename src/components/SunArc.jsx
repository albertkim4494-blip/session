import React from "react";

const POSITIONS = {
  dawn: 0.05,
  morning: 0.28,
  afternoon: 0.5,
  evening: 0.78,
  night: 0.95,
};

/**
 * SunArc — time-of-day glyph. A dashed semicircle arc with a horizon line and
 * a sun disk that travels along the arc according to `time`.
 *
 * @param {string} time   — one of "dawn", "morning", "afternoon", "evening", "night"
 * @param {number} size   — overall width in px (height is 60% of width)
 * @param {string} color  — sun fill color (typically TIME_OF_DAY[time].sun)
 * @param {string} muted  — arc + horizon stroke color (typically theme.borderStrong)
 */
export function SunArc({ time = "morning", size = 56, color = "#fde68a", muted = "rgba(255,255,255,0.15)" }) {
  const t = POSITIONS[time] ?? 0.5;
  // Arc spans (10,50) → (90,50) with peak at (50,8); compute sun position along it.
  const angle = Math.PI * (1 - t);
  const cx = 50 - Math.cos(angle) * 40;
  const cy = 50 - Math.sin(angle) * 36;

  return (
    <svg
      viewBox="0 0 100 60"
      width={size}
      height={size * 0.6}
      style={{ overflow: "visible", display: "block", margin: "0 auto" }}
      aria-hidden="true"
    >
      <path
        d="M10,50 Q50,8 90,50"
        fill="none"
        stroke={muted}
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
      <line x1="6" y1="50" x2="94" y2="50" stroke={muted} strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r="11" fill={color} opacity="0.25" />
      <circle cx={cx} cy={cy} r="6" fill={color} />
    </svg>
  );
}
