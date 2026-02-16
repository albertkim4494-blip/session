import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { validateUsernameStrict, sanitizeUsername, validateDisplayName } from "../lib/userIdentity";
import { isValidBirthdateString, computeAge } from "../lib/validation";

const EQUIPMENT_OPTIONS = [
  { key: "no_equipment", label: "No Equipment", desc: "Bodyweight only" },
  { key: "dumbbell", label: "Dumbbells", desc: "" },
  { key: "barbell", label: "Barbell & Rack", desc: "" },
  { key: "kettlebell", label: "Kettlebells", desc: "" },
  { key: "bands", label: "Bands", desc: "" },
  { key: "full_gym", label: "Full Gym", desc: "All equipment" },
];

export default function OnboardingScreen({ session, onComplete, onUpdatePreference }) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthdateDisplay, setBirthdateDisplay] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [goal, setGoal] = useState("");
  const [about, setAbout] = useState("");
  const [sports, setSports] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [equipment, setEquipment] = useState(["full_gym"]);
  const [measurementSystem, setMeasurementSystem] = useState("imperial");
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

    const wMin = measurementSystem === "metric" ? 23 : 50;
    const wMax = measurementSystem === "metric" ? 454 : 1000;
    if (weightNum < wMin || weightNum > wMax) {
      setError(`Weight must be between ${wMin} and ${wMax} ${measurementSystem === "metric" ? "kg" : "lbs"}.`);
      return;
    }

    // Save equipment and measurement system to state preferences (cloud-synced)
    if (onUpdatePreference) {
      onUpdatePreference("equipment", equipment);
      onUpdatePreference("measurementSystem", measurementSystem);
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
          height_inches: measurementSystem === "metric"
            ? (heightCm ? Math.round(Number(heightCm) / 2.54) : null)
            : (heightFt || heightIn ? (Number(heightFt) || 0) * 12 + (Number(heightIn) || 0) : null),
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
        {/* Sticky header */}
        <div style={styles.stickyHeader}>
          <h1 style={styles.title}>Complete Your Profile</h1>
          <p style={styles.subtitle}>Tell us a bit about yourself to get started.</p>
        </div>

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
            type="text"
            inputMode="numeric"
            placeholder="MM/DD/YYYY"
            value={birthdateDisplay}
            onChange={(e) => {
              let v = e.target.value.replace(/[^\d]/g, "");
              // Auto-insert slashes
              if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
              if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
              setBirthdateDisplay(v);
              // Convert complete MM/DD/YYYY to YYYY-MM-DD for storage
              const match = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
              if (match) {
                setBirthdate(`${match[3]}-${match[1]}-${match[2]}`);
              } else {
                setBirthdate("");
              }
            }}
            maxLength={10}
            style={styles.input}
          />
          <span style={styles.helper}>Enter as MM/DD/YYYY</span>

          <label style={styles.label}>Weight ({measurementSystem === "metric" ? "kg" : "lbs"}) *</label>
          <div style={{ display: "flex", gap: 8, width: "100%", boxSizing: "border-box", marginBottom: 4 }}>
            {[
              { key: "imperial", label: "Imperial (lb)" },
              { key: "metric", label: "Metric (kg)" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setMeasurementSystem(opt.key)}
                style={{
                  flex: 1,
                  padding: "8px 8px",
                  borderRadius: 10,
                  border: `2px solid ${measurementSystem === opt.key ? "#2dd4bf" : "#1e293b"}`,
                  background: measurementSystem === opt.key ? "rgba(45,212,191,0.12)" : "#1a2332",
                  color: measurementSystem === opt.key ? "#2dd4bf" : "#94a3b8",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder={measurementSystem === "metric" ? "e.g. 77" : "e.g. 170"}
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value)}
            required
            min={measurementSystem === "metric" ? 23 : 50}
            max={measurementSystem === "metric" ? 454 : 1000}
            style={styles.input}
          />

          <label style={styles.label}>Height</label>
          {measurementSystem === "metric" ? (
            <input
              type="number"
              placeholder="e.g. 178"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              min={100}
              max={275}
              style={styles.input}
            />
          ) : (
            <div style={{ display: "flex", gap: 8, width: "100%", boxSizing: "border-box" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="number"
                  placeholder="ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  min={3}
                  max={8}
                  style={{ ...styles.input, textAlign: "center" }}
                />
                <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>ft</span>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="number"
                  placeholder="in"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  min={0}
                  max={11}
                  style={{ ...styles.input, textAlign: "center" }}
                />
                <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>in</span>
              </div>
            </div>
          )}

          <label style={styles.label}>Fitness Goal *</label>
          <input
            type="text"
            placeholder="e.g. Build muscle"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Equipment Access *</label>
          <div style={{ display: "flex", gap: 8, width: "100%", boxSizing: "border-box", flexWrap: "wrap" }}>
            {EQUIPMENT_OPTIONS.map((opt) => {
              const isActive = opt.key === "no_equipment"
                ? equipment.length === 0
                : equipment.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    if (opt.key === "no_equipment") {
                      setEquipment([]);
                    } else if (opt.key === "full_gym") {
                      setEquipment(["full_gym"]);
                    } else {
                      setEquipment((prev) => {
                        const without = prev.filter((k) => k !== "full_gym");
                        return without.includes(opt.key)
                          ? without.filter((k) => k !== opt.key)
                          : [...without, opt.key];
                      });
                    }
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `2px solid ${isActive ? "#2dd4bf" : "#1e293b"}`,
                    background: isActive ? "rgba(45,212,191,0.12)" : "#1a2332",
                    color: isActive ? "#2dd4bf" : "#94a3b8",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <span style={styles.helper}>
            {equipment.length === 0 ? "Bodyweight exercises only" : "Bodyweight always included"}
          </span>

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
            placeholder="e.g. Basketball 3x/week, running 2x/week"
            value={sports}
            onChange={(e) => setSports(e.target.value)}
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Saving..." : "Let's Go"}
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
    background: "#0d1117",
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
    overflowX: "hidden",
    background: "#161b22",
    borderRadius: 16,
    padding: "0 32px 32px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    background: "#161b22",
    paddingTop: 32,
    paddingBottom: 8,
    zIndex: 2,
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
    margin: "0 0 8px",
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
    boxSizing: "border-box",
    width: "100%",
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
    color: "#0d1117",
    cursor: "pointer",
    marginTop: 4,
  },
};
