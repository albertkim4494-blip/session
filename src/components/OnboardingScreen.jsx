import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateUsernameStrict, sanitizeUsername, validateDisplayName } from "../lib/userIdentity";
import { isValidBirthdateString, computeAge } from "../lib/validation";

export default function OnboardingScreen({ session, onComplete }) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [goal, setGoal] = useState("");
  const [about, setAbout] = useState("");
  const [sports, setSports] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate username
    const trimmedUsername = username.trim().toLowerCase();
    const usernameErr = validateUsernameStrict(trimmedUsername);
    if (usernameErr) {
      setError(usernameErr);
      return;
    }

    // Check uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmedUsername)
      .maybeSingle();
    if (existing && existing.id !== session.user.id) {
      setError("Username is already taken.");
      return;
    }

    // Validate display name
    const dnErr = validateDisplayName(displayName);
    if (dnErr) {
      setError(dnErr);
      return;
    }

    if (!birthdate || !isValidBirthdateString(birthdate)) {
      setError("Please enter a valid birthdate (must be 13-120 years old).");
      return;
    }
    const ageNum = computeAge(birthdate);
    const weightNum = Number(weightLbs);

    if (weightNum < 50 || weightNum > 1000) {
      setError("Weight must be between 50 and 1000 lbs.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          username: trimmedUsername,
          display_name: displayName.trim() || null,
          birthdate,
          age: ageNum,
          weight_lbs: weightNum,
          goal,
          about: about || null,
          sports: sports || null,
          onboarding_completed_at: new Date().toISOString(),
        });

      if (updateError) {
        setError(updateError.message);
      } else {
        // Cache onboarding completion locally so AuthGate doesn't re-prompt
        try { localStorage.setItem("onboarding_done", "1"); } catch {}
        onComplete();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Complete Your Profile</h1>
        <p style={styles.subtitle}>Tell us a bit about yourself to get started.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username *</label>
          <input
            type="text"
            placeholder="e.g. john_doe"
            value={username}
            onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
            required
            maxLength={16}
            style={styles.input}
          />
          <span style={styles.helper}>3-16 chars: lowercase letters, numbers, underscores</span>

          <label style={styles.label}>Display Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={30}
            style={styles.input}
          />
          <span style={styles.helper}>Shown publicly. Falls back to username if empty.</span>

          <label style={styles.label}>Birthdate *</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Weight (lbs) *</label>
          <input
            type="number"
            placeholder="e.g. 170"
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value)}
            required
            min={50}
            max={1000}
            style={styles.input}
          />

          <label style={styles.label}>Fitness Goal *</label>
          <input
            type="text"
            placeholder="e.g. Build muscle"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>About You</label>
          <textarea
            placeholder={"e.g. 34M, desk job. Recovering from a shoulder impingement (cleared by PT in Dec). Can't do overhead pressing yet. Played water polo in college but haven't been consistent in 5+ years. Want to build back slowly."}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            style={{ ...styles.input, resize: "vertical" }}
          />
          <span style={styles.helper}>Share details that help tailor your workouts — injuries, limitations, fitness history, etc.</span>

          <label style={styles.label}>Sports / Activities</label>
          <input
            type="text"
            placeholder="e.g. Running, Basketball"
            value={sports}
            onChange={(e) => setSports(e.target.value)}
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Saving..." : "Generate Plan"}
          </button>
        </form>
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
    maxHeight: "90dvh",
    overflowY: "auto",
    background: "#0f1722",
    borderRadius: 16,
    padding: 32,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    margin: "0 0 24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: -4,
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
  helper: {
    color: "#64748b",
    fontSize: 11,
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
    color: "#0b0f14",
    cursor: "pointer",
    marginTop: 4,
  },
};
