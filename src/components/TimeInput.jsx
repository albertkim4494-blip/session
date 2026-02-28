import React from "react";

/**
 * Unified time input — decomposes a total-seconds value into H/M/S fields.
 *
 * Props:
 *  value        — total seconds (number)
 *  onChange(sec) — callback with recomposed total seconds
 *  colors       — theme colors object
 *  showHours    — render hours field (default false)
 *  showMinutes  — render minutes field (default true)
 *  showSeconds  — render seconds field (default true)
 *  labelPosition — "above" (pace: label above, colon separators)
 *                  "inline" (rest: "m"/"s" labels beside inputs)
 *  labels       — override label text, default { h: "Hrs", m: "Min", s: "Sec" }
 *  inputWidth   — override input width (default 40)
 *  fontSize     — override input font size (default 14 above, 13 inline)
 */
export function TimeInput({
  value = 0,
  onChange,
  colors,
  showHours = false,
  showMinutes = true,
  showSeconds = true,
  labelPosition = "inline",
  labels: labelsProp,
  inputWidth = 40,
  fontSize: fontSizeProp,
}) {
  const above = labelPosition === "above";
  const labels = { h: "Hrs", m: "Min", s: "Sec", ...labelsProp };
  const fontSize = fontSizeProp ?? (above ? 14 : 13);

  const total = Math.max(0, Math.round(value || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const maxMin = showHours ? 59 : 60;

  const recompose = (nh, nm, ns) => onChange?.(nh * 3600 + nm * 60 + ns);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const inputStyle = {
    width: inputWidth,
    padding: "6px 4px",
    borderRadius: 10,
    border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
    background: colors?.inputBg || "#161b22",
    color: colors?.text || "#e8eef7",
    fontSize,
    fontFamily: "inherit",
    fontWeight: 600,
    textAlign: "center",
    boxSizing: "border-box",
    minWidth: 0,
  };

  const onKey = (e) => { if (e.key === "Enter") e.target.blur(); };
  const onFocus = (e) => requestAnimationFrame(() => e.target.select());

  const display = (v) => above ? (v || "") : v;

  const fields = [];

  if (showHours) {
    fields.push(
      <Field key="h" label={labels.h} above={above}>
        <input type="number" inputMode="numeric" min={0} max={23}
          value={display(h)} placeholder="0" enterKeyHint="done"
          onChange={(e) => recompose(clamp(parseInt(e.target.value) || 0, 0, 23), m, s)}
          onFocus={onFocus} onKeyDown={onKey} style={inputStyle} />
      </Field>
    );
  }

  if (showMinutes) {
    fields.push(
      <Field key="m" label={labels.m} above={above}>
        <input type="number" inputMode="numeric" min={0} max={maxMin}
          value={display(m)} placeholder="0" enterKeyHint="done"
          onChange={(e) => recompose(h, clamp(parseInt(e.target.value) || 0, 0, maxMin), s)}
          onFocus={onFocus} onKeyDown={onKey} style={inputStyle} />
      </Field>
    );
  }

  if (showSeconds) {
    fields.push(
      <Field key="s" label={labels.s} above={above}>
        <input type="number" inputMode="numeric" min={0} max={59}
          value={display(s)} placeholder="0" enterKeyHint="done"
          onChange={(e) => recompose(h, m, clamp(parseInt(e.target.value) || 0, 0, 59))}
          onFocus={onFocus} onKeyDown={onKey} style={inputStyle} />
      </Field>
    );
  }

  // Interleave colon separators for "above" layout
  const items = [];
  for (let i = 0; i < fields.length; i++) {
    if (i > 0 && above) {
      items.push(
        <span key={`sep-${i}`} style={{ fontSize: 16, fontWeight: 700, opacity: 0.4, paddingTop: 14 }}>:</span>
      );
    }
    items.push(fields[i]);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: above ? 6 : 4 }}>
      {items}
    </div>
  );
}

function Field({ label, above, children }) {
  if (above) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>{label}</span>
        {children}
      </div>
    );
  }
  return (
    <>
      {children}
      <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.5 }}>{label}</span>
    </>
  );
}
