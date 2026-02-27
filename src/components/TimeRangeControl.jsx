import React from "react";

const TABS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "all", label: "All" },
];

export function TimeRangeControl({ value, onChange, offset, onOffsetChange, dateLabel, colors }) {
  const isAll = value === "all";

  const tabBase = {
    flex: 1,
    border: "none",
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    lineHeight: 1,
    fontFamily: "inherit",
    textAlign: "center",
  };

  const chevronStyle = (disabled) => ({
    background: "transparent",
    border: "none",
    color: colors.text,
    cursor: disabled ? "default" : "pointer",
    padding: "2px 8px",
    display: "flex",
    alignItems: "center",
    opacity: disabled ? 0.15 : 0.45,
    fontFamily: "inherit",
    flexShrink: 0,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Row 1: full-width period pills */}
      <div style={{
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        background: colors.cardAltBg,
      }}>
        {TABS.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              onClick={() => { onChange(t.value); onOffsetChange(0); }}
              style={{
                ...tabBase,
                background: active ? colors.primaryBg : "transparent",
                color: active ? (colors.primaryText || "#fff") : colors.text,
                opacity: active ? 1 : 0.5,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Row 2: date navigation centered */}
      {!isAll && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <button
            style={chevronStyle(false)}
            onClick={() => onOffsetChange(offset - 1)}
            aria-label="Previous period"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span style={{
            fontSize: 12, fontWeight: 600, opacity: 0.7,
            whiteSpace: "nowrap",
          }}>
            {dateLabel}
          </span>
          <button
            style={chevronStyle(offset >= 0)}
            onClick={() => { if (offset < 0) onOffsetChange(offset + 1); }}
            disabled={offset >= 0}
            aria-label="Next period"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          {offset !== 0 && (
            <button
              style={{
                background: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                opacity: 0.5,
                cursor: "pointer",
                padding: "2px 6px",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "inherit",
                flexShrink: 0,
                marginLeft: 2,
              }}
              onClick={() => onOffsetChange(0)}
            >
              Today
            </button>
          )}
        </div>
      )}
    </div>
  );
}
