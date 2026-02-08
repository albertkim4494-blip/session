import React, { useEffect } from "react";
import { Modal } from "./Modal";
import {
  generateProgram,
  GOALS,
} from "../lib/workoutGenerator";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";

const EQUIPMENT_KEYS = ["home", "basic", "gym"];

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 75, label: "75 min" },
  { value: 90, label: "90 min" },
];

const TOTAL_STEPS = 5;

export function GenerateWizardModal({
  open,
  wizardState,
  dispatch,
  onAccept,
  onClose,
  catalog,
  styles,
  colors,
}) {
  const { step, goal, daysPerWeek, equipment, duration, preview } = wizardState;

  // Generate preview when entering step 5
  useEffect(() => {
    if (step === TOTAL_STEPS && !preview) {
      const result = generateProgram({
        goal,
        daysPerWeek,
        equipment,
        duration,
        catalog,
      });
      dispatch({
        type: "UPDATE_GENERATE_WIZARD",
        payload: { preview: result },
      });
    }
  }, [step, preview, goal, daysPerWeek, equipment, duration, catalog, dispatch]);

  if (!open) return null;

  const update = (payload) =>
    dispatch({ type: "UPDATE_GENERATE_WIZARD", payload });

  const canNext =
    (step === 1 && goal) ||
    (step === 2) ||
    (step === 3) ||
    (step === 4) ||
    (step === 5);

  const goNext = () => {
    if (step < TOTAL_STEPS) update({ step: step + 1 });
  };
  const goBack = () => {
    if (step === TOTAL_STEPS) update({ step: step - 1, preview: null });
    else if (step > 1) update({ step: step - 1 });
  };

  const handleRegenerate = () => {
    const result = generateProgram({
      goal,
      daysPerWeek,
      equipment,
      duration,
      catalog,
    });
    update({ preview: result });
  };

  const handleAccept = () => {
    if (!preview) return;
    onAccept(preview.workouts, { goal, daysPerWeek, equipment, duration });
  };

  const chipStyle = (active) => ({
    padding: "10px 16px",
    borderRadius: 12,
    border: `2px solid ${active ? colors.primaryBg : colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
  });

  const smallChipStyle = (active) => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: `2px solid ${active ? colors.primaryBg : colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    minWidth: 44,
    textAlign: "center",
  });

  const stepTitle = [
    "",
    "What's your goal?",
    "Days per week?",
    "Equipment?",
    "Workout duration?",
    "Your Program",
  ][step];

  return (
    <Modal open={open} title={stepTitle} onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>
        {/* Step 1: Goal */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GOALS.map((g) => (
              <button
                key={g}
                style={chipStyle(goal === g)}
                onClick={() => update({ goal: g })}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Days per week */}
        {step === 2 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", paddingTop: 12 }}>
            {[2, 3, 4, 5, 6].map((d) => (
              <button
                key={d}
                style={smallChipStyle(daysPerWeek === d)}
                onClick={() => update({ daysPerWeek: d })}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Equipment */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EQUIPMENT_KEYS.map((key) => (
              <button
                key={key}
                style={chipStyle(equipment === key)}
                onClick={() => update({ equipment: key })}
              >
                {EQUIPMENT_LABELS[key]}
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Duration */}
        {step === 4 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", paddingTop: 12 }}>
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                style={smallChipStyle(duration === opt.value)}
                onClick={() => update({ duration: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 5: Preview */}
        {step === TOTAL_STEPS && preview && (
          <>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {daysPerWeek}-day {goal} program — {preview.scheme} per exercise — {duration} min sessions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "45vh", overflowY: "auto" }}>
              {preview.workouts.map((w) => (
                <div
                  key={w.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardAltBg,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{w.name}</div>
                  {w.exercises.map((ex) => (
                    <div key={ex.id} style={{ fontSize: 13, padding: "2px 0", opacity: 0.85 }}>
                      {ex.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {step === TOTAL_STEPS && !preview && (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5 }}>
            Generating...
          </div>
        )}

        {/* Footer */}
        <div style={styles.modalFooter}>
          {step > 1 && (
            <button style={styles.secondaryBtn} onClick={goBack}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < TOTAL_STEPS && (
            <button
              style={{
                ...styles.primaryBtn,
                opacity: canNext ? 1 : 0.4,
              }}
              disabled={!canNext}
              onClick={goNext}
            >
              Next
            </button>
          )}
          {step === TOTAL_STEPS && (
            <>
              <button style={styles.secondaryBtn} onClick={handleRegenerate}>
                Regenerate
              </button>
              <button
                style={{ ...styles.primaryBtn, marginLeft: 8 }}
                onClick={handleAccept}
                disabled={!preview}
              >
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
