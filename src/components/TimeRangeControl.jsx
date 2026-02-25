import React from "react";

const TABS = [
  { value: "week", label: "W" },
  { value: "month", label: "M" },
  { value: "year", label: "Y" },
  { value: "all", label: "All" },
];

export function TimeRangeControl({ value, onChange, offset, onOffsetChange, dateLabel, colors }) {
  const isAll = value === "all";

  const segStyle = {
    display: "flex",
    borderRadius: 10,
    overflow: "hidden",
    border: `1px solid ${colors.border}`,
    background: colors.cardAltBg,
  };

  const tabBase = {
    border: "none",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    lineHeight: 1,
  };

  const arrowBtn = {
    background: "transparent",
    border: "none",
    color: colors.text,
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!isAll && (
          <button
            style={{ ...arrowBtn, opacity: 0.5 }}
            onClick={() => onOffsetChange(offset - 1)}
            aria-label="Previous period"
          >
            &#8249;
          </button>
        )}
        <div style={segStyle}>
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
        {!isAll && (
          <button
            style={{ ...arrowBtn, opacity: offset >= 0 ? 0.15 : 0.5 }}
            onClick={() => { if (offset < 0) onOffsetChange(offset + 1); }}
            disabled={offset >= 0}
            aria-label="Next period"
          >
            &#8250;
          </button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.8 }}>
          {dateLabel}
        </div>
        {offset !== 0 && !isAll && (
          <button
            style={{
              background: "transparent",
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.text,
              opacity: 0.6,
              cursor: "pointer",
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 700,
            }}
            onClick={() => onOffsetChange(0)}
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
}
