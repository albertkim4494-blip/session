import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { BodyDiagram, SLUG_TO_MUSCLES } from "./BodyDiagram";
import { ExerciseGif } from "./ExerciseGif";
import { INDIVIDUAL_MUSCLES, MUSCLE_LABELS } from "../lib/muscleGroups";
import { uploadExerciseImage, removeExerciseImage } from "../lib/exerciseImageUpload";
import { SPORT_ICONS, getSportIconUrl } from "../lib/sportIcons";


/**
 * ExerciseDetailModal
 *
 * View mode: read-only display identical for catalog and custom exercises.
 *   - Custom exercises: pencil icon in header to enter edit mode.
 *   - Catalog exercises: pencil icon leads to edit mode, but only "Save as New" available.
 *
 * Edit mode: unified form for movement, equipment, muscles, image, and name.
 *   - Custom exercises: "Save" (update in-place) + "Save as New" (create variant).
 *   - Catalog exercises: "Save as New" only.
 *   - Delete button appears in header (custom only).
 *   - Name field with duplicate validation.
 */

const MOVEMENT_OPTIONS = ["push", "pull", "legs", "core", "cardio", "stretch", "sport"];
const EQUIPMENT_OPTIONS = ["bodyweight", "barbell", "dumbbell", "kettlebell", "cable", "machine", "band"];

