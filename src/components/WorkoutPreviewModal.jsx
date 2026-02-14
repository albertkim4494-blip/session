import React from "react";
import { Modal } from "./Modal";
import { getUnit } from "../lib/constants";

export function WorkoutPreviewModal({ open, state: previewState, dispatch, styles, colors, onImport }) {
  if (!open) return null;

  const sw = previewState.sharedWorkout;
  if (!sw) return null;

  const workout = sw.workout_snapshot;
  const fromUser = sw.from_profile;

  function handleImport() {
    dispatch({ type: "UPDATE_WORKOUT_PREVIEW", payload: { importing: true } });
    onImport?.(sw);
  }

  function handleDismiss() {
    dispatch({ type: "CLOSE_WORKOUT_PREVIEW" });
  }

  return (
    <Modal
      open={open}
      title={workout?.name || "Shared Workout"}
      onClose={() => dispatch({ type: "CLOSE_WORKOUT_PREVIEW" })}
      styles={styles}
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="btn-press"
            disabled={previewState.importing}
            onClick={handleImport}
            style={{
              ...styles.primaryBtn,
              width: "100%",
              padding: "14px 12px",
              textAlign: "center",
              opacity: previewState.importing ? 0.5 : 1,
            }}
          >
            {previewState.importing ? "Adding..." : "Add to My Plan"}
          </button>
          <button
            onClick={handleDismiss}
            style={{
              background: "transparent", border: "none",
              color: colors.text, opacity: 0.5,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              padding: "8px 0", width: "100%",
            }}
          >
            Dismiss
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* From user */}
        {fromUser && (
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
              {fromUser.avatar_url ? (
                <img src={fromUser.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }} />
              ) : (
                (fromUser.username || "?")[0].toUpperCase()
              )}
            </div>
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              from <strong>@{fromUser.username}</strong>
            </span>
            <span style={{ fontSize: 11, opacity: 0.4, marginLeft: "auto" }}>
              {formatTimeAgo(sw.created_at)}
            </span>
          </div>
        )}

        {/* Message */}
        {sw.message && (
          <div style={{
            padding: "10px 12px", borderRadius: 10,
            background: colors.accentBg,
            border: `1px solid ${colors.accentBorder}`,
            fontSize: 13, fontStyle: "italic", lineHeight: 1.4,
          }}>
            "{sw.message}"
          </div>
        )}

        {/* Category tag */}
        {workout?.category && (
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 8px",
              borderRadius: 999, background: colors.subtleBg,
              opacity: 0.7,
            }}>
              {workout.category}
            </span>
          </div>
        )}

        {/* Exercises */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>
            Exercises ({workout?.exercises?.length || 0})
          </div>
          {(workout?.exercises || []).map((ex, i) => {
            const unit = getUnit(ex.unit, ex);
            return (
              <div
                key={ex.id || i}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 10,
                  background: colors.subtleBg,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ex.name}
                  </div>
                  {ex.scheme && (
                    <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>
                      {ex.scheme}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, opacity: 0.5, flexShrink: 0 }}>
                  {unit.abbr}
                </span>
              </div>
            );
          })}
          {(!workout?.exercises || workout.exercises.length === 0) && (
            <div style={{ textAlign: "center", padding: 12, opacity: 0.5, fontSize: 13 }}>
              No exercises
            </div>
          )}
        </div>

        {/* Note */}
        {workout?.note && (
          <div style={{
            padding: "8px 12px", borderRadius: 10,
            background: colors.subtleBg,
            fontSize: 12, opacity: 0.6, lineHeight: 1.4,
          }}>
            {workout.note}
          </div>
        )}
      </div>
    </Modal>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
