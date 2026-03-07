import React, { useState } from "react";
import { Modal } from "./Modal";
import { deleteAnnouncement, pinAnnouncement, toggleReaction } from "../lib/groupApi";
import { REACTION_EMOJIS, getReactionCounts, hasUserReacted, formatTimeAgo } from "../lib/announcementUtils";

export function AnnouncementDetailModal({
  open, state: modalState, dispatch, styles, colors,
  userId, showToast, onUpdated, onDeleted,
}) {
  const [toggling, setToggling] = useState(null);

  if (!open) return null;

  const announcement = modalState.announcement;
  if (!announcement) return null;

  const author = announcement.author_profile;
  const reactions = announcement.announcement_reactions || [];
  const counts = getReactionCounts(reactions);
  const members = modalState.members || [];
  const isAuthor = announcement.author_id === userId;
  const isAdmin = members.some(
    (m) => m.user_id === userId && m.role === "admin" && m.status === "accepted"
  );
  const canManage = isAuthor || isAdmin;

  async function handleToggleReaction(emoji) {
    if (toggling) return; // prevent concurrent toggles
    setToggling(emoji);
    const { error, removed } = await toggleReaction(announcement.id, emoji);
    if (!error) {
      // Read latest reactions from modalState to avoid stale closure
      const current = modalState.announcement?.announcement_reactions || [];
      let updated;
      if (removed) {
        updated = current.filter(
          (r) => !(r.user_id === userId && r.emoji === emoji)
        );
      } else {
        updated = [
          ...current,
          { user_id: userId, emoji, id: "tmp_" + Date.now(), announcement_id: announcement.id, created_at: new Date().toISOString() },
        ];
      }
      dispatch({
        type: "UPDATE_ANNOUNCEMENT_DETAIL",
        payload: {
          announcement: { ...modalState.announcement, announcement_reactions: updated },
        },
      });
      onUpdated?.();
    }
    setToggling(null);
  }

  async function handlePin() {
    const { error } = await pinAnnouncement(announcement.id, !announcement.pinned);
    if (!error) {
      dispatch({
        type: "UPDATE_ANNOUNCEMENT_DETAIL",
        payload: {
          announcement: { ...announcement, pinned: !announcement.pinned },
        },
      });
      showToast?.(announcement.pinned ? "Unpinned" : "Pinned");
      onUpdated?.();
    }
  }

  function handleDelete() {
    dispatch({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Delete Announcement",
        message: "Delete this announcement? This cannot be undone.",
        confirmText: "Delete",
        onConfirm: async () => {
          const { error } = await deleteAnnouncement(announcement.id);
          dispatch({ type: "CLOSE_CONFIRM" });
          if (!error) {
            dispatch({ type: "CLOSE_ANNOUNCEMENT_DETAIL" });
            showToast?.("Announcement deleted");
            onDeleted?.();
          }
        },
      },
    });
  }

  const timeAgo = formatTimeAgo(announcement.created_at);

  return (
    <Modal
      open={open}
      title="Announcement"
      onClose={() => dispatch({ type: "CLOSE_ANNOUNCEMENT_DETAIL" })}
      styles={styles}
      footer={canManage ? (
        <div style={{ display: "flex", gap: 8 }}>
          {isAdmin && (
            <button
              className="btn-press"
              onClick={handlePin}
              style={{ ...styles.secondaryBtn, flex: 1, textAlign: "center", padding: "12px 8px" }}
            >
              {announcement.pinned ? "Unpin" : "Pin"}
            </button>
          )}
          <button
            className="btn-press"
            onClick={handleDelete}
            style={{
              flex: 1, textAlign: "center", padding: "12px 8px",
              background: "none", border: "1px solid rgba(231,76,60,0.4)",
              borderRadius: 12, color: "#e74c3c", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Delete
          </button>
        </div>
      ) : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Author header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999,
            background: colors.accent + "22", color: colors.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, flexShrink: 0, overflow: "hidden",
          }}>
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: 999, objectFit: "cover" }} />
            ) : (
              (author?.username || "?")[0].toUpperCase()
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              @{author?.username || "unknown"}
            </div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>
              {timeAgo}
              {announcement.pinned && (
                <span style={{ marginLeft: 8, color: colors.accent, fontWeight: 600 }}>Pinned</span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {announcement.body}
        </div>

        {/* Reactions bar */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(REACTION_EMOJIS).map(([key, emoji]) => {
            const count = counts[key] || 0;
            const reacted = hasUserReacted(reactions, userId, key);
            const isLoading = toggling === key;
            return (
              <button
                key={key}
                className="btn-press"
                disabled={!!toggling}
                onClick={() => handleToggleReaction(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 10px", borderRadius: 999, fontSize: 14,
                  border: `1.5px solid ${reacted ? colors.accent : colors.border}`,
                  background: reacted ? colors.accent + "18" : colors.subtleBg,
                  cursor: toggling ? "default" : "pointer", fontFamily: "inherit",
                  opacity: isLoading ? 0.5 : 1,
                  transition: "all 0.15s",
                }}
              >
                <span>{emoji}</span>
                {count > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: reacted ? colors.accent : colors.text }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
