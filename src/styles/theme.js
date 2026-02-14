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

export function getColors(theme) {
  return theme === "dark"
    ? {
        appBg: "#171412",
        text: "#F0E8DF",
        border: "rgba(255,255,255,0.07)",
        cardBg: "#231F1A",
        cardAltBg: "#171412",
        inputBg: "#231F1A",
        navBg: "#171412",
        topBarBg: "#171412",
        shadow: "0 2px 8px rgba(0,0,0,0.3)",
        primaryBg: "#D4A574",
        primaryText: "#171412",
        dangerBg: "rgba(255, 80, 80, 0.14)",
        dangerBorder: "rgba(255, 120, 120, 0.45)",
        dangerText: "#ffd7d7",
        dot: "#D4A574",
      }
    : {
        appBg: "#F5F0EB",
        text: "#2D2A26",
        border: "rgba(0,0,0,0.06)",
        cardBg: "#ffffff",
        cardAltBg: "#F9F5F0",
        inputBg: "#ffffff",
        navBg: "#171412",
        topBarBg: "#F5F0EB",
        shadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        primaryBg: "#C49A6C",
        primaryText: "#ffffff",
        dangerBg: "rgba(220, 38, 38, 0.12)",
        dangerBorder: "rgba(220, 38, 38, 0.35)",
        dangerText: "#b91c1c",
        dot: "#C49A6C",
      };
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
    },

    topBar: {
      flexShrink: 0,
      zIndex: 10,
      background: colors.topBarBg,
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
      border: `1px solid ${colors.appBg === "#171412" ? "rgba(212,165,116,0.3)" : "rgba(196,154,108,0.25)"}`,
      background: colors.appBg === "#171412" ? "rgba(212,165,116,0.1)" : "rgba(196,154,108,0.08)",
      color: colors.appBg === "#171412" ? "#D4A574" : "#C49A6C",
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
      color: "#F0E8DF",
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
      color: "#D4A574",
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
      fontSize: 12,
      opacity: 0.5,
      marginLeft: "auto",
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
      background: colors.appBg === "#171412" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
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
      borderLeft: "3px solid #8BAF7F",
    },

    exerciseName: { fontWeight: 700, fontSize: 14 },
    exerciseSub: { marginTop: 4, fontSize: 12, opacity: 0.7 },

    badge: {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 999,
      background: "rgba(46, 204, 113, 0.18)",
      color: "#8BAF7F",
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
      background: colors.appBg === "#171412" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
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
      width: 40,
      height: 40,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      lineHeight: "40px",
      fontSize: 20,
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
      resize: "vertical",
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
      background: "rgba(255,255,255,0.12)",
    },

    themeSwitchTrackLight: {
      background: "rgba(0,0,0,0.08)",
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
      background: "#e8eef7",
    },

    themeSwitchThumbLight: {
      background: "#1f2933",
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
      color: colors.appBg === "#171412" ? "#D4A574" : "#C49A6C",
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
      background: colors.appBg === "#171412" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      overflow: "hidden",
    },

    restTimerProgressFill: {
      height: "100%",
      borderRadius: 2,
      background: colors.appBg === "#171412" ? "#D4A574" : "#C49A6C",
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

  };
}
