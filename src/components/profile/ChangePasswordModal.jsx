import React from "react";
import { Modal } from "../Modal";
import { supabase } from "../../lib/supabase";

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
            fontSize: 14,
            fontWeight: 700,
            color: "#8BAF7F",
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
            <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatch({ type: "CLOSE_CHANGE_PASSWORD" })}>
              Cancel
            </button>
            <button className="btn-press" style={styles.primaryBtn} onClick={handleConfirm} disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
