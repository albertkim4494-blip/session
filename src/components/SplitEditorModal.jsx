import React, { useMemo } from "react";
import { Modal } from "./Modal";
import { DayChips, DISPLAY_DAYS } from "./CadenceEditor";
import { SPLIT_MODES } from "../lib/cadence";

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
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/**
 * SplitEditorModal — create or edit a workout split.
 *
 * Workouts live in at most one split at a time. When the split's mode is "weekly",
 * each member can be assigned specific days. When it's "continuous", members are
 * ordered and rotate through completion (rest pattern handled in Phase 5+).
 */
export function SplitEditorModal({
  open,
  modalState,
  onUpdate,
  onClose,
  onSave,
  onDelete,
  workouts,
  splits,
  styles,
  colors,
}) {
  if (!open) return null;

  const { splitId, name, mode, members, restPattern } = modalState;
  const isNew = !splitId;

  // Map: workoutId → splitId of any *other* split. Used to exclude workouts that
  // are already members of a different split from the picker.
  const ownedByOtherSplit = useMemo(() => {
    const map = new Map();
    for (const s of splits || []) {
      if (s.id === splitId) continue;
      for (const m of s.members || []) map.set(m.workoutId, s.id);
    }
    return map;
  }, [splits, splitId]);

  const memberWorkoutIds = useMemo(() => new Set(members.map((m) => m.workoutId)), [members]);

  const availableToAdd = useMemo(
    () => (workouts || []).filter((w) => !memberWorkoutIds.has(w.id) && !ownedByOtherSplit.has(w.id)),
    [workouts, memberWorkoutIds, ownedByOtherSplit]
  );

  const workoutNameById = useMemo(() => {
    const m = new Map();
    for (const w of workouts || []) m.set(w.id, w.name);
    return m;
  }, [workouts]);

  const setMode = (next) => {
    if (next === mode) return;
    onUpdate({ mode: next });
  };

  const addMember = (workoutId) => {
    const order = members.length;
    onUpdate({ members: [...members, { workoutId, order, days: [] }] });
  };

  const removeMember = (workoutId) => {
    const next = members.filter((m) => m.workoutId !== workoutId).map((m, i) => ({ ...m, order: i }));
    onUpdate({ members: next });
  };

  const moveMember = (workoutId, delta) => {
    const idx = members.findIndex((m) => m.workoutId === workoutId);
    if (idx < 0) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= members.length) return;
    const next = [...members];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    onUpdate({ members: next.map((m, i) => ({ ...m, order: i })) });
  };

  const toggleMemberDay = (workoutId, day) => {
    const next = members.map((m) => {
      if (m.workoutId !== workoutId) return m;
      const days = Array.isArray(m.days) ? m.days : [];
      return { ...m, days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day] };
    });
    onUpdate({ members: next });
  };

  const setRestAfterCycle = (enabled) => {
    onUpdate({ restPattern: enabled ? { type: "afterCycle", days: 1 } : null });
  };

  const canSave = name.trim().length > 0;

  return (
    <Modal
      open={open}
      title={isNew ? "New split" : "Edit split"}
      onClose={onClose}
      styles={styles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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

        {/* Members */}
        <div style={styles.fieldCol}>
          <label style={styles.label}>Workouts in this split</label>

          {members.length === 0 ? (
            <div style={{ fontSize: 12, opacity: 0.5, padding: "10px 0" }}>
              No workouts yet. Add some below.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {members.map((m, i) => {
                const isFirst = i === 0;
                const isLast = i === members.length - 1;
                return (
                  <div
                    key={m.workoutId}
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: 10,
                      padding: 10,
                      background: colors.cardAltBg,
                      display: "flex", flexDirection: "column", gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {mode === SPLIT_MODES.CONTINUOUS && (
                        <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 600, minWidth: 28 }}>
                          {i + 1}.
                        </div>
                      )}
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>
                        {workoutNameById.get(m.workoutId) || "(deleted workout)"}
                      </div>
                      {mode === SPLIT_MODES.CONTINUOUS && (
                        <div style={{ display: "flex", gap: 2 }}>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => moveMember(m.workoutId, -1)}
                            title="Move up"
                            style={{
                              background: "transparent", border: "none", padding: 4,
                              cursor: isFirst ? "default" : "pointer",
                              opacity: isFirst ? 0.2 : 0.55, color: colors.text,
                            }}
                          >
                            <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => moveMember(m.workoutId, 1)}
                            title="Move down"
                            style={{
                              background: "transparent", border: "none", padding: 4,
                              cursor: isLast ? "default" : "pointer",
                              opacity: isLast ? 0.2 : 0.55, color: colors.text,
                            }}
                          >
                            <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMember(m.workoutId)}
                        title="Remove from split"
                        style={{
                          background: "transparent", border: "none", padding: 4,
                          cursor: "pointer", opacity: 0.45, color: colors.text,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {mode === SPLIT_MODES.WEEKLY && (
                      <DayChips
                        selected={Array.isArray(m.days) ? m.days : []}
                        onToggle={(day) => toggleMemberDay(m.workoutId, day)}
                        colors={colors}
                        ariaLabel={`Days for ${workoutNameById.get(m.workoutId) || "member"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add member picker */}
          {availableToAdd.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: colors.accent, padding: "6px 0",
                listStyle: "none", userSelect: "none",
              }}>
                + Add a workout
              </summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                {availableToAdd.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => addMember(w.id)}
                    style={{
                      textAlign: "left", padding: "8px 10px", borderRadius: 8,
                      border: `1px solid ${colors.border}`, background: "transparent",
                      color: colors.text, fontSize: 13, cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </details>
          )}

          {availableToAdd.length === 0 && members.length === 0 && (
            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6, lineHeight: 1.5 }}>
              No standalone workouts to add. Create a workout first, or remove one from another split.
            </div>
          )}
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

        {/* Footer */}
        <div style={styles.modalFooter}>
          {!isNew && onDelete && (
            <button
              className="btn-press"
              style={{ ...styles.secondaryBtn, color: colors.dangerText, borderColor: colors.dangerBorder }}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
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
      </div>
    </Modal>
  );
}
