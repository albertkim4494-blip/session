import React from "react";
import { Modal } from "./Modal";
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
        transition: "background 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/**
 * SplitEditorModal — meta editor for a split: name, mode, rest pattern.
 * Members editing lives in SplitDetailSheet (immediate add/remove/reorder).
 * Mirrors the EditWorkout modal pattern.
 */
export function SplitEditorModal({
  open, modalState, onUpdate, onClose, onSave, styles, colors,
}) {
  if (!open) return null;

  const { splitId, name, mode, restPattern } = modalState;
  const isNew = !splitId;

  const setMode = (next) => {
    if (next === mode) return;
    onUpdate({ mode: next });
  };

  const setRestAfterCycle = (enabled) => {
    onUpdate({ restPattern: enabled ? { type: "afterCycle", days: 1 } : null });
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
      </div>
    </Modal>
  );
}
