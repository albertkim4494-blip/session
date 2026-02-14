import React, { useEffect } from "react";
import { Modal } from "./Modal";
import { getFriends, shareWorkout } from "../lib/socialApi";

export function ShareWorkoutModal({ open, state: shareState, dispatch, workouts, styles, colors, onSent }) {
  // Load friends list on open
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const { data } = await getFriends();
      if (!cancelled) {
        dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { friends: data || [] } });
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  async function handleSend() {
    const workout = workouts.find((w) => w.id === shareState.workoutId);
    if (!workout || !shareState.selectedFriendId) return;

    dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { sending: true } });
    const { error } = await shareWorkout(
      shareState.selectedFriendId,
      workout,
      shareState.message
    );
    dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { sending: false } });

    if (!error) {
      const friend = shareState.friends.find((f) => f.id === shareState.selectedFriendId);
      dispatch({ type: "CLOSE_SHARE_WORKOUT" });
      onSent?.(friend?.username);
    }
  }

  if (!open) return null;

  const selectedWorkout = workouts.find((w) => w.id === shareState.workoutId);
  const needsWorkoutPick = !shareState.workoutId;
  const needsFriendPick = !shareState.selectedFriendId;

  return (
    <Modal
      open={open}
      title="Share Workout"
      onClose={() => dispatch({ type: "CLOSE_SHARE_WORKOUT" })}
      styles={styles}
      footer={
        <button
          className="btn-press"
          disabled={!shareState.workoutId || !shareState.selectedFriendId || shareState.sending}
          onClick={handleSend}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            padding: "14px 12px",
            textAlign: "center",
            opacity: (!shareState.workoutId || !shareState.selectedFriendId || shareState.sending) ? 0.5 : 1,
          }}
        >
          {shareState.sending ? "Sending..." : "Send"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Workout selection */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Workout</label>
          {needsWorkoutPick ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {workouts.length === 0 ? (
                <div style={{ textAlign: "center", padding: 12, opacity: 0.5, fontSize: 13 }}>
                  No workouts to share
                </div>
              ) : (
                workouts.map((w) => (
                  <button
                    key={w.id}
                    className="btn-press"
                    onClick={() => dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { workoutId: w.id, workoutName: w.name } })}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 12px", borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.subtleBg,
                      color: colors.text, cursor: "pointer",
                      textAlign: "left", width: "100%",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{w.name}</span>
                    <span style={{ fontSize: 12, opacity: 0.5 }}>{w.exercises?.length || 0} exercises</span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 10,
              background: colors.accentBg,
              border: `1px solid ${colors.accentBorder}`,
            }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{shareState.workoutName}</span>
              <button
                onClick={() => dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { workoutId: null, workoutName: "" } })}
                style={{ background: "none", border: "none", color: colors.text, opacity: 0.5, cursor: "pointer", padding: 2 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Friend selection */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Send to</label>
          {shareState.friends.length === 0 ? (
            <div style={{ textAlign: "center", padding: 12, opacity: 0.5, fontSize: 13 }}>
              No friends yet
            </div>
          ) : needsFriendPick ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {shareState.friends.map((f) => (
                <button
                  key={f.id}
                  className="btn-press"
                  onClick={() => dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { selectedFriendId: f.id } })}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 12px", borderRadius: 10,
                    border: `1px solid ${colors.border}`,
                    background: colors.subtleBg,
                    color: colors.text, cursor: "pointer",
                    textAlign: "left", width: "100%",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: colors.accent + "22", color: colors.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    overflow: "hidden",
                  }}>
                    {f.avatar_url ? (
                      <img src={f.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }} />
                    ) : (
                      (f.username || "?")[0].toUpperCase()
                    )}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>@{f.username}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", borderRadius: 10,
              background: colors.accentBg,
              border: `1px solid ${colors.accentBorder}`,
            }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                @{shareState.friends.find((f) => f.id === shareState.selectedFriendId)?.username}
              </span>
              <button
                onClick={() => dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { selectedFriendId: null } })}
                style={{ background: "none", border: "none", color: colors.text, opacity: 0.5, cursor: "pointer", padding: 2 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>Message (optional)</label>
          <textarea
            className="input-focus"
            value={shareState.message || ""}
            onChange={(e) => dispatch({ type: "UPDATE_SHARE_WORKOUT", payload: { message: e.target.value.slice(0, 200) } })}
            placeholder="Add a note..."
            maxLength={200}
            rows={2}
            style={{
              ...styles.textInput,
              fontFamily: "inherit",
              resize: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.4, marginTop: 2 }}>
            {(shareState.message || "").length}/200
          </div>
        </div>
      </div>
    </Modal>
  );
}
