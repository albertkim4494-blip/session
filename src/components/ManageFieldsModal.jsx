import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { PRESET_FIELDS, getGroupCustomFields, createCustomField, updateCustomField, deleteCustomField } from "../lib/groupApi";

export function ManageFieldsModal({ open, state: modalState, dispatch, styles, colors, showToast, onUpdated }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newField, setNewField] = useState({ fieldName: "", fieldType: "text", required: false, options: "" });
  const [saving, setSaving] = useState(false);

  const groupId = modalState.groupId;

  useEffect(() => {
    if (open && groupId) {
      setLoading(true);
      getGroupCustomFields(groupId).then(({ data }) => {
        setFields(data || []);
        setLoading(false);
      });
    }
  }, [open, groupId]);

  if (!open) return null;

  const usedPresetKeys = new Set(fields.map(f => f.preset_key).filter(Boolean));
  const availablePresets = PRESET_FIELDS.filter(p => !usedPresetKeys.has(p.key));

  async function handleAddPreset(preset) {
    setSaving(true);
    const { data } = await createCustomField(groupId, {
      fieldName: preset.name,
      fieldType: preset.type,
      required: preset.required,
      options: preset.options || null,
      presetKey: preset.key,
    });
    if (data) {
      setFields(prev => [...prev, data]);
      showToast?.(`Added ${preset.name}`);
      onUpdated?.();
    }
    setSaving(false);
  }

  async function handleAddCustom() {
    const name = newField.fieldName.trim();
    if (!name) return;
    setSaving(true);
    const options = newField.fieldType === "select"
      ? newField.options.split("\n").map(s => s.trim()).filter(Boolean)
      : null;
    const { data } = await createCustomField(groupId, {
      fieldName: name,
      fieldType: newField.fieldType,
      required: newField.required,
      options,
    });
    if (data) {
      setFields(prev => [...prev, data]);
      setNewField({ fieldName: "", fieldType: "text", required: false, options: "" });
      setAddMode(false);
      showToast?.("Field added");
      onUpdated?.();
    }
    setSaving(false);
  }

  async function handleToggleRequired(field) {
    const updated = !field.required;
    await updateCustomField(field.id, { required: updated });
    setFields(prev => prev.map(f => f.id === field.id ? { ...f, required: updated } : f));
    onUpdated?.();
  }

  async function handleDelete(field) {
    await deleteCustomField(field.id);
    setFields(prev => prev.filter(f => f.id !== field.id));
    showToast?.(`Removed ${field.field_name}`);
    onUpdated?.();
  }

  return (
    <Modal
      open={open}
      title="Member Fields"
      onClose={() => dispatch({ type: "CLOSE_MANAGE_FIELDS" })}
      styles={styles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>Loading...</div>
        ) : (
          <>
            {/* Existing fields */}
            {fields.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.6 }}>Current Fields</div>
                {fields.map(f => (
                  <div key={f.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 12px", borderRadius: 10,
                    background: colors.subtleBg, border: `1px solid ${colors.border}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {f.field_name}
                        {f.preset_key && (
                          <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 6 }}>preset</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.5 }}>
                        {f.field_type}{f.required ? " · required" : ""}
                      </div>
                    </div>
                    <button
                      className="btn-press"
                      onClick={() => handleToggleRequired(f)}
                      style={{
                        ...styles.secondaryBtn, padding: "4px 8px", fontSize: 11,
                        color: f.required ? colors.accent : colors.text,
                        opacity: f.required ? 1 : 0.5,
                      }}
                    >
                      {f.required ? "Required" : "Optional"}
                    </button>
                    <button
                      className="btn-press"
                      onClick={() => handleDelete(f)}
                      style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", padding: 4, fontSize: 11, fontFamily: "inherit" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick-add presets */}
            {availablePresets.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.6 }}>Quick Add</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {availablePresets.map(p => (
                    <button
                      key={p.key}
                      className="btn-press"
                      disabled={saving}
                      onClick={() => handleAddPreset(p)}
                      style={{
                        ...styles.secondaryBtn,
                        padding: "6px 12px", fontSize: 12,
                        opacity: saving ? 0.5 : 1,
                      }}
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add custom field */}
            {!addMode ? (
              <button
                className="btn-press"
                onClick={() => setAddMode(true)}
                style={{
                  ...styles.secondaryBtn, width: "100%", textAlign: "center",
                  padding: "10px 14px",
                }}
              >
                + Add Custom Field
              </button>
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", gap: 10,
                padding: "12px 14px", borderRadius: 12,
                background: colors.subtleBg, border: `1px solid ${colors.border}`,
              }}>
                <input
                  className="input-focus"
                  value={newField.fieldName}
                  onChange={(e) => setNewField(prev => ({ ...prev, fieldName: e.target.value.slice(0, 100) }))}
                  placeholder="Field name"
                  maxLength={100}
                  autoFocus
                  style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
                />
                <select
                  className="input-focus"
                  value={newField.fieldType}
                  onChange={(e) => setNewField(prev => ({ ...prev, fieldType: e.target.value }))}
                  style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select (dropdown)</option>
                </select>
                {newField.fieldType === "select" && (
                  <textarea
                    className="input-focus"
                    value={newField.options}
                    onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                    placeholder="One option per line"
                    rows={3}
                    style={{ ...styles.textInput, fontFamily: "inherit", resize: "none", width: "100%", boxSizing: "border-box" }}
                  />
                )}
                <div
                  className="btn-press"
                  onClick={() => setNewField(prev => ({ ...prev, required: !prev.required }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `2px solid ${newField.required ? colors.accent : colors.border}`,
                    background: newField.required ? colors.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s",
                  }}>
                    {newField.required && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                  </div>
                  <span style={{ fontSize: 13 }}>Required</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-press"
                    onClick={() => setAddMode(false)}
                    style={{ ...styles.secondaryBtn, flex: 1, padding: "10px 12px", textAlign: "center" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-press"
                    disabled={!newField.fieldName.trim() || saving}
                    onClick={handleAddCustom}
                    style={{
                      ...styles.primaryBtn, flex: 1, padding: "10px 12px", textAlign: "center",
                      opacity: (!newField.fieldName.trim() || saving) ? 0.5 : 1,
                    }}
                  >
                    {saving ? "Adding..." : "Add Field"}
                  </button>
                </div>
              </div>
            )}

            {fields.length === 0 && !addMode && (
              <div style={{ textAlign: "center", padding: 16, opacity: 0.5, fontSize: 13 }}>
                No member fields yet. Add presets or create custom fields.
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
