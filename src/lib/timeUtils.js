// Time parsing / formatting utilities for pace strings ("H:MM:SS" or "M:SS")

export function parsePace(str) {
  if (!str) return { h: 0, m: 0, s: 0 };
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return { h: parts[0] || 0, m: parts[1] || 0, s: parts[2] || 0 };
  if (parts.length === 2) return { h: 0, m: parts[0] || 0, s: parts[1] || 0 };
  return { h: 0, m: 0, s: parts[0] || 0 };
}

export function formatPace(h, m, s) {
  if (!h && !m && !s) return "";
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${m}:${ss}`;
}

export function parsePaceToSeconds(str) {
  const { h, m, s } = parsePace(str);
  return h * 3600 + m * 60 + s;
}

export function secondsToPace(sec) {
  const total = Math.max(0, Math.round(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return formatPace(h, m, s);
}
