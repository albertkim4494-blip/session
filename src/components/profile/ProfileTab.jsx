import React, { useState, useRef, useEffect } from "react";
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

export function ProfileTab({ modalState, dispatch, profile, session, styles, colors, summaryStats, preferences, onUpdatePreference }) {
  const { displayName, birthdate, gender, weightLbs, goal, sports, about, avatarUrl, avatarPreview } = modalState;
  const age = birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null;
  const [showStatsConfig, setShowStatsConfig] = useState(false);
  const statsConfigRef = useRef(null);

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

  const update = (field, value) => dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { [field]: value, error: "" } });

  const selectedStats = preferences?.profileHighlights || ["totalReps"];
  const toggleStat = (key) => {
    const cur = preferences?.profileHighlights || ["totalReps"];
    const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
    onUpdatePreference?.("profileHighlights", next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

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
        const weightUnit = preferences?.measurementSystem === "metric" ? "kg" : "lbs";

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
        <div style={sectionHeaderStyle}>
          Personal Info
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </div>

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
            <label style={styles.label}>Weight ({preferences?.measurementSystem === "metric" ? "kg" : "lbs"})</label>
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
      </div>

      {/* Training */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={sectionHeaderStyle}>
          Training
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="1" y="9.5" width="3" height="5" rx="0.75" /><rect x="4" y="7" width="3" height="10" rx="0.75" /><rect x="17" y="7" width="3" height="10" rx="0.75" /><rect x="20" y="9.5" width="3" height="5" rx="0.75" /><rect x="7" y="11" width="10" height="2" rx="0.5" /></svg>
        </div>

        <div style={styles.fieldCol}>
          <label style={styles.label}>Fitness Goal</label>
          <input
            value={goal}
            onChange={(e) => update("goal", e.target.value)}
            style={styles.textInput}
            placeholder="e.g. Build muscle"
          />
        </div>

        <div style={styles.fieldCol}>
          <label style={styles.label}>Sports / Activities</label>
          <input
            value={sports}
            onChange={(e) => update("sports", e.target.value)}
            style={styles.textInput}
            placeholder="e.g. Running, Basketball"
          />
        </div>

        <div style={styles.fieldCol}>
          <label style={styles.label}>About You</label>
          <textarea
            value={about}
            onChange={(e) => update("about", e.target.value)}
            style={styles.textarea}
            placeholder="Anything you'd like to share..."
            rows={3}
          />
        </div>

      </div>
    </div>
  );
}
