import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { getFriends } from "../lib/socialApi";
import { inviteToGroup } from "../lib/groupApi";

export function InviteToGroupModal({ open, state: modalState, dispatch, styles, colors }) {
  const [sentIds, setSentIds] = useState(new Set());

  // Load friends list on open
  useEffect(() => {
    if (!open) return;
    setSentIds(new Set());
    let cancelled = false;
    (async () => {
      const { data } = await getFriends();
      if (!cancelled) {
        dispatch({ type: "UPDATE_INVITE_TO_GROUP", payload: { friends: data || [] } });
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  const existingIds = new Set(modalState.existingMemberIds || []);
  const availableFriends = (modalState.friends || []).filter((f) => !existingIds.has(f.id));

  async function handleInvite(userId) {
    dispatch({ type: "UPDATE_INVITE_TO_GROUP", payload: { sending: true } });
    const { error } = await inviteToGroup(modalState.groupId, userId);
    dispatch({ type: "UPDATE_INVITE_TO_GROUP", payload: { sending: false } });

    if (!error) {
      setSentIds((prev) => new Set([...prev, userId]));
    }
  }

  return (
    <Modal
      open={open}
      title={`Invite to ${modalState.groupName || "Group"}`}
      onClose={() => dispatch({ type: "CLOSE_INVITE_TO_GROUP" })}
      styles={styles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {availableFriends.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
            {(modalState.friends || []).length === 0
              ? "No friends yet. Add friends first to invite them."
              : "All your friends are already in this group."}
          </div>
        ) : (
          availableFriends.map((f) => {
            const wasSent = sentIds.has(f.id);
            return (
              <div
                key={f.id}
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
                  {f.avatar_url ? (
                    <img src={f.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: 999, objectFit: "cover" }} />
                  ) : (
                    (f.username || "?")[0].toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>@{f.username}</div>
                  {f.display_name && <div style={{ fontSize: 12, opacity: 0.6 }}>{f.display_name}</div>}
                </div>
                <button
                  className="btn-press"
                  disabled={wasSent || modalState.sending}
                  onClick={() => handleInvite(f.id)}
                  style={{
                    ...styles.primaryBtn,
                    padding: "6px 14px",
                    fontSize: 12,
                    opacity: wasSent ? 0.5 : 1,
                  }}
                >
                  {wasSent ? "Invited" : "Invite"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
