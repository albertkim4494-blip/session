import React from "react";
import { isValidBirthdateString, computeAge } from "../../lib/validation";
import { EQUIPMENT_LABELS } from "../../lib/exerciseCatalog";
import { AvatarUpload } from "./AvatarUpload";

const sectionHeader = {
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 2,
};

export function ProfileTab({ modalState, dispatch, profile, session, styles, colors, summaryStats, preferences, onUpdatePreference }) {
  const { displayName, birthdate, gender, weightLbs, goal, sports, about, avatarUrl, avatarPreview } = modalState;
  const age = birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null;

  const update = (field, value) => dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { [field]: value, error: "" } });

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

      {/* Stats Row */}
      {summaryStats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}>
          <div style={{
            textAlign: "center", padding: "10px 6px", borderRadius: 12,
            background: colors?.cardAltBg, border: `1px solid ${colors?.border}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{summaryStats.logged}</div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>Sessions</div>
          </div>
          <div style={{
            textAlign: "center", padding: "10px 6px", borderRadius: 12,
            background: colors?.cardAltBg, border: `1px solid ${colors?.border}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: summaryStats.weekStreak > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.weekStreak}</div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>Week Streak</div>
          </div>
        </div>
      )}

      {/* Personal Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={sectionHeader}>Personal Info</div>

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
            <label style={styles.label}>Birthdate</label>
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
        <div style={sectionHeader}>Training</div>

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

        <div style={styles.fieldCol}>
          <label style={styles.label}>Equipment Access</label>
          <select
            value={preferences?.equipment || "gym"}
            onChange={(e) => onUpdatePreference?.("equipment", e.target.value)}
            style={styles.textInput}
          >
            {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <span style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>AI Coach will tailor suggestions to your setup.</span>
        </div>

        <div style={styles.fieldCol}>
          <label style={styles.label}>Default Rest Time</label>
          <select
            value={preferences?.defaultRestSec ?? 90}
            onChange={(e) => onUpdatePreference?.("defaultRestSec", Number(e.target.value))}
            style={styles.textInput}
          >
            <option value={30}>30s</option>
            <option value={45}>45s</option>
            <option value={60}>1 min</option>
            <option value={90}>1:30</option>
            <option value={120}>2 min</option>
            <option value={150}>2:30</option>
            <option value={180}>3 min</option>
            <option value={240}>4 min</option>
            <option value={300}>5 min</option>
          </select>
        </div>
      </div>
    </div>
  );
}
