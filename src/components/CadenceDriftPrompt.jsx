import React from "react";
import { DISPLAY_DAYS } from "./CadenceEditor";

function dayLabel(value) {
  const d = DISPLAY_DAYS.find((x) => x.value === value);
  return d ? d.full : "";
}

function daysList(days) {
  return days
    .map((d) => DISPLAY_DAYS.find((x) => x.value === d)?.full?.slice(0, 3) || "")
    .filter(Boolean)
    .join(", ");
}

/**
 * CadenceDriftPrompt — small home-screen card surfaced when an anchor cadence
 * has been logged on a different day 3+ times in the last 4 weeks. Three actions:
 *   - Update plan: applies the suggested change (add or replace day)
 *   - Not now: 4-week cooldown
 *   - Don't ask again: long cooldown for this workout
 */
export function CadenceDriftPrompt({
  workoutName,
  suggestion,
  onUpdate,
  onSnooze,
  onDismiss,
  styles,
  colors,
}) {
  if (!suggestion) return null;

  const newDay = dayLabel(suggestion.suggestedDay);
  const newDayShort = DISPLAY_DAYS.find((x) => x.value === suggestion.suggestedDay)?.full?.slice(0, 3) || "";
  const oldDays = daysList(suggestion.originalDays);

  const headline = suggestion.action === "replace"
    ? `Did your ${workoutName} schedule move to ${newDayShort}?`
    : `Looks like ${newDayShort} is becoming a regular for ${workoutName}.`;

  const subtext = suggestion.action === "replace"
    ? `You've logged ${suggestion.occurrences}× on ${newDay} recently. Your old days (${oldDays}) have been quiet.`
    : `You've logged ${suggestion.occurrences}× on ${newDay} alongside your usual ${oldDays}.`;

  const primaryLabel = suggestion.action === "replace"
    ? `Replace with ${newDayShort}`
    : `Add ${newDayShort}`;

  return (
    <div style={{
      ...styles.card,
      borderLeft: `3px solid ${colors.accent}`,
      padding: "12px 14px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
          {headline}
        </div>
        <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5 }}>
          {subtext}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <button
          className="btn-press"
          style={{
            ...styles.primaryBtn,
            padding: "8px 14px", fontSize: 12,
          }}
          onClick={onUpdate}
        >
          {primaryLabel}
        </button>
        <button
          className="btn-press"
          style={{
            background: "transparent", border: "none",
            color: colors.text, opacity: 0.55,
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            padding: "8px 4px",
          }}
          onClick={onSnooze}
        >
          Not now
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="btn-press"
          style={{
            background: "transparent", border: "none",
            color: colors.text, opacity: 0.4,
            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            padding: "8px 4px",
          }}
          onClick={onDismiss}
        >
          Don't ask again
        </button>
      </div>
    </div>
  );
}
