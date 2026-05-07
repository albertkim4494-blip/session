import React from "react";
import { CADENCE_MODES } from "../lib/cadence";

// Display order: Mon → Sun. Values match JS Date#getDay (0=Sun, 1=Mon, ..., 6=Sat).
const DISPLAY_DAYS = [
  { label: "M", value: 1, full: "Monday" },
  { label: "T", value: 2, full: "Tuesday" },
  { label: "W", value: 3, full: "Wednesday" },
  { label: "T", value: 4, full: "Thursday" },
  { label: "F", value: 5, full: "Friday" },
  { label: "S", value: 6, full: "Saturday" },
  { label: "S", value: 0, full: "Sunday" },
];

function DayChips({ selected, onToggle, colors, ariaLabel }) {
  const sel = Array.isArray(selected) ? selected : [];
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
              width: 36, height: 36, borderRadius: 999,
              border: `1px solid ${isSelected ? colors.accent : colors.border}`,
              background: isSelected ? colors.accent : "transparent",
              color: isSelected ? "#fff" : colors.text,
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            {d.label}
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

      {/* Mode picker */}
      <div style={{ display: "flex", gap: 6 }}>
        <ModeButton active={mode === CADENCE_MODES.WHENEVER} onClick={() => setMode(CADENCE_MODES.WHENEVER)} colors={colors}>
          Whenever
        </ModeButton>
        <ModeButton active={mode === CADENCE_MODES.WEEKLY} onClick={() => setMode(CADENCE_MODES.WEEKLY)} colors={colors}>
          Weekly
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Times per week</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                const active = perWeek === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPerWeek(n)}
                    aria-pressed={active}
                    style={{
                      width: 36, height: 36, borderRadius: 999,
                      border: `1px solid ${active ? colors.accent : colors.border}`,
                      background: active ? colors.accent : "transparent",
                      color: active ? "#fff" : colors.text,
                      fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Preferred days <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
            </div>
            <DayChips
              selected={preferredDays}
              onToggle={toggleDay("preferredDays")}
              colors={colors}
              ariaLabel="Preferred days of the week"
            />
            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6, lineHeight: 1.5 }}>
              Soft hint — you can still log this workout on any day.
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={c.skipIfMissed !== false}
              onChange={(e) => setSkipIfMissed(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span>Skip if missed (no make-up days)</span>
          </label>
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
