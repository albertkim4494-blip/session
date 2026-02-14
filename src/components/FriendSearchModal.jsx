import React, { useRef, useEffect } from "react";
import { Modal } from "./Modal";
import { searchUsers, sendFriendRequest } from "../lib/socialApi";

export function FriendSearchModal({ open, state: searchState, dispatch, styles, colors, onRequestSent }) {
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    clearTimeout(timerRef.current);
    const q = searchState.query?.trim();
    if (!q || q.length < 2) {
      dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { results: [], searching: false } });
      return;
    }
    dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { searching: true } });
    timerRef.current = setTimeout(async () => {
      const { data } = await searchUsers(q);
      dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { results: data || [], searching: false } });
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [searchState.query, open]);

  async function handleAdd(userId) {
    const { error } = await sendFriendRequest(userId);
    if (!error) {
      // Update local result to show pending
      const updated = searchState.results.map((r) =>
        r.id === userId ? { ...r, friendship_status: "pending" } : r
      );
      dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { results: updated } });
      onRequestSent?.();
    }
  }

  if (!open) return null;

  return (
    <Modal
      open={open}
      title="Find Friends"
      onClose={() => dispatch({ type: "CLOSE_FRIEND_SEARCH" })}
      styles={styles}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          ref={inputRef}
          className="input-focus"
          value={searchState.query || ""}
          onChange={(e) => dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { query: e.target.value } })}
          placeholder="Search by username or name..."
          style={{ ...styles.textInput, fontFamily: "inherit" }}
        />

        {searchState.searching && (
          <div style={{ textAlign: "center", padding: 16, opacity: 0.5, fontSize: 13 }}>
            Searching...
          </div>
        )}

        {!searchState.searching && searchState.query?.trim().length >= 2 && searchState.results.length === 0 && (
          <div style={{ textAlign: "center", padding: 16, opacity: 0.5, fontSize: 13 }}>
            No users found
          </div>
        )}

        {!searchState.searching && (!searchState.query || searchState.query.trim().length < 2) && (
          <div style={{ textAlign: "center", padding: 16, opacity: 0.4, fontSize: 13 }}>
            Search by username or display name
          </div>
        )}

        {searchState.results.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: colors.subtleBg,
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: colors.accent + "22",
              color: colors.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, flexShrink: 0,
              overflow: "hidden",
            }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: 999, objectFit: "cover" }} />
              ) : (
                (user.username || "?")[0].toUpperCase()
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                @{user.username}
              </div>
              {user.display_name && (
                <div style={{ fontSize: 12, opacity: 0.6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.display_name}
                </div>
              )}
            </div>

            {/* Action */}
            {user.friendship_status === "accepted" ? (
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.accent, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Friends
              </span>
            ) : user.friendship_status === "pending" ? (
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.5 }}>
                Pending
              </span>
            ) : user.friendship_status === "blocked" ? null : (
              <button
                className="btn-press"
                onClick={() => handleAdd(user.id)}
                style={{
                  ...styles.primaryBtn,
                  padding: "6px 14px",
                  fontSize: 12,
                }}
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
