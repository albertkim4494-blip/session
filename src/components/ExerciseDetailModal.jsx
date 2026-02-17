import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { BodyDiagram } from "./BodyDiagram";
import { ExerciseGif } from "./ExerciseGif";


/**
 * ExerciseDetailModal — two modes:
 *
 * 1. targetWorkoutId set (from Programs + button):
 *    Shows a simple "Add to Workout" button in the footer.
 *
 * 2. targetWorkoutId NOT set (from catalog browse card):
 *    Shows a dropdown with checkbox list of all workouts + "Add to Workout" button in the footer.
 *
 * Both modes always render a footer so Modal uses fixed height (95dvh).
 */

export function ExerciseDetailModal({
  open, entry, onBack, onClose, onAddExercise, onDeleteCustomExercise,
  workouts, styles, colors, targetWorkoutId,
  swipeHandlers, slideDir, position, total,
}) {
  const [checked, setChecked] = useState(new Set());
  const [added, setAdded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addedWorkouts, setAddedWorkouts] = useState(new Set());
  // Build set of workout IDs that already contain this exercise
  const alreadyInWorkouts = React.useMemo(() => {
    if (!entry || !workouts) return new Set();
    const entryName = entry.name.toLowerCase();
    const s = new Set();
    for (const w of workouts) {
      for (const ex of w.exercises || []) {
        if (ex.catalogId === entry.id || ex.name.toLowerCase() === entryName) {
          s.add(w.id);
          break;
        }
      }
    }
    return s;
  }, [entry, workouts]);

  // Reset state when entry changes or modal opens
  useEffect(() => {
    if (open) {
      setChecked(new Set());
      setAdded(false);
      setDropdownOpen(false);
      setAddedWorkouts(new Set());
    }
  }, [open, entry?.id]);

  if (!open || !entry) return null;

  const chipBase = {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
  };

  const movementChip = {
    ...chipBase,
    background: colors.primaryBg,
    color: colors.primaryText,
    textTransform: "capitalize",
  };

  const equipChip = {
    ...chipBase,
    background: colors.subtleBg,
    border: `1px solid ${colors.border}`,
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.8,
  };

  const hasMuscles = entry.muscles?.primary?.length > 0;
  const hasWorkouts = workouts && workouts.length > 0;
  const isBrowseMode = !targetWorkoutId;

  const toggleChecked = (wId) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(wId)) next.delete(wId);
      else next.add(wId);
      return next;
    });
  };

  const handleAddDirect = () => {
    if (!onAddExercise || !targetWorkoutId) return;
    onAddExercise(entry, targetWorkoutId);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleAddMultiple = () => {
    if (!onAddExercise || checked.size === 0) return;
    onAddExercise(entry, [...checked]);
    setAddedWorkouts((prev) => {
      const next = new Set(prev);
      for (const wId of checked) next.add(wId);
      return next;
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setDropdownOpen(false);
      setChecked(new Set());
    }, 1200);
  };

  const addBtnIcon = added ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  // Footer for direct add mode (from Plans + button)
  const directFooter = targetWorkoutId && onAddExercise ? (
    <button
      className="btn-press"
      style={{
        ...styles.primaryBtn,
        width: "100%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
      onClick={handleAddDirect}
    >
      {addBtnIcon}
      {added ? "Added" : "Add to Workout"}
    </button>
  ) : null;

  // Footer for browse mode (from catalog browse)
  const browseFooter = isBrowseMode && hasWorkouts && onAddExercise ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Dropdown toggle */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 12px",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: colors.cardAltBg,
          color: colors.text,
          cursor: "pointer",
          textAlign: "left",
        }}
        onClick={() => setDropdownOpen((v) => !v)}
      >
        <span style={{ fontWeight: 600, fontSize: 13 }}>
          {checked.size === 0
            ? "Select workouts..."
            : `${checked.size} workout${checked.size > 1 ? "s" : ""} selected`}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.4, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {dropdownOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "6px 0",
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          background: colors.cardBg,
          maxHeight: 180,
          overflowY: "auto",
        }}>
          {workouts.map((w) => {
            const alreadyAdded = alreadyInWorkouts.has(w.id) || addedWorkouts.has(w.id);
            const isChecked = alreadyAdded || checked.has(w.id);
            return (
              <button
                key={w.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  color: colors.text,
                  cursor: alreadyAdded ? "default" : "pointer",
                  textAlign: "left",
                  opacity: alreadyAdded ? 0.5 : 1,
                }}
                onClick={() => { if (!alreadyAdded) toggleChecked(w.id); }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${isChecked ? colors.accent : colors.border}`,
                  background: isChecked ? colors.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{w.name}</span>
                </div>
                {alreadyAdded ? (
                  <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.5, color: colors.accent }}>Added</span>
                ) : w.category ? (
                  <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.4 }}>{w.category}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {/* Add button */}
      <button
        className="btn-press"
        disabled={checked.size === 0 && !added}
        style={{
          ...styles.primaryBtn,
          width: "100%",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: checked.size === 0 && !added ? 0.4 : 1,
        }}
        onClick={handleAddMultiple}
      >
        {addBtnIcon}
        {added ? "Added" : `Add to Workout${checked.size > 0 ? ` (${checked.size})` : ""}`}
      </button>
    </div>
  ) : null;

  // Spacer footer for read-only browse (no workouts or no onAddExercise)
  const spacerFooter = !directFooter && !browseFooter ? (
    <div style={{ height: 1 }} />
  ) : null;

  const footer = directFooter || browseFooter || spacerFooter;

  return (
    <Modal
      open={open}
      onClose={onClose}
      styles={styles}
      footer={footer}
      headerContent={
        <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
          <button onClick={onBack} style={{ ...styles.iconBtn, padding: 4, flexShrink: 0 }} aria-label="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
            <div style={{ ...styles.modalTitle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</div>
            {position > 0 && total > 1 && (
              <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.35, marginTop: -2 }}>{position} of {total}</div>
            )}
          </div>
          {entry.custom && onDeleteCustomExercise ? (
            <button
              onClick={() => onDeleteCustomExercise(entry)}
              style={{ ...styles.iconBtn, padding: 4, flexShrink: 0, color: "#e53e3e" }}
              aria-label="Delete custom exercise"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          ) : (
            <div style={{ width: 26, flexShrink: 0 }} />
          )}
        </div>
      }
    >
      <div
        key={entry.id}
        style={{
          display: "flex", flexDirection: "column", gap: 14,
          animation: slideDir ? `cardSlide${slideDir === "left" ? "Left" : "Right"} 0.25s ease-out` : undefined,
        }}
        {...(swipeHandlers || {})}
      >
        {/* Movement + Equipment */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {entry.movement && <span style={movementChip}>{entry.movement}</span>}
          {(entry.equipment || []).map((e) => (
            <span key={e} style={equipChip}>{e}</span>
          ))}
        </div>

        {/* Exercise demonstration GIF */}
        <ExerciseGif gifUrl={entry.gifUrl} exerciseName={entry.name} colors={colors} />

        {/* Body diagram */}
        {hasMuscles && (
          <BodyDiagram
            highlightedMuscles={entry.muscles.primary}
            secondaryMuscles={entry.muscles.secondary || []}
            colors={colors}
          />
        )}
      </div>
    </Modal>
  );
}
