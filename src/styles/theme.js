// Design tokens
export const fontSize = {
  xs: 10,    // sub-labels (RPE/Pace/Target labels, tiny annotations)
  sm: 11,    // captions, badges, column headers, day-of-week
  md: 12,    // secondary text, helper text, small buttons
  base: 13,  // body text, button labels, search results
  lg: 14,    // input text, primary buttons, exercise names
  xl: 16,    // section titles, card titles, modal titles, date display
  "2xl": 20, // stat numbers, hero numbers
  "3xl": 28, // timer display
};

export const radius = {
  sm: 8,     // small buttons, chips, popovers, compact elements
  md: 12,    // inputs, buttons, set rows, standard cards
  lg: 14,    // exercise rows, manage items, calendar cells
  xl: 16,    // main cards
  "2xl": 18, // modal sheet
  full: 999, // pills, avatars, badges, dots
};

export const icon = {
  xs: 14,    // inline icons (gear, edit, trash, add, checkmark)
  sm: 16,    // search icon, chevrons, expand/collapse
  md: 18,    // nav arrows, export/import/reset icons, password eye
  lg: 22,    // bottom nav icons
  xl: 40,    // empty state illustrations
  stroke: 2, // standard stroke for ALL icons
};

const THEMES = {
  dark: {
    appBg: "#0d1117",
    text: "#e8eef7",
    textSecondary: "rgba(232,238,247,0.55)",
    textTertiary: "rgba(232,238,247,0.35)",
    border: "rgba(255,255,255,0.06)",
    borderStrong: "rgba(255,255,255,0.14)",
    cardBg: "#161b22",
    cardAltBg: "#0d1117",
    inputBg: "#161b22",
    navBg: "#0d1117",
    topBarBg: "#0d1117",
    shadow: "0 2px 8px rgba(0,0,0,0.3)",
    primaryBg: "#1a2744",
    primaryText: "#e8eef7",
    dangerBg: "rgba(255, 80, 80, 0.14)",
    dangerBorder: "rgba(255, 120, 120, 0.45)",
    dangerText: "#ffd7d7",
    dot: "#7dd3fc",
    accent: "#7dd3fc",
    accentBg: "rgba(125,211,252,0.1)",
    accentSoft: "rgba(125,211,252,0.10)",
    accentBorder: "rgba(125,211,252,0.3)",
    subtleBg: "rgba(255,255,255,0.06)",
    subtleTrack: "rgba(255,255,255,0.08)",
  },
  light: {
    appBg: "#f8f9fa",
    text: "#1f2933",
    textSecondary: "rgba(31,41,51,0.55)",
    textTertiary: "rgba(31,41,51,0.35)",
    border: "rgba(0,0,0,0.08)",
    borderStrong: "rgba(31,41,51,0.16)",
    cardBg: "#ffffff",
    cardAltBg: "#f1f3f5",
    inputBg: "#ffffff",
    navBg: "#f8f9fa",
    topBarBg: "#f8f9fa",
    shadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
    primaryBg: "#2b5b7a",
    primaryText: "#ffffff",
    dangerBg: "rgba(220, 38, 38, 0.12)",
    dangerBorder: "rgba(220, 38, 38, 0.35)",
    dangerText: "#b91c1c",
    dot: "#2563eb",
    accent: "#2b5b7a",
    accentBg: "rgba(43,91,122,0.08)",
    accentSoft: "rgba(43,91,122,0.10)",
    accentBorder: "rgba(43,91,122,0.25)",
    subtleBg: "rgba(0,0,0,0.05)",
    subtleTrack: "rgba(0,0,0,0.06)",
  },
  japandi: {
    appBg: "#F5F1E8",
    text: "#3d3529",
    textSecondary: "rgba(61,53,41,0.55)",
    textTertiary: "rgba(61,53,41,0.35)",
    border: "rgba(61,53,41,0.12)",
    borderStrong: "rgba(61,53,41,0.20)",
    cardBg: "#FBF8F2",
    cardAltBg: "#F5F1E8",
    inputBg: "#FBF8F2",
    navBg: "#F5F1E8",
    topBarBg: "#F5F1E8",
    shadow: "0 1px 3px rgba(61,53,41,0.08), 0 2px 8px rgba(61,53,41,0.04)",
    primaryBg: "#8a7e6b",
    primaryText: "#ffffff",
    dangerBg: "rgba(220, 38, 38, 0.12)",
    dangerBorder: "rgba(220, 38, 38, 0.35)",
    dangerText: "#b91c1c",
    dot: "#D97706",
    accent: "#D97706",
    accentBg: "rgba(217,119,6,0.08)",
    accentSoft: "rgba(217,119,6,0.10)",
    accentBorder: "rgba(217,119,6,0.25)",
    subtleBg: "rgba(61,53,41,0.06)",
    subtleTrack: "rgba(61,53,41,0.08)",
  },
};

