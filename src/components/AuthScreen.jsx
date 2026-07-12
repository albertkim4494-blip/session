import React, { useState } from "react";
import { supabase } from "../lib/supabase";

// Bump when the Terms/Privacy content materially changes, so recorded consent
// is versioned (stored in auth user metadata at sign-up).
const TOS_VERSION = "2026-07-11";

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
  const [mode, setMode] = useState("login"); // "login" | "signup" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Auto-clear mismatch error when passwords match
  const confirmMismatch = mode === "signup" && confirmPassword.length > 0 && password !== confirmPassword;

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
    setConfirmPassword("");
    setShowConfirm(false);
    setAgreed(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    // Password reset request — send an email, don't reveal whether it exists.
    if (mode === "reset") {
      setLoading(true);
      try {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        setNotice("If an account exists for that email, a password reset link is on its way. Check your inbox.");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (mode === "signup" && !agreed) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) setError(authError.message);
      } else {
        // Record consent (timestamp + policy version) in the user's auth metadata.
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { tos_accepted_at: new Date().toISOString(), tos_version: TOS_VERSION } },
        });
        if (authError) {
          setError(authError.message);
        } else if (!data?.session) {
          // Email confirmation required — no session yet.
          switchMode("login");
          setNotice("Account created. Check your email to confirm your account, then log in.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";
  const isReset = mode === "reset";

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logoBanner}>
          <img
            src="/icons/icon-512.png"
            alt="Session"
            style={styles.logoImg}
          />
        </div>

        {/* Mode toggle pills (hidden during password reset) */}
        {!isReset && (
          <div style={styles.pillRow}>
            <button
              style={{ ...styles.pill, ...(isLogin ? styles.pillActive : styles.pillInactive) }}
              onClick={() => switchMode("login")}
            >
              Log In
            </button>
            <button
              style={{ ...styles.pill, ...(!isLogin ? styles.pillActive : styles.pillInactive) }}
              onClick={() => switchMode("signup")}
            >
              Sign Up
            </button>
          </div>
        )}

        {isReset && (
          <p style={styles.resetIntro}>Enter your email and we'll send you a link to reset your password.</p>
        )}

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
          {!isReset && (<>
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
          </>)}

          {isLogin && (
            <button type="button" style={styles.forgotLink} onClick={() => switchMode("reset")}>
              Forgot password?
            </button>
          )}

          {mode === "signup" && (
            <label style={styles.consent}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                style={styles.checkbox}
              />
              <span>
                I agree to the{" "}
                <a href="/terms.html" target="_blank" rel="noopener noreferrer" style={styles.inlineLink}>Terms of Service</a>{" "}and{" "}
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" style={styles.inlineLink}>Privacy Policy</a>.
              </span>
            </label>
          )}

          {notice && <div style={styles.notice}>{notice}</div>}
          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Please wait..." : isReset ? "Send reset link" : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          {isReset ? (
            <button style={styles.link} onClick={() => switchMode("login")}>Back to log in</button>
          ) : (
            <>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                style={styles.link}
                onClick={() => switchMode(isLogin ? "signup" : "login")}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </>
          )}
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
  logoBanner: {
    background: "#E8E0D4",
    borderRadius: 14,
    padding: "18px 0",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    display: "block",
    height: 48,
    objectFit: "contain",
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
  notice: {
    color: "#2dd4bf",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.5,
  },
  resetIntro: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.5,
    margin: "0 0 16px",
  },
  forgotLink: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 12,
    padding: 0,
    marginTop: -4,
    alignSelf: "flex-end",
  },
  consent: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    fontSize: 12.5,
    lineHeight: 1.45,
    color: "#94a3b8",
    cursor: "pointer",
  },
  checkbox: {
    marginTop: 2,
    width: 16,
    height: 16,
    flexShrink: 0,
    accentColor: "#2dd4bf",
    cursor: "pointer",
  },
  inlineLink: {
    color: "#2dd4bf",
    textDecoration: "underline",
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
