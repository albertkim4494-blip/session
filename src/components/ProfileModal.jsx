import React, { useState } from "react";
import { Modal } from "./Modal";
import { PillTabs } from "./PillTabs";
import { isValidBirthdateString, computeAge } from "../lib/validation";
import { validateDisplayName } from "../lib/userIdentity";
import { ProfileTab } from "./profile/ProfileTab";
import { SettingsTab } from "./profile/SettingsTab";

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "settings", label: "Settings" },
];

export function ProfileModal({ open, modalState, dispatch, profile, session, onLogout, onSave, styles, summaryStats, colors, preferences, onUpdatePreference }) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!open) return null;

  const { displayName, birthdate, weightLbs, avatarUrl, saving, error } = modalState;

  async function handleSave() {
    const dnErr = validateDisplayName(displayName);
    if (dnErr) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: dnErr } });
      return;
    }
    if (birthdate && !isValidBirthdateString(birthdate)) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: "Invalid birthdate (must be 13-120 years old)" } });
      return;
    }
    const wNum = Number(weightLbs);
    const isMetric = preferences?.measurementSystem === "metric";
    const wMin = isMetric ? 23 : 50;
    const wMax = isMetric ? 454 : 1000;
    if (weightLbs && (wNum < wMin || wNum > wMax)) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: `Weight must be ${wMin}-${wMax} ${isMetric ? "kg" : "lbs"}` } });
      return;
    }

    dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { saving: true, error: "" } });

    const updates = {
      display_name: displayName.trim() || null,
      birthdate: modalState.birthdate || null,
      gender: modalState.gender || null,
      weight_lbs: weightLbs ? wNum : null,
      goal: modalState.goal?.trim() || null,
      sports: modalState.sports?.trim() || null,
      about: modalState.about?.trim() || null,
      age: birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null,
      avatar_url: avatarUrl || null,
    };

    try {
      await onSave(updates);
    } finally {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false } });
    }
  }

  const profileFooter = (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ flex: 1 }} />
      {error && (
        <div style={{
          fontSize: 12,
          color: colors?.dangerText || "#f87171",
          background: colors?.dangerBg || "rgba(248,113,113,0.1)",
          border: `1px solid ${colors?.dangerBorder || "rgba(248,113,113,0.3)"}`,
          borderRadius: 8,
          padding: "6px 10px",
          flex: 1,
          minWidth: 0,
        }}>
          {error}
        </div>
      )}
      <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })}>
        Cancel
      </button>
      <button className="btn-press" style={styles.primaryBtn} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );

  const settingsFooter = (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button className="btn-press" style={styles.dangerBtn} onClick={onLogout} type="button">
        Logout
      </button>
      <div style={{ flex: 1 }} />
      <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })}>
        Close
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      title="Profile"
      onClose={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })}
      styles={styles}
      footer={activeTab === "profile" ? profileFooter : settingsFooter}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <PillTabs tabs={TABS} value={activeTab} onChange={setActiveTab} styles={styles} />

        {activeTab === "profile" ? (
          <ProfileTab
            modalState={modalState}
            dispatch={dispatch}
            profile={profile}
            session={session}
            styles={styles}
            colors={colors}
            summaryStats={summaryStats}
            preferences={preferences}
            onUpdatePreference={onUpdatePreference}
          />
        ) : (
          <SettingsTab
            dispatch={dispatch}
            profile={profile}
            preferences={preferences}
            onUpdatePreference={onUpdatePreference}
            styles={styles}
            colors={colors}
          />
        )}
      </div>
    </Modal>
  );
}