export const THEME_LIST = [
  { key: "dark", label: "Night", swatch: "#000000" },
  { key: "light", label: "Day", swatch: "#ffffff" },
  { key: "japandi", label: "Nature" },
];

// ---------------------------------------------------------------------------
// Time-of-day atmosphere — radial wash + greeting copy used by the train tab
// hero. Five periods covering a full day. Gradients are theme-specific;
// themes outside {dark, light, japandi} return null and the renderer skips
// the wash for those themes (Phase 2 decides the fallback).
// ---------------------------------------------------------------------------

export const TIME_OF_DAY = {
  dawn: {
    greeting: "Good morning",
    sub: "Ease into the day",
    sun: "#ffb38a",
    gradient: (themeKey) =>
      themeKey === "dark"
        ? "radial-gradient(120% 70% at 50% -10%, rgba(255,170,140,0.22) 0%, rgba(120,90,180,0.16) 35%, rgba(13,17,23,0) 70%)"
        : themeKey === "japandi"
          ? "radial-gradient(120% 70% at 50% -10%, rgba(220,150,110,0.30) 0%, rgba(200,160,180,0.18) 38%, rgba(245,241,232,0) 72%)"
          : themeKey === "light"
            ? "radial-gradient(120% 70% at 50% -10%, rgba(255,180,150,0.45) 0%, rgba(180,160,210,0.30) 35%, rgba(248,249,250,0) 70%)"
            : null,
  },
  morning: {
    greeting: "Good morning",
    sub: "Let’s move",
    sun: "#fde68a",
    gradient: (themeKey) =>
      themeKey === "dark"
        ? "radial-gradient(120% 70% at 50% -10%, rgba(125,211,252,0.22) 0%, rgba(80,140,200,0.12) 38%, rgba(13,17,23,0) 72%)"
        : themeKey === "japandi"
          ? "radial-gradient(120% 70% at 50% -10%, rgba(180,200,180,0.32) 0%, rgba(220,200,170,0.22) 40%, rgba(245,241,232,0) 72%)"
          : themeKey === "light"
            ? "radial-gradient(120% 70% at 50% -10%, rgba(160,210,240,0.45) 0%, rgba(200,220,200,0.25) 40%, rgba(248,249,250,0) 72%)"
            : null,
  },
  afternoon: {
    greeting: "Good afternoon",
    sub: "Strong middle",
    sun: "#fbbf24",
    gradient: (themeKey) =>
      themeKey === "dark"
        ? "radial-gradient(120% 70% at 50% -10%, rgba(255,210,140,0.18) 0%, rgba(200,140,90,0.12) 38%, rgba(13,17,23,0) 72%)"
        : themeKey === "japandi"
          ? "radial-gradient(120% 70% at 50% -10%, rgba(230,200,150,0.32) 0%, rgba(210,170,120,0.20) 40%, rgba(245,241,232,0) 72%)"
          : themeKey === "light"
            ? "radial-gradient(120% 70% at 50% -10%, rgba(255,220,160,0.40) 0%, rgba(240,200,150,0.25) 40%, rgba(248,249,250,0) 72%)"
            : null,
  },
  evening: {
    greeting: "Good evening",
    sub: "One more push",
    sun: "#f97316",
    gradient: (themeKey) =>
      themeKey === "dark"
        ? "radial-gradient(120% 70% at 50% -10%, rgba(255,130,90,0.22) 0%, rgba(150,70,140,0.16) 38%, rgba(13,17,23,0) 72%)"
        : themeKey === "japandi"
          ? "radial-gradient(120% 70% at 50% -10%, rgba(220,130,100,0.32) 0%, rgba(180,110,140,0.20) 40%, rgba(245,241,232,0) 72%)"
          : themeKey === "light"
            ? "radial-gradient(120% 70% at 50% -10%, rgba(255,160,120,0.42) 0%, rgba(220,140,180,0.26) 40%, rgba(248,249,250,0) 72%)"
            : null,
  },
  night: {
    greeting: "Good evening",
    sub: "Quiet finish",
    sun: "#818cf8",
    gradient: (themeKey) =>
      themeKey === "dark"
        ? "radial-gradient(120% 70% at 50% -10%, rgba(80,90,180,0.22) 0%, rgba(40,30,90,0.18) 38%, rgba(13,17,23,0) 72%)"
        : themeKey === "japandi"
          ? "radial-gradient(120% 70% at 50% -10%, rgba(120,130,170,0.28) 0%, rgba(100,90,130,0.18) 40%, rgba(245,241,232,0) 72%)"
          : themeKey === "light"
            ? "radial-gradient(120% 70% at 50% -10%, rgba(140,150,210,0.34) 0%, rgba(110,120,180,0.20) 40%, rgba(248,249,250,0) 72%)"
            : null,
  },
};

