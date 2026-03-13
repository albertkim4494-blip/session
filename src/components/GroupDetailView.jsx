import React, { useEffect, useState, useCallback, useMemo } from "react";
import { PillTabs } from "./PillTabs";
import { getGroupDetail, leaveGroup, removeMember, promoteMember, deleteGroup, deleteGroupWorkout, updateGroupSettings } from "../lib/groupApi";
import { isPollOpen, getPollCounts, formatDeadline, formatEventDateTime } from "../lib/pollUtils";
import { REACTION_EMOJIS, getReactionCounts, formatAmount, getDuesPaymentSummary, formatTimeAgo } from "../lib/announcementUtils";

export function GroupDetailView({
  groupId, userId, dispatch, styles, colors,
  onBack, onStartGroupWorkout, showToast, refreshSocial,
}) {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [dues, setDues] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState("feed");
  const [venmoInput, setVenmoInput] = useState("");
  const [venmoSaving, setVenmoSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    const { data } = await getGroupDetail(groupId);
    if (data) {
      setGroup(data.group);
      setMembers(data.members || []);
      setWorkouts(data.workouts || []);
      setPolls(data.polls || []);
      setAnnouncements(data.announcements || []);
      setDues(data.dues || []);
      setCustomFields(data.customFields || []);
      setVenmoInput(data.group?.venmo_username || "");
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

  // Merge workouts + polls + announcements + dues into unified feed
  // Pinned announcements sort to top, then by created_at desc
  const feedItems = useMemo(() => {
    const items = [];
    for (const w of workouts) {
      items.push({ type: "workout", data: w, created_at: w.created_at, pinned: false });
    }
    for (const p of polls) {
      items.push({ type: "poll", data: p, created_at: p.created_at, pinned: false });
    }
    for (const a of announcements) {
      items.push({ type: "announcement", data: a, created_at: a.created_at, pinned: !!a.pinned });
    }
    for (const d of dues) {
      items.push({ type: "dues", data: d, created_at: d.created_at, pinned: false });
    }
    items.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return items;
  }, [workouts, polls, announcements, dues]);

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
          {/* Action buttons row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn-press"
              onClick={() => dispatch({
                type: "OPEN_CREATE_ANNOUNCEMENT",
                payload: { groupId: group.id },
              })}
              style={{
                ...styles.secondaryBtn, flex: 1, textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "12px 14px", minWidth: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              Post
            </button>
            {isAdmin && (
              <>
                <button
                  className="btn-press"
                  onClick={() => dispatch({
                    type: "OPEN_SHARE_TO_GROUP",
                    payload: { groupId: group.id, groupName: group.name },
                  })}
                  style={{
                    ...styles.primaryBtn, flex: 1, textAlign: "center",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "12px 14px", minWidth: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Workout
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
                    padding: "12px 14px", minWidth: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Poll
                </button>
                <button
                  className="btn-press"
                  onClick={() => dispatch({
                    type: "OPEN_CREATE_DUES",
                    payload: { groupId: group.id },
                  })}
                  style={{
                    ...styles.secondaryBtn, flex: 1, textAlign: "center",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "12px 14px", minWidth: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                  Dues
                </button>
              </>
            )}
          </div>

          {feedItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
              {isAdmin ? "Share a workout or post an update to get started!" : "Nothing shared yet"}
            </div>
          ) : (
            feedItems.map((item) => {
              if (item.type === "workout") {
                return renderWorkoutCard(item.data, { dispatch, colors, styles, isAdmin, fetchDetail });
              }
              if (item.type === "poll") {
                return renderPollCard(item.data, { dispatch, colors, styles, userId, acceptedMembers, members });
              }
              if (item.type === "announcement") {
                return renderAnnouncementCard(item.data, { dispatch, colors, styles, userId, members });
              }
              if (item.type === "dues") {
                return renderDuesCard(item.data, { dispatch, colors, styles, acceptedMembers, members, venmoUsername: group?.venmo_username });
              }
              return null;
            })
          )}
        </div>
      )}

      {/* Members tab */}
      {subTab === "members" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
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
                  ...styles.secondaryBtn, flex: 1, textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 14px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                Invite Friends
              </button>
            )}
            {customFields.length > 0 && (
              <button
                className="btn-press"
                onClick={() => dispatch({
                  type: "OPEN_FILL_FIELDS",
                  payload: { groupId: group.id, fields: customFields, requiredMode: false },
                })}
                style={{
                  ...styles.secondaryBtn, flex: 1, textAlign: "center",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 14px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                My Info
              </button>
            )}
          </div>

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

          {/* Venmo username */}
          <div style={{ padding: "12px 14px", borderRadius: 12, background: colors.subtleBg, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>Venmo</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, opacity: 0.5 }}>@</span>
              <input
                className="input-focus"
                value={venmoInput}
                onChange={(e) => setVenmoInput(e.target.value.replace(/^@/, "").slice(0, 40))}
                placeholder="venmo-username"
                maxLength={40}
                style={{ ...styles.textInput, fontFamily: "inherit", flex: 1, boxSizing: "border-box" }}
              />
              <button
                className="btn-press"
                disabled={venmoSaving || venmoInput === (group?.venmo_username || "")}
                onClick={async () => {
                  setVenmoSaving(true);
                  await updateGroupSettings(group.id, { venmoUsername: venmoInput.trim() || null });
                  setVenmoSaving(false);
                  showToast?.("Venmo updated");
                  fetchDetail();
                }}
                style={{
                  ...styles.primaryBtn,
                  padding: "8px 14px", fontSize: 13, flexShrink: 0,
                  opacity: (venmoSaving || venmoInput === (group?.venmo_username || "")) ? 0.4 : 1,
                }}
              >
                {venmoSaving ? "..." : "Save"}
              </button>
            </div>
            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>
              Members will see a "Pay via Venmo" button on dues
            </div>
          </div>

          {/* Manage Member Fields */}
          <button
            className="btn-press"
            onClick={() => dispatch({
              type: "OPEN_MANAGE_FIELDS",
              payload: { groupId: group.id, fields: customFields },
            })}
            style={{
              ...styles.secondaryBtn, width: "100%", textAlign: "center",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "12px 14px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Manage Member Fields {customFields.length > 0 ? `(${customFields.length})` : ""}
          </button>

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
  const eventDateStr = formatEventDateTime(poll.event_date, poll.event_time, poll.event_end_time);
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

function renderAnnouncementCard(announcement, { dispatch, colors, styles, userId, members }) {
  const author = announcement.author_profile;
  const reactions = announcement.announcement_reactions || [];
  const counts = getReactionCounts(reactions);
  const bodyPreview = announcement.body.length > 150
    ? announcement.body.slice(0, 150) + "..."
    : announcement.body;

  const reactionEntries = Object.entries(counts).filter(([, count]) => count > 0);

  return (
    <div
      key={announcement.id}
      className="btn-press"
      onClick={() => dispatch({
        type: "OPEN_ANNOUNCEMENT_DETAIL",
        payload: { announcement, members },
      })}
      style={{
        padding: "12px 14px", borderRadius: 12,
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        {announcement.pinned && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={colors.accent} stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2L15 8.5L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9 8.5L12 2Z" />
          </svg>
        )}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          @{author?.username || "unknown"}
        </span>
        <span style={{ fontSize: 11, opacity: 0.4, flexShrink: 0 }}>
          {formatTimeAgo(announcement.created_at)}
        </span>
      </div>

      <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {bodyPreview}
      </div>

      {reactionEntries.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
          {reactionEntries.map(([key, count]) => (
            <span key={key} style={{
              fontSize: 12, padding: "2px 6px", borderRadius: 999,
              background: colors.subtleBg, border: `1px solid ${colors.border}`,
            }}>
              {REACTION_EMOJIS[key]} {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function renderDuesCard(dues, { dispatch, colors, styles, acceptedMembers, members, venmoUsername }) {
  const createdBy = dues.created_by_profile;
  const payments = dues.dues_payments || [];
  const summary = getDuesPaymentSummary(payments, acceptedMembers.length, dues.amount_cents);

  return (
    <div
      key={dues.id}
      className="btn-press"
      onClick={() => dispatch({
        type: "OPEN_DUES_DETAIL",
        payload: { dues, members, venmoUsername },
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
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {dues.title}
        </span>
        {dues.closed && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px",
            borderRadius: 999, background: "rgba(231,76,60,0.12)", color: "#e74c3c",
          }}>
            Closed
          </span>
        )}
      </div>

      <div style={{ fontSize: 12, opacity: 0.6 }}>
        {formatAmount(dues.amount_cents)} · by @{createdBy?.username || "unknown"} · {formatTimeAgo(dues.created_at)}
      </div>

      {dues.due_date && (
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
          Due {new Date(dues.due_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ marginTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3, opacity: 0.7 }}>
          {summary.paid}/{summary.total} paid
        </div>
        <div style={{
          height: 5, borderRadius: 3,
          background: colors.border, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: colors.accent,
            width: summary.total > 0 ? `${(summary.paid / summary.total) * 100}%` : "0%",
            transition: "width 0.3s",
          }} />
        </div>
      </div>
    </div>
  );
}

