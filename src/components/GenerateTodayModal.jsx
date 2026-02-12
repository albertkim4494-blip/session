import React, { useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";

const EQUIPMENT_KEYS = ["home", "basic", "gym"];

const DURATION_OPTIONS = [
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90+ min" },
];

const MUSCLE_LABELS = {
  CHEST: "Chest",
  BACK: "Back",
  QUADS: "Quads",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",
  ANTERIOR_DELT: "Front Delts",
  LATERAL_DELT: "Side Delts",
  POSTERIOR_DELT: "Rear Delts",
  TRICEPS: "Triceps",
  BICEPS: "Biceps",
  ABS: "Abs",
};

export function GenerateTodayModal({
  open,
  todayState,
  dispatch,
  onGenerate,
  onAccept,
  onClose,
  styles,
  colors,
}) {
  if (!open) return null;

  const { step, duration, equipment, preview, loading, error } = todayState;
  const genRef = useRef(0);

  const update = (payload) =>
    dispatch({ type: "UPDATE_GENERATE_TODAY", payload });

  // Auto-generate when entering step 3 (preview)
  useEffect(() => {
    if (step !== 3 || preview || loading) return;
    const genId = ++genRef.current;
    onGenerate({ equipment, duration });
    // onGenerate handles setting loading/preview state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, preview, loading, equipment, duration]);

  const TOTAL_STEPS = 3; // 1=duration, 2=equipment, 3=preview

  const stepTitles = ["", "How much time do you have?", "Equipment?", "Generated Workout"];
  const stepTitle = stepTitles[step] || "";

  const goNext = () => {
    if (step < TOTAL_STEPS) update({ step: step + 1 });
  };
  const goBack = () => {
    if (step === 3) update({ step: step - 1, preview: null, loading: false, error: null });
    else if (step > 1) update({ step: step - 1 });
  };

  const handleRegenerate = () => {
    update({ preview: null, loading: false, error: null });
    // useEffect will re-trigger generation
  };

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

  const muscleChipStyle = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
    background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    border: `1px solid ${colors.border}`,
    opacity: 0.85,
  };

  return (
    <Modal open={open} title={stepTitle} onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Step 1: Duration */}
        {step === 1 && (
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

        {/* Step 2: Equipment */}
        {step === 2 && (
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

        {/* Step 3: Preview — loading */}
        {step === 3 && loading && !preview && (
          <div style={{ textAlign: "center", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, border: `3px solid ${colors.border}`,
              borderTopColor: colors.primaryBg, borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              Designing your workout...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Step 3: Preview — content */}
        {step === 3 && preview && (
          <>
            {error && (
              <div style={{
                fontSize: 12, padding: "6px 10px", borderRadius: 8,
                background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.3)",
                color: colors.text, opacity: 0.8,
              }}>
                {error}
              </div>
            )}

            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {preview.note || `Based on your recent training — targets muscles you haven't worked recently. ${duration} min session.`}
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.cardAltBg,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>
                  {preview.name}
                </div>
                {preview.scheme && (
                  <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 600 }}>
                    {preview.scheme}
                  </span>
                )}
              </div>

              {preview.targetMuscles && preview.targetMuscles.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                  {preview.targetMuscles.map((m) => (
                    <span key={m} style={muscleChipStyle}>
                      {MUSCLE_LABELS[m] || m.replace(/_/g, " ").toLowerCase()}
                    </span>
                  ))}
                </div>
              )}

              {preview.exercises.map((ex) => (
                <div key={ex.id} style={{ fontSize: 13, padding: "3px 0", opacity: 0.85, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{ex.name}</span>
                  {ex.scheme && (
                    <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, marginLeft: 8, whiteSpace: "nowrap" }}>
                      {ex.scheme}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={styles.modalFooter}>
          {step > 1 && !loading && (
            <button style={styles.secondaryBtn} onClick={goBack}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 && (
            <button style={styles.primaryBtn} onClick={goNext}>
              Next
            </button>
          )}
          {step === 3 && !loading && (
            <>
              <button style={styles.secondaryBtn} onClick={handleRegenerate}>
                Regenerate
              </button>
              <button
                style={{ ...styles.primaryBtn, marginLeft: 8 }}
                onClick={() => onAccept(preview)}
                disabled={!preview}
              >
                Use Today
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
