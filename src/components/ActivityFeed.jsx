import React, { useState } from "react";
import { FEED_EMOJI_MAP, FEED_REACTIONS } from "../lib/feedApi";

// ============================================================================
// Helpers
// ============================================================================

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function formatVolume(vol) {
  if (!vol || vol <= 0) return null;
  if (vol >= 10000) return `${(vol / 1000).toFixed(1)}k`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
  return String(Math.round(vol));
}

// ============================================================================
// Stat Cell — bento grid item
// ============================================================================

function StatCell({ label, value, colors }) {
  return (
    <div style={{
      background: colors.subtleBg,
      borderRadius: 10,
      padding: "10px 12px",
      textAlign: "center",
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        opacity: 0.5,
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 18,
        fontWeight: 800,
      }}>
        {value}
      </div>
    </div>
  );
}

// ============================================================================
// Reaction Bar
// ============================================================================

function ReactionBar({ reactions, userId, feedEventId, onReact, colors }) {
  const grouped = {};
  for (const r of reactions || []) {
    if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, userReacted: false };
    grouped[r.emoji].count++;
    if (r.user_id === userId) grouped[r.emoji].userReacted = true;
  }

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {FEED_REACTIONS.map((emoji) => {
        const info = grouped[emoji];
        const count = info?.count || 0;
        const active = info?.userReacted || false;
        return (
          <button
            key={emoji}
            className="btn-press"
            onClick={() => onReact(feedEventId, emoji)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 999,
              border: active ? `1px solid ${colors.accentBorder}` : `1px solid ${colors.border}`,
              background: active ? colors.accentBg : "transparent",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: colors.text,
              opacity: count > 0 || active ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: 14 }}>{FEED_EMOJI_MAP[emoji]}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Workout Card — regular feed item
// ============================================================================

function WorkoutCard({ item, userId, onReact, colors }) {
  const p = item.payload || {};
  const weightLabel = p.measurementSystem === "metric" ? "kg" : "lbs";
  const stats = [];
  if (p.exerciseCount) stats.push({ label: "Exercises", value: p.exerciseCount });
  if (p.totalSets) stats.push({ label: "Sets", value: p.totalSets });
  const vol = formatVolume(p.totalVolume);
  if (vol) stats.push({ label: "Volume", value: `${vol} ${weightLabel}` });
  if (p.duration) stats.push({ label: "Duration", value: `${p.duration}m` });

  return (
    <div style={{
      background: colors.cardBg,
      borderRadius: 16,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}>
      {/* Header: avatar + name + time */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: colors.accent + "22", color: colors.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, flexShrink: 0,
          overflow: "hidden",
        }}>
          {item.avatar_url ? (
            <img src={item.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover" }} />
          ) : (
            (item.username || "?")[0].toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {item.display_name || `@${item.username}`}
            <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: 6 }}>completed</span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.05em", opacity: 0.45, marginTop: 1,
          }}>
            {p.category || "Workout"} &middot; {timeAgo(item.created_at)}
          </div>
        </div>
      </div>

      {/* Workout title */}
      <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
        {p.workoutName || "Workout"}
      </div>

      {/* Exercise list (abbreviated) */}
      {p.exercises?.length > 0 && (
        <div style={{ fontSize: 12, opacity: 0.55, lineHeight: 1.5 }}>
          {p.exercises.slice(0, 5).join(" \u00B7 ")}
          {p.exercises.length > 5 && ` +${p.exercises.length - 5} more`}
        </div>
      )}

      {/* Stat bento grid */}
      {stats.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
          gap: 8,
        }}>
          {stats.map((s) => (
            <StatCell key={s.label} label={s.label} value={s.value} colors={colors} />
          ))}
        </div>
      )}

      {/* Reactions */}
      <ReactionBar
        reactions={item.reactions}
        userId={userId}
        feedEventId={item.id}
        onReact={onReact}
        colors={colors}
      />
    </div>
  );
}

// ============================================================================
// PR Hero Card — highlighted personal record
// ============================================================================

function PRCard({ item, userId, onReact, colors }) {
  const p = item.payload || {};

  return (
    <div style={{
      background: colors.accentBg,
      border: `1px solid ${colors.accentBorder}`,
      borderRadius: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}>
      {/* Badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        alignSelf: "flex-start",
        padding: "4px 12px", borderRadius: 999,
        background: colors.accent, color: colors.primaryText || "#fff",
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Personal Record
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: colors.accent + "22", color: colors.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, flexShrink: 0,
          overflow: "hidden",
        }}>
          {item.avatar_url ? (
            <img src={item.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover" }} />
          ) : (
            (item.username || "?")[0].toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.display_name || `@${item.username}`}</div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.45, marginTop: 1 }}>
            {timeAgo(item.created_at)}
          </div>
        </div>
      </div>

      {/* PR Value */}
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>{p.exerciseName}</div>
        <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>
          {p.value} <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.6 }}>{p.unit}</span>
        </div>
        {p.previousValue != null && (
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
            Previous: {p.previousValue} {p.unit}
          </div>
        )}
      </div>

      {/* Reactions */}
      <ReactionBar
        reactions={item.reactions}
        userId={userId}
        feedEventId={item.id}
        onReact={onReact}
        colors={colors}
      />
    </div>
  );
}

// ============================================================================
// Activity Feed — main component
// ============================================================================

export function ActivityFeed({
  items,
  loading,
  userId,
  colors,
  styles,
  hasMore,
  onLoadMore,
  onReact,
  onPublish,
  canPublish,
  friendCount,
}) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try { await onPublish(); } finally { setPublishing(false); }
  };

  // Empty state — no friends
  if (!loading && friendCount === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 20px", textAlign: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        <div style={{ fontSize: 15, fontWeight: 700 }}>No friends yet</div>
        <div style={{ fontSize: 13, opacity: 0.5, maxWidth: 240 }}>
          Add friends to see their workouts and PRs in your feed.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Publish button */}
      {canPublish && (
        <button
          className="btn-press"
          onClick={handlePublish}
          disabled={publishing}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 16px",
            opacity: publishing ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {publishing ? "Posting..." : "Share Today's Workout"}
        </button>
      )}

      {/* Loading */}
      {loading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: 24, opacity: 0.5, fontSize: 13 }}>
          Loading feed...
        </div>
      )}

      {/* Empty feed (has friends but no activity) */}
      {!loading && items.length === 0 && friendCount > 0 && (
        <div style={{ textAlign: "center", padding: "32px 20px", opacity: 0.5 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No activity yet</div>
          <div style={{ fontSize: 12 }}>
            When you or your friends post workouts, they'll show up here.
          </div>
        </div>
      )}

      {/* Feed items */}
      {items.map((item) =>
        item.event_type === "pr" ? (
          <PRCard key={item.id} item={item} userId={userId} onReact={onReact} colors={colors} />
        ) : (
          <WorkoutCard key={item.id} item={item} userId={userId} onReact={onReact} colors={colors} />
        )
      )}

      {/* Load more */}
      {hasMore && items.length > 0 && (
        <button
          className="btn-press"
          onClick={onLoadMore}
          style={{
            padding: "12px 16px",
            borderRadius: 999,
            border: `1px solid ${colors.border}`,
            background: "transparent",
            color: colors.text,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            opacity: 0.7,
            textAlign: "center",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}
