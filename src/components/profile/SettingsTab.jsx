import React from "react";
import { THEME_LIST, getColors } from "../../styles/theme";
import { usernameChangeCooldownMs } from "../../lib/userIdentity";
import { SOUND_LIST, playTimerSound } from "../../lib/timerSounds";
import { EQUIPMENT_LABELS } from "../../lib/exerciseCatalog";

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

export function SettingsTab({ dispatch, profile, preferences, onUpdatePreference, styles, colors }) {

  function openChangeUsername() {
    const cooldownMs = usernameChangeCooldownMs(profile?.username_last_changed_at);
    dispatch({
      type: "OPEN_CHANGE_USERNAME",
      payload: { value: profile?.username || "", cooldownMs },
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Display */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={sectionHeaderStyle}>
          Display
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
        </div>

        <div>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Units</span>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {[
              { key: "metric", label: "Metric", icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 2.07A8 8 0 004.07 11H7.1a16.5 16.5 0 01.8-5.38A12.3 12.3 0 0111 4.07zM11 13H4.07A8 8 0 0011 19.93V13zm2 6.93A8 8 0 0019.93 13H16.9a16.5 16.5 0 01-.8 5.38A12.3 12.3 0 0113 19.93zM13 11h6.93A8 8 0 0013 4.07V11z" fillRule="evenodd" />
                </svg>
              )},
              { key: "imperial", label: "Imperial", icon: (
                <svg width="16" height="11" viewBox="0 0 32 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="0.75" y="0.75" width="30.5" height="20.5" rx="2" />
                  <line x1="0" y1="4.4" x2="32" y2="4.4" />
                  <line x1="0" y1="8" x2="32" y2="8" />
                  <line x1="0" y1="11.6" x2="32" y2="11.6" />
                  <line x1="0" y1="15.2" x2="32" y2="15.2" />
                  <line x1="0" y1="18.8" x2="32" y2="18.8" />
                  <rect x="0.75" y="0.75" width="12.5" height="10.5" fill="currentColor" stroke="none" opacity="0.35" />
                  <circle cx="4" cy="3" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="8" cy="3" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="6" cy="6" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="10" cy="6" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="4" cy="9" r="0.9" fill="currentColor" stroke="none" />
                  <circle cx="8" cy="9" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              )},
            ].map((u) => {
              const isActive = (preferences?.measurementSystem || "imperial") === u.key;
              return (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => onUpdatePreference?.("measurementSystem", u.key)}
                  style={{
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: 999,
                    border: `1.5px solid ${isActive ? (colors?.accent || "#7dd3fc") : (colors?.border || "rgba(255,255,255,0.10)")}`,
                    background: isActive ? (colors?.accent || "#7dd3fc") + "22" : "transparent",
                    color: isActive ? (colors?.accent || "#7dd3fc") : (colors?.text || "#e8eef7"),
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {u.icon} {u.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Theme</span>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
            {THEME_LIST.map((t) => {
              const isActive = (preferences?.theme || "dark") === t.key;
              const tc = getColors(t.key);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onUpdatePreference?.("theme", t.key)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    background: t.swatch || tc.accent,
                    outline: isActive ? `2px solid ${colors?.accent || "#7dd3fc"}` : "none",
                    outlineOffset: 3,
                  }} />
                  <span style={{
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? (colors?.accent || "#7dd3fc") : (colors?.text || "#e8eef7"),
                    opacity: isActive ? 1 : 0.65,
                  }}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audio */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ ...sectionHeaderStyle, marginBottom: 10 }}>
          Audio
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Timer Sound</span>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {[{ key: "none", label: "None" }, ...SOUND_LIST].map((s) => {
                const currentKey = preferences?.timerSound === false ? "none" : (preferences?.timerSoundType || "beep");
                const isActive = currentKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      if (s.key === "none") {
                        onUpdatePreference?.("timerSound", false);
                      } else {
                        onUpdatePreference?.("timerSound", true);
                        onUpdatePreference?.("timerSoundType", s.key);
                        playTimerSound(s.key);
                      }
                    }}
                    style={{
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 999,
                      border: `1.5px solid ${isActive ? (colors?.accent || "#7dd3fc") : (colors?.border || "rgba(255,255,255,0.10)")}`,
                      background: isActive ? (colors?.accent || "#7dd3fc") + "22" : "transparent",
                      color: isActive ? (colors?.accent || "#7dd3fc") : (colors?.text || "#e8eef7"),
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      fontFamily: "inherit",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Rest Timer</span>
            <span style={{ fontSize: 11, opacity: 0.5, display: "block", marginTop: 2 }}>Countdown between sets after completing one</span>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {[{ key: "none", label: "None" }, ...SOUND_LIST].map((s) => {
                const currentKey = preferences?.restTimerEnabled === false ? "none" : (preferences?.restTimerSoundType || "beep");
                const isActive = currentKey === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      if (s.key === "none") {
                        onUpdatePreference?.("restTimerEnabled", false);
                      } else {
                        onUpdatePreference?.("restTimerEnabled", true);
                        onUpdatePreference?.("restTimerSoundType", s.key);
                        playTimerSound(s.key);
                      }
                    }}
                    style={{
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 999,
                      border: `1.5px solid ${isActive ? (colors?.accent || "#7dd3fc") : (colors?.border || "rgba(255,255,255,0.10)")}`,
                      background: isActive ? (colors?.accent || "#7dd3fc") + "22" : "transparent",
                      color: isActive ? (colors?.accent || "#7dd3fc") : (colors?.text || "#e8eef7"),
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      fontFamily: "inherit",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

          </div>

          <div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Voice Input</span>
            <span style={{ fontSize: 11, opacity: 0.5, display: "block", marginTop: 2 }}>Enable microphone for voice-to-text on training fields</span>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[
                { key: false, label: "Off" },
                { key: true, label: "On" },
              ].map((opt) => {
                const isActive = (!!preferences?.voiceInput) === opt.key;
                return (
                  <button
                    key={String(opt.key)}
                    type="button"
                    onClick={() => onUpdatePreference?.("voiceInput", opt.key)}
                    style={{
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 999,
                      border: `1.5px solid ${isActive ? (colors?.accent || "#7dd3fc") : (colors?.border || "rgba(255,255,255,0.10)")}`,
                      background: isActive ? (colors?.accent || "#7dd3fc") + "22" : "transparent",
                      color: isActive ? (colors?.accent || "#7dd3fc") : (colors?.text || "#e8eef7"),
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      fontFamily: "inherit",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Training */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ ...sectionHeaderStyle, marginBottom: 10 }}>
          Training
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="1" y="9.5" width="3" height="5" rx="0.75" /><rect x="4" y="7" width="3" height="10" rx="0.75" /><rect x="17" y="7" width="3" height="10" rx="0.75" /><rect x="20" y="9.5" width="3" height="5" rx="0.75" /><rect x="7" y="11" width="10" height="2" rx="0.5" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Equipment</span>
            <select
              value={preferences?.equipment || "gym"}
              onChange={(e) => onUpdatePreference?.("equipment", e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
                background: colors?.inputBg || "#161b22",
                color: colors?.text || "#e8eef7",
                fontSize: 13,
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Default Rest</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                value={Math.floor((preferences?.defaultRestSec ?? 90) / 60)}
                onChange={(e) => {
                  const m = Math.max(0, Math.min(60, Number(e.target.value) || 0));
                  const s = (preferences?.defaultRestSec ?? 90) % 60;
                  onUpdatePreference?.("defaultRestSec", m * 60 + s);
                }}
                style={{
                  width: 40,
                  padding: "6px 4px",
                  borderRadius: 10,
                  border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
                  background: colors?.inputBg || "#161b22",
                  color: colors?.text || "#e8eef7",
                  fontSize: 13,
                  fontFamily: "inherit",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.5 }}>m</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                value={(preferences?.defaultRestSec ?? 90) % 60}
                onChange={(e) => {
                  const s = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                  const m = Math.floor((preferences?.defaultRestSec ?? 90) / 60);
                  onUpdatePreference?.("defaultRestSec", m * 60 + s);
                }}
                style={{
                  width: 40,
                  padding: "6px 4px",
                  borderRadius: 10,
                  border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
                  background: colors?.inputBg || "#161b22",
                  color: colors?.text || "#e8eef7",
                  fontSize: 13,
                  fontFamily: "inherit",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.5 }}>s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ ...sectionHeaderStyle, marginBottom: 10 }}>
          Account
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Username</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>
                @{profile?.username || "\u2014"}
              </span>
              <button
                type="button"
                className="btn-press"
                onClick={openChangeUsername}
                style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 12 }}
              >
                Change
              </button>
            </div>
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Password</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>
                ••••••••
              </span>
              <button
                type="button"
                className="btn-press"
                onClick={() => dispatch({ type: "OPEN_CHANGE_PASSWORD" })}
                style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 12 }}
              >
                Change
              </button>
            </div>
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Billing</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>
                Free plan
              </span>
              <button
                type="button"
                className="btn-press"
                onClick={() => dispatch({ type: "OPEN_BILLING" })}
                style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 12 }}
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.4 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Coming soon</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.4 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Refer Friends</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
