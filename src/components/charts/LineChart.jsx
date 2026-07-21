import React, { useRef, useState, useCallback } from "react";

/**
 * LineChart — dependency-light, hand-rolled SVG line chart with touch/mouse
 * scrubbing.
 *
 * Responsive: scales to its container width via a fixed viewBox + width:100%.
 * Themeable: all colors passed in. Supports multiple series on shared axes.
 * Interactive: drag a finger (or hover) across the chart to reveal a crosshair
 * and a floating tooltip with the exact date and every series value at that point.
 *
 * @param {object[]} data - records, one per x-point, ascending.
 * @param {{key:string,label:string,color:string}[]} lines - series to plot.
 * @param {string} xKey - field on each record used for the x-axis label (a date).
 * @param {object} colors - theme colors (needs .text, .border; .appBg for tooltip).
 * @param {(v:number)=>string} [formatValue] - y-value / point label formatter.
 * @param {(x:any)=>string} [formatX] - x-axis label formatter.
 */
export function LineChart({ data, lines, xKey = "date", colors, formatValue, formatX, formatXLong }) {
  const fmtV = formatValue || ((v) => String(Math.round(v)));
  const fmtX = formatX || ((x) => String(x));
  const fmtXLong = formatXLong || fmtX;

  // viewBox coordinate space (scales to container). Padding leaves room for labels.
  const W = 320;
  const H = 180;
  const padL = 8;
  const padR = 10;
  const padT = 14;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const n = data?.length || 0;

  const containerRef = useRef(null);
  const [active, setActive] = useState(null); // active data index while scrubbing

  // Shared y-scale across every plotted line.
  let min = Infinity;
  let max = -Infinity;
  for (const rec of data || []) {
    for (const ln of lines) {
      const v = Number(rec[ln.key]);
      if (Number.isFinite(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) { min = 0; max = 1; }
  if (min === max) { min = min - 1; max = max + 1; }

  const xAt = (i) => (n <= 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW);
  const yAt = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;

  const gridColor = colors?.border || "rgba(255,255,255,0.12)";
  const axisText = colors?.text || "#e8e8e8";

  // Map a pointer's clientX to the nearest data index.
  const indexFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el || n === 0) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return null;
    const f = (clientX - rect.left) / rect.width;       // 0..1 across container
    const plotStart = padL / W;
    const plotSpan = (W - padL - padR) / W;
    let pf = (f - plotStart) / plotSpan;                 // 0..1 across plot area
    pf = Math.max(0, Math.min(1, pf));
    return n <= 1 ? 0 : Math.round(pf * (n - 1));
  }, [n]);

  const onDown = (e) => setActive(indexFromClientX(e.clientX));
  const onMove = (e) => {
    // Mouse: track on hover. Touch: only while a finger is down (buttons/pressure).
    if (e.pointerType === "mouse" || e.pressure > 0 || e.buttons > 0) {
      setActive(indexFromClientX(e.clientX));
    }
  };
  const onLeave = () => setActive(null);
  const onUp = (e) => { if (e.pointerType !== "mouse") setActive(null); };

  const activeRec = active != null && data ? data[active] : null;
  // Tooltip horizontal position as a % of container width, clamped away from edges.
  const tipPct = active != null ? Math.max(14, Math.min(86, (xAt(active) / W) * 100)) : 50;

  return (
    <div style={{ width: "100%" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
        {lines.map((ln) => (
          <div key={ln.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 3, borderRadius: 2, background: ln.color, display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>{ln.label}</span>
          </div>
        ))}
      </div>

      {/* Interactive area: position:relative so the HTML tooltip can overlay the SVG.
          touchAction pan-y lets vertical page scroll through while we own horizontal drags. */}
      <div
        ref={containerRef}
        data-owns-horizontal-gesture
        style={{ width: "100%", position: "relative", touchAction: "pan-y", cursor: "crosshair" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onLeave}
        onPointerLeave={onLeave}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
          role="img"
          aria-label="Progress line chart"
        >
          {/* horizontal grid lines + y labels */}
          {[max, (max + min) / 2, min].map((v, gi) => {
            const y = yAt(v);
            return (
              <g key={gi}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={gridColor} strokeWidth="0.5" strokeDasharray={gi === 2 ? "0" : "2 3"} />
                <text x={padL} y={y - 2} fontSize="8" fill={axisText} opacity="0.45">{fmtV(v)}</text>
              </g>
            );
          })}

          {/* crosshair at the active index */}
          {active != null && (
            <line x1={xAt(active)} y1={padT} x2={xAt(active)} y2={padT + plotH} stroke={axisText} strokeWidth="0.7" opacity="0.35" strokeDasharray="2 2" />
          )}

          {/* each series: polyline + point dots */}
          {lines.map((ln) => {
            const pts = (data || [])
              .map((rec, i) => {
                const v = Number(rec[ln.key]);
                return Number.isFinite(v) ? `${xAt(i)},${yAt(v)}` : null;
              })
              .filter(Boolean)
              .join(" ");
            return (
              <g key={ln.key}>
                <polyline points={pts} fill="none" stroke={ln.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {(data || []).map((rec, i) => {
                  const v = Number(rec[ln.key]);
                  if (!Number.isFinite(v)) return null;
                  const isActive = i === active;
                  return <circle key={i} cx={xAt(i)} cy={yAt(v)} r={isActive ? 4 : 2.2} fill={ln.color} stroke={isActive ? (colors?.appBg || "#000") : "none"} strokeWidth={isActive ? 1.2 : 0} />;
                })}
              </g>
            );
          })}

          {/* static x-axis labels: first / middle / last (hidden while scrubbing to avoid clutter) */}
          {n > 0 && active == null && (
            <>
              <text x={padL} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="start">{fmtX(data[0][xKey])}</text>
              {n > 2 && (
                <text x={padL + plotW / 2} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="middle">
                  {fmtX(data[Math.floor(n / 2)][xKey])}
                </text>
              )}
              {n > 1 && (
                <text x={W - padR} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="end">{fmtX(data[n - 1][xKey])}</text>
              )}
            </>
          )}
        </svg>

        {/* Floating tooltip while scrubbing */}
        {activeRec && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${tipPct}%`,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              background: colors?.appBg || "#111",
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
              padding: "6px 9px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, opacity: 0.85 }}>{fmtXLong(activeRec[xKey])}</div>
            {lines.map((ln) => {
              const v = Number(activeRec[ln.key]);
              return (
                <div key={ln.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: ln.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ opacity: 0.65 }}>{ln.label}</span>
                  <span style={{ fontWeight: 700, marginLeft: "auto" }}>{Number.isFinite(v) ? fmtV(v) : "—"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