/** Map a Date (or hour 0–23) to a time-of-day key. */
export function getTimeOfDay(input) {
  let h;
  if (typeof input === "number") h = input;
  else if (input instanceof Date) h = input.getHours();
  else h = new Date().getHours();

  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

export function getColors(theme) {
  return THEMES[theme] || THEMES.dark;
}

export function getStyles(colors) {
  return {
    app: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      background: colors.appBg,
      color: colors.text,
      height: "100dvh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },

    content: {
      width: "100%",
      maxWidth: 760,
      overflowX: "clip",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      paddingLeft: "calc(16px + var(--safe-left, 0px))",
      paddingRight: "calc(16px + var(--safe-right, 0px))",
      paddingTop: "calc(10px + var(--safe-top, 0px))",
      position: "relative",
      zIndex: 1,
    },

    topBar: {
      flexShrink: 0,
      zIndex: 10,
      background: "transparent",
      padding: "16px 0 12px",
      borderBottom: "none",
    },

    label: { fontSize: 12, opacity: 0.85 },

    avatarBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 700,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
      overflow: "hidden",
    },

    profileDivider: {
      borderTop: `1px solid ${colors.border}`,
      paddingTop: 12,
      marginTop: 2,
    },

    topBarRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    textInput: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      fontFamily: "inherit",
      width: "100%",
      boxSizing: "border-box",
    },

    dateBtn: {
      padding: "4px 0",
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: colors.text,
      textAlign: "center",
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
    },

    navArrow: {
      padding: 6,
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: colors.text,
      opacity: 0.5,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      WebkitTapHighlightColor: "transparent",
    },

    todayChip: {
      padding: "4px 10px",
      borderRadius: 999,
      border: `1px solid ${colors.accentBorder}`,
      background: colors.accentBg,
      color: colors.accent,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
    },

    body: { flex: 1, paddingTop: 14, overflowY: "auto", overflowX: "hidden", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", paddingBottom: 24 },
    section: { display: "flex", flexDirection: "column", gap: 12, minWidth: 0, maxWidth: "100%" },

    nav: {
      flexShrink: 0,
      display: "flex",
      gap: 8,
      paddingTop: 10,
      paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
      background: colors.navBg,
      borderTop: "none",
      touchAction: "none",
    },

    navBtn: {
      flex: 1,
      padding: "6px 12px 4px",
      borderRadius: 12,
      border: "none",
      background: "transparent",
      color: colors.text,
      opacity: 0.45,
      fontWeight: 700,
      fontSize: 11,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      transition: "opacity 0.2s, color 0.2s",
      WebkitTapHighlightColor: "transparent",
      outline: "none",
      cursor: "pointer",
    },

    navBtnActive: {
      opacity: 1,
      color: colors.accent,
      background: colors.accentBg,
    },

    card: {
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 16,
      boxShadow: colors.shadow,
    },

    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 10,
      cursor: "pointer",
    },

    collapseToggle: {
      opacity: 0.4,
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
    },

    collapseAllRow: {
      display: "flex",
      justifyContent: "flex-end",
    },

    collapseAllBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 600,
      fontSize: 12,
      opacity: 0.85,
      cursor: "pointer",
    },

    autocompleteDropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: 4,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      zIndex: 10,
      overflow: "hidden",
      maxHeight: 200,
      overflowY: "auto",
    },

    autocompleteOption: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "10px 14px",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${colors.border}`,
      color: colors.text,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },

    cardTitle: { fontWeight: 700, fontSize: 16 },

    tagMuted: {
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 7px",
      borderRadius: 999,
      background: colors.subtleBg,
      border: `1px solid ${colors.border}`,
      opacity: 0.65,
    },

    emptyText: { opacity: 0.75, fontSize: 13, padding: "6px 2px" },

    exerciseRow: { display: "flex", alignItems: "stretch", gap: 8 },

    exerciseBtn: {
      flex: 1,
      textAlign: "left",
      padding: "14px 16px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      borderLeft: `3px solid transparent`,
    },

    exerciseBtnLogged: {
      borderLeft: "3px solid #2ecc71",
    },

    exerciseName: { fontWeight: 700, fontSize: 14 },
    exerciseSub: { marginTop: 4, fontSize: 12, opacity: 0.7 },

    badge: {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 999,
      background: "rgba(46, 204, 113, 0.18)",
      color: "#2ecc71",
    },

    badgeMuted: {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 999,
      opacity: 0.4,
    },

    unitPill: {
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 7px",
      borderRadius: 999,
      background: colors.subtleBg,
      border: `1px solid ${colors.border}`,
      opacity: 0.65,
    },

    primaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 700,
      fontSize: 14,
    },

    secondaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 600,
      fontSize: 14,
    },

    dangerBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      color: colors.dangerText,
      fontWeight: 700,
      fontSize: 14,
    },

    deleteLogBtn: {
      padding: 8,
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: colors.dangerText,
      opacity: 0.5,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },

    manageList: { display: "flex", flexDirection: "column", gap: 10 },

    manageItem: {
      textAlign: "left",
      padding: 12,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
    },

    manageItemActive: {
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
    },

    manageExerciseRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      minWidth: 0,
      maxWidth: "100%",
    },

    manageExerciseLeft: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      flex: 1,
      overflow: "hidden",
    },

    manageExerciseName: {
      fontWeight: 700,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0,
      flex: 1,
      width: 0,
    },

    manageExerciseActions: {
      display: "flex",
      gap: 4,
      flexShrink: 0,
    },

    pillRow: { display: "flex", gap: 8, marginBottom: 10 },

    pill: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      fontWeight: 700,
    },

    pillActive: {
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    pillInactive: {
      background: colors.cardAltBg,
      color: colors.text,
      opacity: 0.85,
      border: `1px solid ${colors.border}`,
    },

    rangeRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },

    rangeText: { fontSize: 12, opacity: 0.8 },

    summaryRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
    },

    summaryRight: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },

    summaryChip: {
      fontSize: 12,
      fontWeight: 700,
      padding: "6px 10px",
      borderRadius: 999,
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    smallText: { fontSize: 12, opacity: 0.8 },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      padding: 10,
      zIndex: 50,
    },

    modalSheet: {
      width: "100%",
      maxWidth: 720,
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    },

    modalHeader: {
      padding: "14px 16px",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    modalTitle: { fontWeight: 700, fontSize: 16 },
    modalBody: { padding: 16, maxHeight: "78vh", overflow: "auto" },
    modalFooter: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 },

    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "pointer",
    },

    setRow: {
      display: "grid",
      gridTemplateColumns: "36px 1fr 1fr 46px 40px",
      gap: 10,
      alignItems: "center",
      padding: 10,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
    },

    setIndex: {
      fontWeight: 700,
      opacity: 0.85,
      textAlign: "center",
      paddingBottom: 10,
    },

    fieldCol: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
    bwCol: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },

    numInput: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box",
      minWidth: 0,
    },

    disabledInput: { opacity: 0.7 },
    checkbox: { width: 22, height: 22 },

    textarea: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: 14,
      fontFamily: "inherit",
      resize: "none",
      width: "100%",
      boxSizing: "border-box",
    },

    calendarSwipeArea: {
      borderRadius: 14,
      touchAction: "pan-y",
    },

    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 8,
    },

    calendarDow: {
      fontSize: 11,
      fontWeight: 600,
      opacity: 0.75,
      textAlign: "center",
      padding: "4px 0",
    },

    calendarCell: {
      padding: "10px 0 6px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 700,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    },

    calendarCellActive: {
      background: colors.primaryBg,
      color: colors.primaryText,
      border: `1px solid ${colors.border}`,
    },

    calendarCellNum: {
      lineHeight: "18px",
    },

    calendarDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: colors.dot,
      opacity: 1,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.25)",
    },

    calendarCellToday: {
      boxShadow: `0 0 0 2px ${colors.primaryBg} inset`,
    },

    themeSwitch: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px 6px 6px",
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      background: colors.cardBg,
      color: colors.text,
      fontWeight: 600,
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      cursor: "pointer",
    },

    themeSwitchTrack: {
      width: 40,
      height: 22,
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      padding: 2,
      boxSizing: "border-box",
      position: "relative",
      transition: "background 160ms ease",
    },

    themeSwitchTrackDark: {
      background: colors.accentBg,
    },

    themeSwitchTrackLight: {
      background: colors.subtleTrack,
    },

    themeSwitchThumb: {
      width: 16,
      height: 16,
      borderRadius: 999,
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)",
      position: "absolute",
      top: 2,
      left: 2,
    },

    themeSwitchThumbDark: {
      background: colors.accent,
    },

    themeSwitchThumbLight: {
      background: colors.text,
      opacity: 0.35,
    },

    themeSwitchLabel: {
      fontSize: 12,
      opacity: 0.9,
    },

    addExerciseFullBtn: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
    },

    reorderBtnGroup: {
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
    },

    reorderBtn: {
      background: "transparent",
      border: "none",
      color: colors.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 2px",
      cursor: "pointer",
      lineHeight: 1,
    },

    compactSecondaryBtn: {
      padding: "6px 8px",
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
    },

    // Timer styles
    timerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: 12,
    },

    timerRingWrap: {
      width: 120,
      height: 120,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    timerDigital: {
      fontSize: 28,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      position: "absolute",
      textAlign: "center",
    },

    timerControls: {
      display: "flex",
      gap: 10,
      alignItems: "center",
    },

    timerBtn: {
      padding: "8px 16px",
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
    },

    timerBtnPrimary: {
      padding: "8px 16px",
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    },

    timerModeToggle: {
      fontSize: 12,
      fontWeight: 700,
      color: colors.accent,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "2px 0",
      opacity: 0.8,
    },

    // Rest timer bar (inline in modal)
    restTimerBar: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      background: colors.cardAltBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      flexShrink: 0,
    },

    restTimerTime: {
      fontSize: 18,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      minWidth: 42,
      textAlign: "right",
    },

    restTimerProgress: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: colors.subtleTrack,
      overflow: "hidden",
    },

    restTimerProgressFill: {
      height: "100%",
      borderRadius: 2,
      background: colors.accent,
      transition: "width 0.3s linear",
    },

    restTimerDismiss: {
      width: 28,
      height: 28,
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: colors.text,
      opacity: 0.5,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      flexShrink: 0,
    },

    fab: {
      position: "fixed",
      bottom: "calc(70px + env(safe-area-inset-bottom, 0px))",
      right: "max(20px, calc(50vw - 360px))",
      width: 60,
      height: 60,
      borderRadius: 999,
      background: colors.accent,
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 40,
      transition: "opacity 0.3s ease, transform 0.2s ease",
    },

    fabPanel: {
      position: "fixed",
      bottom: "calc(140px + env(safe-area-inset-bottom, 0px))",
      right: "max(20px, calc(50vw - 360px))",
      left: "max(20px, calc(50vw - 360px))",
      maxHeight: "calc(100dvh - 240px)",
      background: colors.cardBg,
      border: `1px solid rgba(0,0,0,0.06)`,
      borderRadius: 18,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      zIndex: 41,
    },

  };
}
