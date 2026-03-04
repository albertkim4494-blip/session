import React, { useEffect, useState, useCallback, useMemo } from "react";
import { PillTabs } from "./PillTabs";
import { getGroupDetail, leaveGroup, removeMember, promoteMember, deleteGroup, deleteGroupWorkout } from "../lib/groupApi";
import { isPollOpen, getPollCounts, formatDeadline, formatEventDateTime } from "../lib/pollUtils";

export function GroupDetailView({
  groupId, userId, dispatch, styles, colors,
  onBack, onStartGroupWorkout, showToast, refreshSocial,
}) {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState("feed");

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    const { data } = await getGroupDetail(groupId);
    if (data) {
      setGroup(data.group);
      setMembers(data.members || []);
      setWorkouts(data.workouts || []);
      setPolls(data.polls || []);
    }
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const myMembership = members.find((m) => m.user_id === userId);
  const isAdmin = myMembership?.role === "admin";
  const acceptedMembers = members.filter((m) => m.status === "accepted");
  const memberIds = members.map((m) => m.user_id);

  // Merge workouts + polls into unified feed sorted by created_at desc
  const feedItems = useMemo(() => {
    const items = [];
    for (const w of workouts) {
      items.push({ type: "workout", data: w, created_at: w.created_at });
    }
    for (const p of polls) {
      items.push({ type: "poll", data: p, created_at: p.created_at });
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return items;
  }, [workouts, polls]);

  if (loading && !group) {
    return (
      <div style={{ textAlign: "center", padding: 40, opacity: 0.5, fontSize: 13 }}>
        Loading...
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          className="btn-press"
          onClick={onBack}
          style={{ ...styles.secondaryBtn, alignSelf: "flex-start", padding: "6px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
          Group not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          className="btn-press"
          onClick={onBack}
          style={{ background: "none", border: "none", color: colors.text, cursor: "pointer", padding: 4 }}
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {group.name}
          </div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>
            {acceptedMembers.length} member{acceptedMembers.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {group.description && (
        <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.4, padding: "0 4px" }}>
          {group.description}
        </div>
      )}

      {/* Sub-tabs */}
      <PillTabs
        tabs={[
          { value: "feed", label: "Feed" },
          { value: "members", label: `Members (${acceptedMembers.length})` },
          ...(isAdmin ? [{ value: "settings", label: "Settings" }] : []),
        ]}
        value={subTab}
        onChange={setSubTab}
        styles={styles}
      />

      {/* Feed tab */}
      {subTab === "feed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {isAdmin && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-press"
                onClick={() => dispatch({
                  type: "OPEN_SHARE_TO_GROUP",
                  payload: { groupId: group.id, groupName: group.name },
                })}
                style={{
                  ...styles.primaryBtn, flex: 1, textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 14px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Share Workout
              </button>
              <button
                className="btn-press"
                onClick={() => dispatch({
                  type: "OPEN_CREATE_POLL",
                  payload: { groupId: group.id, groupName: group.name },
                })}
                style={{
                  ...styles.secondaryBtn, flex: 1, textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 14px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Create Poll
              </button>
            </div>
          )}

          {feedItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
              {isAdmin ? "Share a workout or create a poll to get started!" : "Nothing shared yet"}
            </div>
          ) : (
            feedItems.map((item) =>
              item.type === "workout"
                ? renderWorkoutCard(item.data, { dispatch, colors, styles, isAdmin, fetchDetail })
                : renderPollCard(item.data, { dispatch, colors, styles, userId, acceptedMembers, members })
            )
          )}
        </div>
      )}

      {/* Members tab */}
      {subTab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {isAdmin && (
            <button
              className="btn-press"
              onClick={() => dispatch({
                type: "OPEN_INVITE_TO_GROUP",
                payload: {
                  groupId: group.id,
                  groupName: group.name,
                  existingMemberIds: memberIds,
                },
              })}
              style={{
                ...styles.secondaryBtn, width: "100%", textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "10px 14px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
              Invite Friends
            </button>
          )}

          {acceptedMembers.map((m) => {
            const p = m.profile;
            const isSelf = m.user_id === userId;
            return (
              <div
                key={m.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10,
                  background: colors.subtleBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: colors.accent + "22", color: colors.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  overflow: "hidden",
                }}>
                  {p?.avatar_url ? (
                    <img src={p.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: 999, objectFit: "cover" }} />
                  ) : (
                    (p?.username || "?")[0].toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    @{p?.username || "unknown"}
                    {isSelf && <span style={{ opacity: 0.4, fontWeight: 400 }}> (you)</span>}
                  </div>
                  {p?.display_name && <div style={{ fontSize: 12, opacity: 0.6 }}>{p.display_name}</div>}
                </div>
                {/* Role badge */}
                {m.role === "admin" && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px",
                    borderRadius: 999, background: colors.accent + "22",
                    color: colors.accent,
                  }}>
                    Admin
                  </span>
                )}
                {/* Admin actions on non-self members */}
                {isAdmin && !isSelf && (
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {m.role !== "admin" && (
                      <button
                        className="btn-press"
                        onClick={async () => {
                          await promoteMember(m.id);
                          fetchDetail();
                        }}
                        style={{ ...styles.secondaryBtn, padding: "4px 8px", fontSize: 11 }}
                      >
                        Promote
                      </button>
                    )}
                    <button
                      className="btn-press"
                      onClick={async () => {
                        await removeMember(m.id);
                        fetchDetail();
                      }}
                      style={{ ...styles.secondaryBtn, padding: "4px 8px", fontSize: 11, opacity: 0.6 }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {/* Leave button for self (non-creator) */}
                {isSelf && !isAdmin && (
                  <button
                    className="btn-press"
                    onClick={async () => {
                      await leaveGroup(group.id);
                      showToast?.("Left group");
                      refreshSocial?.();
                      onBack?.();
                    }}
                    style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 11, opacity: 0.6 }}
                  >
                    Leave
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Settings tab (admin only) */}
      {subTab === "settings" && isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 14px", borderRadius: 12, background: colors.subtleBg, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>Group Info</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{group.name}</div>
            {group.description && <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{group.description}</div>}
          </div>

          <button
            className="btn-press"
            onClick={() => {
              dispatch({
                type: "OPEN_CONFIRM",
                payload: {
                  title: "Delete Group",
                  message: `Delete "${group.name}"? This will remove all members and shared workouts permanently.`,
                  confirmText: "Delete Group",
                  onConfirm: async () => {
                    await deleteGroup(group.id);
                    dispatch({ type: "CLOSE_CONFIRM" });
                    showToast?.("Group deleted");
                    refreshSocial?.();
                    onBack?.();
                  },
                },
              });
            }}
            style={{
              background: "none",
              border: `1px solid rgba(231,76,60,0.4)`,
              borderRadius: 12,
              color: "#e74c3c",
              padding: "12px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Delete Group
          </button>

          {/* Leave as admin */}
          <button
            className="btn-press"
            onClick={async () => {
              const otherAdmins = acceptedMembers.filter((m) => m.role === "admin" && m.user_id !== userId);
              if (otherAdmins.length === 0) {
                showToast?.("Promote another member to admin before leaving");
                return;
              }
              await leaveGroup(group.id);
              showToast?.("Left group");
              refreshSocial?.();
              onBack?.();
            }}
            style={{
              background: "none", border: `1px solid ${colors.border}`,
              borderRadius: 12, color: colors.text, opacity: 0.6,
              padding: "12px 14px", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Leave Group
          </button>
        </div>
      )}
    </div>
  );
}

function renderWorkoutCard(gw, { dispatch, colors, styles, isAdmin, fetchDetail }) {
  const w = gw.workout_snapshot;
  const sharedBy = gw.shared_by_profile;
  return (
    <div
      key={gw.id}
      className="btn-press"
      onClick={() => dispatch({
        type: "OPEN_GROUP_WORKOUT_PREVIEW",
        payload: { groupWorkout: gw },
      })}
      style={{
        padding: "12px 14px", borderRadius: 12,
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {w?.name || "Workout"}
        </span>
        <span style={{ fontSize: 11, opacity: 0.4, flexShrink: 0 }}>
          {w?.exercises?.length || 0} exercises
        </span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        by @{sharedBy?.username || "unknown"} · {formatTimeAgo(gw.created_at)}
      </div>
      {gw.message && (
        <div style={{ fontSize: 13, fontStyle: "italic", opacity: 0.7, marginTop: 4 }}>
          "{gw.message}"
        </div>
      )}
      {/* Admin delete */}
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button
            className="btn-press"
            onClick={async (e) => {
              e.stopPropagation();
              await deleteGroupWorkout(gw.id);
              fetchDetail();
            }}
            style={{ background: "none", border: "none", color: colors.text, opacity: 0.3, cursor: "pointer", padding: 4, fontSize: 11 }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function renderPollCard(poll, { dispatch, colors, userId, acceptedMembers, members }) {
  const responses = poll.poll_responses || [];
  const counts = getPollCounts(responses, acceptedMembers.length);
  const open = isPollOpen(poll);
  const myResponse = responses.find((r) => r.user_id === userId);
  const eventDateStr = formatEventDateTime(poll.event_date, poll.event_time);
  const deadlineStr = formatDeadline(poll.deadline);
  const createdBy = poll.created_by_profile;

  const responseColors = { yes: "#27ae60", maybe: "#f39c12", no: "#e74c3c" };

  return (
    <div
      key={poll.id}
      className="btn-press"
      onClick={() => dispatch({
        type: "OPEN_POLL_DETAIL",
        payload: { poll, members },
      })}
      style={{
        padding: "12px 14px", borderRadius: 12,
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {poll.title}
        </span>
        {!open && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px",
            borderRadius: 999, background: "rgba(231,76,60,0.12)", color: "#e74c3c",
          }}>
            Closed
          </span>
        )}
      </div>

      <div style={{ fontSize: 12, opacity: 0.6 }}>
        by @{createdBy?.username || "unknown"} · {formatTimeAgo(poll.created_at)}
      </div>

      {eventDateStr && (
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
          {eventDateStr}
        </div>
      )}

      {/* Headcount pills */}
      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        {[
          { label: "Yes", count: counts.yes, color: "#27ae60" },
          { label: "Maybe", count: counts.maybe, color: "#f39c12" },
          { label: "No", count: counts.no, color: "#e74c3c" },
        ].filter((c) => c.count > 0).map((c) => (
          <span key={c.label} style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px",
            borderRadius: 999, background: c.color + "18", color: c.color,
          }}>
            {c.count} {c.label}
          </span>
        ))}
        {deadlineStr && deadlineStr !== "Closed" && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px",
            borderRadius: 999, background: colors.accent + "18", color: colors.accent,
          }}>
            {deadlineStr}
          </span>
        )}
      </div>

      {/* My response indicator */}
      {myResponse && (
        <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: responseColors[myResponse.response] || colors.text }}>
          You voted: {myResponse.response.charAt(0).toUpperCase() + myResponse.response.slice(1)}
        </div>
      )}
    </div>
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
