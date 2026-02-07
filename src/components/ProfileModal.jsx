import React from "react";
import { Modal } from "./Modal";
import { ThemeSwitch } from "./ThemeSwitch";
import { supabase } from "../lib/supabase";
import { isValidBirthdateString, computeAge } from "../lib/validation";
import {
  validateDisplayName,
  validateUsernameStrict,
  usernameChangeCooldownMs,
  formatCooldown,
  sanitizeUsername,
} from "../lib/userIdentity";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";

export function ProfileModal({ open, modalState, dispatch, profile, theme, onToggleTheme, equipment, onSetEquipment, onLogout, onSave, styles }) {
  if (!open) return null;

  const { displayName, birthdate, gender, weightLbs, goal, sports, about, saving, error } = modalState;
  const age = birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null;

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
    if (weightLbs && (wNum < 50 || wNum > 1000)) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: "Weight must be 50-1000 lbs" } });
      return;
    }

    dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { saving: true, error: "" } });

    const updates = {
      display_name: displayName.trim() || null,
      birthdate: birthdate || null,
      gender: gender || null,
      weight_lbs: weightLbs ? wNum : null,
      goal: goal.trim() || null,
      sports: sports.trim() || null,
      about: about.trim() || null,
      age: birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null,
    };

    await onSave(updates);
  }

  const update = (field, value) => dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { [field]: value, error: "" } });

  function openChangeUsername() {
    const cooldownMs = usernameChangeCooldownMs(profile?.username_last_changed_at);
    dispatch({
      type: "OPEN_CHANGE_USERNAME",
      payload: { value: profile?.username || "", cooldownMs },
    });
  }

  return (
    <Modal open={open} title="Profile" onClose={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>Username</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>
              @{profile?.username || "\u2014"}
            </span>
            <button
              type="button"
              onClick={openChangeUsername}
              style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 12 }}
            >
              Change
            </button>
          </div>
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
            <label style={styles.label}>Birthdate</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => update("birthdate", e.target.value)}
              style={styles.textInput}
            />
          </div>
          {age !== null && (
            <div style={{ ...styles.fieldCol, width: 60, flexShrink: 0 }}>
              <label style={styles.label}>Age</label>
              <div style={{ padding: "10px 0", fontWeight: 800, fontSize: 14 }}>
                {age}
              </div>
            </div>
          )}
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
            <label style={styles.label}>Weight (lbs)</label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => update("weightLbs", e.target.value)}
              style={styles.textInput}
              placeholder="e.g. 170"
              min={50}
              max={1000}
            />
          </div>
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

        <div style={styles.fieldCol}>
          <label style={styles.label}>Equipment Access</label>
          <select
            value={equipment || "gym"}
            onChange={(e) => onSetEquipment(e.target.value)}
            style={styles.textInput}
          >
            {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <span style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>AI Coach will tailor suggestions to your setup.</span>
        </div>

        <div style={styles.profileDivider}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Theme</span>
            <ThemeSwitch theme={theme} styles={styles} onToggle={onToggleTheme} />
          </div>
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}

        <div style={styles.modalFooter}>
          <button
            style={styles.dangerBtn}
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
          <div style={{ flex: 1 }} />
          <button style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })}>
            Cancel
          </button>
          <button style={styles.primaryBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ChangeUsernameModal({ open, modalState, dispatch, profile, session, onProfileUpdate, styles }) {
  if (!open) return null;

  const { value, checking, error, cooldownMs } = modalState;
  const onCooldown = cooldownMs > 0;

  async function handleConfirm() {
    const trimmed = value.trim().toLowerCase();

    if (trimmed === profile?.username) {
      dispatch({ type: "CLOSE_CHANGE_USERNAME" });
      return;
    }

    const err = validateUsernameStrict(trimmed);
    if (err) {
      dispatch({ type: "UPDATE_CHANGE_USERNAME", payload: { error: err } });
      return;
    }

    dispatch({ type: "UPDATE_CHANGE_USERNAME", payload: { checking: true, error: "" } });

    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", trimmed)
        .maybeSingle();

      if (existing && existing.id !== session.user.id) {
        dispatch({ type: "UPDATE_CHANGE_USERNAME", payload: { checking: false, error: "Username is already taken." } });
        return;
      }

      const now = new Date().toISOString();
      const { error: saveErr } = await supabase
        .from("profiles")
        .update({
          username: trimmed,
          username_last_changed_at: now,
          username_change_count: (profile?.username_change_count || 0) + 1,
        })
        .eq("id", session.user.id);

      if (saveErr) {
        dispatch({ type: "UPDATE_CHANGE_USERNAME", payload: { checking: false, error: saveErr.message } });
        return;
      }

      onProfileUpdate({
        username: trimmed,
        username_last_changed_at: now,
        username_change_count: (profile?.username_change_count || 0) + 1,
      });
      dispatch({ type: "CLOSE_CHANGE_USERNAME" });
    } catch {
      dispatch({ type: "UPDATE_CHANGE_USERNAME", payload: { checking: false, error: "Failed to save. Try again." } });
    }
  }

  return (
    <Modal open={open} title="Change Username" onClose={() => dispatch({ type: "CLOSE_CHANGE_USERNAME" })} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {onCooldown ? (
          <div style={{ fontSize: 14, opacity: 0.8, textAlign: "center", padding: "12px 0" }}>
            You can change your username again in <strong>{formatCooldown(cooldownMs)}</strong>.
          </div>
        ) : (
          <>
            <div style={styles.fieldCol}>
              <label style={styles.label}>New Username</label>
              <input
                value={value}
                onChange={(e) => dispatch({
                  type: "UPDATE_CHANGE_USERNAME",
                  payload: { value: sanitizeUsername(e.target.value), error: "" },
                })}
                style={styles.textInput}
                placeholder="e.g. new_name"
                maxLength={16}
                autoFocus
              />
              <span style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                3-16 chars: lowercase letters, numbers, underscores. 30-day cooldown after change.
              </span>
            </div>
            {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}
          </>
        )}

        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_CHANGE_USERNAME" })}>
            Cancel
          </button>
          {!onCooldown && (
            <button style={styles.primaryBtn} onClick={handleConfirm} disabled={checking}>
              {checking ? "Checking..." : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
