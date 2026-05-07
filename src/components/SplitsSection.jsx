import React, { useMemo } from "react";
import { SPLIT_MODES } from "../lib/cadence";
import { DISPLAY_DAYS } from "./CadenceEditor";

// Render anchor days like "Mon, Wed" using the same display order as the editor.
function formatDays(days) {
  if (!Array.isArray(days) || days.length === 0) return "";
  const labels = DISPLAY_DAYS.filter((d) => days.includes(d.value)).map((d) => {
    const long = d.full.slice(0, 3); // "Mon", "Tue", ...
    return long;
  });
  return labels.join(" · ");
}

/**
 * SplitsSection — collapsible card on the Plan tab listing all splits.
 * Members are rendered nested inside their parent split with a per-member
 * cadence summary. Each split header opens the editor; each member opens the
 * workout edit modal so users can adjust exercises directly.
 */
export function SplitsSection({
  splits,
  workouts,
  onCreateSplit,
  onEditSplit,
  onEditWorkout,
  styles,
  colors,
}) {
  const workoutById = useMemo(() => {
    const m = new Map();
    for (const w of workouts || []) m.set(w.id, w);
    return m;
  }, [workouts]);

  const hasAny = (splits || []).length > 0;

  return (
    <div className="card-hover" style={styles.card}>
      <div style={{ ...styles.cardHeader, marginBottom: hasAny ? 12 : 0 }}>
        <div style={styles.cardTitle}>Splits</div>
        <button
          className="btn-press"
          style={{
            ...styles.primaryBtn,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "6px 10px",
          }}
          onClick={onCreateSplit}
          title="Add split"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {!hasAny ? (
        <div style={{ textAlign: "center", padding: "12px 12px 4px", opacity: 0.5, fontSize: 13, lineHeight: 1.5 }}>
          Group workouts that run together — like a Push/Pull/Legs cycle or a sport-week routine.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {splits.map((s) => {
            const isContinuous = s.mode === SPLIT_MODES.CONTINUOUS;
            const memberCount = (s.members || []).length;
            const summary = isContinuous
              ? `Continuous · ${memberCount} in sequence`
              : `Weekly · ${memberCount} ${memberCount === 1 ? "workout" : "workouts"}`;

            return (
              <div
                key={s.id}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  background: colors.cardAltBg,
                  overflow: "hidden",
                }}
              >
                {/* Split header — tap to edit */}
                <button
                  type="button"
                  onClick={() => onEditSplit(s.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "10px 12px",
                    background: "transparent", border: "none", color: colors.text,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", gap: 2,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.55 }}>{summary}</div>
                </button>

                {/* Members */}
                {memberCount > 0 && (
                  <div style={{
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex", flexDirection: "column",
                  }}>
                    {(s.members || []).map((m, i) => {
                      const w = workoutById.get(m.workoutId);
                      const subtitle = isContinuous
                        ? `Day ${i + 1}`
                        : (Array.isArray(m.days) && m.days.length > 0 ? formatDays(m.days) : "Any day");
                      return (
                        <button
                          key={m.workoutId}
                          type="button"
                          onClick={() => w && onEditWorkout(w.id)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 12px",
                            border: "none",
                            borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
                            background: "transparent", color: colors.text,
                            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
                              {w?.name || "(deleted workout)"}
                            </div>
                            <div style={{ fontSize: 11, opacity: 0.55 }}>{subtitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
