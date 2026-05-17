import React from "react";
import { useDragReorder } from "../hooks/useDragReorder";
import { SPLIT_MODES } from "../lib/cadence";
import { DragGrip } from "./WorkoutsList";

/**
 * SplitsList — the body of the Splits section on the Plans tab.
 * Mirrors WorkoutsList: rows + dashed "+ Add split" button. In reorder mode
 * the chevron is replaced with a grip handle that drags the row.
 */
export function SplitsList({
  splits,
  reorderSplits,
  onOpenDetail,
  onCommitReorder,
  onAddSplit,
  colors,
}) {
  const drag = useDragReorder({
    itemCount: splits.length,
    onCommit: onCommitReorder,
    rowHeight: 68,
  });

  return (
    <div style={{
      padding: 12, paddingTop: 0,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {splits.map((s, si) => {
        const isContinuous = s.mode === SPLIT_MODES.CONTINUOUS;
        const memberCount = (s.members || []).length;
        const handleClick = reorderSplits ? undefined : () => onOpenDetail(s.id);

        return (
          <div
            key={s.id}
            ref={reorderSplits ? drag.setItemRef(si) : undefined}
            style={{
              width: "100%",
              ...(reorderSplits ? drag.itemStyle(si) : {}),
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
                cursor: reorderSplits ? "default" : "pointer",
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
                }}>{s.name}</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginTop: 3,
                  fontSize: 11.5, color: colors.textSecondary,
                  flexWrap: "wrap",
                }}>
                  <span>{memberCount} {memberCount === 1 ? "workout" : "workouts"}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 999,
                    background: colors.accentSoft,
                    color: colors.accent,
                    border: `1px solid ${colors.accentBorder}`,
                    marginLeft: 4,
                  }}>{isContinuous ? "Continuous" : "Weekly"}</span>
                </div>
              </div>
              {reorderSplits ? (
                <DragGrip {...drag.handleProps(si)} colors={colors} />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          </div>
        );
      })}

      {/* Add split — dashed button. Hidden during reorder. */}
      {!reorderSplits && (
        <button
          type="button"
          onClick={onAddSplit}
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
          Add split
        </button>
      )}
    </div>
  );
}
