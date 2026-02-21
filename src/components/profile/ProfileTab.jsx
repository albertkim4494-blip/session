import React, { useState, useRef, useEffect, useCallback } from "react";
import { isValidBirthdateString, computeAge } from "../../lib/validation";

import { AvatarUpload } from "./AvatarUpload";

const sectionHeaderStyle = {
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 2,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const GENDER_LABELS = { male: "Male", female: "Female", other: "Other" };

const hasSpeechRecognition = typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);

function MicButton({ field, listeningField, onToggle, colors }) {
  const active = listeningField === field;
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      aria-label={active ? "Stop listening" : "Voice input"}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 4,
        color: active ? colors?.accent : colors?.text,
        opacity: active ? 1 : 0.4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        animation: active ? "micPulse 1.2s ease-in-out infinite" : "none",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}

export function ProfileTab({ modalState, dispatch, profile, session, styles, colors, summaryStats, preferences, onUpdatePreference }) {
  const { displayName, birthdate, gender, weightLbs, heightInches, goal, sports, about, avatarUrl, avatarPreview } = modalState;
  const age = birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null;
  const [showStatsConfig, setShowStatsConfig] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingTraining, setEditingTraining] = useState(false);
  const [listeningField, setListeningField] = useState(null);
  const [micError, setMicError] = useState("");
  const statsConfigRef = useRef(null);
  const recognitionRef = useRef(null);
  const micStreamRef = useRef(null);

  useEffect(() => {
    if (!showStatsConfig) return;
    const handler = (e) => {
      if (statsConfigRef.current && !statsConfigRef.current.contains(e.target)) {
        setShowStatsConfig(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStatsConfig]);

  // Cleanup speech recognition + mic stream on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    };
  }, []);

  const update = (field, value) => dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { [field]: value, error: "" } });

  const selectedStats = preferences?.profileHighlights || ["totalReps"];
  const toggleStat = (key) => {
    const cur = preferences?.profileHighlights || ["totalReps"];
    const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
    onUpdatePreference?.("profileHighlights", next);
  };

  const isMetric = preferences?.measurementSystem === "metric";
  const weightUnit = isMetric ? "kg" : "lbs";

  // Voice input toggle — with getUserMedia pre-flight for Android PWA compat
  const toggleListening = useCallback(async (field) => {
    if (!hasSpeechRecognition) return;
    setMicError("");

    // If already listening on this field, stop
    if (listeningField === field) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setListeningField(null);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }

    // Pre-grant mic permission via getUserMedia — Android PWAs may not
    // trigger the SpeechRecognition permission prompt on their own.
    // Keep the stream open while recognition runs (some Android devices
    // need an active stream for SpeechRecognition to receive audio).
    try {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (_) {
      setMicError("Mic access denied");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;
        const transcript = event.results[i][0]?.transcript;
        if (transcript) {
          const currentVal = modalState[field] || "";
          const separator = currentVal && !currentVal.endsWith(" ") ? " " : "";
          update(field, currentVal + separator + transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      setListeningField(null);
      recognitionRef.current = null;
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicError("Mic access denied");
      } else if (event.error === "network") {
        setMicError("No network for speech");
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setMicError("Voice not available");
      }
    };

    recognition.onend = () => {
      setListeningField(null);
      recognitionRef.current = null;
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    setListeningField(field);
    try {
      recognition.start();
    } catch (_) {
      setListeningField(null);
      setMicError("Voice not available");
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    }
  }, [listeningField, modalState, update]);

  // Read-only display value helper
  const notSet = <span style={{ opacity: 0.35, fontStyle: "italic" }}>Not set</span>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Mic pulse animation */}
      {hasSpeechRecognition && listeningField && (
        <style>{`@keyframes micPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      )}

      {/* Mic error banner */}
      {micError && (
        <div style={{
          padding: "8px 12px",
          borderRadius: 10,
          background: "rgba(229,57,53,0.1)",
          border: "1px solid rgba(229,57,53,0.3)",
          fontSize: 12,
          color: "#e53935",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="9" y="1" width="6" height="11" rx="3" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="4" y1="4" x2="20" y2="20" />
          </svg>
          {micError}
          <button onClick={() => setMicError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "#e53935", cursor: "pointer", fontSize: 16, padding: "0 2px", fontFamily: "inherit" }}>&times;</button>
        </div>
      )}

      {/* Avatar Hero */}
      <AvatarUpload
        displayName={displayName}
        username={profile?.username}
        avatarUrl={avatarUrl}
        avatarPreview={avatarPreview}
        age={age}
        session={session}
        dispatch={dispatch}
        colors={colors}
      />

      {/* Stats */}
      {summaryStats && summaryStats.logged > 0 && (() => {
        const badgeStyle = {
          textAlign: "center", padding: "10px 4px", borderRadius: 12,
          background: colors?.cardAltBg, border: `1px solid ${colors?.border}`,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        };
        const valStyle = { fontSize: 18, fontWeight: 700 };
        const subStyle = { fontSize: 10, fontWeight: 600, opacity: 0.5 };
        const exStyle = { fontSize: 9, fontWeight: 600, opacity: 0.4, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" };
        const formatNum = (n) => n >= 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : n.toLocaleString();

        const statBadges = [];
        if (selectedStats.includes("totalReps")) {
          const best = summaryStats.bestReps;
          const unitLabel = best?.unit ? best.unit.label : "Reps";
          statBadges.push(
            <div key="reps" style={badgeStyle}>
              {best && <div style={exStyle}>{best.name}</div>}
              <div style={{ ...valStyle, color: colors?.accent }}>{best ? formatNum(best.value) : "\u2014"}</div>
              <div style={subStyle}>Total {unitLabel}</div>
            </div>
          );
        }
        if (selectedStats.includes("volume")) {
          const best = summaryStats.bestVolume;
          statBadges.push(
            <div key="vol" style={badgeStyle}>
              {best && <div style={exStyle}>{best.name}</div>}
              <div style={valStyle}>{best ? formatNum(Math.round(best.value)) : "\u2014"}</div>
              <div style={subStyle}>Volume ({weightUnit})</div>
            </div>
          );
        }
        if (selectedStats.includes("topLift")) {
          const best = summaryStats.bestLift;
          statBadges.push(
            <div key="lift" style={badgeStyle}>
              {best && <div style={exStyle}>{best.name}</div>}
              <div style={valStyle}>{best ? `${best.value} ${weightUnit}` : "\u2014"}</div>
              <div style={subStyle}>Top Lift ({weightUnit})</div>
            </div>
          );
        }

        const topRowCols = statBadges.length === 1 ? "1fr 1fr 1fr" : "1fr 1fr";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Gear icon row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <div ref={statsConfigRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowStatsConfig((v) => !v)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: colors?.text, opacity: 0.35, display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Configure stats"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
                  </svg>
                </button>
                {showStatsConfig && (
                  <div style={{
                    position: "absolute", right: 0, top: "100%", marginTop: 4, zIndex: 30,
                    background: colors?.cardBg, border: `1px solid ${colors?.border}`,
                    borderRadius: 10, padding: "10px 14px", minWidth: 160,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginBottom: 2 }}>Show Highlights</div>
                    {[
                      { key: "totalReps", label: "Top Exercise" },
                      { key: "volume", label: `Volume (${weightUnit})` },
                      { key: "topLift", label: `Top Lift (${weightUnit})` },
                    ].map((opt) => (
                      <label key={opt.key} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        fontSize: 13, color: colors?.text, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedStats.includes(opt.key)}
                          onChange={() => toggleStat(opt.key)}
                          style={{ accentColor: colors?.primaryBg }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 1: Sessions + Week Streak (+ 1 stat if only 1 selected) */}
            <div style={{ display: "grid", gridTemplateColumns: topRowCols, gap: 8 }}>
              <div style={badgeStyle}>
                <div style={valStyle}>{summaryStats.logged}</div>
                <div style={subStyle}>Sessions</div>
              </div>
              <div style={badgeStyle}>
                <div style={{ ...valStyle, color: summaryStats.weekStreak > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.weekStreak}</div>
                <div style={subStyle}>Week Streak</div>
              </div>
              {statBadges.length === 1 && statBadges[0]}
            </div>

            {/* Row 2: 2-3 selected stats */}
            {statBadges.length >= 2 && (
              <div style={{ display: "grid", gridTemplateColumns: statBadges.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8 }}>
                {statBadges}
              </div>
            )}
          </div>
        );
      })()}

      {/* Personal Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...sectionHeaderStyle, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Personal Info
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <button
            type="button"
            onClick={() => setEditingInfo((v) => !v)}
            aria-label={editingInfo ? "Done editing" : "Edit personal info"}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: editingInfo ? colors?.accent : colors?.text,
              opacity: editingInfo ? 1 : 0.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingInfo ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            )}
          </button>
        </div>

        {editingInfo ? (
          <>
            <div style={styles.fieldCol}>
              <label style={styles.label}>Display Name</label>
              <input
                value={displayName}
                onChange={(e) => update("displayName", e.target.value)}
                style={styles.textInput}
                placeholder="e.g. John Doe"
                maxLength={30}
              />
              <span style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>Shown publicly. Falls back to username if empty.</span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>
                  Birthdate{age !== null && <span style={{ opacity: 0.5, fontWeight: 500 }}> ({age} yrs)</span>}
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => update("birthdate", e.target.value)}
                  style={styles.textInput}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => update("gender", e.target.value)}
                  style={styles.textInput}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Weight ({weightUnit})</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => update("weightLbs", e.target.value)}
                  style={styles.textInput}
                  placeholder={preferences?.measurementSystem === "metric" ? "e.g. 77" : "e.g. 170"}
                  min={preferences?.measurementSystem === "metric" ? 23 : 50}
                  max={preferences?.measurementSystem === "metric" ? 454 : 1000}
                />
              </div>
            </div>

            <div style={styles.fieldCol}>
              <label style={styles.label}>Height {isMetric ? "(cm)" : "(ft / in)"}</label>
              {isMetric ? (
                <input
                  type="number"
                  value={heightInches ? Math.round(Number(heightInches) * 2.54) : ""}
                  onChange={(e) => {
                    const cm = Number(e.target.value);
                    update("heightInches", cm ? String(Math.round(cm / 2.54)) : "");
                  }}
                  style={styles.textInput}
                  placeholder="e.g. 178"
                  min={100}
                  max={275}
                />
              ) : (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="number"
                    value={heightInches ? Math.floor(Number(heightInches) / 12) : ""}
                    onChange={(e) => {
                      const ft = Math.max(0, Number(e.target.value) || 0);
                      const currentIn = heightInches ? Number(heightInches) % 12 : 0;
                      update("heightInches", String(ft * 12 + currentIn));
                    }}
                    style={{ ...styles.textInput, width: 52, textAlign: "center" }}
                    placeholder="ft"
                    min={3}
                    max={8}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.5 }}>ft</span>
                  <input
                    type="number"
                    value={heightInches ? Number(heightInches) % 12 : ""}
                    onChange={(e) => {
                      const inches = Math.max(0, Math.min(11, Number(e.target.value) || 0));
                      const currentFt = heightInches ? Math.floor(Number(heightInches) / 12) : 0;
                      update("heightInches", String(currentFt * 12 + inches));
                    }}
                    style={{ ...styles.textInput, width: 52, textAlign: "center" }}
                    placeholder="in"
                    min={0}
                    max={11}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.5 }}>in</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 12,
              background: colors?.cardAltBg,
              border: `1px solid ${colors?.border}`,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Name</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{displayName || notSet}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Birthdate</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {birthdate && isValidBirthdateString(birthdate)
                    ? <>{new Date(birthdate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}{age !== null && <span style={{ opacity: 0.5, fontWeight: 500 }}> ({age})</span>}</>
                    : notSet}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Gender</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{gender ? GENDER_LABELS[gender] || gender : notSet}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Height</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {heightInches ? (
                    isMetric
                      ? `${Math.round(Number(heightInches) * 2.54)} cm`
                      : `${Math.floor(Number(heightInches) / 12)}'${Number(heightInches) % 12}"`
                  ) : notSet}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Weight</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{weightLbs ? `${weightLbs} ${weightUnit}` : notSet}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Training */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...sectionHeaderStyle, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Training
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="1" y="9.5" width="3" height="5" rx="0.75" /><rect x="4" y="7" width="3" height="10" rx="0.75" /><rect x="17" y="7" width="3" height="10" rx="0.75" /><rect x="20" y="9.5" width="3" height="5" rx="0.75" /><rect x="7" y="11" width="10" height="2" rx="0.5" /></svg>
          </div>
          <button
            type="button"
            onClick={() => setEditingTraining((v) => !v)}
            aria-label={editingTraining ? "Done editing" : "Edit training info"}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: editingTraining ? colors?.accent : colors?.text,
              opacity: editingTraining ? 1 : 0.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {editingTraining ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            )}
          </button>
        </div>

        {/* AI context banner */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderRadius: 8,
          background: colors?.accentBg,
          border: `1px solid ${colors?.accentBorder}`,
          fontSize: 11,
          color: colors?.accent,
          fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0b429" stroke="none" style={{ flexShrink: 0 }}>
            <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
            <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
          </svg>
          Your AI coach uses this to personalize recommendations
        </div>

        {editingTraining ? (
          <>
            <div style={styles.fieldCol}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={styles.label}>Fitness Goal</label>
                {hasSpeechRecognition && <MicButton field="goal" listeningField={listeningField} onToggle={toggleListening} colors={colors} />}
              </div>
              <input
                value={goal}
                onChange={(e) => update("goal", e.target.value)}
                style={styles.textInput}
                placeholder="e.g. Build muscle, lose 10lbs, run a 5k under 25min"
              />
            </div>

            <div style={styles.fieldCol}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={styles.label}>Sports / Activities</label>
                {hasSpeechRecognition && <MicButton field="sports" listeningField={listeningField} onToggle={toggleListening} colors={colors} />}
              </div>
              <input
                value={sports}
                onChange={(e) => update("sports", e.target.value)}
                style={styles.textInput}
                placeholder="e.g. Basketball 3x/week, running 2x/week"
              />
            </div>

            <div style={styles.fieldCol}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={styles.label}>About You</label>
                {hasSpeechRecognition && <MicButton field="about" listeningField={listeningField} onToggle={toggleListening} colors={colors} />}
              </div>
              <textarea
                value={about}
                onChange={(e) => update("about", e.target.value)}
                style={styles.textarea}
                placeholder="e.g. Recovering from knee injury, prefer morning workouts, 2 years lifting experience"
                rows={3}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 12,
              background: colors?.cardAltBg,
              border: `1px solid ${colors?.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Fitness Goal</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{goal || notSet}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>Sports / Activities</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{sports || notSet}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 2 }}>About You</div>
              <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "pre-wrap" }}>{about || notSet}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
