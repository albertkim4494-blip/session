import React, { useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Shown when the user arrives via a password-reset email link (Supabase emits a
 * PASSWORD_RECOVERY auth event, which AuthGate routes here). Lets them set a new
 * password on the recovery session, then continues into the app.
 */
export default function UpdatePasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) { setError(err.message); return; }
      setDone(true);
      setTimeout(() => onDone && onDone(), 1200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Set a new password</h2>
        {done ? (
          <p style={styles.notice}>Password updated. Signing you in…</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              minLength={6}
              autoComplete="new-password"
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              required
              minLength={6}
              autoComplete="new-password"
              style={styles.input}
            />
            {mismatch && <div style={styles.mismatch}>Passwords do not match</div>}
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" disabled={loading} style={styles.submit}>
              {loading ? "Please wait..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117", padding: 16, position: "fixed", inset: 0 },
  card: { width: "100%", maxWidth: 380, background: "#161b22", borderRadius: 16, padding: 32 },
  title: { color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "12px 14px", fontSize: 15, borderRadius: 10, border: "1px solid #1e293b", background: "#1a2332", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  mismatch: { color: "#fbbf24", fontSize: 12, marginTop: -6 },
  error: { color: "#f87171", fontSize: 13, textAlign: "center" },
  notice: { color: "#2dd4bf", fontSize: 14, textAlign: "center", lineHeight: 1.5 },
  submit: { padding: "12px 0", fontSize: 15, fontWeight: 600, borderRadius: 10, border: "none", background: "#2dd4bf", color: "#0d1117", cursor: "pointer", marginTop: 4, fontFamily: "inherit" },
};
