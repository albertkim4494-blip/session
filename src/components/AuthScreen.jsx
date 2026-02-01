import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
            onClick={() => { setMode("login"); setError(""); }}
          >
            Log In
          </button>
          <button
            style={{
              ...styles.pill,
              ...(!isLogin ? styles.pillActive : styles.pillInactive),
            }}
            onClick={() => { setMode("signup"); setError(""); }}
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
            style={styles.input}
          />

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
    background: "#0b0f14",
    padding: 16,
    overflow: "hidden",
    position: "fixed",
    inset: 0,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#0f1722",
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
    color: "#0b0f14",
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
    color: "#0b0f14",
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
