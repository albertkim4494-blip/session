import React from "react";

export function ThemeSwitch({ theme, onToggle, styles, labels }) {
  const isDark = theme === "dark";
  const [onLabel, offLabel] = labels || ["Dark", "Light"];

  return (
    <button
      onClick={onToggle}
      style={styles.themeSwitch}
      aria-label="Toggle"
      type="button"
    >
      <span
        style={{
          ...styles.themeSwitchTrack,
          ...(isDark ? styles.themeSwitchTrackDark : styles.themeSwitchTrackLight),
        }}
      >
        <span
          style={{
            ...styles.themeSwitchThumb,
            ...(isDark ? styles.themeSwitchThumbDark : styles.themeSwitchThumbLight),
            transform: isDark ? "translateX(20px)" : "translateX(0px)",
          }}
        />
      </span>
      <span style={styles.themeSwitchLabel}>{isDark ? onLabel : offLabel}</span>
    </button>
  );
}
