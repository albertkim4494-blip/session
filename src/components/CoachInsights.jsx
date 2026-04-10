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
}
@keyframes coachDotPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}`;

let animInjected = false;
function ensureAnimation() {
  if (animInjected) return;
  animInjected = true;
  const style = document.createElement("style");
  style.textContent = ANIM_CSS;
  document.head.appendChild(style);
}

function renderSupportLine(label, text, style = {}) {
  if (!text) return null;
  return (
    <div style={style}>
      <span style={{ opacity: 0.55 }}>{label}:</span> {text}
    </div>
  );
}

function filterInsightCtas(ctas, existingNames) {
  return (Array.isArray(ctas) ? ctas : []).filter((cta) => {
    const name = cta?.exercise?.toLowerCase();
    return name && !existingNames.has(name);
  });
}

function renderInsightCtas(ctas, onAddExercise, colors, accentColor, compact = false) {
  if (!Array.isArray(ctas) || ctas.length === 0) return null;
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: compact ? 6 : 8,
      justifyContent: compact ? "flex-start" : "center",
      marginTop: compact ? 6 : 12,
    }}>
      {ctas.map((cta) => (
        <button
          key={`${cta.catalogId || cta.exercise}-${cta.exercise}`}
          onClick={() => onAddExercise(cta.exercise)}
          className="btn-press"
          style={{
            padding: compact ? "4px 10px" : "6px 12px",
            fontSize: compact ? 12 : 12,
            fontWeight: compact ? 600 : 700,
            borderRadius: compact ? 6 : 8,
            border: `1px solid ${compact ? colors.border : `${accentColor}44`}`,
            background: compact ? "transparent" : `${accentColor}18`,
            color: colors.text,
            cursor: "pointer",
            opacity: compact ? 0.75 : 1,
          }}
        >
          + Add {cta.exercise}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CoachHeroInsight — Lightweight inline insight for the sessions hero state
// ---------------------------------------------------------------------------
export function CoachHeroInsight({
  insights,
  onAddExercise,
  colors,
  loading,
  error,
  onRefresh,
  userExerciseNames,
  hideLabel,
}) {
  const hasInsights = insights.length > 0;

  const existingNames = new Set(
    (userExerciseNames || []).map((n) => n.toLowerCase())
  );

  const topRaw = selectTopInsight(insights);
  const hero = topRaw ? normalizeInsight(topRaw) : null;
  if (hero) {
    hero.ctas = filterInsightCtas(hero.ctas, existingNames);
  }

  useEffect(() => { ensureAnimation(); }, []);

  // Loading shimmer
  if (loading && !hasInsights) {
    return (
      <div style={{
        textAlign: "center", opacity: 0.4, fontSize: 14, padding: "8px 0",
        animation: "coachFadeIn 0.4s ease-out",
      }}>
        Thinking...
      </div>
    );
  }

  // Error — subtle inline
  if (error && !hasInsights) {
    return (
      <div style={{ textAlign: "center", opacity: 0.4, fontSize: 13, padding: "8px 0" }}>
        {error}
      </div>
    );
  }

  // Empty — prompt to refresh
  if (!hasInsights) {
    return onRefresh ? (
      <div style={{
        textAlign: "center", padding: "8px 0",
        animation: "coachFadeIn 0.4s ease-out",
      }}>
        <button
          onClick={onRefresh}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: colors.text, opacity: 0.45, fontSize: 14, padding: 0,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
            <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
            <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
          </svg>
          <span style={{ textDecoration: "underline" }}>Get a suggestion for today</span>
        </button>
      </div>
    ) : null;
  }

  // Has insight — render inline
  const accentColor = SEVERITY_COLORS[hero?.severity] || "#6b7280";

  return (
    <div style={{
      textAlign: "center", padding: "4px 0",
      animation: "coachFadeIn 0.5s ease-out",
      opacity: loading ? 0.5 : 1,
      transition: "opacity 0.3s",
    }}>
      {!hideLabel && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 13, opacity: 0.45, marginBottom: 8,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
            <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
            <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
          </svg>
          Coach
        </div>
      )}
      {hero && (
        <div>
          <div style={{
            fontSize: 16, fontWeight: 700, lineHeight: 1.35,
            maxWidth: 320, margin: "0 auto 6px",
          }}>
            {hero.headline}
          </div>
          <div style={{
            fontSize: 15, lineHeight: 1.5, opacity: 0.7,
            maxWidth: 320, margin: "0 auto",
          }}>
            {hero.detail}
          </div>
          {renderSupportLine("Why", hero.evidence, {
            fontSize: 12,
            lineHeight: 1.45,
            opacity: 0.62,
            maxWidth: 320,
            margin: "8px auto 0",
          })}
          {renderInsightCtas(hero.ctas, onAddExercise, colors, accentColor)}
        </div>
      )}
      {onRefresh && !loading && (
        <button
          onClick={onRefresh}
          style={{
            background: "transparent", border: "none", color: colors.text,
            opacity: 0.3, fontSize: 11, cursor: "pointer", padding: "8px 6px 0",
            textDecoration: "underline",
          }}
        >
          Refresh
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CoachInsightsCard — Full insight card for sessions tab (has sessions state)
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
  checkinSlot,   // ReactNode — rendered in header row (right side)
  refreshSlot,   // ReactNode — rendered below header (e.g. refresh button)
  hasNotification, // boolean — red dot badge when true
  onSeen,          // callback — called when card is expanded (user sees content)
}) {
  const [showMore, setShowMore] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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
        if (n) {
          n.ctas = filterInsightCtas(n.ctas, existingNames);
        }
        return n;
      }).filter(Boolean)
    : [];
  const topRaw = selectTopInsight(insights);
  const hero = topRaw ? normalizeInsight(topRaw) : null;
  if (hero) {
    hero.ctas = filterInsightCtas(hero.ctas, existingNames);
  }
  const rest = normalized.filter((n) => n !== hero && n.headline !== hero?.headline);

  // Trigger animation and auto-expand when hero headline changes
  useEffect(() => {
    ensureAnimation();
    if (hero && hero.headline !== prevHeadlineRef.current) {
      setAnimKey((k) => k + 1);
      setCollapsed(false);
      prevHeadlineRef.current = hero.headline;
    }
  }, [hero?.headline]);

  // Mark notification as seen when card is expanded and has insights
  useEffect(() => {
    if (!collapsed && hasNotification && hasInsights) {
      onSeen?.();
    }
  }, [collapsed, hasNotification, hasInsights]);

  const accentColor = hero ? (SEVERITY_COLORS[hero.severity] || "#6b7280") : "#6b7280";

  return (
    <div style={{ padding: "16px 24px", borderRadius: 16, background: `color-mix(in srgb, ${colors.cardBg} 40%, ${colors.appBg})` }}>
      {/* Header row — clickable to collapse */}
      <div
        onClick={() => setCollapsed((v) => !v)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: collapsed ? 0 : 10, cursor: "pointer" }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.4, letterSpacing: 0.5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" /><path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" /></svg>
          Coach
          {hasNotification && collapsed && (
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#ef4444", flexShrink: 0,
              marginLeft: 1,
            }} />
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, transform: collapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {!collapsed && (
        <>
          {/* Check-in pills row */}
          {checkinSlot && (
            <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: 10 }}>
              {checkinSlot}
            </div>
          )}

          {/* Edit / check-in section */}
          {refreshSlot && <div style={{ marginBottom: 10 }}>{refreshSlot}</div>}

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
            <div style={{ padding: "8px 0", opacity: 0.4, fontSize: 13 }}>
              Analyzing your workouts...
            </div>
          )}

          {/* Empty state — no insights yet */}
          {!loading && !hasInsights && !error && (
            <div style={{ fontSize: 13, opacity: 0.5, lineHeight: 1.5 }}>
              {onRefresh ? (
                <>
                  Tap{" "}
                  <button
                    onClick={onRefresh}
                    style={{
                      background: "transparent", border: "none", color: colors.text,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0,
                      textDecoration: "underline", opacity: 0.9,
                    }}
                  >
                    Refresh
                  </button>
                  {" "}to get a personalized suggestion for today.
                </>
              ) : (
                "Log a workout to get personalized coaching tips."
              )}
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
                paddingLeft: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35, marginBottom: 3 }}>
                {hero.headline}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.45 }}>
                {hero.detail}
              </div>
              {renderSupportLine("Why", hero.evidence, {
                fontSize: 12,
                opacity: 0.62,
                lineHeight: 1.45,
                marginTop: 6,
              })}
              {renderSupportLine("Result", hero.expectedOutcome, {
                fontSize: 12,
                opacity: 0.62,
                lineHeight: 1.45,
                marginTop: 4,
              })}
              {renderInsightCtas(hero.ctas, onAddExercise, colors, accentColor)}
            </div>
          )}

          {/* More insights toggle */}
          {rest.length > 0 && (
            <>
              <button
                onClick={() => setShowMore((v) => !v)}
                style={{
                  marginTop: 12, background: "transparent", border: "none",
                  color: colors.text, opacity: 0.4, fontSize: 12, cursor: "pointer",
                  padding: 0, fontWeight: 600,
                }}
              >
                {showMore ? "Hide" : `More insights (${rest.length})`}
              </button>

              {showMore && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                  {rest.map((item, idx) => (
                    <CompactInsight key={item.title || idx} item={item} onAddExercise={onAddExercise} colors={colors} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            {loading ? (
              <span style={{ fontSize: 11, opacity: 0.3 }}>Updating...</span>
            ) : onRefresh ? (
              <button
                onClick={onRefresh}
                style={{
                  background: "transparent", border: "none", color: colors.text,
                  opacity: 0.3, fontSize: 11, cursor: "pointer", padding: "2px 6px",
                  textDecoration: "underline",
                }}
              >
                Refresh
              </button>
            ) : null}
          </div>
        </>
      )}
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
      {renderSupportLine("Why", item.evidence, {
        fontSize: 11,
        opacity: 0.58,
        lineHeight: 1.4,
        marginTop: 4,
      })}
      {renderInsightCtas(item.ctas, onAddExercise, colors, accent, true)}
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
    setAdded(true);
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
                {(workouts || []).map((w) => {
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
