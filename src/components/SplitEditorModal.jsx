import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "./Modal";
import { SPLIT_MODES } from "../lib/cadence";
import { DayChips } from "./CadenceEditor";

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

  const { splitId, name, mode, members, restPattern } = modalState;
  const isNew = !splitId;

  useEffect(() => { if (open) setPickerOpen(false); }, [open, splitId]);

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
          <label style={styles.label}>Workouts in this split</label>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(members || []).map((m, i) => {
              const isFirst = i === 0;
              const isLast = i === (members || []).length - 1;
              const workoutName = workoutNameById.get(m.workoutId) || "(deleted workout)";
              return (
                <div
                  key={m.workoutId}
                  style={{
                    background: colors.cardAltBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    display: "flex", flexDirection: "column",
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
                    {mode === SPLIT_MODES.CONTINUOUS && (
                      <>
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => moveMember(m.workoutId, -1)}
                          title="Move up"
                          style={{
                            background: "transparent", border: "none",
                            color: colors.text, opacity: isFirst ? 0.15 : 0.55,
                            padding: 4, cursor: isFirst ? "default" : "pointer",
                            display: "flex", alignItems: "center",
                          }}
                        >
                          <svg width="14" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => moveMember(m.workoutId, 1)}
                          title="Move down"
                          style={{
                            background: "transparent", border: "none",
                            color: colors.text, opacity: isLast ? 0.15 : 0.55,
                            padding: 4, cursor: isLast ? "default" : "pointer",
                            display: "flex", alignItems: "center",
                          }}
                        >
                          <svg width="14" height="11" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                        </button>
                      </>
                    )}
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
                  </div>

                  {mode === SPLIT_MODES.WEEKLY && (
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

            {/* Add a workout — dashed accent button + inline picker */}
            {availableToAdd.length > 0 ? (
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
