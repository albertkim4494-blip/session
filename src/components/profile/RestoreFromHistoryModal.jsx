import React, { useEffect } from "react";
import { Modal } from "../Modal";
import { fetchHistorySnapshots } from "../../lib/supabaseSync";

function summarizeSnapshot(state) {
  const logDays = Object.keys(state?.logsByDate || {}).length;
  const dailyDays = Object.keys(state?.dailyWorkouts || {}).length;
  const programWorkouts = (state?.program?.workouts || []).length;
  const customExercises = (state?.customExercises || []).length;
  const totalLogEntries = Object.values(state?.logsByDate || {}).reduce(
    (acc, dayLogs) => acc + Object.keys(dayLogs || {}).length,
    0
  );
  const bytes = JSON.stringify(state || {}).length;
  return { logDays, dailyDays, programWorkouts, customExercises, totalLogEntries, bytes };
}

function formatTimestamp(iso) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const dateStr = sameDay
    ? "Today"
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateStr}, ${timeStr}`;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function RestoreFromHistoryModal({ open, modalState, dispatch, session, onRestore, styles, colors }) {
  const { snapshots, loading, expandedId, confirmId, restoring, error } = modalState;

  useEffect(() => {
    if (!open || !session?.user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchHistorySnapshots(session.user.id);
        if (cancelled) return;
        dispatch({ type: "UPDATE_RESTORE_HISTORY", payload: { snapshots: rows, loading: false, error: "" } });
      } catch (err) {
        if (cancelled) return;
        dispatch({
          type: "UPDATE_RESTORE_HISTORY",
          payload: { loading: false, error: err?.message || "Failed to load snapshots" },
        });
      }
    })();
    return () => { cancelled = true; };
  }, [open, session?.user?.id]);

  if (!open) return null;

  async function handleRestore(snapshot) {
    dispatch({ type: "UPDATE_RESTORE_HISTORY", payload: { restoring: true, error: "" } });
    try {
      await onRestore(snapshot.state);
      dispatch({ type: "CLOSE_RESTORE_HISTORY" });
    } catch (err) {
      dispatch({
        type: "UPDATE_RESTORE_HISTORY",
        payload: { restoring: false, error: err?.message || "Restore failed" },
      });
    }
  }

  const accent = colors?.accent || "#7dd3fc";
  const border = colors?.border || "rgba(255,255,255,0.10)";
  const dangerText = colors?.dangerText || "#f87171";
  const dangerBg = colors?.dangerBg || "rgba(248,113,113,0.1)";
  const dangerBorder = colors?.dangerBorder || "rgba(248,113,113,0.3)";

  return (
    <Modal
      open={open}
      title="Restore from backup"
      onClose={() => dispatch({ type: "CLOSE_RESTORE_HISTORY" })}
      styles={styles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5 }}>
          Every cloud save creates a snapshot. Pick a point in time to restore your data.
          The most recent 50 snapshots are kept.
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 20, fontSize: 13, opacity: 0.6 }}>
            Loading snapshots…
          </div>
        )}

        {!loading && error && (
          <div style={{
            fontSize: 13,
            color: dangerText,
            background: dangerBg,
            border: `1px solid ${dangerBorder}`,
            borderRadius: 8,
            padding: "8px 10px",
          }}>
            {error}
          </div>
        )}

        {!loading && !error && snapshots.length === 0 && (
          <div style={{ textAlign: "center", padding: 20, fontSize: 13, opacity: 0.6 }}>
            No snapshots yet. They will start appearing after your next save.
          </div>
        )}

        {!loading && snapshots.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "60dvh", overflowY: "auto" }}>
            {snapshots.map((snap) => {
              const summary = summarizeSnapshot(snap.state);
              const isExpanded = expandedId === snap.id;
              const isConfirming = confirmId === snap.id;

              return (
                <div
                  key={snap.id}
                  style={{
                    border: `1px solid ${border}`,
                    borderRadius: 10,
                    padding: 10,
                    background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => dispatch({
                      type: "UPDATE_RESTORE_HISTORY",
                      payload: { expandedId: isExpanded ? null : snap.id, confirmId: null },
                    })}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                      color: "inherit",
                      fontFamily: "inherit",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {formatTimestamp(snap.created_at)}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.6 }}>
                        {formatBytes(summary.bytes)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span>{summary.logDays} log day{summary.logDays === 1 ? "" : "s"}</span>
                      <span>{summary.totalLogEntries} entries</span>
                      <span>{summary.programWorkouts} workouts</span>
                      {summary.customExercises > 0 && <span>{summary.customExercises} custom ex</span>}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${border}` }}>
                      {isConfirming ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>
                            Replace your current data with this snapshot?
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
                            Your current state will be saved as another snapshot before this one is restored, so this is reversible.
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <button
                              className="btn-press"
                              style={{ ...styles.secondaryBtn, flex: 1 }}
                              onClick={() => dispatch({
                                type: "UPDATE_RESTORE_HISTORY",
                                payload: { confirmId: null },
                              })}
                              disabled={restoring}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn-press"
                              style={{ ...styles.primaryBtn, flex: 1 }}
                              onClick={() => handleRestore(snap)}
                              disabled={restoring}
                            >
                              {restoring ? "Restoring…" : "Restore"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn-press"
                          style={{ ...styles.primaryBtn, width: "100%" }}
                          onClick={() => dispatch({
                            type: "UPDATE_RESTORE_HISTORY",
                            payload: { confirmId: snap.id },
                          })}
                        >
                          Restore this snapshot
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
