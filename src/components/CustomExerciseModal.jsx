import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "./Modal";
import { BodyDiagram } from "./BodyDiagram";
import { REP_UNITS } from "../lib/constants";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch } from "../lib/exerciseCatalogUtils";

function formatMuscleName(muscle) {
  return muscle
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export function CustomExerciseModal({
  open, modalState, onUpdate, onClose, onSave,
  enrichExercise, workouts, styles, colors,
}) {
  const [checked, setChecked] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const lastEnrichedRef = useRef("");

  const {
    workoutId, name, unit, customUnitAbbr, customUnitAllowDecimal,
    enriching, enriched, enrichError, muscles, equipment, tags, movement,
  } = modalState;

  const isBrowseMode = !workoutId;
  const hasWorkouts = workouts && workouts.length > 0;

  // Catalog search suggestions based on name input
  const suggestions = useMemo(() => {
    const q = name.trim();
    if (q.length < 2) return [];
    return catalogSearch(EXERCISE_CATALOG, q, { limit: 6 });
  }, [name]);

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setChecked(new Set());
      setDropdownOpen(false);
      setShowSuggestions(false);
      lastEnrichedRef.current = "";
    }
  }, [open]);

  // Auto-enrich after 500ms debounce when name changes (3+ chars)
  useEffect(() => {
    if (!open || !enrichExercise) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = name.trim();
    if (trimmed.length < 3) return;
    if (trimmed === lastEnrichedRef.current) return;

    debounceRef.current = setTimeout(async () => {
      onUpdate({ enriching: true, enrichError: null });
      try {
        const result = await enrichExercise(trimmed);
        lastEnrichedRef.current = trimmed;
        onUpdate({
          enriching: false,
          enriched: true,
          muscles: result.muscles,
          equipment: result.equipment,
          tags: result.tags,
          movement: result.movement,
          unit: result.defaultUnit || "reps",
        });
      } catch (err) {
        onUpdate({
          enriching: false,
          enrichError: err.message || "Failed to classify exercise",
        });
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [open, name]);

  if (!open) return null;

  const chipBase = {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
  };

  const muscleChip = {
    ...chipBase,
    background: colors.accentBg,
    border: `1px solid ${colors.accentBorder}`,
    color: colors.accent,
  };

  const equipChip = {
    ...chipBase,
    background: colors.subtleBg,
    border: `1px solid ${colors.border}`,
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.8,
  };

  const tagChip = {
    ...chipBase,
    background: "transparent",
    border: `1px solid ${colors.border}`,
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.55,
  };

  const movementChipStyle = {
    ...chipBase,
    background: colors.primaryBg,
    color: colors.primaryText,
    textTransform: "capitalize",
  };

  const toggleChecked = (wId) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(wId)) next.delete(wId);
      else next.add(wId);
      return next;
    });
  };

  const hasMuscles = muscles?.primary?.length > 0;
  const canSave = name.trim().length > 0 && (workoutId || checked.size > 0);

  const selectSuggestion = (entry) => {
    setShowSuggestions(false);
    lastEnrichedRef.current = entry.name;
    onUpdate({
      name: entry.name,
      enriching: false,
      enriched: true,
      enrichError: null,
      muscles: entry.muscles || { primary: [] },
      equipment: entry.equipment || [],
      tags: entry.tags || [],
      movement: entry.movement || "",
      unit: entry.defaultUnit || "reps",
    });
  };

  const handleSave = () => {
    if (!canSave) return;
    const targetIds = workoutId ? [workoutId] : [...checked];
    onSave({
      name: name.trim(),
      unit,
      customUnitAbbr: unit === "custom" ? customUnitAbbr : undefined,
      customUnitAllowDecimal: unit === "custom" ? customUnitAllowDecimal : undefined,
      muscles: enriched ? muscles : undefined,
      equipment: enriched ? equipment : undefined,
      tags: enriched ? tags : undefined,
      movement: enriched ? movement : undefined,
    }, targetIds);
  };

  const footer = (
    <button
      className="btn-press"
      disabled={!canSave}
      style={{
        ...styles.primaryBtn,
        width: "100%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: canSave ? 1 : 0.4,
      }}
      onClick={handleSave}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Add to Plan{isBrowseMode && checked.size > 0 ? ` (${checked.size})` : ""}
    </button>
  );

  return (
    <Modal
      open={open}
      title="Custom Exercise"
      onClose={onClose}
      styles={styles}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Name input with autocomplete */}
        <div style={{ ...styles.fieldCol, position: "relative" }}>
          <label style={styles.label}>Exercise name</label>
          <input
            value={name}
            onChange={(e) => {
              onUpdate({ name: e.target.value, enriched: false, enrichError: null });
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            style={styles.textInput}
            placeholder="e.g. Kettlebell Swing"
            autoFocus
          />

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              marginTop: 4,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: colors.cardBg,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              maxHeight: 220,
              overflowY: "auto",
            }}>
              {suggestions.map((entry) => (
                <button
                  key={entry.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    borderBottom: `1px solid ${colors.border}22`,
                    color: colors.text,
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(entry)}
                >
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{entry.name}</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {entry.muscles?.primary?.slice(0, 3).map((m) => (
                      <span key={m} style={{
                        fontSize: 10, fontWeight: 600, opacity: 0.5,
                      }}>
                        {m.replace(/_/g, " ").toLowerCase()}
                      </span>
                    ))}
                    {entry.movement && (
                      <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.35 }}>
                        {entry.movement}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI enrichment status */}
        {enriching && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
            <div style={{
              width: 16, height: 16, border: `2px solid ${colors.accent}`,
              borderTopColor: "transparent", borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontSize: 12, opacity: 0.6 }}>Classifying exercise...</span>
          </div>
        )}

        {enrichError && !enriching && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 10,
            background: colors.subtleBg, fontSize: 12, opacity: 0.7,
          }}>
            <span style={{ flex: 1 }}>Auto-classify unavailable — you can still add the exercise manually.</span>
            <button
              style={{
                background: "transparent", border: "none", color: colors.accent,
                fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "2px 6px",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                onUpdate({ enrichError: null, enriched: false });
                lastEnrichedRef.current = "";
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* AI results — body diagram + chips */}
        {enriched && !enriching && (
          <>
            {hasMuscles ? (
              <BodyDiagram highlightedMuscles={muscles.primary} colors={colors} />
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "24px 16px", gap: 8,
                borderRadius: 12, background: colors.subtleBg, opacity: 0.6,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                  Full-body / no specific muscle targeting
                </span>
              </div>
            )}

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {movement && <span style={movementChipStyle}>{movement}</span>}
              {(equipment || []).map((e) => (
                <span key={e} style={equipChip}>{e}</span>
              ))}
            </div>

            {hasMuscles && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginBottom: 6 }}>Muscles</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {muscles.primary.map((m) => (
                    <span key={m} style={muscleChip}>{formatMuscleName(m)}</span>
                  ))}
                </div>
              </div>
            )}

            {tags?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginBottom: 6 }}>Tags</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tags.map((t) => (
                    <span key={t} style={tagChip}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Unit selector */}
        <div style={styles.fieldCol}>
          <label style={styles.label}>Unit</label>
          <select
            value={unit}
            onChange={(e) => onUpdate({ unit: e.target.value })}
            style={styles.textInput}
          >
            {REP_UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label} ({u.abbr})
              </option>
            ))}
            <option value="custom">Custom...</option>
          </select>
        </div>

        {unit === "custom" && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ ...styles.fieldCol, flex: 1 }}>
              <label style={styles.label}>Abbreviation</label>
              <input
                value={customUnitAbbr || ""}
                onChange={(e) => onUpdate({ customUnitAbbr: e.target.value.slice(0, 10) })}
                style={styles.textInput}
                placeholder="e.g. cal"
              />
            </div>
            <div style={{ ...styles.fieldCol, alignItems: "center" }}>
              <label style={styles.label}>Decimals</label>
              <input
                type="checkbox"
                checked={customUnitAllowDecimal || false}
                onChange={(e) => onUpdate({ customUnitAllowDecimal: e.target.checked })}
                style={styles.checkbox}
              />
            </div>
          </div>
        )}

        {/* Workout selector (browse mode only) */}
        {isBrowseMode && hasWorkouts && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginBottom: 6 }}>Add to Workout</div>
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

            {dropdownOpen && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 6,
                padding: "6px 0",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.cardBg,
                maxHeight: 180,
                overflowY: "auto",
              }}>
                {workouts.map((w) => {
                  const isChecked = checked.has(w.id);
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
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onClick={() => toggleChecked(w.id)}
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
                      {w.category && (
                        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.4 }}>{w.category}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
