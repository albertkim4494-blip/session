import React, { useRef } from "react";
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
  avatarInitial,
} from "../lib/userIdentity";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";

const sectionHeader = {
  fontSize: 13,
  fontWeight: 800,
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 2,
};

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Center-crop: use the smaller dimension as the crop square
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function ProfileModal({ open, modalState, dispatch, profile, session, theme, onToggleTheme, equipment, onSetEquipment, onLogout, onSave, styles, summaryStats, colors }) {
  const fileInputRef = useRef(null);
  if (!open) return null;

  const { displayName, birthdate, gender, weightLbs, goal, sports, about, avatarUrl, avatarPreview, saving, error } = modalState;
  const age = birthdate && isValidBirthdateString(birthdate) ? computeAge(birthdate) : null;
  const initial = avatarInitial(displayName, profile?.username);
  const avatarSrc = avatarPreview || avatarUrl;

  async function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { error: "Only JPEG, PNG, or WebP images allowed" } });
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: previewUrl, error: "" } });

    try {
      const compressed = await compressImage(file);
      const userId = session.user.id;
      const path = `${userId}/avatar.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, compressed, { upsert: true, contentType: "image/jpeg" });

      if (uploadErr) {
        dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: null, error: uploadErr.message } });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData.publicUrl + "?t=" + Date.now();

      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarUrl: publicUrl, avatarPreview: null } });
      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { avatarPreview: null, error: "Upload failed. Try again." } });
      URL.revokeObjectURL(previewUrl);
    }

    // Reset input so the same file can be re-selected
    e.target.value = "";
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
      avatar_url: avatarUrl || null,
    };

    try {
      await onSave(updates);
    } finally {
      dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false } });
    }
  }

  const update = (field, value) => dispatch({ type: "UPDATE_PROFILE_MODAL", payload: { [field]: value, error: "" } });

  function openChangeUsername() {
    const cooldownMs = usernameChangeCooldownMs(profile?.username_last_changed_at);
    dispatch({
      type: "OPEN_CHANGE_USERNAME",
      payload: { value: profile?.username || "", cooldownMs },
    });
  }

  const footerContent = (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button style={styles.dangerBtn} onClick={onLogout} type="button">
        Logout
      </button>
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
      <button style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })}>
        Cancel
      </button>
      <button style={styles.primaryBtn} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );

  return (
    <Modal open={open} title="Profile" onClose={() => dispatch({ type: "CLOSE_PROFILE_MODAL" })} styles={styles} footer={footerContent}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Hidden file input for avatar */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleAvatarPick}
        />

        {/* ── Hero Section ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 4, paddingBottom: 4 }}>
          <div style={{ position: "relative", width: 68, height: 68 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 68,
                height: 68,
                borderRadius: 999,
                background: colors?.primaryBg || "#152338",
                color: colors?.primaryText || "#e8eef7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 28,
                border: `2px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
                cursor: "pointer",
                padding: 0,
                overflow: "hidden",
              }}
              aria-label="Change profile picture"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                initial
              )}
            </button>
            {/* Camera badge — outside button so it isn't clipped */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: colors?.primaryBg || "#152338",
                border: `2px solid ${colors?.cardBg || "#0f1722"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors?.primaryText || "#e8eef7"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>
            {displayName?.trim() || profile?.username || "User"}
          </div>
          <div style={{ fontSize: 13, opacity: 0.5, fontWeight: 600 }}>
            @{profile?.username || "\u2014"}
          </div>
          {age !== null && (
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
              background: colors?.cardAltBg || "rgba(255,255,255,0.06)",
              border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
              marginTop: 2,
            }}>
              {age} yrs old
            </div>
          )}
        </div>

        {/* ── Stats Row ── */}
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
              <div style={{ fontSize: 20, fontWeight: 900 }}>{summaryStats.logged}</div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>Sessions</div>
            </div>
            <div style={{
              textAlign: "center", padding: "10px 6px", borderRadius: 12,
              background: colors?.cardAltBg, border: `1px solid ${colors?.border}`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: summaryStats.longestStreak > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.longestStreak}</div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>Longest Streak</div>
            </div>
          </div>
        )}

        {/* ── Personal Info ── */}
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
        </div>

        {/* ── Goals ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={sectionHeader}>Goals</div>

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

        {/* ── Account ── */}
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
                  onClick={() => dispatch({ type: "OPEN_CHANGE_PASSWORD" })}
                  style={{ ...styles.secondaryBtn, padding: "4px 10px", fontSize: 12 }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Preferences ── */}
        <div style={{ borderTop: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`, paddingTop: 14 }}>
          <div style={{ ...sectionHeader, marginBottom: 10 }}>Preferences</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Theme</span>
              <ThemeSwitch theme={theme} styles={styles} onToggle={onToggleTheme} />
            </div>

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

export function ChangePasswordModal({ open, modalState, dispatch, styles, colors }) {
  if (!open) return null;

  const { newPassword, confirmPassword, saving, error, success } = modalState;

  async function handleConfirm() {
    if (newPassword.length < 6) {
      dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { error: "Password must be at least 6 characters" } });
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { error: "Passwords do not match" } });
      return;
    }

    dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { saving: true, error: "" } });

    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) {
        dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { saving: false, error: updateErr.message } });
        return;
      }

      dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { saving: false, success: true } });
      setTimeout(() => dispatch({ type: "CLOSE_CHANGE_PASSWORD" }), 1500);
    } catch {
      dispatch({ type: "UPDATE_CHANGE_PASSWORD", payload: { saving: false, error: "Failed to update. Try again." } });
    }
  }

  return (
    <Modal open={open} title="Change Password" onClose={() => dispatch({ type: "CLOSE_CHANGE_PASSWORD" })} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {success ? (
          <div style={{
            textAlign: "center",
            padding: "18px 0",
            fontSize: 15,
            fontWeight: 700,
            color: "#2ecc71",
          }}>
            Password updated!
          </div>
        ) : (
          <>
            <div style={styles.fieldCol}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => dispatch({
                  type: "UPDATE_CHANGE_PASSWORD",
                  payload: { newPassword: e.target.value, error: "" },
                })}
                style={styles.textInput}
                placeholder="Min 6 characters"
                autoFocus
              />
            </div>

            <div style={styles.fieldCol}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => dispatch({
                  type: "UPDATE_CHANGE_PASSWORD",
                  payload: { confirmPassword: e.target.value, error: "" },
                })}
                style={styles.textInput}
                placeholder="Re-enter password"
              />
            </div>

            {error && (
              <div style={{
                fontSize: 13,
                color: colors?.dangerText || "#f87171",
                background: colors?.dangerBg || "rgba(248,113,113,0.1)",
                border: `1px solid ${colors?.dangerBorder || "rgba(248,113,113,0.3)"}`,
                borderRadius: 8,
                padding: "6px 10px",
              }}>
                {error}
              </div>
            )}
          </>
        )}

        {!success && (
          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_CHANGE_PASSWORD" })}>
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={handleConfirm} disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
