import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { normalizeInsight, selectTopInsight } from "../lib/coachNormalize";

// ---------------------------------------------------------------------------
// Severity accent colors
// ---------------------------------------------------------------------------
const SEVERITY_COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#3b82f6",
  INFO: "#10b981",
};

// ---------------------------------------------------------------------------
// Entrance animation (CSS injected once)
// ---------------------------------------------------------------------------
const ANIM_CSS = `
@keyframes coachFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

let animInjected = false;
function ensureAnimation() {
  if (animInjected) return;
  animInjected = true;
  const style = document.createElement("style");
  style.textContent = ANIM_CSS;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// CoachInsightsCard — Hero-style insight card for Progress tab
// ---------------------------------------------------------------------------
export function CoachInsightsCard({
  insights,
  onAddExercise,
  styles,
  colors,
  loading,
  error,
  onRefresh,
  userExerciseNames,
}) {
  const [showMore, setShowMore] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const prevHeadlineRef = useRef(null);

  const hasInsights = insights.length > 0;

  // Set of exercise names already in the user's program (lowercase for comparison)
  const existingNames = new Set(
    (userExerciseNames || []).map((n) => n.toLowerCase())
  );

  // Normalize all insights, filtering out CTAs for exercises already in the program
  const normalized = hasInsights
    ? insights.map((i) => {
        const n = normalizeInsight(i);
        if (n && n.cta && existingNames.has(n.cta.exercise.toLowerCase())) {
          n.cta = null;
        }
        return n;
      }).filter(Boolean)
    : [];
  const topRaw = selectTopInsight(insights);
  const hero = topRaw ? normalizeInsight(topRaw) : null;
  if (hero && hero.cta && existingNames.has(hero.cta.exercise.toLowerCase())) {
    hero.cta = null;
  }
  const rest = normalized.filter((n) => n !== hero && n.headline !== hero?.headline);

  // Trigger animation when hero headline changes
  useEffect(() => {
    ensureAnimation();
    if (hero && hero.headline !== prevHeadlineRef.current) {
      setAnimKey((k) => k + 1);
      prevHeadlineRef.current = hero.headline;
    }
  }, [hero?.headline]);

  if (!loading && !hasInsights && !error) return null;

  const accentColor = hero ? (SEVERITY_COLORS[hero.severity] || "#6b7280") : "#6b7280";

  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: "20px 18px",
        boxShadow: colors.shadow,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: hero ? 14 : 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.5, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Coach Insight
        </div>
        {onRefresh && !loading && (
          <button
            onClick={onRefresh}
            style={{
              background: "transparent", border: "none", color: colors.text,
              opacity: 0.45, fontSize: 12, cursor: "pointer", padding: "2px 6px",
              textDecoration: "underline",
            }}
          >
            Refresh
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          fontSize: 13, padding: "8px 12px", marginBottom: 10, opacity: 0.7,
          background: "rgba(245,158,11,0.1)", borderRadius: 8,
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !hasInsights && (
        <div style={{ padding: "12px 0", textAlign: "center", opacity: 0.5, fontSize: 14 }}>
          Analyzing your workouts...
        </div>
      )}

      {/* Hero insight */}
      {hero && (
        <div
          key={animKey}
          style={{
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.3s",
            animation: "coachFadeIn 0.4s ease-out",
            borderLeft: `3px solid ${accentColor}`,
            paddingLeft: 14,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35, marginBottom: 4 }}>
            {hero.headline}
          </div>
          <div style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.45 }}>
            {hero.detail}
          </div>
          {hero.cta && (
            <button
              onClick={() => onAddExercise(hero.cta.exercise)}
              style={{
                marginTop: 10, padding: "7px 14px", fontSize: 13, fontWeight: 700,
                borderRadius: 8, border: `1px solid ${accentColor}44`,
                background: `${accentColor}18`, color: colors.text,
                cursor: "pointer",
              }}
            >
              + Add {hero.cta.exercise}
            </button>
          )}
        </div>
      )}

      {/* More insights toggle */}
      {rest.length > 0 && (
        <>
          <button
            onClick={() => setShowMore((v) => !v)}
            style={{
              marginTop: 14, background: "transparent", border: "none",
              color: colors.text, opacity: 0.5, fontSize: 13, cursor: "pointer",
              padding: 0, fontWeight: 600,
            }}
          >
            {showMore ? "Hide" : `More insights (${rest.length})`}
          </button>

          {showMore && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {rest.map((item, idx) => (
                <CompactInsight key={idx} item={item} onAddExercise={onAddExercise} colors={colors} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div style={{ fontSize: 11, opacity: 0.35, marginTop: 12 }}>
        {loading ? "Updating..." : "Powered by AI"}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CompactInsight — Small item for the "More insights" section
// ---------------------------------------------------------------------------
function CompactInsight({ item, onAddExercise, colors }) {
  const accent = SEVERITY_COLORS[item.severity] || "#6b7280";
  return (
    <div style={{
      borderLeft: `3px solid ${accent}`,
      paddingLeft: 12,
      paddingTop: 4,
      paddingBottom: 4,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{item.headline}</div>
      <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>{item.detail}</div>
      {item.cta && (
        <button
          onClick={() => onAddExercise(item.cta.exercise)}
          style={{
            marginTop: 4, padding: "4px 10px", fontSize: 12, fontWeight: 600,
            borderRadius: 6, border: `1px solid ${colors.border}`,
            background: "transparent", color: colors.text,
            cursor: "pointer", opacity: 0.7,
          }}
        >
          + Add {item.cta.exercise}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CoachNudge — Single-line coach presence for the Train tab
// ---------------------------------------------------------------------------
export function CoachNudge({ insights, colors }) {
  const topRaw = selectTopInsight(insights || []);
  const hero = topRaw ? normalizeInsight(topRaw) : null;

  if (!hero) return null;

  return (
    <div style={{
      fontSize: 13,
      lineHeight: 1.4,
      padding: "8px 12px",
      borderRadius: 10,
      background: `${SEVERITY_COLORS[hero.severity] || "#6b7280"}12`,
      border: `1px solid ${SEVERITY_COLORS[hero.severity] || "#6b7280"}30`,
      color: colors.text,
      opacity: 0.85,
      animation: "coachFadeIn 0.4s ease-out",
    }}>
      <span style={{ fontWeight: 700 }}>Coach: </span>
      {hero.detail}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AddSuggestedExerciseModal (unchanged)
// ---------------------------------------------------------------------------
export function AddSuggestedExerciseModal({ open, exerciseName, workouts, onCancel, onConfirm, styles }) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || null);

  useEffect(() => {
    if (open && workouts.length > 0) {
      setSelectedWorkoutId(workouts[0].id);
    }
  }, [open, workouts]);

  if (!open) return null;

  return (
    <Modal open={open} title={`Add "${exerciseName}"`} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={styles.fieldCol}>
          <label style={styles.label}>Add to which workout?</label>
          <select
            value={selectedWorkoutId || ""}
            onChange={(e) => setSelectedWorkoutId(e.target.value)}
            style={{ ...styles.textInput, paddingRight: 32, appearance: "auto" }}
          >
            {workouts.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.category})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.smallText}>
          This will add <b>&quot;{exerciseName}&quot;</b> to your selected workout. You can rename or remove it later.
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.secondaryBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={styles.primaryBtn}
            onClick={() => onConfirm(selectedWorkoutId, exerciseName)}
            disabled={!selectedWorkoutId}
          >
            Add Exercise
          </button>
        </div>
      </div>
    </Modal>
  );
}
