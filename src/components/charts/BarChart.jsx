import React, { useRef, useState, useCallback } from "react";

/**
 * BarChart — dependency-light SVG bar chart with touch/mouse scrubbing.
 * Bars start at zero (honest magnitude for accumulated-per-bucket metrics like
 * weekly volume). Drag a finger (or hover) to highlight a bar and reveal a
 * floating tooltip with its label + value. Single series.
 *
 * @param {object[]} data - records, one per bar, ascending.
 * @param {string} valueKey - numeric field to plot.
 * @param {string} label - series label (shown in tooltip).
 * @param {string} color - bar color.
 * @param {string} xKey - field for the x-axis label.
 * @param {object} colors - theme colors.
 * @param {(v:number)=>string} [formatValue]
 * @param {(x:any)=>string} [formatX]
 * @param {(x:any)=>string} [formatXLong] - tooltip date format (defaults to formatX).
 */
export function BarChart({ data, valueKey, label, color, xKey = "date", colors, formatValue, formatX, formatXLong }) {
  const fmtV = formatValue || ((v) => String(Math.round(v)));
  const fmtX = formatX || ((x) => String(x));
  const fmtXLong = formatXLong || fmtX;

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
  const [active, setActive] = useState(null);

  let max = 0;
  for (const rec of data || []) {
    const v = Number(rec[valueKey]);
    if (Number.isFinite(v) && v > max) max = v;
  }
  if (max <= 0) max = 1;

  const slot = n > 0 ? plotW / n : plotW;
  const barW = Math.max(2, slot * 0.68);
  const centerAt = (i) => padL + (i + 0.5) * slot;
  const barH = (v) => (Math.max(0, v) / max) * plotH;

  const indexFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el || n === 0) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return null;
    const f = (clientX - rect.left) / rect.width;
    const plotStart = padL / W;
    const plotSpan = (W - padL - padR) / W;
    let pf = (f - plotStart) / plotSpan;
    pf = Math.max(0, Math.min(0.999, pf));
    return Math.min(n - 1, Math.floor(pf * n));
  }, [n]);

  const onDown = (e) => setActive(indexFromClientX(e.clientX));
  const onMove = (e) => {
    if (e.pointerType === "mouse" || e.pressure > 0 || e.buttons > 0) setActive(indexFromClientX(e.clientX));
  };
  const onLeave = () => setActive(null);
  const onUp = (e) => { if (e.pointerType !== "mouse") setActive(null); };

  const activeRec = active != null && data ? data[active] : null;
  const tipPct = active != null ? Math.max(14, Math.min(86, (centerAt(active) / W) * 100)) : 50;
  const gridColor = colors?.border || "rgba(255,255,255,0.12)";
  const axisText = colors?.text || "#e8e8e8";

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 3, borderRadius: 2, background: color, display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>{label}</span>
        </div>
      </div>

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
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }} role="img" aria-label="Volume bar chart">
          {/* grid + y labels (0 / mid / max) */}
          {[max, max / 2, 0].map((v, gi) => {
            const y = padT + plotH - (v / max) * plotH;
            return (
              <g key={gi}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={gridColor} strokeWidth="0.5" strokeDasharray={gi === 2 ? "0" : "2 3"} />
                <text x={padL} y={y - 2} fontSize="8" fill={axisText} opacity="0.45">{fmtV(v)}</text>
              </g>
            );
          })}

          {/* bars */}
          {(data || []).map((rec, i) => {
            const v = Number(rec[valueKey]) || 0;
            const h = barH(v);
            const x = centerAt(i) - barW / 2;
            const y = padT + plotH - h;
            const dim = active != null && active !== i;
            return (
              <rect
                key={i}
                x={x} y={y} width={barW} height={h}
                rx={Math.min(2, barW / 2)}
                fill={color}
                opacity={v === 0 ? 0 : dim ? 0.45 : active === i ? 1 : 0.82}
              />
            );
          })}

          {n > 0 && active == null && (
            <>
              <text x={padL} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="start">{fmtX(data[0][xKey])}</text>
              {n > 2 && <text x={padL + plotW / 2} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="middle">{fmtX(data[Math.floor(n / 2)][xKey])}</text>}
              {n > 1 && <text x={W - padR} y={H - 6} fontSize="8" fill={axisText} opacity="0.5" textAnchor="end">{fmtX(data[n - 1][xKey])}</text>}
            </>
          )}
        </svg>

        {activeRec && (
          <div style={{
            position: "absolute", top: 0, left: `${tipPct}%`, transform: "translateX(-50%)",
            pointerEvents: "none", background: colors?.appBg || "#111", border: `1px solid ${gridColor}`,
            borderRadius: 8, padding: "6px 9px", boxShadow: "0 4px 14px rgba(0,0,0,0.25)", whiteSpace: "nowrap", zIndex: 2,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, opacity: 0.85 }}>{fmtXLong(activeRec[xKey])}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ opacity: 0.65 }}>{label}</span>
              <span style={{ fontWeight: 700, marginLeft: "auto" }}>{fmtV(Number(activeRec[valueKey]) || 0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
