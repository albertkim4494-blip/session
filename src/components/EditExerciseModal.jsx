import React, { useState, useMemo, useRef, useEffect } from "react";
import { Modal } from "./Modal";
import { REP_UNITS } from "../lib/constants";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch } from "../lib/exerciseCatalogUtils";

export function EditExerciseModal({
  open, modalState, onUpdate, onClose, onSave, styles, colors, catalog,
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const {
    name, unit, customUnitAbbr, customUnitAllowDecimal,
    originalName, originalUnit, catalogId,
  } = modalState;

  const unitChanged = unit !== originalUnit;
  const trimmedName = (name || "").trim();

  // Inline suggestions — show when input is focused and has 2+ chars
  const suggestions = useMemo(() => {
    if (trimmedName.length < 2) return [];
    return catalogSearch(catalog || EXERCISE_CATALOG, trimmedName, { limit: Infinity });
  }, [trimmedName, catalog]);

  const showSuggestions = focused && trimmedName.length >= 2;

  // Is the current name an exact catalog match?
  const exactMatch = useMemo(() => {
    if (!trimmedName) return false;
    const lower = trimmedName.toLowerCase();
    return suggestions.some((e) => e.name.toLowerCase() === lower);
  }, [trimmedName, suggestions]);

  // Reset focus state when modal opens
  useEffect(() => {
    if (open) setFocused(false);
  }, [open]);

  if (!open) return null;

  const selectSuggestion = (entry) => {
    setFocused(false);
    onUpdate({
      name: entry.name,
      catalogId: entry.id,
      unit: entry.defaultUnit || "reps",
    });
  };

  const useCustomName = () => {
    setFocused(false);
    onUpdate({ name: trimmedName, catalogId: null });
  };

  // Result row style
  const resultBtn = {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: colors.cardAltBg,
    color: colors.text,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  const footer = (
    <div style={styles.modalFooter}>
      <button className="btn-press" style={styles.secondaryBtn} onClick={onClose}>
        Cancel
      </button>
      <button className="btn-press" style={styles.primaryBtn} onClick={onSave}>
        Save
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      title="Edit Exercise"
      onClose={onClose}
      styles={styles}
      footer={footer}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
        {/* Name input */}
        <div style={styles.fieldCol}>
          <label style={styles.label}>Exercise name</label>
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => {
                onUpdate({ name: e.target.value, catalogId: null });
                setFocused(true);
              }}
              onFocus={() => setFocused(true)}
              style={{
                ...styles.textInput,
                paddingRight: trimmedName ? 32 : undefined,
              }}
              placeholder="e.g. Bench Press"
              autoFocus
            />
            {/* Clear button */}
            {trimmedName && focused && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onUpdate({ name: "", catalogId: null });
                  inputRef.current?.focus();
                }}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: colors.text,
                  opacity: 0.35,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Clear"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Inline suggestions when focused */}
        {showSuggestions ? (
          <div style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            {/* "Use as custom name" option — shown when text doesn't exactly match a catalog entry */}
            {!exactMatch && trimmedName.length > 0 && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={useCustomName}
                style={{
                  ...resultBtn,
                  background: colors.primaryBg,
                  borderColor: colors.accent + "44",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.primaryText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span style={{ fontWeight: 700, fontSize: 13, color: colors.primaryText }}>
                  Use "{trimmedName}"
                </span>
              </button>
            )}
            {suggestions.map((entry) => (
              <button
                key={entry.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(entry)}
                style={resultBtn}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>{entry.name}</span>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {entry.muscles?.primary?.slice(0, 3).map((m) => (
                    <span key={m} style={{ fontSize: 10, fontWeight: 600, opacity: 0.5 }}>
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
            {suggestions.length === 0 && (
              <div style={{ textAlign: "center", padding: 16, opacity: 0.4, fontSize: 12 }}>
                No catalog matches
              </div>
            )}
          </div>
        ) : (
          <>
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

            {/* Catalog match indicator */}
            {trimmedName && !catalogId && (
              <div style={{
                fontSize: 11,
                opacity: 0.45,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Custom name — no catalog data (muscles, gif)
              </div>
            )}

            {/* Unit change warning */}
            {unitChanged && (
              <div style={{
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(255,193,7,0.08)",
                border: "1px solid rgba(255,193,7,0.25)",
                fontSize: 12,
                lineHeight: 1.5,
                opacity: 0.85,
              }}>
                Changing the unit may affect how existing logs display. Consider creating a new exercise instead.
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
