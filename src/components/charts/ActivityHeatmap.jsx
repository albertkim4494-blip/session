import React, { useState } from "react";
import { activityLevel } from "../../lib/activityCalendar";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVEL_OPACITY = [0, 0.32, 0.55, 0.78, 1];

function longDate(dk) {
  const p = String(dk).split("-");
  if (p.length !== 3) return dk;
  return `${MONTHS[Number(p[1]) - 1]} ${Number(p[2])}, ${p[0]}`;
}

/**
 * ActivityHeatmap — GitHub-style consistency grid. Columns are weeks, rows are
 * days; cell shade encodes completed-set volume. Tap a cell to inspect the exact
 * day. Dependency-light SVG-free (plain divs).
 *
 * @param {Array<Array<{date:string,sets:number,inRange:boolean}>>} weeks
 * @param {object} colors - theme colors (.accent, .subtleTrack/.subtleBg, .text)
 */
export function ActivityHeatmap({ weeks, colors }) {
  const [sel, setSel] = useState(null);
  const track = colors?.subtleTrack || colors?.subtleBg || "rgba(255,255,255,0.08)";
  const CELL = 13;
  const GAP = 3;

  if (!weeks || weeks.length === 0) {
    return <div style={{ fontSize: 12, opacity: 0.55, padding: "6px 2px" }}>No sessions in this range yet.</div>;
  }

  const activeDays = weeks.reduce((n, wk) => n + wk.filter((c) => c.inRange && c.sets > 0).length, 0);

  // Month label per column when the column's first day changes month.
  let prevMonth = null;
  const monthLabels = weeks.map((wk) => {
    const m = Number(wk[0].date.split("-")[1]);
    if (m !== prevMonth) { prevMonth = m; return MONTHS[m - 1]; }
    return "";
  });

  return (
    <div>
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
          {/* month labels */}
          <div style={{ display: "flex", gap: GAP, height: 12 }}>
            {monthLabels.map((lbl, i) => (
              <div key={i} style={{ width: CELL, fontSize: 9, opacity: 0.5, whiteSpace: "nowrap", overflow: "visible" }}>{lbl}</div>
            ))}
          </div>
          {/* week columns */}
          <div style={{ display: "flex", gap: GAP }}>
            {weeks.map((wk, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {wk.map((cell) => {
                  const lvl = activityLevel(cell.sets);
                  const isSel = sel && sel.date === cell.date;
                  const bg = !cell.inRange ? "transparent" : lvl === 0 ? track : colors.accent;
                  return (
                    <div
                      key={cell.date}
                      onClick={cell.inRange ? () => setSel({ date: cell.date, sets: cell.sets }) : undefined}
                      title={cell.inRange ? `${longDate(cell.date)} · ${cell.sets} set${cell.sets === 1 ? "" : "s"}` : undefined}
                      style={{
                        width: CELL, height: CELL, borderRadius: 3,
                        background: bg,
                        opacity: !cell.inRange ? 0 : lvl === 0 ? 1 : LEVEL_OPACITY[lvl],
                        cursor: cell.inRange ? "pointer" : "default",
                        boxShadow: isSel ? `0 0 0 2px ${colors.text}` : "none",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* caption: selected day, else summary + legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8, minHeight: 16 }}>
        <span style={{ fontSize: 11.5, opacity: 0.7, fontWeight: sel ? 700 : 400 }}>
          {sel ? `${longDate(sel.date)} · ${sel.sets} set${sel.sets === 1 ? "" : "s"}` : `${activeDays} active day${activeDays === 1 ? "" : "s"} in range`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <span style={{ fontSize: 9, opacity: 0.45 }}>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span key={lvl} style={{ width: 10, height: 10, borderRadius: 2, background: lvl === 0 ? track : colors.accent, opacity: lvl === 0 ? 1 : LEVEL_OPACITY[lvl] }} />
          ))}
          <span style={{ fontSize: 9, opacity: 0.45 }}>More</span>
        </div>
      </div>
    </div>
  );
}
