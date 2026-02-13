import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-clear mismatch error when passwords match
  const confirmMismatch = mode === "signup" && confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (authError) setError(authError.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Workout Tracker</h1>

        {/* Mode toggle pills */}
        <div style={styles.pillRow}>
          <button
            style={{
              ...styles.pill,
              ...(isLogin ? styles.pillActive : styles.pillInactive),
            }}
            onClick={() => { setMode("login"); setError(""); setConfirmPassword(""); setShowConfirm(false); }}
          >
            Log In
          </button>
          <button
            style={{
              ...styles.pill,
              ...(!isLogin ? styles.pillActive : styles.pillInactive),
            }}
            onClick={() => { setMode("signup"); setError(""); setConfirmPassword(""); setShowConfirm(false); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={styles.input}
          />
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              style={{ ...styles.input, paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {!isLogin && (
            <>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ ...styles.input, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {confirmMismatch && (
                <div style={styles.mismatch}>Passwords do not match</div>
              )}
            </>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            style={styles.link}
            onClick={() => { setMode(isLogin ? "signup" : "login"); setError(""); }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    padding: 16,
    overflow: "hidden",
    position: "fixed",
    inset: 0,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#161b22",
    borderRadius: 16,
    padding: 32,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    margin: "0 0 24px",
  },
  pillRow: {
    display: "flex",
    background: "#1a2332",
    borderRadius: 10,
    padding: 3,
    marginBottom: 24,
  },
  pill: {
    flex: 1,
    padding: "8px 0",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  pillActive: {
    background: "#2dd4bf",
    color: "#0d1117",
  },
  pillInactive: {
    background: "transparent",
    color: "#94a3b8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: "12px 14px",
    fontSize: 15,
    borderRadius: 10,
    border: "1px solid #1e293b",
    background: "#1a2332",
    color: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mismatch: {
    color: "#fbbf24",
    fontSize: 12,
    marginTop: -6,
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    textAlign: "center",
  },
  submit: {
    padding: "12px 0",
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 10,
    border: "none",
    background: "#2dd4bf",
    color: "#0d1117",
    cursor: "pointer",
    marginTop: 4,
  },
  footer: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 0,
  },
  link: {
    background: "none",
    border: "none",
    color: "#2dd4bf",
    cursor: "pointer",
    fontSize: 13,
    padding: 0,
    textDecoration: "underline",
  },
};
