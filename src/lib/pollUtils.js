/**
 * Pure utility functions for group polls — no Supabase dependency.
 */

export function isPollOpen(poll) {
  if (!poll) return false;
  if (poll.closed) return false;
  if (poll.deadline) {
    return new Date(poll.deadline).getTime() > Date.now();
  }
  return true;
}

export function getPollCounts(responses, totalMembers) {
  const r = responses || [];
  let yes = 0, no = 0, maybe = 0;
  for (const resp of r) {
    if (resp.response === "yes") yes++;
    else if (resp.response === "no") no++;
    else if (resp.response === "maybe") maybe++;
  }
  const noResponse = Math.max(0, (totalMembers || 0) - r.length);
  return { yes, no, maybe, noResponse };
}

export function getAttendanceSummary(responses) {
  const r = responses || [];
  let attended = 0, absent = 0, untracked = 0, saidYes = 0;
  for (const resp of r) {
    if (resp.response === "yes") saidYes++;
    if (resp.attended === true) attended++;
    else if (resp.attended === false) absent++;
    else untracked++;
  }
  return { attended, absent, untracked, saidYes };
}

export function formatDeadline(deadline) {
  if (!deadline) return null;
  const now = Date.now();
  const dl = new Date(deadline).getTime();
  const diff = dl - now;
  if (diff <= 0) return "Closed";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Closes in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Closes in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Closes in ${days}d`;
}

export function formatEventDateTime(eventDate, eventTime) {
  if (!eventDate) return null;
  const d = new Date(eventDate + "T00:00:00");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayName = dayNames[d.getUTCDay()];
  const monthName = monthNames[d.getUTCMonth()];
  const dayNum = d.getUTCDate();

  let str = `${dayName}, ${monthName} ${dayNum}`;
  if (eventTime) {
    const [h, m] = eventTime.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    str += ` at ${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  return str;
}
