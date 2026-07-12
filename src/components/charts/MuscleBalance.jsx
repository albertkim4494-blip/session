import React from "react";

/**
 * MuscleBalance — horizontal bars of completed sets per muscle group, sorted so
 * imbalances (and untrained groups) are obvious at a glance. Dependency-light.
 *
 * @param {{group:string,label:string,sets:number}[]} data
 * @param {object} colors - theme colors (.accent, .text, .subtleTrack/.border)
 */
export function MuscleBalance({ data, colors }) {
  const rows = [...(data || [])].sort((a, b) => b.sets - a.sets);
  const max = rows.reduce((m, r) => Math.max(m, r.sets), 0);
  const track = colors?.subtleTrack || colors?.subtleBg || "rgba(255,255,255,0.08)";

  const total = rows.reduce((s, r) => s + r.sets, 0);
  if (total === 0) {
    return (
      <div style={{ fontSize: 12, opacity: 0.55, padding: "6px 2px", lineHeight: 1.5 }}>
        No strength sets logged in this range yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((r) => {
        const pct = max > 0 ? (r.sets / max) * 100 : 0;
        const empty = r.sets === 0;
        return (
          <div key={r.group} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 74, flexShrink: 0, fontSize: 12, fontWeight: 600, opacity: empty ? 0.4 : 0.85 }}>{r.label}</span>
            <div style={{ flex: 1, height: 14, borderRadius: 7, background: track, overflow: "hidden", position: "relative" }}>
              {!empty && (
                <div style={{ width: `${Math.max(pct, 3)}%`, height: "100%", borderRadius: 7, background: colors.accent, transition: "width 0.3s" }} />
              )}
            </div>
            <span style={{ width: 34, flexShrink: 0, textAlign: "right", fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", opacity: empty ? 0.35 : 1 }}>
              {r.sets % 1 === 0 ? r.sets : r.sets.toFixed(1)}
            </span>
          </div>
        );
      })}
      <div style={{ fontSize: 10.5, opacity: 0.4, marginTop: 2 }}>Estimated effective sets · secondary muscles count as ½</div>
    </div>
  );
}
