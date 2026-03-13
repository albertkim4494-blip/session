import React, { useState, useEffect, useRef } from "react";
import { CoachCheckin, CheckinSummary, CheckinEditSection } from "./CoachCheckin";
import { CoachHeroInsight } from "./CoachInsights";

// ---------------------------------------------------------------------------
// CSS animation (injected once)
// ---------------------------------------------------------------------------
const ANIM_CSS = `
@keyframes coachCardFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes coachCardSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

let animInjected = false;
function ensureAnim() {
  if (animInjected) return;
  animInjected = true;
  const style = document.createElement("style");
  style.textContent = ANIM_CSS;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// CoachCard — Combined check-in + coach insight card
// ---------------------------------------------------------------------------
export function CoachCard({
  todayCheckin,
  onCheckinSubmit,
  onCheckinUpdate,
  checkinEditSection,
  setCheckinEditSection,
  coachInsights,
  coachLoading,
  coachStreaming,
  coachError,
  onCoachRefresh,
  onAddSuggestion,
  userExerciseNames,
  colors,
  onClearCheckin,
}) {
  useEffect(() => { ensureAnim(); }, []);

  // Track when check-in was just submitted for transition animation
  const [justSubmitted, setJustSubmitted] = useState(false);
  const prevCheckinRef = useRef(todayCheckin);

  useEffect(() => {
    if (!prevCheckinRef.current && todayCheckin) {
      setJustSubmitted(true);
      const t = setTimeout(() => setJustSubmitted(false), 500);
      return () => clearTimeout(t);
    }
    prevCheckinRef.current = todayCheckin;
  }, [todayCheckin]);

  // --- Phase 1: No check-in yet — show check-in form ---
  if (!todayCheckin) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        alignItems: "center", textAlign: "center", flex: 1,
        justifyContent: "center",
      }}>
        <CoachCheckin
          colors={colors}
          onSubmit={onCheckinSubmit}
          editValues={null}
          showAll
        />
      </div>
    );
  }

  // --- Phase 2-4: Check-in exists — show chips + insights ---
  const hasInsights = coachInsights.length > 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column", flex: 1,
      gap: 10, overflow: "auto",
      animation: justSubmitted ? "coachCardFadeIn 0.3s ease-out" : undefined,
    }}>
      {/* Check-in chips / edit section at top */}
      <div style={{
        flexShrink: 0,
        animation: justSubmitted ? "coachCardSlideUp 0.3s ease-out" : undefined,
      }}>
        {checkinEditSection ? (
          <CheckinEditSection
            section={checkinEditSection}
            checkin={todayCheckin}
            onSave={(updated) => {
              onCheckinUpdate(updated);
              // Re-fetch with the updated data (pass directly to avoid stale localStorage read)
              onCoachRefresh(updated);
            }}
            onCancel={() => setCheckinEditSection(null)}
            colors={colors}
          />
        ) : (
          <CheckinSummary
            checkin={todayCheckin}
            onEdit={(section) => setCheckinEditSection(section)}
            onClear={onClearCheckin}
            colors={colors}
          />
        )}
      </div>

      {/* Divider */}
      {!checkinEditSection && (
        <div style={{
          height: 1,
          background: colors.border,
          opacity: 0.3,
          flexShrink: 0,
        }} />
      )}

      {/* Coach insight area */}
      {!checkinEditSection && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          flex: 1, justifyContent: hasInsights ? "flex-start" : "center",
          gap: 8, minHeight: 0,
        }}>
          {hasInsights ? (
            /* Has insights — show them */
            <div style={{
              width: "100%",
              animation: justSubmitted ? "coachCardSlideUp 0.35s ease-out" : undefined,
            }}>
              <CoachHeroInsight
                insights={coachInsights}
                onAddExercise={onAddSuggestion}
                colors={colors}
                loading={coachLoading}
                error={coachError}
                userExerciseNames={userExerciseNames}
                onRefresh={onCoachRefresh}
                hideLabel
                streaming={coachStreaming}
              />
              {coachStreaming && (
                <div style={{
                  display: "flex", justifyContent: "center",
                  gap: 4, padding: "12px 0 0",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: colors.textSecondary || colors.text,
                      animation: `coachDotPulse 1s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          ) : coachStreaming ? (
            /* Streaming started but no insights yet */
            <div style={{
              display: "flex", justifyContent: "center",
              gap: 4, padding: "16px 0",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: colors.textSecondary || colors.text,
                  animation: `coachDotPulse 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          ) : coachLoading ? (
            /* Loading (non-streaming) */
            <div style={{
              fontSize: 13, opacity: 0.4, padding: "8px 0",
              animation: "coachCardFadeIn 0.4s ease-out",
            }}>
              Thinking...
            </div>
          ) : (
            /* Checked in but no insights yet */
            <div style={{ fontSize: 13, opacity: 0.45, color: colors.textSecondary || colors.text }}>
              {coachError || (
                <button
                  onClick={onCoachRefresh}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: colors.text, opacity: 0.45, fontSize: 13, padding: 0,
                    display: "inline-flex", alignItems: "center", gap: 5,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
                    <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
                    <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
                  </svg>
                  <span style={{ textDecoration: "underline" }}>Get coach insights</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
