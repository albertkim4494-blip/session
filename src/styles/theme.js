export function getColors(theme) {
  return theme === "dark"
    ? {
        appBg: "#0b0f14",
        text: "#e8eef7",
        border: "rgba(255,255,255,0.10)",
        cardBg: "#0f1722",
        cardAltBg: "#0b111a",
        inputBg: "#0f1722",
        navBg: "#0b0f14",
        topBarBg: "#0b0f14",
        shadow: "0 8px 18px rgba(0,0,0,0.25)",
        primaryBg: "#152338",
        primaryText: "#e8eef7",
        dangerBg: "rgba(255, 80, 80, 0.14)",
        dangerBorder: "rgba(255, 120, 120, 0.45)",
        dangerText: "#ffd7d7",
        dot: "#7dd3fc",
      }
    : {
        appBg: "#f5f9fc",
        text: "#1f2933",
        border: "#dde5ec",
        cardBg: "#ffffff",
        cardAltBg: "#eef6f3",
        inputBg: "#ffffff",
        navBg: "#f5f9fc",
        topBarBg: "#f5f9fc",
        shadow: "0 8px 18px rgba(31,41,51,0.08)",
        primaryBg: "#2b5b7a",
        primaryText: "#ffffff",
        dangerBg: "rgba(220, 38, 38, 0.12)",
        dangerBorder: "rgba(220, 38, 38, 0.35)",
        dangerText: "#b91c1c",
        dot: "#2563eb",
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
      paddingLeft: "calc(14px + var(--safe-left, 0px))",
      paddingRight: "calc(14px + var(--safe-right, 0px))",
      paddingTop: "calc(10px + var(--safe-top, 0px))",
    },

    topBar: {
      flexShrink: 0,
      zIndex: 10,
      background: colors.topBarBg,
      padding: "14px 0 10px",
      borderBottom: `1px solid ${colors.border}`,
    },

    label: { fontSize: 12, opacity: 0.85 },

    avatarBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      border: `1px solid ${colors.border}`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 900,
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
      border: `1px solid ${colors.appBg === "#0b0f14" ? "rgba(125,211,252,0.3)" : "rgba(43,91,122,0.25)"}`,
      background: colors.appBg === "#0b0f14" ? "rgba(125,211,252,0.1)" : "rgba(43,91,122,0.08)",
      color: colors.appBg === "#0b0f14" ? "#7dd3fc" : "#2b5b7a",
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
      borderTop: `1px solid ${colors.border}`,
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
      color: colors.appBg === "#0b0f14" ? "#7dd3fc" : "#2b5b7a",
    },

    card: {
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 12,
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
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 700,
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

    cardTitle: { fontWeight: 900, fontSize: 16 },

    tagMuted: {
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 7px",
      borderRadius: 999,
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      border: `1px solid ${colors.border}`,
      opacity: 0.65,
    },

    emptyText: { opacity: 0.75, fontSize: 13, padding: "6px 2px" },

    exerciseRow: { display: "flex", alignItems: "stretch", gap: 8 },

    exerciseBtn: {
      flex: 1,
      textAlign: "left",
      padding: "12px 14px",
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      borderLeft: `3px solid transparent`,
    },

    exerciseBtnLogged: {
      borderLeft: "3px solid #2ecc71",
    },

    exerciseName: { fontWeight: 800, fontSize: 14 },
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
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      border: `1px solid ${colors.border}`,
      opacity: 0.65,
    },

    primaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 900,
      fontSize: 14,
    },

    secondaryBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 800,
      fontSize: 14,
    },

    dangerBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      color: colors.dangerText,
      fontWeight: 900,
    },

    deleteLogBtn: {
      padding: 8,
      borderRadius: 10,
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
      border: "1px solid rgba(255,255,255,0.10)",
      fontWeight: 900,
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
      fontWeight: 900,
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
      background: "rgba(0,0,0,0.55)",
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
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    },

    modalHeader: {
      padding: 12,
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    modalTitle: { fontWeight: 900, fontSize: 16 },
    modalBody: { padding: 12, maxHeight: "78vh", overflow: "auto" },
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
      fontWeight: 900,
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
      resize: "vertical",
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
      fontWeight: 800,
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
      fontWeight: 900,
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
      fontWeight: 800,
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
      border: `1px solid rgba(255,255,255,0.18)`,
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 900,
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
      fontWeight: 800,
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
      fontWeight: 900,
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
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.cardAltBg,
      color: colors.text,
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
    },

    timerBtnPrimary: {
      padding: "8px 16px",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.18)",
      background: colors.primaryBg,
      color: colors.primaryText,
      fontWeight: 800,
      fontSize: 13,
      cursor: "pointer",
    },

    timerModeToggle: {
      fontSize: 12,
      fontWeight: 700,
      color: colors.appBg === "#0b0f14" ? "#7dd3fc" : "#2b5b7a",
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
      fontWeight: 900,
      fontVariantNumeric: "tabular-nums",
      minWidth: 42,
      textAlign: "right",
    },

    restTimerProgress: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: colors.appBg === "#0b0f14" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      overflow: "hidden",
    },

    restTimerProgressFill: {
      height: "100%",
      borderRadius: 2,
      background: colors.appBg === "#0b0f14" ? "#7dd3fc" : "#2b5b7a",
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
