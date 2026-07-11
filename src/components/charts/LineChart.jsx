import React from "react";

/**
 * LineChart — dependency-light, hand-rolled SVG line chart.
 *
 * Responsive: scales to its container width via a fixed viewBox + width:100%.
 * Themeable: all colors passed in. Supports multiple series on shared axes.
 *
 * @param {object[]} data - records, one per x-point, ascending.
 * @param {{key:string,label:string,color:string}[]} lines - series to plot.
 * @param {string} xKey - field on each record used for the x-axis label (a date).
 * @param {object} colors - theme colors (needs .text, .border, .textMuted?).
 * @param {(v:number)=>string} [formatValue] - y-value / point label formatter.
 * @param {(x:any)=>string} [formatX] - x-axis label formatter.
 */
export function LineChart({ data, lines, xKey = "date", colors, formatValue, formatX }) {
  const fmtV = formatValue || ((v) => String(Math.round(v)));
  const fmtX = formatX || ((x) => String(x));

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

  // Collect all numeric values across every plotted line to set the shared y-scale.
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
  if (min === max) { min = min - 1; max = max + 1; } // flat line → give it vertical room

  const xAt = (i) => (n <= 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW);
  const yAt = (v) => padT + plotH - ((v - min) / (max - min)) * plotH;

  const gridColor = colors?.border || "rgba(255,255,255,0.12)";
  const axisText = colors?.text || "#e8e8e8";

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

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
        role="img"
        aria-label="Progress line chart"
      >
        {/* horizontal grid lines (top / mid / bottom) + y labels */}
        {[max, (max + min) / 2, min].map((v, gi) => {
          const y = yAt(v);
          return (
            <g key={gi}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={gridColor} strokeWidth="0.5" strokeDasharray={gi === 2 ? "0" : "2 3"} />
              <text x={padL} y={y - 2} fontSize="8" fill={axisText} opacity="0.45">{fmtV(v)}</text>
            </g>
          );
        })}

        {/* each series: polyline + point dots (native <title> tooltip) */}
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
                return (
                  <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.5" fill={ln.color}>
                    <title>{`${fmtX(rec[xKey])} · ${ln.label}: ${fmtV(v)}`}</title>
                  </circle>
                );
              })}
            </g>
          );
        })}

        {/* x-axis labels: first + last (and middle if room) */}
        {n > 0 && (
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
    </div>
  );
}
