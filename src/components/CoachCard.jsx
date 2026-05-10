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

// Wrap interactive areas inside the card so a click doesn't bubble up to the
// wrapper's onClick (which toggles the card's expanded state).
const stopBubble = (e) => e.stopPropagation();

// ---------------------------------------------------------------------------
// CoachCard — Combined check-in + coach insight card
// ---------------------------------------------------------------------------
export function CoachCard({
  expanded = false,
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

  // Local: has the user tapped "How are you feeling today?" inside this card?
  // Drives the inline stepwise CoachCheckin until they submit (or we collapse).
  const [showStepwise, setShowStepwise] = useState(false);

  useEffect(() => {
    if (!prevCheckinRef.current && todayCheckin) {
      setJustSubmitted(true);
      setShowStepwise(false);
      const t = setTimeout(() => setJustSubmitted(false), 500);
      return () => clearTimeout(t);
    }
    prevCheckinRef.current = todayCheckin;
  }, [todayCheckin]);

  // If the card collapses, reset the stepwise flow so the next expand starts
  // back at the prompt.
  useEffect(() => {
    if (!expanded) setShowStepwise(false);
  }, [expanded]);

  const hasInsights = coachInsights.length > 0;
  const hasCheckin = !!todayCheckin;

  // Editing a single check-in field via chip tap — replace the chips with the
  // inline editor (still inside the expanded card).
  if (checkinEditSection && checkinEditSection !== "full") {
    return (
      <div onClick={stopBubble} style={{
        display: "flex", flexDirection: "column", flex: 1,
        gap: 10, overflow: "auto",
        animation: justSubmitted ? "coachCardFadeIn 0.3s ease-out" : undefined,
      }}>
        <CheckinEditSection
          section={checkinEditSection}
          checkin={todayCheckin || { mood: null, sleep: null, pain: [] }}
          onSave={(updated) => {
            onCheckinUpdate(updated);
            onCoachRefresh(updated);
          }}
          onCancel={() => setCheckinEditSection(null)}
          colors={colors}
        />
      </div>
    );
  }

  // Default: insight on top, check-in below — only when the parent says expanded.
  return (
    <div style={{
      display: "flex", flexDirection: "column", flex: 1,
      gap: 10, overflow: "auto",
      animation: justSubmitted ? "coachCardFadeIn 0.3s ease-out" : undefined,
    }}>
      {/* Coach insight area */}
      <div style={{
        flexShrink: 0,
        animation: justSubmitted ? "coachCardSlideUp 0.35s ease-out" : undefined,
      }}>
        {hasInsights ? (
          <CoachHeroInsight
            expanded={expanded}
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
        ) : coachStreaming ? (
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 4, padding: "12px 0",
          }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: colors.textSecondary,
                animation: `coachDotPulse 1s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        ) : coachLoading ? (
          <div style={{
            fontSize: 13, opacity: 0.4, padding: "8px 0", textAlign: "center",
            animation: "coachCardFadeIn 0.4s ease-out",
          }}>
            Thinking...
          </div>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.45, color: colors.textSecondary, textAlign: "center", padding: "8px 0" }}>
            {coachError || (
              <button
                onClick={(e) => { e.stopPropagation(); onCoachRefresh(); }}
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

      {/* Check-in area only appears when card is expanded */}
      {expanded && (
        <>
          <div style={{
            height: 1,
            background: colors.border,
            opacity: 0.3,
            flexShrink: 0,
          }} />

          <div
            onClick={stopBubble}
            style={{
              flexShrink: 0,
              animation: justSubmitted ? "coachCardSlideUp 0.3s ease-out" : undefined,
            }}
          >
            {hasCheckin ? (
              <CheckinSummary
                checkin={todayCheckin}
                onEdit={(section) => setCheckinEditSection(section)}
                onClear={onClearCheckin}
                colors={colors}
              />
            ) : showStepwise ? (
              /* Inline stepwise check-in: mood → sleep → pain → submit */
              <CoachCheckin
                colors={colors}
                onSubmit={(data) => {
                  setShowStepwise(false);
                  onCheckinSubmit(data);
                }}
                onCancel={() => setShowStepwise(false)}
                editValues={null}
                autoExpand
              />
            ) : (
              /* Two-line prompt — the entry point into the stepwise flow */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStepwise(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: colors.text,
                  cursor: "pointer",
                  padding: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  fontFamily: "inherit",
                }}
              >
                <span style={{
                  fontSize: 13,
                  opacity: 0.5,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}>
                  How are you feeling today?
                </span>
                <span style={{
                  fontSize: 11,
                  opacity: 0.35,
                }}>
                  Tap to share your mood, sleep, and pain points
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
