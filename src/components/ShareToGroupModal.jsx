import React, { useState } from "react";
import { Modal } from "./Modal";
import { shareWorkoutToGroup } from "../lib/groupApi";

function uid() {
  return "ex_" + Math.random().toString(36).slice(2, 10);
}

function emptySet() {
  return { reps: "", weight: "", rpe: "", rest: "" };
}

function emptyExercise() {
  return { id: uid(), name: "", unit: "reps", notes: "", prescribedSets: [emptySet()] };
}

export function ShareToGroupModal({ open, state: modalState, dispatch, styles, colors, onShared }) {
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [workoutName, setWorkoutName] = useState("");
  const [message, setMessage] = useState("");

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setExercises([emptyExercise()]);
      setWorkoutName("");
      setMessage("");
    }
  }, [open]);

  if (!open) return null;

  function updateExercise(idx, field, value) {
    setExercises((prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  }

  function updateSet(exIdx, setIdx, field, value) {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const newSets = ex.prescribedSets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s);
      return { ...ex, prescribedSets: newSets };
    }));
  }

  function addSet(exIdx) {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      return { ...ex, prescribedSets: [...ex.prescribedSets, emptySet()] };
    }));
  }

  function removeSet(exIdx, setIdx) {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx || ex.prescribedSets.length <= 1) return ex;
      return { ...ex, prescribedSets: ex.prescribedSets.filter((_, si) => si !== setIdx) };
    }));
  }

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(idx) {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  const validExercises = exercises.filter((ex) => ex.name.trim());
  const canShare = validExercises.length > 0 && !modalState.sending;

  async function handleShare() {
    const snapshot = {
      name: workoutName.trim() || "Group Workout",
      category: "Workout",
      exercises: validExercises.map((ex) => ({
        name: ex.name.trim(),
        unit: ex.unit,
        notes: ex.notes.trim() || undefined,
        prescribedSets: ex.prescribedSets.map((s) => {
          const set = {};
          if (s.reps) set.reps = Number(s.reps) || 0;
          if (s.weight) set.weight = s.weight;
          if (s.rpe) set.rpe = s.rpe;
          if (s.rest) set.rest = Number(s.rest) || 0;
          if (s.targetTime) set.targetTime = s.targetTime;
          if (s.pace) set.pace = s.pace;
          return set;
        }),
      })),
    };

    dispatch({ type: "UPDATE_SHARE_TO_GROUP", payload: { sending: true } });
    const { error } = await shareWorkoutToGroup(modalState.groupId, snapshot, message);
    dispatch({ type: "UPDATE_SHARE_TO_GROUP", payload: { sending: false } });

    if (!error) {
      dispatch({ type: "CLOSE_SHARE_TO_GROUP" });
      onShared?.();
    }
  }

  const inputStyle = { ...styles.textInput, fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
  const smallInput = { ...inputStyle, width: 70, textAlign: "center", padding: "6px 4px", fontSize: 13 };

  return (
    <Modal
      open={open}
      title={`Share to ${modalState.groupName || "Group"}`}
      onClose={() => dispatch({ type: "CLOSE_SHARE_TO_GROUP" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!canShare}
          onClick={handleShare}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: canShare ? 1 : 0.5,
          }}
        >
          {modalState.sending ? "Sharing..." : "Share to Group"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Group chip */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 999,
          background: colors.accentBg,
          border: `1px solid ${colors.accentBorder}`,
          fontSize: 12, fontWeight: 600, alignSelf: "flex-start",
        }}>
          {modalState.groupName}
        </div>

        {/* Workout name */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Workout Name</label>
          <input
            className="input-focus"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value.slice(0, 80))}
            placeholder="e.g. Monday Push Day"
            maxLength={80}
            style={inputStyle}
          />
        </div>

        {/* Exercises */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ ...styles.label, display: "block" }}>Exercises</label>

          {exercises.map((ex, exIdx) => (
            <div key={ex.id} style={{
              padding: "12px 10px", borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: colors.cardAltBg,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {/* Exercise header */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  className="input-focus"
                  value={ex.name}
                  onChange={(e) => updateExercise(exIdx, "name", e.target.value)}
                  placeholder={`Exercise ${exIdx + 1}`}
                  style={{ ...inputStyle, flex: 1, fontWeight: 600 }}
                />
                {exercises.length > 1 && (
                  <button
                    onClick={() => removeExercise(exIdx)}
                    style={{ background: "none", border: "none", color: colors.text, opacity: 0.4, cursor: "pointer", padding: 4 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>

              {/* Notes */}
              <input
                className="input-focus"
                value={ex.notes}
                onChange={(e) => updateExercise(exIdx, "notes", e.target.value)}
                placeholder="Notes (optional)"
                style={{ ...inputStyle, fontSize: 12, opacity: 0.8 }}
              />

              {/* Set headers */}
              <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 60px 60px 28px", gap: 4, alignItems: "center", fontSize: 11, fontWeight: 600, opacity: 0.5 }}>
                <span style={{ textAlign: "center" }}>#</span>
                <span>Reps</span>
                <span>Weight</span>
                <span style={{ textAlign: "center" }}>RPE</span>
                <span style={{ textAlign: "center" }}>Rest</span>
                <span></span>
              </div>

              {/* Set rows */}
              {ex.prescribedSets.map((s, si) => (
                <div key={si} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 60px 60px 28px", gap: 4, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center", opacity: 0.5 }}>{si + 1}</span>
                  <input
                    className="input-focus"
                    type="number"
                    inputMode="numeric"
                    value={s.reps}
                    onChange={(e) => updateSet(exIdx, si, "reps", e.target.value)}
                    placeholder="10"
                    style={{ ...smallInput, width: "100%" }}
                  />
                  <input
                    className="input-focus"
                    value={s.weight}
                    onChange={(e) => updateSet(exIdx, si, "weight", e.target.value)}
                    placeholder="135"
                    style={{ ...smallInput, width: "100%" }}
                  />
                  <select
                    className="input-focus"
                    value={s.rpe}
                    onChange={(e) => updateSet(exIdx, si, "rpe", e.target.value)}
                    style={{ ...smallInput, width: "100%", padding: "6px 2px" }}
                  >
                    <option value="">-</option>
                    {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((v) => (
                      <option key={v} value={String(v)}>{v}</option>
                    ))}
                  </select>
                  <input
                    className="input-focus"
                    type="number"
                    inputMode="numeric"
                    value={s.rest}
                    onChange={(e) => updateSet(exIdx, si, "rest", e.target.value)}
                    placeholder="90"
                    style={{ ...smallInput, width: "100%" }}
                  />
                  <button
                    onClick={() => removeSet(exIdx, si)}
                    style={{
                      background: "none", border: "none", color: colors.text,
                      opacity: ex.prescribedSets.length <= 1 ? 0.15 : 0.4,
                      cursor: ex.prescribedSets.length <= 1 ? "default" : "pointer",
                      padding: 2,
                    }}
                    disabled={ex.prescribedSets.length <= 1}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>
              ))}

              {/* Add set button */}
              <button
                className="btn-press"
                onClick={() => addSet(exIdx)}
                style={{
                  background: "none", border: `1px dashed ${colors.border}`,
                  borderRadius: 8, padding: "6px 0", cursor: "pointer",
                  color: colors.accent, fontSize: 12, fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                + Add Set
              </button>
            </div>
          ))}

          {/* Add exercise button */}
          <button
            className="btn-press"
            onClick={addExercise}
            style={{
              ...styles.secondaryBtn,
              width: "100%",
              textAlign: "center",
              padding: "10px 12px",
            }}
          >
            + Add Exercise
          </button>
        </div>

        {/* Message */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Message (optional)</label>
          <textarea
            className="input-focus"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            placeholder="Add a note for the group..."
            maxLength={500}
            rows={2}
            style={{ ...inputStyle, resize: "none" }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {message.length}/500
          </div>
        </div>
      </div>
    </Modal>
  );
}
