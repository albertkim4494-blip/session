import React, { useState, useEffect } from "react";
import { PAIN_AREAS } from "../lib/coachCheckin";

// ---------------------------------------------------------------------------
// Mood face data (duplicated from App.jsx — those are not exported)
// ---------------------------------------------------------------------------
const MOOD_FACES = [
  { value: 2, label: "Great", mouth: "M12,18 Q16,22 20,18", eyes: "happy" },
  { value: 1, label: "Good", mouth: "M13,19 Q16,21 19,19", eyes: "normal" },
  { value: 0, label: "Okay", mouth: "M13,19 L19,19", eyes: "normal" },
  { value: -1, label: "Tough", mouth: "M13,20 Q16,18 19,20", eyes: "normal" },
  { value: -2, label: "Brutal", mouth: "M12,21 Q16,17 20,21", eyes: "squint" },
];

const MOOD_LABELS = { "-2": "Brutal", "-1": "Tough", "0": "Okay", "1": "Good", "2": "Great" };
const SLEEP_OPTIONS = ["poor", "okay", "great"];
const SLEEP_LABELS = { poor: "Poor", okay: "Okay", great: "Great" };
const SEVERITY_CYCLE = [null, "mild", "moderate", "severe"];
const SEVERITY_COLORS = { mild: "#eab308", moderate: "#f97316", severe: "#ef4444" };
const SEVERITY_EMOJI = { mild: "\uD83D\uDFE1", moderate: "\uD83D\uDFE0", severe: "\uD83D\uDD34" };

