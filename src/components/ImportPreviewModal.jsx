import React from "react";
import { Modal } from "./Modal";

export function ImportPreviewModal({ open, state: modalState, dispatch, styles, colors, onConfirm }) {
  if (!open) return null;

  const { format, stats, importData, mode } = modalState;

  const formatLabel = format === "strong" ? "Strong CSV" : format === "hevy" ? "Hevy CSV" : format === "json" ? "Session JSON" : "CSV";
  const sessionCount = stats?.sessionCount ?? 0;
  const exerciseCount = stats?.exerciseCount ?? 0;
  const dateRange = stats?.dateRange;

  // Count matched vs unmatched exercises
  const matchedCount = (importData?.workouts || []).reduce(
    (acc, w) => acc + (w.exercises || []).filter((e) => e.catalogId).length,
    0
  );
  const unmatchedCount = exerciseCount - matchedCount;

  return (
    <Modal
      open={open}
      title="Import Preview"
      onClose={() => dispatch({ type: "CLOSE_IMPORT_PREVIEW" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          onClick={() => onConfirm?.(mode)}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
          }}
        >
          Import {sessionCount} Session{sessionCount !== 1 ? "s" : ""}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Format badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            background: colors.accent + "22",
            color: colors.accent,
          }}>
            {formatLabel}
          </span>
        </div>

        {/* Summary stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}>
          <StatCard label="Sessions" value={sessionCount} colors={colors} />
          <StatCard label="Exercises" value={exerciseCount} colors={colors} />
        </div>
        {dateRange && (
          <div style={{ fontSize: 13, opacity: 0.6, textAlign: "center" }}>
            {dateRange.from} to {dateRange.to}
          </div>
        )}

        {/* Exercise matching */}
        {exerciseCount > 0 && (
          <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: colors.cardAltBg,
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Exercise Matching</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              {matchedCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#4ade80" }}>&#10003;</span>
                  <span>{matchedCount} matched to catalog</span>
                </div>
              )}
              {unmatchedCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: colors.accent }}>+</span>
                  <span>{unmatchedCount} new exercise{unmatchedCount !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Import mode toggle */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Import Mode</div>
          <div style={{ display: "flex", gap: 8 }}>
            <ModeButton
              label="Merge"
              desc="Add new data, keep existing"
              active={mode === "merge"}
              onClick={() => dispatch({ type: "UPDATE_IMPORT_PREVIEW", payload: { mode: "merge" } })}
              colors={colors}
              styles={styles}
            />
            <ModeButton
              label="Replace"
              desc="Overwrite all data"
              active={mode === "replace"}
              onClick={() => dispatch({ type: "UPDATE_IMPORT_PREVIEW", payload: { mode: "replace" } })}
              colors={colors}
              styles={styles}
            />
          </div>
        </div>

        {/* Warning for replace mode */}
        {mode === "replace" && (
          <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: colors.dangerBg,
            border: `1px solid ${colors.dangerBorder}`,
            color: colors.dangerText,
            fontSize: 13,
          }}>
            This will overwrite all existing data. Your current workouts and logs will be replaced.
          </div>
        )}
      </div>
    </Modal>
  );
}

function StatCard({ label, value, colors }) {
  return (
    <div style={{
      padding: "10px 12px",
      borderRadius: 10,
      background: colors.cardAltBg,
      border: `1px solid ${colors.border}`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.5 }}>{label}</div>
    </div>
  );
}

function ModeButton({ label, desc, active, onClick, colors, styles }) {
  return (
    <button
      className="btn-press"
      onClick={onClick}
      type="button"
      style={{
        flex: 1,
        padding: "10px 8px",
        borderRadius: 10,
        border: `1.5px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accent + "18" : colors.cardAltBg,
        color: colors.text,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 11, opacity: 0.5 }}>{desc}</div>
    </button>
  );
}
