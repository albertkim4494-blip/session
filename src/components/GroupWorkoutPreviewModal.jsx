import React from "react";
import { Modal } from "./Modal";
import { getUnit } from "../lib/constants";
import { formatTimeAgo } from "../lib/announcementUtils";

export function GroupWorkoutPreviewModal({ open, state: previewState, dispatch, styles, colors, onStartWorkout }) {
  if (!open) return null;

  const gw = previewState.groupWorkout;
  if (!gw) return null;

  const workout = gw.workout_snapshot;
  const sharedBy = gw.shared_by_profile;

  return (
    <Modal
      open={open}
      title={workout?.name || "Group Workout"}
      onClose={() => dispatch({ type: "CLOSE_GROUP_WORKOUT_PREVIEW" })}
      styles={styles}
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="btn-press"
            onClick={() => {
              onStartWorkout?.(gw);
              dispatch({ type: "CLOSE_GROUP_WORKOUT_PREVIEW" });
            }}
            style={{ ...styles.primaryBtn, width: "100%", padding: "14px 12px", textAlign: "center" }}
          >
            Start Workout
          </button>
          <button
            onClick={() => dispatch({ type: "CLOSE_GROUP_WORKOUT_PREVIEW" })}
            style={{
              background: "transparent", border: "none",
              color: colors.text, opacity: 0.5,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 0", width: "100%",
              fontFamily: "inherit",
            }}
          >
            Close
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Shared by */}
        {sharedBy && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 10,
            background: colors.subtleBg,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: colors.accent + "22", color: colors.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
              overflow: "hidden",
            }}>
              {sharedBy.avatar_url ? (
                <img src={sharedBy.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }} />
              ) : (
                (sharedBy.username || "?")[0].toUpperCase()
              )}
            </div>
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              shared by <strong>@{sharedBy.username}</strong>
            </span>
            <span style={{ fontSize: 11, opacity: 0.4, marginLeft: "auto" }}>
              {formatTimeAgo(gw.created_at)}
            </span>
          </div>
        )}

        {/* Message */}
        {gw.message && (
          <div style={{
            padding: "10px 12px", borderRadius: 10,
            background: colors.accentBg,
            border: `1px solid ${colors.accentBorder}`,
            fontSize: 13, fontStyle: "italic", lineHeight: 1.4,
          }}>
            "{gw.message}"
          </div>
        )}

        {/* Exercises with prescribed sets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>
            Exercises ({workout?.exercises?.length || 0})
          </div>
          {(workout?.exercises || []).map((ex, i) => {
            const unit = getUnit(ex.unit, ex);
            const sets = ex.prescribedSets || [];
            return (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: 10,
                background: colors.subtleBg,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: sets.length > 0 ? 8 : 0 }}>
                  {ex.name}
                </div>
                {ex.notes && (
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6, fontStyle: "italic" }}>
                    {ex.notes}
                  </div>
                )}
                {sets.length > 0 && (
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {/* Set table headers */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr 1fr 50px 50px",
                      gap: 4, fontWeight: 600, opacity: 0.6, marginBottom: 4,
                    }}>
                      <span style={{ textAlign: "center" }}>Set</span>
                      <span>Reps</span>
                      <span>Weight</span>
                      <span style={{ textAlign: "center" }}>RPE</span>
                      <span style={{ textAlign: "center" }}>Rest</span>
                    </div>
                    {sets.map((s, si) => (
                      <div key={si} style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr 1fr 50px 50px",
                        gap: 4, padding: "3px 0",
                        borderTop: si > 0 ? `1px solid ${colors.border}` : "none",
                      }}>
                        <span style={{ textAlign: "center", opacity: 0.5, fontWeight: 600 }}>{si + 1}</span>
                        <span>{s.reps || s.targetTime || "-"}</span>
                        <span>{s.weight || s.pace || "-"}</span>
                        <span style={{ textAlign: "center" }}>{s.rpe || "-"}</span>
                        <span style={{ textAlign: "center" }}>{s.rest ? `${s.rest}s` : "-"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {(!workout?.exercises || workout.exercises.length === 0) && (
            <div style={{ textAlign: "center", padding: 12, opacity: 0.5, fontSize: 13 }}>
              No exercises
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

