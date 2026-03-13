import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { getMyFieldValues, setFieldValue } from "../lib/groupApi";

export function FillFieldsModal({ open, state: modalState, dispatch, styles, colors, showToast }) {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = modalState.fields || [];
  const groupId = modalState.groupId;
  const requiredMode = modalState.requiredMode;

  useEffect(() => {
    if (open && groupId) {
      setLoading(true);
      getMyFieldValues(groupId).then(({ data }) => {
        const map = {};
        for (const v of (data || [])) {
          map[v.field_id] = v.value || "";
        }
        setValues(map);
        setLoading(false);
      });
    }
  }, [open, groupId]);

  if (!open) return null;

  const requiredFields = fields.filter(f => f.required);
  const allRequiredFilled = requiredFields.every(f => (values[f.id] || "").trim().length > 0);
  const canClose = !requiredMode || allRequiredFilled;

  async function handleSave() {
    if (requiredMode && !allRequiredFilled) return;
    setSaving(true);
    for (const f of fields) {
      const val = (values[f.id] || "").trim();
      if (val) {
        await setFieldValue(f.id, val);
      }
    }
    setSaving(false);
    showToast?.("Info saved");
    if (modalState.onComplete) {
      modalState.onComplete();
    }
    dispatch({ type: "CLOSE_FILL_FIELDS" });
  }

  function renderFieldInput(field) {
    const val = values[field.id] || "";
    const onChange = (v) => setValues(prev => ({ ...prev, [field.id]: v }));

    if (field.field_type === "select") {
      const options = Array.isArray(field.options) ? field.options : [];
      return (
        <select
          className="input-focus"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
        >
          <option value="">Select...</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (field.field_type === "date") {
      return (
        <input
          className="input-focus"
          type="date"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
        />
      );
    }

    if (field.field_type === "number") {
      return (
        <input
          className="input-focus"
          type="number"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter number"
          style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
        />
      );
    }

    return (
      <input
        className="input-focus"
        value={val}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter value"
        style={{ ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
      />
    );
  }

  return (
    <Modal
      open={open}
      title="My Info"
      onClose={canClose ? () => dispatch({ type: "CLOSE_FILL_FIELDS" }) : undefined}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={saving || (requiredMode && !allRequiredFilled)}
          onClick={handleSave}
          style={{
            ...styles.primaryBtn,
            width: "100%", padding: "14px 12px", textAlign: "center",
            opacity: (saving || (requiredMode && !allRequiredFilled)) ? 0.5 : 1,
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>Loading...</div>
        ) : fields.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>No fields to fill.</div>
        ) : (
          fields.map(f => (
            <div key={f.id}>
              <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>
                {f.field_name}
                {f.required && <span style={{ color: "#e74c3c", marginLeft: 4 }}>*</span>}
              </label>
              {renderFieldInput(f)}
            </div>
          ))
        )}

        {requiredMode && !allRequiredFilled && (
          <div style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600, textAlign: "center" }}>
            Please fill in all required fields to continue
          </div>
        )}
      </div>
    </Modal>
  );
}
