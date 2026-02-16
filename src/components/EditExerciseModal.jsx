import React, { useState, useMemo } from "react";
import { Modal } from "./Modal";
import { REP_UNITS } from "../lib/constants";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch } from "../lib/exerciseCatalogUtils";

export function EditExerciseModal({
  open, modalState, onUpdate, onClose, onSave, styles, colors, catalog,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    name, unit, customUnitAbbr, customUnitAllowDecimal,
    originalName, originalUnit, catalogId,
  } = modalState;

  const unitChanged = unit !== originalUnit;

  // Catalog search suggestions based on name input
  const suggestions = useMemo(() => {
    const q = (name || "").trim();
    if (q.length < 2) return [];
    return catalogSearch(catalog || EXERCISE_CATALOG, q, { limit: 6 });
  }, [name, catalog]);

  if (!open) return null;

  const selectSuggestion = (entry) => {
    setShowSuggestions(false);
    onUpdate({
      name: entry.name,
      catalogId: entry.id,
      unit: entry.defaultUnit || "reps",
    });
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Name input with autocomplete */}
        <div style={{ ...styles.fieldCol, position: "relative" }}>
          <label style={styles.label}>Exercise name</label>
          <input
            value={name}
            onChange={(e) => {
              onUpdate({ name: e.target.value, catalogId: null });
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={styles.textInput}
            placeholder="e.g. Bench Press"
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
      </div>
    </Modal>
  );
}
