import React, { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { getUnit } from "../lib/constants";
import { CADENCE_MODES } from "../lib/cadence";
import { DISPLAY_DAYS } from "./CadenceEditor";
import { useSwipe } from "../hooks/useSwipe";
import { useDragReorder } from "../hooks/useDragReorder";
import { DragGrip } from "./WorkoutsList";

function cadenceLine(cadence) {
  const c = cadence || { mode: CADENCE_MODES.WHENEVER };
  if (c.mode === CADENCE_MODES.CONTINUOUS) return "Continuous";
  if (c.mode === CADENCE_MODES.WEEKLY) return `${c.perWeek || 1}×/wk`;
  if (c.mode === CADENCE_MODES.ANCHOR) {
    if (!Array.isArray(c.days) || c.days.length === 0) return "Anchor (no days)";
    return DISPLAY_DAYS.filter((d) => c.days.includes(d.value))
      .map((d) => d.full.slice(0, 3))
      .join(" · ");
  }
  return "Whenever";
}

function MetaChip({ label, value, onClick, colors, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        background: colors.subtleBg,
        border: `1px solid ${colors.border}`,
        cursor: disabled ? "default" : "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        color: colors.text,
        minHeight: 44,
        opacity: disabled ? 0.85 : 1,
      }}
    >
      <div style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: colors.textTertiary,
      }}>{label}</div>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: colors.text,
        marginTop: 2,
      }}>{value}</div>
    </button>
  );
}

