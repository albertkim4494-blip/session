import React from "react";
import { ThemeSwitch } from "../ThemeSwitch";
import { usernameChangeCooldownMs } from "../../lib/userIdentity";

const sectionHeader = {
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 2,
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
        <div style={sectionHeader}>Display</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Units</span>
          <ThemeSwitch
            theme={preferences?.measurementSystem === "metric" ? "dark" : "light"}
            styles={styles}
            labels={["Metric", "Imperial"]}
            onToggle={() => onUpdatePreference?.("measurementSystem", preferences?.measurementSystem === "metric" ? "imperial" : "metric")}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Theme</span>
          <ThemeSwitch
            theme={preferences?.theme || "dark"}
            styles={styles}
            onToggle={() => onUpdatePreference?.("theme", preferences?.theme === "dark" ? "light" : "dark")}
          />
        </div>
      </div>

      {/* Audio */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ ...sectionHeader, marginBottom: 10 }}>Audio</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Timer Sound</span>
            <ThemeSwitch
              theme={preferences?.timerSound !== false ? "dark" : "light"}
              styles={styles}
              labels={["On", "Off"]}
              onToggle={() => onUpdatePreference?.("timerSound", !(preferences?.timerSound !== false))}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Rest Timer</span>
              <ThemeSwitch
                theme={preferences?.restTimerEnabled !== false ? "dark" : "light"}
                styles={styles}
                labels={["On", "Off"]}
                onToggle={() => onUpdatePreference?.("restTimerEnabled", !(preferences?.restTimerEnabled !== false))}
              />
            </div>
            <span style={{ fontSize: 11, opacity: 0.5 }}>Countdown between sets after completing one</span>
          </div>
        </div>
      </div>

      {/* Account */}
      <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
        <div style={{ ...sectionHeader, marginBottom: 10 }}>Account</div>

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
