import React from "react";

export function PillTabs({ tabs, value, onChange, styles }) {
  return (
    <div style={styles.pillRow}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            style={{
              ...styles.pill,
              ...(active ? styles.pillActive : styles.pillInactive),
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
