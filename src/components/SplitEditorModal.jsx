import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "./Modal";
import { SPLIT_MODES } from "../lib/cadence";
import { DayChips } from "./CadenceEditor";
import { useDragReorder } from "../hooks/useDragReorder";
import { DragGrip } from "./WorkoutsList";

function ModeButton({ active, onClick, children, colors }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accentBg : "transparent",
        color: active ? colors.accent : colors.text,
        fontSize: 13, fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/**
 * SplitEditorModal — name, mode, rest pattern, and (staged) member workouts.
 * Members are buffered in modal state and persisted on Save. Mirrors the
 * Cancel/Save flow of the EditWorkout modal.
 */
export function SplitEditorModal({
  open, modalState, onUpdate, onClose, onSave, workouts, splits, styles, colors, weekStartsOn = 1,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reorderMembers, setReorderMembers] = useState(false);

  const { splitId, name, mode, members, restPattern } = modalState;
  const isNew = !splitId;

  useEffect(() => {
    if (open) {
      setPickerOpen(false);
      setReorderMembers(false);
    }
  }, [open, splitId]);

  // Drag-to-reorder hook for continuous members. Members are staged here, so
  // the commit handler shuffles modalState.members directly (no immediate
  // persistence — Save commits everything).
  const memberDrag = useDragReorder({
    itemCount: (members || []).length,
    onCommit: (from, to) => {
      const arr = [...(members || [])];
      if (from < 0 || from >= arr.length) return;
      if (to < 0 || to >= arr.length) return;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      onUpdate({ members: arr });
    },
    rowHeight: 64,
  });

  const workoutNameById = useMemo(() => {
    const m = new Map();
    for (const w of workouts || []) m.set(w.id, w.name);
    return m;
  }, [workouts]);

  const otherSplitNameByWorkout = useMemo(() => {
    const m = new Map();
    for (const s of splits || []) {
      if (s.id === splitId) continue;
      for (const mem of s.members || []) m.set(mem.workoutId, s.name);
    }
    return m;
  }, [splits, splitId]);

  const memberWorkoutIds = useMemo(() => new Set((members || []).map((m) => m.workoutId)), [members]);

  const availableToAdd = useMemo(
    () => (workouts || []).filter((w) => !memberWorkoutIds.has(w.id)),
    [workouts, memberWorkoutIds]
  );

  if (!open) return null;

  const setMode = (next) => {
    if (next === mode) return;
    onUpdate({ mode: next });
  };

  const setRestAfterCycle = (enabled) => {
    onUpdate({ restPattern: enabled ? { type: "afterCycle", days: 1 } : null });
  };

  const addMember = (workoutId) => {
    onUpdate({ members: [...(members || []), { workoutId, days: [] }] });
  };

  const removeMember = (workoutId) => {
    onUpdate({ members: (members || []).filter((m) => m.workoutId !== workoutId) });
  };

  const moveMember = (workoutId, delta) => {
    const list = members || [];
    const idx = list.findIndex((m) => m.workoutId === workoutId);
    if (idx < 0) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const next = [...list];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    onUpdate({ members: next });
  };

  const toggleMemberDay = (workoutId, day) => {
    onUpdate({
      members: (members || []).map((m) => {
        if (m.workoutId !== workoutId) return m;
        const days = Array.isArray(m.days) ? m.days : [];
        return { ...m, days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day] };
      }),
    });
  };

  const canSave = (name || "").trim().length > 0;

  const footer = (
    <div style={styles.modalFooter}>
      <button className="btn-press" style={styles.secondaryBtn} onClick={onClose}>
        Cancel
      </button>
      <button
        className="btn-press"
        style={{ ...styles.primaryBtn, opacity: canSave ? 1 : 0.5, pointerEvents: canSave ? "auto" : "none" }}
        onClick={onSave}
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      title={isNew ? "New Split" : "Edit Split"}
      onClose={onClose}
      styles={styles}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minHeight: 0 }}>
        {/* Name */}
        <div style={styles.fieldCol}>
          <label style={styles.label}>Split name</label>
          <input
            value={name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            style={styles.textInput}
            placeholder="e.g. PPL, Upper/Lower"
            autoFocus
          />
        </div>

        {/* Mode */}
        <div style={styles.fieldCol}>
          <label style={styles.label}>How does this split run?</label>
          <div style={{ display: "flex", gap: 6 }}>
            <ModeButton active={mode === SPLIT_MODES.WEEKLY} onClick={() => setMode(SPLIT_MODES.WEEKLY)} colors={colors}>
              Weekly
            </ModeButton>
            <ModeButton active={mode === SPLIT_MODES.CONTINUOUS} onClick={() => setMode(SPLIT_MODES.CONTINUOUS)} colors={colors}>
              Continuous
            </ModeButton>
          </div>
          <div style={{ fontSize: 11, opacity: 0.55, marginTop: 6, lineHeight: 1.5 }}>
            {mode === SPLIT_MODES.WEEKLY
              ? "Each workout has target day(s) of the week."
              : "Workouts rotate in order. Calendar days don't matter — when one finishes, the next is up."}
          </div>
        </div>

        {/* Rest pattern (continuous only) */}
        {mode === SPLIT_MODES.CONTINUOUS && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={restPattern?.type === "afterCycle"}
              onChange={(e) => setRestAfterCycle(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span>Take a rest day after each full cycle</span>
          </label>
        )}

        {/* Members */}
        <div style={styles.fieldCol}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={styles.label}>Workouts in this split</label>
            {mode === SPLIT_MODES.CONTINUOUS && (members || []).length > 1 && (
              <button
                type="button"
                onClick={() => setReorderMembers((v) => !v)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: reorderMembers ? colors.accentSoft : "transparent",
                  border: `1px solid ${reorderMembers ? colors.accentBorder : colors.border}`,
                  color: reorderMembers ? colors.accent : colors.textSecondary,
                  fontFamily: "inherit",
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                  cursor: "pointer",
                  minHeight: 32,
                }}
              >{reorderMembers ? "Done" : "Reorder"}</button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(members || []).map((m, i) => {
              const workoutName = workoutNameById.get(m.workoutId) || "(deleted workout)";
              return (
                <div
                  key={m.workoutId}
                  ref={reorderMembers ? memberDrag.setItemRef(i) : undefined}
                  style={{
                    background: colors.cardAltBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    display: "flex", flexDirection: "column",
                    ...(reorderMembers ? memberDrag.itemStyle(i) : {}),
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {mode === SPLIT_MODES.CONTINUOUS && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                            textTransform: "uppercase",
                            color: colors.textTertiary,
                          }}>{`Day ${i + 1}`}</span>
                        )}
                        <span style={{
                          fontSize: 14, fontWeight: 700, color: colors.text,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{workoutName}</span>
                      </div>
                    </div>
                    {reorderMembers ? (
                      <DragGrip {...memberDrag.handleProps(i)} colors={colors} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeMember(m.workoutId)}
                        title="Remove from split"
                        style={{
                          background: "transparent", border: "none",
                          padding: 4, marginLeft: 2,
                          cursor: "pointer", opacity: 0.45, color: colors.text,
                          display: "flex", alignItems: "center",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {mode === SPLIT_MODES.WEEKLY && !reorderMembers && (
                    <div style={{
                      padding: "0 12px 12px",
                      borderTop: `1px solid ${colors.border}`,
                      paddingTop: 10,
                    }}>
                      <DayChips
                        selected={Array.isArray(m.days) ? m.days : []}
                        onToggle={(day) => toggleMemberDay(m.workoutId, day)}
                        colors={colors}
                        ariaLabel={`Days for ${workoutName}`}
                        weekStartsOn={weekStartsOn}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add a workout — dashed accent button + inline picker. Hidden
                while reordering for a cleaner drag UI. */}
            {!reorderMembers && availableToAdd.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  aria-expanded={pickerOpen}
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    borderRadius: 14,
                    background: pickerOpen ? colors.accentSoft : "transparent",
                    color: colors.accent,
                    border: `1.5px dashed ${colors.accentBorder}`,
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    minHeight: 48,
                  }}
                >
                  {pickerOpen ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      Done adding
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Add a workout
                    </>
                  )}
                </button>

                {pickerOpen && availableToAdd.map((w) => {
                  const otherSplitName = otherSplitNameByWorkout.get(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => addMember(w.id)}
                      style={{
                        width: "100%", minHeight: 56,
                        padding: "12px 14px",
                        borderRadius: 14,
                        background: colors.cardAltBg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: 12,
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700, color: colors.text,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{w.name}</div>
                        {otherSplitName && (
                          <div style={{
                            fontSize: 11, color: colors.textSecondary, marginTop: 2,
                          }}>
                            Already in: {otherSplitName}
                          </div>
                        )}
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  );
                })}
              </>
            ) : (members || []).length === 0 ? (
              <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>
                No workouts to add. Create one first.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}
