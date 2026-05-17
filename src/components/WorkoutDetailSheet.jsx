import React, { useMemo, useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { getUnit } from "../lib/constants";
import { CADENCE_MODES } from "../lib/cadence";
import { DISPLAY_DAYS } from "./CadenceEditor";

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
  onBrowseCatalog,
  onMoveExercise,
  onShareWorkout,
  onDuplicateWorkout,
  onDeleteWorkout,
  reorderExercises,
  onToggleReorderExercises,
  styles,
  colors,
}) {
  const [nameDraft, setNameDraft] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (workout) setNameDraft(workout.name || "");
  }, [workout?.id, workout?.name]);

  if (!open || !workout) return null;

  const exercises = workout.exercises || [];
  const cadenceValue = splitForWorkout ? "Continuous" : cadenceLine(workout.cadence);
  const scheduleValue = splitForWorkout ? `In split: ${splitForWorkout.name}` : "Standalone";
  const categoryValue = (workout.category || "Workout").trim();

  const commitName = () => {
    const trimmed = (nameDraft || "").trim();
    if (!trimmed || trimmed === workout.name) {
      setNameDraft(workout.name || "");
      return;
    }
    onRenameWorkout(workout.id, trimmed);
  };

  // Custom header: Close left, Done right (both dismiss; Done commits inline name)
  const headerContent = (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 10 }}>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: colors.textSecondary,
          fontFamily: "inherit",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          padding: "6px 4px",
          minHeight: 44,
        }}
      >Close</button>
      <div style={{ flex: 1 }} />
      <button
        type="button"
        onClick={() => { commitName(); onClose(); }}
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          border: "none",
          background: colors.accent,
          color: colors.appBg,
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          minHeight: 36,
        }}
      >Done</button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      styles={styles}
      headerContent={headerContent}
      hideClose
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Workout name — inline editable */}
        <input
          ref={nameInputRef}
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commitName(); e.currentTarget.blur(); }
          }}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: colors.text,
            fontFamily: "inherit",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: -0.5,
            padding: "4px 0",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          <MetaChip label="Category" value={categoryValue} colors={colors}
            onClick={() => onOpenEditWorkout(workout.id)} />
          <MetaChip label="Schedule" value={scheduleValue} colors={colors} disabled />
          <MetaChip label="Cadence" value={cadenceValue} colors={colors}
            onClick={splitForWorkout ? undefined : () => onOpenEditWorkout(workout.id)}
            disabled={!!splitForWorkout} />
        </div>

        {/* Exercises section header */}
        <div style={{
          marginTop: 22,
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
            const isFirst = i === 0;
            const isLast = i === exercises.length - 1;
            const unitInfo = getUnit(ex.unit, ex);
            return (
              <button
                key={ex.id}
                type="button"
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
                  <div style={{ display: "flex", flexDirection: "row", flexShrink: 0 }}>
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={(e) => { e.stopPropagation(); onMoveExercise(workout.id, ex.id, -1); }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        opacity: isFirst ? 0.15 : 0.6,
                        padding: "4px 6px",
                        cursor: isFirst ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Move up"
                    >
                      <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={(e) => { e.stopPropagation(); onMoveExercise(workout.id, ex.id, 1); }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        opacity: isLast ? 0.15 : 0.6,
                        padding: "4px 6px",
                        cursor: isLast ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Move down"
                    >
                      <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                    </button>
                  </div>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
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

          {/* Browse catalog (secondary link below dashed button) */}
          {!reorderExercises && (
            <button
              type="button"
              onClick={() => onBrowseCatalog(workout.id)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "transparent",
                color: colors.textSecondary,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              Browse exercise catalog →
            </button>
          )}
        </div>

        {/* Bottom action row */}
        <div style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          gap: 8,
        }}>
          <ActionButton colors={colors} label="Share" onClick={() => onShareWorkout(workout.id, workout.name)}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>}
          />
          <ActionButton colors={colors} label="Duplicate" onClick={() => onDuplicateWorkout(workout.id)}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
          />
          <ActionButton colors={colors} label="Delete" danger onClick={() => onDeleteWorkout(workout.id)}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.dangerText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>}
          />
        </div>
      </div>
    </Modal>
  );
}
