import React from "react";
import { Modal } from "./Modal";

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
  preview,
  onRegenerate,
  onAccept,
  onClose,
  styles,
  colors,
}) {
  if (!open || !preview) return null;

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
    <Modal open={open} title="Generated Workout" onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Based on your recent training — targets muscles you haven't worked recently.
        </div>

        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            background: colors.cardAltBg,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
            {preview.name}
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
            <div key={ex.id} style={{ fontSize: 13, padding: "2px 0", opacity: 0.85 }}>
              {ex.name}
            </div>
          ))}
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onRegenerate}>
            Regenerate
          </button>
          <button
            style={{ ...styles.primaryBtn, marginLeft: 8 }}
            onClick={() => onAccept(preview)}
          >
            Add to Program
          </button>
        </div>
      </div>
    </Modal>
  );
}