function ActionButton({ icon, label, onClick, danger, colors }) {
  const fg = danger ? colors.dangerText : colors.text;
  const border = danger ? colors.dangerBorder : colors.border;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 8px",
        borderRadius: 12,
        background: colors.subtleBg,
        border: `1px solid ${border}`,
        color: fg,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: 700,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minHeight: 56,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function WorkoutDetailSheet({
  open,
  workout,
  splitForWorkout,
  onClose,
  onRenameWorkout,
  onOpenEditWorkout,
  onOpenEditExercise,
  onAddExercise,
  onMoveExercise,
  onReorderExercisesByIndex,
  onShareWorkout,
  onDeleteWorkout,
  reorderExercises,
  onToggleReorderExercises,
  onPrevWorkout,
  onNextWorkout,
  hasPrev,
  hasNext,
  styles,
  colors,
}) {
  // Direction of the last nav swipe — drives slide-in animation on the body content.
  const [navDir, setNavDir] = useState(null); // "left" (next) | "right" (prev) | null

  // Swipe left = next, swipe right = prev. Mirrors the log-modal card-swipe.
  const goPrev = () => {
    if (!hasPrev) return;
    setNavDir("right");
    onPrevWorkout?.();
  };
  const goNext = () => {
    if (!hasNext) return;
    setNavDir("left");
    onNextWorkout?.();
  };
  const swipe = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    thresholdPx: 60,
  });

  // Drag-to-reorder for exercises. Must be called before any early return.
  const exercises = workout?.exercises || [];
  const workoutId = workout?.id;
  const exerciseDrag = useDragReorder({
    itemCount: exercises.length,
    onCommit: (from, to) => workoutId && onReorderExercisesByIndex?.(workoutId, from, to),
    rowHeight: 64,
  });

  if (!open || !workout) return null;
  const cadenceValue = splitForWorkout ? "Continuous" : cadenceLine(workout.cadence);
  const categoryValue = (workout.category || "Workout").trim();

  // Lower overlay z-index so sub-modals (CatalogBrowse, EditExercise) layer on top.
  const sheetStyles = useMemo(() => ({
    ...styles,
    modalOverlay: { ...styles.modalOverlay, zIndex: 45 },
  }), [styles]);

  // Footer (frozen at sheet bottom by Modal).
  const footer = (
    <div style={{
      display: "flex",
      gap: 8,
      paddingTop: 6,
      borderTop: `1px solid ${colors.border}`,
    }}>
      <ActionButton colors={colors} label="Share" onClick={() => onShareWorkout(workout.id, workout.name)}
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>}
      />
      <ActionButton colors={colors} label="Delete" danger onClick={() => onDeleteWorkout(workout.id)}
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.dangerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      title={workout.name}
      onClose={onClose}
      styles={sheetStyles}
      footer={footer}
      headerActions={
        <button
          type="button"
          onClick={() => onOpenEditWorkout(workout.id)}
          aria-label="Edit workout name, category and schedule"
          title="Edit workout"
          style={sheetStyles.iconBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      }
    >
      {/* Swipe wrapper — keyed by workout.id so the slide animation replays on nav.
          Sits as a single flex child of modalBody and re-establishes the flex
          column layout for the frozen header + scrollable exercises area. */}
      <div
        key={workout.id}
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          animation: navDir
            ? `${navDir === "left" ? "workoutSheetSlideInRight" : "workoutSheetSlideInLeft"} 0.22s cubic-bezier(.2,.8,.3,1)`
            : undefined,
        }}
      >
      {/* FROZEN HEADER BLOCK — meta chips (name lives in the modal title bar) */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <MetaChip label="Category" value={categoryValue} colors={colors} disabled />
          <MetaChip label="Schedule" value={cadenceValue} colors={colors} disabled />
        </div>
      </div>

      {/* SCROLLABLE EXERCISES AREA */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        marginTop: 22,
        marginLeft: -4,
        marginRight: -4,
        paddingLeft: 4,
        paddingRight: 4,
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}>
        {/* Exercises section header */}
        <div style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: colors.textTertiary,
          }}>
            Exercises · {exercises.length}
          </div>
          {exercises.length > 1 && (
            <button
              type="button"
              onClick={onToggleReorderExercises}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: reorderExercises ? colors.accentSoft : "transparent",
                border: `1px solid ${reorderExercises ? colors.accentBorder : colors.border}`,
                color: reorderExercises ? colors.accent : colors.textSecondary,
                fontFamily: "inherit",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.3,
                cursor: "pointer",
                minHeight: 32,
              }}
            >{reorderExercises ? "Done" : "Reorder"}</button>
          )}
        </div>

        {/* Exercise rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {exercises.length === 0 && (
            <div style={{
              padding: "20px 14px",
              borderRadius: 14,
              border: `1px dashed ${colors.border}`,
              background: colors.cardAltBg,
              textAlign: "center",
              color: colors.textSecondary,
              fontSize: 13,
            }}>
              No exercises yet. Tap below to add one.
            </div>
          )}
          {exercises.map((ex, i) => {
            const unitInfo = getUnit(ex.unit, ex);
            return (
              <div
                key={ex.id}
                ref={reorderExercises ? exerciseDrag.setItemRef(i) : undefined}
                style={{
                  width: "100%",
                  ...(reorderExercises ? exerciseDrag.itemStyle(i) : {}),
                }}
              >
                <div
                  onClick={reorderExercises ? undefined : () => onOpenEditExercise(workout.id, ex.id)}
                  style={{
                    width: "100%",
                    minHeight: 56,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: colors.cardAltBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    cursor: reorderExercises ? "default" : "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: colors.subtleBg,
                    fontSize: 11,
                    fontWeight: 800,
                    color: colors.textSecondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: colors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>{ex.name}</div>
                    <div style={{
                      fontSize: 11.5,
                      color: colors.textSecondary,
                      marginTop: 2,
                    }}>{unitInfo.label} ({unitInfo.abbr})</div>
                  </div>
                  {reorderExercises ? (
                    <DragGrip {...exerciseDrag.handleProps(i)} colors={colors} />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add exercise (dashed) */}
          {!reorderExercises && (
            <button
              type="button"
              onClick={() => onAddExercise(workout.id)}
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: 14,
                background: "transparent",
                color: colors.accent,
                border: `1.5px dashed ${colors.accentBorder}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 2,
                minHeight: 48,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add exercise
            </button>
          )}

        </div>
      </div>
      </div>
    </Modal>
  );
}
