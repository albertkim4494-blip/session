// Pure utility functions for announcements, reactions, and dues

export function formatTimeAgo(dateStr) {
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

export const REACTION_EMOJIS = {
  thumbsup: "\u{1F44D}",
  fire: "\u{1F525}",
  heart: "\u2764\uFE0F",
  clap: "\u{1F44F}",
  "100": "\u{1F4AF}",
};

export function getReactionCounts(reactions) {
  const counts = {};
  for (const r of reactions || []) {
    counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  }
  return counts;
}

export function hasUserReacted(reactions, userId, emoji) {
  return (reactions || []).some(
    (r) => r.user_id === userId && r.emoji === emoji
  );
}

export function formatAmount(cents) {
  if (cents == null || isNaN(cents)) return "$0.00";
  const dollars = Math.abs(cents) / 100;
  return (cents < 0 ? "-" : "") + "$" + dollars.toFixed(2);
}

export function parseDollarsToCents(str) {
  if (typeof str !== "string") return null;
  const cleaned = str.replace(/^\$/, "").trim();
  if (!cleaned || isNaN(cleaned)) return null;
  const num = parseFloat(cleaned);
  if (num < 0) return null;
  return Math.round(num * 100);
}

export function getDuesPaymentSummary(payments, totalMembers, amountCents) {
  const paid = (payments || []).length;
  const unpaid = Math.max(0, totalMembers - paid);
  const collectedCents = paid * (amountCents || 0);
  return { paid, unpaid, total: totalMembers, collectedCents };
}
