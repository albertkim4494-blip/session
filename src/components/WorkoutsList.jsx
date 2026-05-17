import React from "react";
import { useDragReorder } from "../hooks/useDragReorder";
import { CADENCE_MODES } from "../lib/cadence";
import { getDisplayDays } from "./CadenceEditor";

/**
 * WorkoutsList — the body of the Workouts section on the Plans tab.
 * Renders rows + the dashed "+ Add workout" button. In reorder mode the
 * chevron is replaced with a grip handle that drags the row.
 */
export function WorkoutsList({
  workouts,
  reorderWorkouts,
  onOpenDetail,
  onCommitReorder,
  onAddWorkout,
  colors,
  weekStartsOn = 1,
}) {
  const displayDays = getDisplayDays(weekStartsOn);
  const drag = useDragReorder({
    itemCount: workouts.length,
    onCommit: onCommitReorder,
    rowHeight: 68,
  });

  return (
    <div style={{
      padding: 12, paddingTop: 0,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {workouts.map((w, wi) => {
        const exCount = (w.exercises || []).length;
        const cadLabel = (() => {
          const c = w.cadence || { mode: CADENCE_MODES.WHENEVER };
          if (c.mode === CADENCE_MODES.CONTINUOUS) return "Continuous";
          if (c.mode === CADENCE_MODES.ANCHOR) {
            if (!Array.isArray(c.days) || c.days.length === 0) return null;
            return displayDays.filter((d) => c.days.includes(d.value))
              .map((d) => d.full.slice(0, 3)).join(" · ");
          }
          // Legacy weekly — kept rendering until the user edits the schedule.
          if (c.mode === CADENCE_MODES.WEEKLY) return `${c.perWeek || 1}×/wk`;
          return null;
        })();

        const handleClick = reorderWorkouts ? undefined : () => onOpenDetail(w.id);

        return (
          <div
            key={w.id}
            ref={reorderWorkouts ? drag.setItemRef(wi) : undefined}
            style={{
              width: "100%",
              ...(reorderWorkouts ? drag.itemStyle(wi) : {}),
            }}
          >
            <div
              onClick={handleClick}
              style={{
                width: "100%", minHeight: 60,
                padding: "12px 14px",
                borderRadius: 14,
                background: colors.cardAltBg,
                border: `1px solid ${colors.border}`,
                cursor: reorderWorkouts ? "default" : "pointer",
                textAlign: "left", fontFamily: "inherit",
                color: colors.text,
                display: "flex", alignItems: "center", gap: 12,
                boxSizing: "border-box",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14.5, fontWeight: 700,
                  color: colors.text, letterSpacing: -0.1,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{w.name}</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginTop: 3,
                  fontSize: 11.5, color: colors.textSecondary,
                  flexWrap: "wrap",
                }}>
                  <span>{exCount} {exCount === 1 ? "exercise" : "exercises"}</span>
                  {w.category && (
                    <span style={{ color: colors.textTertiary }}>· {(w.category || "").trim()}</span>
                  )}
                  {cadLabel && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 999,
                      background: colors.subtleBg,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.border}`,
                      marginLeft: 4,
                    }}>{cadLabel}</span>
                  )}
                </div>
              </div>
              {reorderWorkouts ? (
                <DragGrip {...drag.handleProps(wi)} colors={colors} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          </div>
        );
      })}

      {/* Add workout — dashed button. Hidden during reorder. */}
      {!reorderWorkouts && (
        <button
          type="button"
          onClick={onAddWorkout}
          style={{
            width: "100%",
            padding: "13px 14px",
            borderRadius: 14,
            background: "transparent",
            color: colors.accent,
            border: `1.5px dashed ${colors.accentBorder}`,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            minHeight: 48,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add workout
        </button>
      )}
    </div>
  );
}

/** Three-horizontal-lines drag handle. Spread {...drag.handleProps(idx)} onto it. */
export function DragGrip({ colors, style, ...handlers }) {
  return (
    <div
      {...handlers}
      title="Drag to reorder"
      aria-label="Drag to reorder"
      style={{
        flexShrink: 0,
        padding: "8px 10px",
        margin: "-8px -10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: colors.textSecondary,
        ...style,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </div>
  );
}
