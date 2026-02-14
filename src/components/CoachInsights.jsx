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
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.5, letterSpacing: 0.5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0b429" stroke="none"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" /><path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" /></svg>
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
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 }}>
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
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{item.headline}</div>
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
      borderRadius: 8,
      background: `${SEVERITY_COLORS[hero.severity] || "#6b7280"}12`,
      border: `1px solid ${SEVERITY_COLORS[hero.severity] || "#6b7280"}30`,
      color: colors.text,
      opacity: 0.85,
      animation: "coachFadeIn 0.4s ease-out",
    }}>
      <span style={{ fontWeight: 700 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none" style={{ verticalAlign: -1, marginRight: 3 }}><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" /><path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" /></svg>Coach: </span>
      {hero.detail}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AddSuggestedExerciseModal
// ---------------------------------------------------------------------------
export function AddSuggestedExerciseModal({ open, exerciseName, workouts, onCancel, onConfirm, styles, colors }) {
  const [mode, setMode] = useState("today");
  const [checked, setChecked] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("today");
      setChecked(new Set());
      setDropdownOpen(false);
      setAdded(false);
    }
  }, [open]);

  if (!open) return null;

  const toggleChecked = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBase = {
    flex: 1, padding: "7px 0", border: "none", borderRadius: 8,
    fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.15s",
  };
  const toggleActive = { ...toggleBase, background: colors?.primaryBg || "#1a2744", color: colors?.primaryText || "#e8eef7" };
  const toggleInactive = { ...toggleBase, background: "transparent", color: colors?.text || "#e8eef7", opacity: 0.5 };

  const handleConfirm = () => {
    if (mode === "today") {
      onConfirm("__today__", exerciseName);
    } else {
      onConfirm([...checked], exerciseName);
    }
  };

  const canConfirm = mode === "today" || checked.size > 0;

  return (
    <Modal open={open} title={`Add "${exerciseName}"`} onClose={onCancel} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          display: "flex", gap: 4, padding: 3, borderRadius: 8,
          background: colors?.cardAltBg || "#0d1117",
          border: `1px solid ${colors?.border || "rgba(255,255,255,0.10)"}`,
        }}>
          <button style={mode === "today" ? toggleActive : toggleInactive} onClick={() => setMode("today")}>
            Just for Today
          </button>
          <button style={mode === "workout" ? toggleActive : toggleInactive} onClick={() => setMode("workout")}>
            Add to Workout
          </button>
        </div>

        {mode === "workout" && (
          <>
            {/* Dropdown toggle */}
            <button
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "10px 12px", borderRadius: 12,
                border: `1px solid ${colors.border}`, background: colors.cardAltBg,
                color: colors.text, cursor: "pointer", textAlign: "left",
              }}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                {checked.size === 0
                  ? "Select workouts..."
                  : `${checked.size} workout${checked.size > 1 ? "s" : ""} selected`}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: 0.4, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                display: "flex", flexDirection: "column", gap: 2, padding: "6px 0",
                borderRadius: 12, border: `1px solid ${colors.border}`,
                background: colors.cardBg, maxHeight: 180, overflowY: "auto",
              }}>
                {workouts.map((w) => {
                  const isChecked = checked.has(w.id);
                  return (
                    <button
                      key={w.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                        background: "transparent", border: "none", color: colors.text,
                        cursor: "pointer", textAlign: "left",
                      }}
                      onClick={() => toggleChecked(w.id)}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${isChecked ? colors.accent : colors.border}`,
                        background: isChecked ? colors.accent : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.15s",
                      }}>
                        {isChecked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{w.name}</span>
                      </div>
                      {w.category && (
                        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.4 }}>{w.category}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div style={styles.smallText}>
          {mode === "today"
            ? <>This will add <b>&quot;{exerciseName}&quot;</b> to today&apos;s workout. It won&apos;t appear on other days.</>
            : <>This will add <b>&quot;{exerciseName}&quot;</b> to your selected workout{checked.size > 1 ? "s" : ""} permanently.</>
          }
        </div>

        <button
          className="btn-press"
          disabled={!canConfirm || added}
          style={{
            ...styles.primaryBtn, width: "100%", textAlign: "center",
            opacity: canConfirm && !added ? 1 : 0.4,
          }}
          onClick={handleConfirm}
        >
          {added
            ? "Added"
            : mode === "today"
              ? "Add for Today"
              : `Add to Workout${checked.size > 0 ? ` (${checked.size})` : ""}`
          }
        </button>
      </div>
    </Modal>
  );
}
