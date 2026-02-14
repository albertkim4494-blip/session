import React, { useState } from "react";
import { Modal } from "./Modal";
import { useSwipe } from "../hooks/useSwipe";
import { isValidBirthdateString, computeAge } from "../lib/validation";
import { validateDisplayName } from "../lib/userIdentity";
import { ProfileTab } from "./profile/ProfileTab";
import { SettingsTab } from "./profile/SettingsTab";

const TABS = [
  { value: "profile", label: "Profile", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )},
  { value: "settings", label: "Settings", icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" /></svg>
  )},
];

const DIRTY_FIELDS = ["displayName", "birthdate", "gender", "weightLbs", "goal", "sports", "about", "avatarUrl"];

function isDirty(modalState) {
  const init = modalState._initial;
  if (!init) return false;
  return DIRTY_FIELDS.some((k) => (modalState[k] ?? "") !== (init[k] ?? ""));
}

export function ProfileModal({ open, modalState, dispatch, profile, session, onLogout, onSave, styles, summaryStats, colors, preferences, onUpdatePreference }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setActiveTab("settings"),
    onSwipeRight: () => setActiveTab("profile"),
  });

  if (!open) return null;

  const { displayName, birthdate, weightLbs, avatarUrl, saving, error } = modalState;

  function handleCancel() {
    if (isDirty(modalState)) {
      setShowDiscardConfirm(true);
    } else {
      dispatch({ type: "CLOSE_PROFILE_MODAL" });
    }
  }

  function handleDiscard() {
    setShowDiscardConfirm(false);
    dispatch({ type: "CLOSE_PROFILE_MODAL" });
  }

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

  const unifiedFooter = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {error && (
        <div style={{
          fontSize: 12,
          color: colors?.dangerText || "#f87171",
          background: colors?.dangerBg || "rgba(248,113,113,0.1)",
          border: `1px solid ${colors?.dangerBorder || "rgba(248,113,113,0.3)"}`,
          borderRadius: 8,
          padding: "6px 10px",
        }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn-press" style={styles.dangerBtn} onClick={onLogout} type="button">
          Logout
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn-press" style={styles.secondaryBtn} onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn-press" style={styles.primaryBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );

  const headerTabs = (
    <div style={{
      display: "flex",
      flex: 1,
      padding: 3,
      borderRadius: 10,
      background: colors?.cardAltBg || "rgba(255,255,255,0.06)",
      gap: 2,
    }}>
      {TABS.map((t) => {
        const active = t.value === activeTab;
        return (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            style={{
              flex: 1,
              padding: "6px 0",
              background: active ? (colors?.cardBg || "#161b22") : "transparent",
              border: "none",
              borderRadius: 8,
              color: colors?.text || "#e8eef7",
              opacity: active ? 1 : 0.5,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              WebkitTapHighlightColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
              transition: "background 0.15s, opacity 0.15s, box-shadow 0.15s",
              outline: "none",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <Modal
      open={open}
      headerContent={headerTabs}
      hideClose
      onClose={handleCancel}
      styles={styles}
      footer={unifiedFooter}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }} {...swipeHandlers}>
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

      {/* Discard unsaved changes confirmation */}
      {showDiscardConfirm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            borderRadius: "inherit",
          }}
          onMouseDown={handleDiscard}
        >
          <div
            style={{
              background: colors?.cardBg || "#161b22",
              border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
              borderRadius: 14,
              padding: "20px 24px",
              maxWidth: 300,
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: colors?.text || "#e8eef7" }}>
              Discard unsaved changes?
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16, color: colors?.text || "#e8eef7" }}>
              You have unsaved profile changes that will be lost.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn-press"
                style={styles.secondaryBtn}
                onClick={() => setShowDiscardConfirm(false)}
              >
                Keep Editing
              </button>
              <button
                className="btn-press"
                style={styles.dangerBtn}
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