function PencilIcon({ size = 14, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function ExerciseDetailModal({
  open, entry, onBack, onClose, onAddExercise,
  onDeleteCustomExercise, onUpdateCustomExercise, onSaveAsNew,
  workouts, styles, colors, targetWorkoutId, session, catalog,
  sheetRef, footerRef, bodyRef, position, total,
  sheetAnimation,
}) {
  // Add-to-workout state
  const [checked, setChecked] = useState(new Set());
  const [added, setAdded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addedWorkouts, setAddedWorkouts] = useState(new Set());

  // Unified edit mode
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftMovement, setDraftMovement] = useState("");
  const [draftEquipment, setDraftEquipment] = useState([]);
  const [draftPrimary, setDraftPrimary] = useState([]);
  const [draftSecondary, setDraftSecondary] = useState([]);
  const [draftGifUrl, setDraftGifUrl] = useState(null);
  const [draftSportIcon, setDraftSportIcon] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const fileInputRef = useRef(null);

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

  // Reset all state when entry changes or modal opens
  useEffect(() => {
    if (open) {
      setChecked(new Set());
      setAdded(false);
      setDropdownOpen(false);
      setAddedWorkouts(new Set());
      setEditing(false);
      setImageUploading(false);
      setImageError("");
      setNameError("");
    }
  }, [open, entry?.id]);

  if (!open || !entry) return null;

  const isCustom = entry.custom === true;
  const canEdit = !!onSaveAsNew; // anyone can "Save as New"
  const canUpdate = isCustom && !!onUpdateCustomExercise; // only custom can update in-place

  // --- Name duplicate checking ---
  const isNameTaken = (name, excludeId) => {
    if (!catalog) return false;
    const lower = name.trim().toLowerCase();
    return catalog.some((e) => e.name.toLowerCase() === lower && e.id !== excludeId);
  };

  // --- Enter / exit edit mode ---
  const startEditing = () => {
    setDraftName(entry.name);
    setDraftMovement(entry.movement || "");
    setDraftEquipment([...(entry.equipment || [])]);
    setDraftPrimary([...(entry.muscles?.primary || [])]);
    setDraftSecondary([...(entry.muscles?.secondary || [])]);
    setDraftGifUrl(entry.gifUrl || null);
    setDraftSportIcon(entry.sportIcon || null);
    setImageError("");
    setNameError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setImageError("");
    setNameError("");
  };

  const buildDraft = () => ({
    ...entry,
    name: draftName.trim(),
    movement: draftMovement || undefined,
    equipment: draftEquipment,
    muscles: { primary: draftPrimary, secondary: draftSecondary },
    gifUrl: draftGifUrl,
    sportIcon: draftMovement === "sport" ? (draftSportIcon || undefined) : undefined,
  });

  const handleSave = () => {
    const trimmed = draftName.trim();
    if (!trimmed) { setNameError("Name is required"); return; }
    if (isNameTaken(trimmed, entry.id)) { setNameError("Name already exists"); return; }
    const updated = buildDraft();
    // Clean up storage if image was removed
    if (entry.gifUrl && !updated.gifUrl) {
      const userId = session?.user?.id;
      if (userId) removeExerciseImage(userId, entry.id).catch(() => {});
    }
    onUpdateCustomExercise(updated);
    setEditing(false);
  };

  const handleSaveAsNew = () => {
    const trimmed = draftName.trim();
    if (!trimmed) { setNameError("Name is required"); return; }
    // For "Save as New", name must not match anything (including the source exercise)
    if (isNameTaken(trimmed, null)) { setNameError("Name already exists"); return; }
    const draft = buildDraft();
    onSaveAsNew(draft);
    setEditing(false);
  };

  // --- Muscle tap-to-cycle: off → primary → secondary → off ---
  const cycleMuscle = (muscle) => {
    const isPrimary = draftPrimary.includes(muscle);
    const isSecondary = draftSecondary.includes(muscle);
    if (!isPrimary && !isSecondary) {
      setDraftPrimary((prev) => [...prev, muscle]);
    } else if (isPrimary) {
      setDraftPrimary((prev) => prev.filter((m) => m !== muscle));
      setDraftSecondary((prev) => [...prev, muscle]);
    } else {
      setDraftSecondary((prev) => prev.filter((m) => m !== muscle));
    }
  };

  // --- Image handling ---
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setImageError("Only JPEG, PNG, WebP, or GIF allowed");
      return;
    }

    setImageError("");
    setImageUploading(true);
    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("Not signed in");
      const publicUrl = await uploadExerciseImage(file, userId, entry.id);
      setDraftGifUrl(publicUrl);
    } catch (err) {
      setImageError(err.message || "Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setDraftGifUrl(null);
    // Storage cleanup deferred to save handlers — removing during draft editing
    // would destroy the original image if the user cancels.
  };

  // --- Styles ---
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

  const toggleChipStyle = (active) => ({
    padding: "5px 10px",
    borderRadius: 999,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    background: active ? colors.primaryBg : colors.cardBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 11,
    cursor: "pointer",
    textTransform: "capitalize",
  });

  const sectionLabelStyle = {
    fontSize: 10, fontWeight: 700, opacity: 0.5, marginBottom: 6,
    textTransform: "uppercase", letterSpacing: 0.5,
  };

  const smallBtnStyle = {
    padding: "5px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  };

  const allMuscles = [...(entry.muscles?.primary || []), ...(entry.muscles?.secondary || [])];
  const hasMuscles = allMuscles.length > 0;
  const hasWorkouts = workouts && workouts.length > 0;
  const isBrowseMode = !targetWorkoutId;

  // --- Add-to-workout handlers ---
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
    setTimeout(() => { onClose(); }, 600);
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

  // ===================== FOOTER =====================

  const editFooter = editing ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className="btn-press"
          style={{ ...styles.secondaryBtn, flex: 1, textAlign: "center" }}
          onClick={cancelEditing}
        >
          Cancel
        </button>
        {canUpdate && (
          <button
            className="btn-press"
            style={{ ...styles.primaryBtn, flex: 1, textAlign: "center" }}
            disabled={imageUploading}
            onClick={handleSave}
          >
            Save
          </button>
        )}
      </div>
      {onSaveAsNew && (
        <button
          className="btn-press"
          style={{
            ...styles.secondaryBtn, width: "100%", textAlign: "center",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
          disabled={imageUploading}
          onClick={handleSaveAsNew}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          Save as New Exercise
        </button>
      )}
      {nameError && (
        <div style={{ fontSize: 11, color: "#e53e3e", fontWeight: 600, textAlign: "center" }}>
          {nameError}
        </div>
      )}
    </div>
  ) : null;

  const directFooter = !editing && targetWorkoutId && onAddExercise ? (
    <button
      className="btn-press"
      style={{
        ...styles.primaryBtn, width: "100%", textAlign: "center",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}
      onClick={handleAddDirect}
    >
      {addBtnIcon}
      {added ? "Added" : "Add to Workout"}
    </button>
  ) : null;

  const browseFooter = !editing && isBrowseMode && hasWorkouts && onAddExercise ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 12px", borderRadius: 12,
          border: `1px solid ${colors.border}`, background: colors.cardAltBg,
          color: colors.text, cursor: "pointer", textAlign: "left",
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

      {dropdownOpen && (
        <div style={{
          display: "flex", flexDirection: "column", gap: 2, padding: "6px 0",
          borderRadius: 12, border: `1px solid ${colors.border}`,
          background: colors.cardBg, maxHeight: 180, overflowY: "auto",
        }}>
          {workouts.map((w) => {
            const alreadyAdded = alreadyInWorkouts.has(w.id) || addedWorkouts.has(w.id);
            const isChecked = alreadyAdded || checked.has(w.id);
            return (
              <button
                key={w.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: "transparent", border: "none", color: colors.text,
                  cursor: alreadyAdded ? "default" : "pointer", textAlign: "left",
                  opacity: alreadyAdded ? 0.5 : 1,
                }}
                onClick={() => { if (!alreadyAdded) toggleChecked(w.id); }}
              >
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

      <button
        className="btn-press"
        disabled={checked.size === 0 && !added}
        style={{
          ...styles.primaryBtn, width: "100%", textAlign: "center",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          opacity: checked.size === 0 && !added ? 0.4 : 1,
        }}
        onClick={handleAddMultiple}
      >
        {addBtnIcon}
        {added ? "Added" : `Add to Workout${checked.size > 0 ? ` (${checked.size})` : ""}`}
      </button>
    </div>
  ) : null;

  const spacerFooter = !editing && !directFooter && !browseFooter ? (
    <div style={{ height: 1 }} />
  ) : null;

  const footer = editFooter || directFooter || browseFooter || spacerFooter;

  // ===================== RENDER =====================

  return (
    <Modal
      open={open}
      onClose={editing ? cancelEditing : onClose}
      styles={styles}
      footer={footer}
      sheetAnimation={sheetAnimation}
      sheetRef={sheetRef}
      footerRef={footerRef}
      bodyRef={bodyRef}
      headerContent={
        <div style={{ ...styles.modalTitle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
          {editing ? "Edit Exercise" : entry.name}
        </div>
      }
      headerActions={
        <>
          {/* Edit mode: show delete for custom exercises */}
          {editing && isCustom && onDeleteCustomExercise && (
            <button
              onClick={() => { cancelEditing(); onDeleteCustomExercise(entry); }}
              style={{ ...styles.iconBtn, padding: 4, color: "#e53e3e" }}
              aria-label="Delete custom exercise"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}
          <button onClick={editing ? cancelEditing : onBack} style={{ ...styles.iconBtn, padding: 4 }} aria-label={editing ? "Cancel editing" : "Back"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </>
      }
    >
      {editing ? (
        /* ==================== EDIT MODE ==================== */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Name */}
          <div>
            <div style={sectionLabelStyle}>Name</div>
            <input
              value={draftName}
              onChange={(e) => { setDraftName(e.target.value); setNameError(""); }}
              style={{ ...styles.textInput, width: "100%", fontFamily: "inherit" }}
              placeholder="Exercise name"
            />
          </div>

          {/* Image */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={sectionLabelStyle}>Image</div>
            {draftGifUrl && (
              <ExerciseGif gifUrl={draftGifUrl} exerciseName={draftName || entry.name} colors={colors} />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn-press"
                style={{ ...smallBtnStyle, background: colors.cardBg, border: `1px solid ${colors.border}`, color: colors.text }}
                disabled={imageUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageUploading ? "Uploading..." : draftGifUrl ? "Replace Image" : "Upload Image"}
              </button>
              {draftGifUrl && (
                <button
                  className="btn-press"
                  style={{ ...smallBtnStyle, background: colors.cardBg, border: `1px solid ${colors.border}`, color: "#e53e3e" }}
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              )}
            </div>
            {imageError && (
              <div style={{ fontSize: 11, color: "#e53e3e", fontWeight: 600 }}>{imageError}</div>
            )}
          </div>

          {/* Movement */}
          <div>
            <div style={sectionLabelStyle}>Movement</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {MOVEMENT_OPTIONS.map((m) => (
                <button
                  key={m}
                  style={toggleChipStyle(draftMovement === m)}
                  onClick={() => setDraftMovement(draftMovement === m ? "" : m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Sport Icon picker — only when movement is "sport" */}
          {draftMovement === "sport" && (
            <div>
              <div style={sectionLabelStyle}>Sport Icon</div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
                gap: 6,
                maxHeight: 200,
                overflowY: "auto",
                padding: "4px 0",
              }}>
                {SPORT_ICONS.map((icon) => {
                  const isSelected = draftSportIcon === icon.slug;
                  const isDark = colors.appBg.startsWith("#0") || colors.appBg.startsWith("#1");
                  return (
                    <button
                      key={icon.slug}
                      onClick={() => setDraftSportIcon(isSelected ? null : icon.slug)}
                      title={icon.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        padding: "6px 2px",
                        borderRadius: 10,
                        border: `2px solid ${isSelected ? colors.accent : "transparent"}`,
                        background: isSelected ? colors.accent + "18" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={icon.url}
                        alt={icon.label}
                        style={{
                          width: 28, height: 28, objectFit: "contain",
                          filter: isDark ? "invert(1)" : "none",
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      />
                      <span style={{
                        fontSize: 8, fontWeight: 600, opacity: isSelected ? 0.9 : 0.5,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        width: "100%", textAlign: "center",
                      }}>
                        {icon.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Equipment */}
          <div>
            <div style={sectionLabelStyle}>Equipment</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq}
                  style={toggleChipStyle(draftEquipment.includes(eq))}
                  onClick={() => {
                    setDraftEquipment((prev) =>
                      prev.includes(eq) ? prev.filter((x) => x !== eq) : [...prev, eq]
                    );
                  }}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Target Muscles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={sectionLabelStyle}>Target Muscles</div>
            <BodyDiagram
              highlightedMuscles={draftPrimary}
              secondaryMuscles={draftSecondary}
              colors={colors}
              onBodyPartPress={(part) => {
                const muscles = SLUG_TO_MUSCLES[part.slug];
                if (!muscles?.length) return;
                for (const m of muscles) cycleMuscle(m);
              }}
            />

            {/* Legend */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", fontSize: 10, fontWeight: 600, opacity: 0.55 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.accent }} />
                Primary
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.accent + "55" }} />
                Secondary
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.cardBg, border: `1px solid ${colors.border}` }} />
                Off
              </span>
            </div>
            <div style={{ fontSize: 10, opacity: 0.4, textAlign: "center" }}>
              Tap to cycle: off → primary → secondary → off
            </div>

            {/* Muscle chips */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {INDIVIDUAL_MUSCLES.map((m) => {
                const isPrimary = draftPrimary.includes(m);
                const isSecondary = draftSecondary.includes(m);
                const active = isPrimary || isSecondary;
                return (
                  <button
                    key={m}
                    style={{
                      padding: "4px 9px", borderRadius: 999, fontSize: 11,
                      fontWeight: 700, cursor: "pointer",
                      border: `1px solid ${active ? colors.accent : colors.border}`,
                      background: isPrimary ? colors.accent : isSecondary ? colors.accent + "55" : colors.cardBg,
                      color: isPrimary ? "#fff" : isSecondary ? colors.accent : colors.text,
                    }}
                    onClick={() => cycleMuscle(m)}
                  >
                    {MUSCLE_LABELS[m]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== VIEW MODE ==================== */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Movement + Equipment chips + Edit button */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {entry.movement && <span style={movementChip}>{entry.movement}</span>}
            {(entry.equipment || []).map((e) => (
              <span key={e} style={equipChip}>{e}</span>
            ))}
            {canEdit && (
              <button
                className="btn-press"
                onClick={startEditing}
                style={{
                  display: "flex", alignItems: "center", gap: 4, marginLeft: "auto",
                  padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: colors.subtleBg, border: `1px solid ${colors.border}`,
                  color: colors.text, cursor: "pointer", opacity: 0.6,
                }}
              >
                <PencilIcon size={11} />
                Edit
              </button>
            )}
          </div>

          {/* Sport icon (if sport and no GIF) */}
          {!entry.gifUrl && (() => {
            const iconUrl = getSportIconUrl(entry.name, entry.sportIcon);
            if (!iconUrl) return null;
            const isDark = colors.appBg.startsWith("#0") || colors.appBg.startsWith("#1");
            return (
              <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                <img
                  src={iconUrl}
                  alt=""
                  style={{
                    width: 80, height: 80, objectFit: "contain",
                    filter: isDark ? "invert(1)" : "none",
                    opacity: 0.7,
                  }}
                />
              </div>
            );
          })()}

          {/* Exercise demonstration GIF */}
          <ExerciseGif gifUrl={entry.gifUrl} exerciseName={entry.name} colors={colors} />

          {/* Body diagram + muscle chips */}
          {hasMuscles && (
            <>
              <BodyDiagram
                highlightedMuscles={entry.muscles?.primary || []}
                secondaryMuscles={entry.muscles?.secondary || []}
                colors={colors}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(entry.muscles?.primary || []).map((m) => (
                  <span key={m} style={{ ...chipBase, background: colors.accent + "22", border: `1px solid ${colors.accent}`, color: colors.accent, textTransform: "capitalize" }}>
                    {m.replace(/_/g, " ")}
                  </span>
                ))}
                {(entry.muscles?.secondary || []).map((m) => (
                  <span key={m} style={{ ...chipBase, background: colors.subtleBg, border: `1px solid ${colors.border}`, textTransform: "capitalize" }}>
                    {m.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
