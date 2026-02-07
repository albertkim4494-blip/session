import React from "react";

export function ThemeSwitch({ theme, onToggle, styles }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      style={styles.themeSwitch}
      aria-label="Toggle theme"
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
      <span style={styles.themeSwitchLabel}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
