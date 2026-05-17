import React from "react";
import { CADENCE_MODES } from "../lib/cadence";

// Display order: Mon → Sun. Values match JS Date#getDay (0=Sun, 1=Mon, ..., 6=Sat).
export const DISPLAY_DAYS = [
  { label: "M", value: 1, full: "Monday" },
  { label: "T", value: 2, full: "Tuesday" },
  { label: "W", value: 3, full: "Wednesday" },
  { label: "T", value: 4, full: "Thursday" },
  { label: "F", value: 5, full: "Friday" },
  { label: "S", value: 6, full: "Saturday" },
  { label: "S", value: 0, full: "Sunday" },
];

export function DayChips({ selected, onToggle, colors, ariaLabel }) {
  const sel = Array.isArray(selected) ? selected : [];
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: "flex", gap: 4, width: "100%" }}>
      {DISPLAY_DAYS.map((d, i) => {
        const isSelected = sel.includes(d.value);
        return (
          <button
            key={`${d.value}-${i}`}
            type="button"
            aria-pressed={isSelected}
            aria-label={d.full}
            onClick={() => onToggle(d.value)}
            style={{
              flex: 1,
              minWidth: 0,
              height: 36,
              padding: "0 2px",
              borderRadius: 999,
              border: `1px solid ${isSelected ? colors.accent : colors.border}`,
              background: isSelected ? colors.accent : "transparent",
              color: isSelected ? "#fff" : colors.text,
              fontSize: 12, fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "background 0.15s ease, border-color 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxSizing: "border-box",
              lineHeight: 1,
            }}
          >
            {d.full.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );
}

function ModeButton({ active, onClick, children, colors }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accentBg : "transparent",
        color: active ? colors.accent : colors.text,
        fontSize: 13, fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/**
 * CadenceEditor — inline schedule editor for a workout.
 * Renders three modes: Whenever (default), Weekly cadence, Specific days (anchor).
 * Continuous is intentionally absent here — that mode is only set via split membership.
 */
export function CadenceEditor({ cadence, onChange, colors, styles }) {
  const c = cadence || { mode: CADENCE_MODES.WHENEVER };
  const mode = c.mode || CADENCE_MODES.WHENEVER;

  const setMode = (next) => {
    if (next === mode) return;
    if (next === CADENCE_MODES.WHENEVER) onChange({ mode: CADENCE_MODES.WHENEVER });
    else if (next === CADENCE_MODES.WEEKLY) {
      onChange({
        mode: CADENCE_MODES.WEEKLY,
        perWeek: c.perWeek || 1,
        preferredDays: Array.isArray(c.preferredDays) ? c.preferredDays : [],
        skipIfMissed: c.skipIfMissed !== false,
      });
    } else if (next === CADENCE_MODES.ANCHOR) {
      onChange({
        mode: CADENCE_MODES.ANCHOR,
        days: Array.isArray(c.days) ? c.days : [],
      });
    }
  };

  const toggleDay = (key) => (val) => {
    const list = Array.isArray(c[key]) ? c[key] : [];
    const next = list.includes(val) ? list.filter((d) => d !== val) : [...list, val];
    onChange({ ...c, [key]: next });
  };

  const setPerWeek = (n) => onChange({ ...c, perWeek: n });
  const setSkipIfMissed = (v) => onChange({ ...c, skipIfMissed: v });

  const preferredDays = Array.isArray(c.preferredDays) ? c.preferredDays : [];
  const anchorDays = Array.isArray(c.days) ? c.days : [];
  const perWeek = Number(c.perWeek) || 1;

  return (
    <div style={styles.fieldCol}>
      <label style={styles.label}>Schedule</label>

      {/* Mode picker — workouts schedule via Whenever or Specific days only.
          Weekly / Continuous cadence is set automatically when a workout is
          added to a Split. */}
      <div style={{ display: "flex", gap: 6 }}>
        <ModeButton active={mode === CADENCE_MODES.WHENEVER} onClick={() => setMode(CADENCE_MODES.WHENEVER)} colors={colors}>
          Whenever
        </ModeButton>
        <ModeButton active={mode === CADENCE_MODES.ANCHOR} onClick={() => setMode(CADENCE_MODES.ANCHOR)} colors={colors}>
          Specific days
        </ModeButton>
      </div>

      {/* Mode-specific settings */}
      {mode === CADENCE_MODES.WHENEVER && (
        <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4, lineHeight: 1.5 }}>
          No schedule. Add this workout whenever you want.
        </div>
      )}

      {mode === CADENCE_MODES.WEEKLY && (
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, lineHeight: 1.5 }}>
          Weekly schedules now live on Splits. Pick Whenever or Specific days, or add this workout to a Split.
        </div>
      )}

      {mode === CADENCE_MODES.ANCHOR && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Days</div>
          <DayChips
            selected={anchorDays}
            onToggle={toggleDay("days")}
            colors={colors}
            ariaLabel="Anchor days"
          />
          {anchorDays.length === 0 && (
            <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.5 }}>
              Pick at least one day. This workout will appear on those days each week.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
