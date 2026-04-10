import React, { useRef, useEffect, useState, useCallback } from "react";
import { searchUsers, sendFriendRequest } from "../lib/socialApi";

const LS_RECENT_KEY = "wt_recent_searches";
const MAX_RECENT = 6;

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT_KEY)) || []; } catch { return []; }
}
function saveRecent(list) {
  try { localStorage.setItem(LS_RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT))); } catch {}
}
function addRecent(query) {
  const q = query?.trim();
  if (!q || q.length < 2) return;
  const list = loadRecent().filter(r => r.toLowerCase() !== q.toLowerCase());
  list.unshift(q);
  saveRecent(list);
}
function removeRecent(query) {
  saveRecent(loadRecent().filter(r => r !== query));
}

// Section label component
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em", opacity: 0.4, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

// User result card
function UserCard({ user, onAdd, colors }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: 14, borderRadius: 16,
      background: colors.subtleBg,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: colors.accent + "22", color: colors.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 700, flexShrink: 0, overflow: "hidden",
      }}>
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: "cover" }} />
        ) : (
          (user.username || "?")[0].toUpperCase()
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.display_name || `@${user.username}`}
        </div>
        <div style={{ fontSize: 12, opacity: 0.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
          @{user.username}
        </div>
      </div>
      {user.friendship_status === "accepted" ? (
        <span style={{ fontSize: 12, fontWeight: 600, color: colors.accent, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Friends
        </span>
      ) : user.friendship_status === "pending" ? (
        <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.4 }}>Pending</span>
      ) : user.friendship_status === "blocked" ? null : (
        <button
          className="btn-press"
          onClick={() => onAdd(user.id)}
          style={{
            padding: "8px 20px", fontSize: 12, fontWeight: 700,
            borderRadius: 999, border: `1px solid ${colors.border}`,
            background: "transparent", color: colors.text, cursor: "pointer",
          }}
        >
          Add
        </button>
      )}
    </div>
  );
}

export function FriendSearchModal({ open, state: searchState, dispatch, styles, colors, onRequestSent, friends }) {
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const closeSearch = useCallback(() => dispatch({ type: "CLOSE_FRIEND_SEARCH" }), [dispatch]);

  // CloseWatcher for Android back button (fullscreen overlay, no Modal wrapper)
  useEffect(() => {
    if (!open || typeof CloseWatcher === "undefined") return;
    let watcher;
    try {
      watcher = new CloseWatcher();
      watcher.onclose = closeSearch;
    } catch {}
    return () => { try { watcher?.destroy(); } catch {} };
  }, [open, closeSearch]);

  // Also handle browser history back for older browsers
  useEffect(() => {
    if (!open) return;
    const onPop = () => closeSearch();
    window.history.pushState({ friendSearch: true }, "");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, closeSearch]);

  useEffect(() => {
    if (open) {
      setRecentSearches(loadRecent());
      if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
      // Load suggested: search with empty-ish query to get random discoverable users
      searchUsers("a").then(({ data }) => {
        // Filter out existing friends
        const friendIds = new Set((friends || []).map(f => f.id));
        setSuggested((data || []).filter(u => !friendIds.has(u.id) && u.friendship_status !== "accepted").slice(0, 6));
      });
    }
  }, [open, friends]);

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
      addRecent(q);
      setRecentSearches(loadRecent());
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [searchState.query, open]);

  const handleAdd = useCallback(async (userId) => {
    const { error } = await sendFriendRequest(userId);
    if (!error) {
      const updated = searchState.results.map((r) =>
        r.id === userId ? { ...r, friendship_status: "pending" } : r
      );
      dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { results: updated } });
      setSuggested(prev => prev.map(u => u.id === userId ? { ...u, friendship_status: "pending" } : u));
      onRequestSent?.();
    }
  }, [searchState.results, dispatch, onRequestSent]);

  if (!open) return null;

  const hasQuery = searchState.query?.trim().length >= 2;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: colors.appBg,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Search bar + Cancel */}
      <div style={{
        padding: "calc(12px + var(--safe-top, 0px)) 16px 12px",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px", borderRadius: 999,
          background: colors.subtleBg,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={searchState.query || ""}
            onChange={(e) => dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { query: e.target.value } })}
            placeholder="Find friends or trainers..."
            style={{
              border: "none", background: "transparent", outline: "none",
              color: colors.text, fontSize: 14, fontFamily: "inherit",
              width: "100%", padding: 0,
            }}
          />
          {searchState.query && (
            <button
              onClick={() => dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { query: "" } })}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.4, flexShrink: 0, color: colors.text }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
        <button
          onClick={closeSearch}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: colors.accent, fontSize: 14, fontWeight: 700,
            padding: "8px 4px", flexShrink: 0,
          }}
        >
          Cancel
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>

        {/* === Before typing: recent searches + suggested === */}
        {!hasQuery && !searchState.searching && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <SectionLabel>Recent Searches</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentSearches.map((q) => (
                    <div
                      key={q}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                      }}
                      onClick={() => dispatch({ type: "UPDATE_FRIEND_SEARCH", payload: { query: q } })}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                          <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{q}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeRecent(q); setRecentSearches(loadRecent()); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.25, color: colors.text }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested People */}
            {suggested.length > 0 && (
              <div>
                <SectionLabel>Suggested People</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {suggested.map((user) => (
                    <UserCard key={user.id} user={user} onAdd={handleAdd} colors={colors} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty default */}
            {recentSearches.length === 0 && suggested.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, margin: "0 auto 12px" }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <div style={{ fontSize: 14, opacity: 0.4, lineHeight: 1.5 }}>
                  Search by username or display name to find people to connect with.
                </div>
              </div>
            )}
          </div>
        )}

        {/* === Searching indicator === */}
        {searchState.searching && (
          <div style={{ textAlign: "center", padding: 32, opacity: 0.5, fontSize: 13 }}>
            Searching...
          </div>
        )}

        {/* === No results === */}
        {!searchState.searching && hasQuery && searchState.results.length === 0 && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 14, opacity: 0.45, marginBottom: 4 }}>No users found for "{searchState.query?.trim()}"</div>
            <div style={{ fontSize: 12, opacity: 0.3 }}>Try a different username or name</div>
          </div>
        )}

        {/* === Search Results === */}
        {!searchState.searching && searchState.results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SectionLabel>Search Results</SectionLabel>
            {searchState.results.map((user) => (
              <UserCard key={user.id} user={user} onAdd={handleAdd} colors={colors} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