// ---------------------------------------------------------------------------
// CSS animation (injected once)
// ---------------------------------------------------------------------------
const ANIM_CSS = `
@keyframes checkinFadeIn {
  from { opacity: 0; transform: translateY(6px); }
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
// FaceIcon — inline SVG face button
// ---------------------------------------------------------------------------
function FaceIcon({ face, selected, color, onSelect }) {
  return (
    <button
      onClick={() => onSelect(face.value)}
      aria-label={face.label}
      style={{
        width: 44, height: 44, padding: 0, border: "none",
        background: "transparent", cursor: "pointer",
        transform: selected ? "scale(1.15)" : "scale(1)",
        transition: "transform 0.15s ease",
        opacity: selected ? 1 : 0.55,
      }}
    >
      <svg viewBox="0 0 32 32" width="44" height="44">
        <circle
          cx="16" cy="16" r="14"
          fill={selected ? "#FFD93D" : "transparent"}
          stroke={selected ? "#E6B800" : color}
          strokeWidth="1.5"
        />
        {face.eyes === "happy" ? (
          <>
            <path d="M10,13 Q11,11 12,13" fill="none" stroke={selected ? "#5D4E00" : color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20,13 Q21,11 22,13" fill="none" stroke={selected ? "#5D4E00" : color} strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : face.eyes === "squint" ? (
          <>
            <line x1="9.5" y1="13" x2="12.5" y2="13" stroke={selected ? "#5D4E00" : color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19.5" y1="13" x2="22.5" y2="13" stroke={selected ? "#5D4E00" : color} strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="11" cy="12.5" r="1.5" fill={selected ? "#5D4E00" : color} />
            <circle cx="21" cy="12.5" r="1.5" fill={selected ? "#5D4E00" : color} />
          </>
        )}
        <path d={face.mouth} fill="none" stroke={selected ? "#5D4E00" : color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// CheckinMoodPicker
// ---------------------------------------------------------------------------
function CheckinMoodPicker({ value, onChange, colors }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>How are you feeling?</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 260 }}>
        {MOOD_FACES.map((face) => (
          <FaceIcon
            key={face.value}
            face={face}
            selected={value === face.value}
            color={colors.textSecondary || colors.text}
            onSelect={(v) => onChange(value === v ? null : v)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SleepPicker
// ---------------------------------------------------------------------------
function SleepPicker({ value, onChange, colors }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>How'd you sleep?</div>
      <div style={{ display: "flex", gap: 6 }}>
        {SLEEP_OPTIONS.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(active ? null : opt)}
              style={{
                padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: `1px solid ${active ? (colors.accent || "#3b82f6") : colors.border}`,
                background: active ? (colors.primaryBg || "#1a2744") : "transparent",
                color: active ? (colors.primaryText || colors.text) : colors.text,
                opacity: active ? 1 : 0.6,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {SLEEP_LABELS[opt]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PainAreaPills
// ---------------------------------------------------------------------------
function PainAreaPills({ painMap, onChange, colors }) {
  const handleTap = (area) => {
    const current = painMap[area] || null;
    const currentIdx = SEVERITY_CYCLE.indexOf(current);
    const nextIdx = (currentIdx + 1) % SEVERITY_CYCLE.length;
    const next = SEVERITY_CYCLE[nextIdx];
    onChange(area, next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>Anything hurting?</div>
      <div style={{ fontSize: 10, opacity: 0.4, marginTop: -2 }}>
        Tap to cycle: off {"\u2192"} Mild {"\u2192"} Moderate {"\u2192"} Severe {"\u2192"} off
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6,
        justifyContent: "center", maxWidth: 320,
      }}>
        {PAIN_AREAS.map((area) => {
          const severity = painMap[area] || null;
          const active = severity !== null;
          const bg = active ? (SEVERITY_COLORS[severity] + "22") : "transparent";
          const borderColor = active ? SEVERITY_COLORS[severity] : colors.border;
          return (
            <button
              key={area}
              onClick={() => handleTap(area)}
              style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: `1px solid ${borderColor}`,
                background: bg,
                color: colors.text,
                opacity: active ? 1 : 0.5,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {active ? `${SEVERITY_EMOJI[severity]} ${area}` : area}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckinSummary — compact post-submission summary
// ---------------------------------------------------------------------------
function CheckinSummary({ checkin, onEdit, colors }) {
  const moodLabel = MOOD_LABELS[String(checkin.mood)] ?? "?";
  const moodFace = MOOD_FACES.find((f) => f.value === checkin.mood);
  const sleepLabel = checkin.sleep ? `Slept ${checkin.sleep}` : null;
  const painItems = (checkin.pain || []).filter((p) => p.severity);

  return (
    <button
      onClick={onEdit}
      style={{
        display: "flex", flexDirection: "column", gap: 2,
        width: "100%", padding: "8px 12px", borderRadius: 10,
        border: `1px solid ${colors.border}`,
        background: colors.cardBg,
        color: colors.text,
        cursor: "pointer", textAlign: "left",
        transition: "opacity 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
        {moodFace && (
          <svg viewBox="0 0 32 32" width="20" height="20">
            <circle cx="16" cy="16" r="14" fill="#FFD93D" stroke="#E6B800" strokeWidth="1.5" />
            {moodFace.eyes === "happy" ? (
              <>
                <path d="M10,13 Q11,11 12,13" fill="none" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20,13 Q21,11 22,13" fill="none" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : moodFace.eyes === "squint" ? (
              <>
                <line x1="9.5" y1="13" x2="12.5" y2="13" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="19.5" y1="13" x2="22.5" y2="13" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="11" cy="12.5" r="1.5" fill="#5D4E00" />
                <circle cx="21" cy="12.5" r="1.5" fill="#5D4E00" />
              </>
            )}
            <path d={moodFace.mouth} fill="none" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
        <span style={{ fontWeight: 600 }}>{moodLabel}</span>
        {sleepLabel && (
          <>
            <span style={{ opacity: 0.3 }}>{"\u00B7"}</span>
            <span style={{ opacity: 0.7 }}>{sleepLabel}</span>
          </>
        )}
        <span style={{ marginLeft: "auto", opacity: 0.3, fontSize: 11 }}>tap to edit</span>
      </div>
      {painItems.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
          {painItems.map((p) => (
            <span key={p.area} style={{ fontSize: 12, opacity: 0.8 }}>
              {SEVERITY_EMOJI[p.severity]} {p.area} ({p.severity})
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CoachCheckin — Main export
// ---------------------------------------------------------------------------
export function CoachCheckin({
  colors,
  todayCheckin,
  onSubmit,
  onEdit,
}) {
  const [mood, setMood] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [painMap, setPainMap] = useState({}); // area → severity

  useEffect(() => { ensureAnim(); }, []);

  // Reset form when switching to edit mode (todayCheckin becomes null)
  useEffect(() => {
    if (todayCheckin === null) {
      setMood(null);
      setSleep(null);
      setPainMap({});
    }
  }, [todayCheckin]);

  // Summary mode — already checked in
  if (todayCheckin) {
    return (
      <div style={{ animation: "checkinFadeIn 0.3s ease-out" }}>
        <CheckinSummary checkin={todayCheckin} onEdit={onEdit} colors={colors} />
      </div>
    );
  }

  // Form mode
  const handlePainChange = (area, severity) => {
    setPainMap((prev) => {
      const next = { ...prev };
      if (severity === null) {
        delete next[area];
      } else {
        next[area] = severity;
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const pain = Object.entries(painMap)
      .filter(([, sev]) => sev)
      .map(([area, severity]) => ({ area, severity }));

    onSubmit({
      mood: mood ?? 0,
      sleep: sleep ?? "okay",
      pain,
    });
  };

  const hasAnyInput = mood !== null || sleep !== null || Object.keys(painMap).length > 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 16,
      padding: "16px 0",
      animation: "checkinFadeIn 0.4s ease-out",
    }}>
      <CheckinMoodPicker value={mood} onChange={setMood} colors={colors} />
      <SleepPicker value={sleep} onChange={setSleep} colors={colors} />
      <PainAreaPills painMap={painMap} onChange={handlePainChange} colors={colors} />

      <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
        <button
          className="btn-press"
          onClick={handleSubmit}
          style={{
            padding: "10px 24px", borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            border: `1px solid ${colors.border}`,
            background: colors.cardBg,
            color: colors.text,
            cursor: "pointer",
            boxShadow: colors.shadow,
            opacity: hasAnyInput ? 1 : 0.6,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
            <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
            <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
          </svg>
          Get Today's Analysis
        </button>
      </div>
    </div>
  );
}
