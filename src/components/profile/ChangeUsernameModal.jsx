import React from "react";
import { Modal } from "../Modal";
import { supabase } from "../../lib/supabase";
import {
  validateUsernameStrict,
  formatCooldown,
  sanitizeUsername,
} from "../../lib/userIdentity";

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
          <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_CHANGE_USERNAME" })}>
            Cancel
          </button>
          {!onCooldown && (
            <button className="btn-press" style={styles.primaryBtn} onClick={handleConfirm} disabled={checking}>
              {checking ? "Checking..." : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
