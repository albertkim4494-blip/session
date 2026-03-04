import React, { useState } from "react";
import { Modal } from "./Modal";
import { respondToPoll, removeResponse, closePoll, reopenPoll, deletePoll, markAttendance, getPollDetail } from "../lib/groupApi";
import { isPollOpen, getPollCounts, getAttendanceSummary, formatDeadline, formatEventDateTime } from "../lib/pollUtils";

export function PollDetailModal({ open, state: modalState, dispatch, styles, colors, userId, onUpdated, onDeleted, showToast }) {
  const [attendanceMode, setAttendanceMode] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [voting, setVoting] = useState(false);

  const poll = modalState.poll;
  const members = modalState.members || [];
  const responses = poll?.poll_responses || [];
  const isOpen = isPollOpen(poll);
  const acceptedMembers = members.filter((m) => m.status === "accepted");
  const isAdmin = members.some((m) => m.user_id === userId && m.role === "admin" && m.status === "accepted");
  const createdByProfile = poll?.created_by_profile;
  const myResponse = responses.find((r) => r.user_id === userId);

  // Sync attendance map when poll changes
  React.useEffect(() => {
    if (poll) {
      const map = {};
      for (const r of (poll.poll_responses || [])) {
        if (r.attended != null) map[r.user_id] = r.attended;
      }
      setAttendanceMap(map);
      setAttendanceMode(false);
    }
  }, [poll]);

  async function refreshPoll() {
    if (!poll?.id) return;
    const { data } = await getPollDetail(poll.id);
    if (data) {
      dispatch({ type: "UPDATE_POLL_DETAIL", payload: { poll: data } });
    }
    onUpdated?.();
  }

  if (!open) return null;

  const counts = getPollCounts(responses, acceptedMembers.length);
  const attendanceSummary = getAttendanceSummary(responses);
  const eventDateStr = formatEventDateTime(poll?.event_date, poll?.event_time);
  const deadlineStr = formatDeadline(poll?.deadline);

  // Check if event date has passed (show attendance section)
  const eventPassed = poll?.event_date && new Date(poll.event_date + "T23:59:59").getTime() < Date.now();

  async function handleVote(response) {
    if (voting) return;
    setVoting(true);

    if (myResponse?.response === response) {
      // Un-vote (tap same to remove)
      await removeResponse(poll.id);
    } else {
      await respondToPoll(poll.id, response);
    }

    setVoting(false);
    await refreshPoll();
  }

  async function handleClosePoll() {
    await closePoll(poll.id);
    await refreshPoll();
  }

  async function handleReopenPoll() {
    await reopenPoll(poll.id);
    await refreshPoll();
  }

  async function handleDeletePoll() {
    await deletePoll(poll.id);
    dispatch({ type: "CLOSE_POLL_DETAIL" });
    onDeleted?.();
  }

  async function handleSaveAttendance() {
    setSavingAttendance(true);
    for (const [uid, attended] of Object.entries(attendanceMap)) {
      await markAttendance(poll.id, uid, attended);
    }
    setSavingAttendance(false);
    showToast?.("Attendance saved");
    await refreshPoll();
  }

  async function handleSelfCheckin() {
    await markAttendance(poll.id, userId, true);
    showToast?.("Checked in!");
    await refreshPoll();
  }

  const voteButtons = [
    { value: "yes", label: "Yes", color: "#27ae60", bg: "rgba(39,174,96,0.15)" },
    { value: "maybe", label: "Maybe", color: "#f39c12", bg: "rgba(243,156,18,0.15)" },
    { value: "no", label: "No", color: "#e74c3c", bg: "rgba(231,76,60,0.15)" },
  ];

  // Group responses by type for the list
  const responsesByType = { yes: [], maybe: [], no: [] };
  for (const r of responses) {
    if (responsesByType[r.response]) {
      responsesByType[r.response].push(r);
    }
  }

  return (
    <Modal
      open={open}
      title={poll?.title || "Poll"}
      onClose={() => dispatch({ type: "CLOSE_POLL_DETAIL" })}
      styles={styles}
      footer={
        isAdmin ? (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button
              className="btn-press"
              onClick={isOpen ? handleClosePoll : handleReopenPoll}
              style={{ ...styles.secondaryBtn, flex: 1, padding: "12px 10px", textAlign: "center" }}
            >
              {isOpen ? "Close Poll" : "Reopen Poll"}
            </button>
            <button
              className="btn-press"
              onClick={handleDeletePoll}
              style={{
                background: "none",
                border: "1px solid rgba(231,76,60,0.4)",
                borderRadius: 10,
                color: "#e74c3c",
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Delete
            </button>
          </div>
        ) : null
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {poll?.description && (
            <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.4 }}>
              {poll.description}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 12, opacity: 0.5 }}>
            {createdByProfile && <span>by @{createdByProfile.username}</span>}
            {eventDateStr && (
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {eventDateStr}
              </span>
            )}
          </div>
          {deadlineStr && (
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: deadlineStr === "Closed" ? "#e74c3c" : colors.accent,
            }}>
              {deadlineStr}
            </div>
          )}
          {!isOpen && (
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#e74c3c",
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(231,76,60,0.12)", alignSelf: "flex-start",
            }}>
              Voting closed
            </div>
          )}
        </div>

        {/* Voting buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {voteButtons.map((btn) => {
            const isSelected = myResponse?.response === btn.value;
            const disabled = !isOpen || voting;
            return (
              <button
                key={btn.value}
                className="btn-press"
                disabled={disabled}
                onClick={() => handleVote(btn.value)}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 10,
                  border: `2px solid ${isSelected ? btn.color : colors.border}`,
                  background: isSelected ? btn.bg : "transparent",
                  color: isSelected ? btn.color : colors.text,
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 14,
                  cursor: disabled ? "default" : "pointer",
                  opacity: disabled && !isSelected ? 0.4 : 1,
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Headcount summary */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
          padding: "10px 12px", borderRadius: 10,
          background: colors.subtleBg, border: `1px solid ${colors.border}`,
        }}>
          {[
            { label: "Yes", count: counts.yes, color: "#27ae60" },
            { label: "Maybe", count: counts.maybe, color: "#f39c12" },
            { label: "No", count: counts.no, color: "#e74c3c" },
            { label: "No response", count: counts.noResponse, color: colors.text, opacity: 0.4 },
          ].map((item) => (
            <span key={item.label} style={{
              fontSize: 13, fontWeight: 600,
              color: item.color, opacity: item.opacity || 1,
            }}>
              {item.count} {item.label}
            </span>
          ))}
        </div>

        {/* Response list grouped by type */}
        {responses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.6 }}>Responses</div>
            {["yes", "maybe", "no"].map((type) => {
              const items = responsesByType[type];
              if (items.length === 0) return null;
              const typeColor = type === "yes" ? "#27ae60" : type === "maybe" ? "#f39c12" : "#e74c3c";
              const typeLabel = type === "yes" ? "Yes" : type === "maybe" ? "Maybe" : "No";
              return (
                <div key={type}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: typeColor, marginBottom: 4, textTransform: "uppercase" }}>
                    {typeLabel} ({items.length})
                  </div>
                  {items.map((r) => {
                    const member = acceptedMembers.find((m) => m.user_id === r.user_id);
                    const p = member?.profile;
                    return (
                      <div key={r.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 8px", borderRadius: 8,
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: 999,
                          background: colors.accent + "22", color: colors.accent,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          overflow: "hidden",
                        }}>
                          {p?.avatar_url ? (
                            <img src={p.avatar_url} alt="" style={{ width: 24, height: 24, borderRadius: 999, objectFit: "cover" }} />
                          ) : (
                            (p?.username || "?")[0].toUpperCase()
                          )}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>
                          @{p?.username || "unknown"}
                          {r.user_id === userId && <span style={{ opacity: 0.4, fontWeight: 400 }}> (you)</span>}
                        </span>
                        {r.attended === true && (
                          <span style={{ fontSize: 10, color: "#27ae60", fontWeight: 700, marginLeft: "auto" }}>Attended</span>
                        )}
                        {r.attended === false && (
                          <span style={{ fontSize: 10, color: "#e74c3c", fontWeight: 700, marginLeft: "auto" }}>Absent</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Attendance section */}
        {(eventPassed || attendanceMode) && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            padding: "12px 14px", borderRadius: 12,
            background: colors.subtleBg, border: `1px solid ${colors.border}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>Attendance</div>

            {/* Attendance summary */}
            {responses.some((r) => r.attended != null) && (
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                {attendanceSummary.saidYes} said Yes, {attendanceSummary.attended} actually attended
              </div>
            )}

            {/* Self check-in */}
            {poll?.allow_self_checkin && !isAdmin && myResponse?.attended == null && (
              <button
                className="btn-press"
                onClick={handleSelfCheckin}
                style={{
                  ...styles.secondaryBtn, width: "100%", textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 14px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                I was there
              </button>
            )}
            {poll?.allow_self_checkin && !isAdmin && myResponse?.attended === true && (
              <div style={{ fontSize: 12, color: "#27ae60", fontWeight: 600 }}>You checked in</div>
            )}

            {/* Admin attendance marking */}
            {isAdmin && (
              <>
                {!attendanceMode ? (
                  <button
                    className="btn-press"
                    onClick={() => setAttendanceMode(true)}
                    style={{ ...styles.secondaryBtn, padding: "10px 14px", textAlign: "center", width: "100%" }}
                  >
                    Mark Attendance
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {acceptedMembers.map((m) => {
                      const p = m.profile;
                      const checked = attendanceMap[m.user_id] === true;
                      return (
                        <div
                          key={m.id}
                          className="btn-press"
                          onClick={() => {
                            setAttendanceMap((prev) => ({
                              ...prev,
                              [m.user_id]: !prev[m.user_id],
                            }));
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 10px", borderRadius: 8,
                            background: checked ? "rgba(39,174,96,0.1)" : "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{
                            width: 20, height: 20, borderRadius: 4,
                            border: `2px solid ${checked ? "#27ae60" : colors.border}`,
                            background: checked ? "#27ae60" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {checked && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            )}
                          </div>
                          <div style={{
                            width: 24, height: 24, borderRadius: 999,
                            background: colors.accent + "22", color: colors.accent,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, flexShrink: 0,
                            overflow: "hidden",
                          }}>
                            {p?.avatar_url ? (
                              <img src={p.avatar_url} alt="" style={{ width: 24, height: 24, borderRadius: 999, objectFit: "cover" }} />
                            ) : (
                              (p?.username || "?")[0].toUpperCase()
                            )}
                          </div>
                          <span style={{ fontSize: 13 }}>@{p?.username || "unknown"}</span>
                        </div>
                      );
                    })}
                    <button
                      className="btn-press"
                      disabled={savingAttendance}
                      onClick={handleSaveAttendance}
                      style={{
                        ...styles.primaryBtn,
                        width: "100%", padding: "12px 12px",
                        textAlign: "center", marginTop: 4,
                        opacity: savingAttendance ? 0.5 : 1,
                      }}
                    >
                      {savingAttendance ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
