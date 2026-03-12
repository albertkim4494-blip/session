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
}
@keyframes checkinStagger {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes checkinCollapse {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
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
export function CheckinSummary({ checkin, onEdit, onClear, colors }) {
  const c = checkin || {};
  const moodFace = MOOD_FACES.find((f) => f.value === c.mood);
  const hasMood = c.mood !== null && c.mood !== undefined;
  const hasSleep = !!c.sleep;
  const painItems = (c.pain || []).filter((p) => p.severity);

  const tagStyle = {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: `1px solid ${colors.border}`,
    background: colors.cardBg, color: colors.text, opacity: 0.7,
    cursor: "pointer",
  };

  const placeholderStyle = { ...tagStyle, opacity: 0.35 };

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", alignItems: "center",
    }}>
      {hasMood ? (
        <span style={tagStyle} onClick={() => onEdit("mood")}>
          <svg viewBox="0 0 32 32" width="14" height="14">
            <circle cx="16" cy="16" r="14" fill="#FFD93D" stroke="#E6B800" strokeWidth="1.5" />
            <path d={moodFace.mouth} fill="none" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {MOOD_LABELS[String(c.mood)]}
        </span>
      ) : (
        <span style={placeholderStyle} onClick={() => onEdit("mood")}>
          +
          <svg viewBox="0 0 32 32" width="14" height="14">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="11" cy="12.5" r="1.5" fill="currentColor" />
            <circle cx="21" cy="12.5" r="1.5" fill="currentColor" />
            <path d="M13,19 L19,19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {hasSleep ? (
        <span style={tagStyle} onClick={() => onEdit("sleep")}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          {SLEEP_LABELS[c.sleep]}
        </span>
      ) : (
        <span style={placeholderStyle} onClick={() => onEdit("sleep")}>
          +
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      )}
      {painItems.length > 0 ? painItems.map((p) => (
        <span key={p.area} onClick={() => onEdit("pain")} style={tagStyle}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="5" fill={SEVERITY_COLORS[p.severity]} />
          </svg>
          {p.area}
        </span>
      )) : (
        <span style={placeholderStyle} onClick={() => onEdit("pain")}>+ Pain</span>
      )}
      {onClear && (
        <button
          onClick={onClear}
          style={{
            background: "transparent", border: "none",
            color: colors.text, opacity: 0.3, fontSize: 11,
            cursor: "pointer", padding: "2px 4px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckinEditSection — edit a single section inline, auto-saves on change
// ---------------------------------------------------------------------------
export function CheckinEditSection({ section, checkin, onSave, onCancel, colors }) {
  const [painMap, setPainMap] = useState(() => {
    const map = {};
    for (const p of (checkin.pain || [])) { if (p.severity) map[p.area] = p.severity; }
    return map;
  });

  useEffect(() => { ensureAnim(); }, []);

  const handleMoodSelect = (v) => {
    if (v === null || v === checkin.mood) { onCancel(); return; }
    onSave({ ...checkin, mood: v });
  };

  const handleSleepSelect = (v) => {
    if (v === null || v === checkin.sleep) { onCancel(); return; }
    onSave({ ...checkin, sleep: v });
  };

  const handlePainChange = (area, severity) => {
    setPainMap((prev) => {
      const next = { ...prev };
      if (severity === null) { delete next[area]; } else { next[area] = severity; }
      return next;
    });
  };

  const handlePainDone = () => {
    const pain = Object.entries(painMap)
      .filter(([, sev]) => sev)
      .map(([area, severity]) => ({ area, severity }));
    onSave({ ...checkin, pain });
  };

  const fadeIn = { opacity: 0, animation: "checkinStagger 0.4s ease-out forwards" };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14,
      animation: "checkinFadeIn 0.3s ease-out",
    }}>
      {section === "mood" && (
        <div style={fadeIn}>
          <CheckinMoodPicker value={checkin.mood} onChange={handleMoodSelect} colors={colors} />
        </div>
      )}
      {section === "sleep" && (
        <div style={fadeIn}>
          <SleepPicker value={checkin.sleep} onChange={handleSleepSelect} colors={colors} />
        </div>
      )}
      {section === "pain" && (
        <>
          <div style={fadeIn}>
            <PainAreaPills painMap={painMap} onChange={handlePainChange} colors={colors} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, paddingTop: 4 }}>
            {Object.keys(painMap).length > 0 ? (
              <button
                onClick={handlePainDone}
                style={{
                  background: "transparent", border: "none",
                  color: colors.text, cursor: "pointer",
                  fontSize: 13, opacity: 0.4,
                  transition: "opacity 0.15s",
                }}
                onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              >
                Done
              </button>
            ) : (
              <button
                onClick={handlePainDone}
                style={{
                  background: "transparent", border: "none",
                  color: colors.text, cursor: "pointer",
                  fontSize: 13, opacity: 0.4,
                  transition: "opacity 0.15s",
                }}
                onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              >
                No pain, I'm good
              </button>
            )}
            <button
              onClick={onCancel}
              style={{
                background: "transparent", border: "none",
                color: colors.text, cursor: "pointer",
                fontSize: 13, opacity: 0.3,
                transition: "opacity 0.15s",
              }}
              onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.5"; }}
              onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.3"; }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CoachCheckin — Main export
// ---------------------------------------------------------------------------
export function CoachCheckin({
  colors,
  onSubmit,
  onCancel,
  editValues,   // null = fresh check-in, { mood, sleep, pain } = editing existing
  autoExpand,   // if true, skip the collapsed "How are you feeling?" prompt
}) {
  const isEdit = editValues !== null && editValues !== undefined;
  const [expanded, setExpanded] = useState(isEdit || autoExpand);
  const [mood, setMood] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [painMap, setPainMap] = useState({});
  const [editStep, setEditStep] = useState(0); // tracks which step user is on during edit

  useEffect(() => { ensureAnim(); }, []);

  // When switching into edit mode, pre-populate with existing values
  useEffect(() => {
    if (isEdit) {
      setExpanded(true);
      setEditStep(0);
      setMood(editValues.mood ?? null);
      setSleep(editValues.sleep ?? null);
      const map = {};
      for (const p of (editValues.pain || [])) { if (p.severity) map[p.area] = p.severity; }
      setPainMap(map);
    } else {
      setExpanded(!!autoExpand);
      setMood(null);
      setSleep(null);
      setPainMap({});
    }
  }, [isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step calculation
  const step = isEdit ? editStep : (mood === null ? 0 : sleep === null ? 1 : 2);

  // Keep jumpToStep ref current
  const jumpToStep = (target) => {
    if (isEdit) {
      setEditStep(target);
    } else {
      if (target <= 0) { setMood(null); setSleep(null); setPainMap({}); }
      else if (target <= 1) { setSleep(null); setPainMap({}); }
    }
  };

  // Collapsed — subtle prompt
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          background: "transparent", border: "none",
          color: colors.text, cursor: "pointer",
          fontSize: 13, opacity: 0.35,
          padding: "4px 0",
          transition: "opacity 0.15s",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}
        onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
        onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.35"; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
          <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
          <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
        </svg>
        How are you feeling?
      </button>
    );
  }

  // Form mode (expanded)
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

  const handleCollapse = () => {
    setMood(null);
    setSleep(null);
    setPainMap({});
    setExpanded(false);
    if (onCancel) onCancel();
  };

  const handleMoodChange = (v) => {
    setMood(v);
    if (v !== null && step === 0 && isEdit) setEditStep(1);
  };

  const handleSleepChange = (v) => {
    setSleep(v);
    if (v !== null && step === 1 && isEdit) setEditStep(2);
  };

  const fadeIn = { opacity: 0, animation: "checkinStagger 0.4s ease-out forwards" };

  const moodFace = mood !== null ? MOOD_FACES.find((f) => f.value === mood) : null;
  const tagStyle = {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: `1px solid ${colors.border}`,
    background: colors.cardBg, color: colors.text, opacity: 0.7,
    cursor: "pointer",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
      animation: "checkinFadeIn 0.3s ease-out",
    }}>
      {/* Answered tags — tappable to jump back */}
      {step > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", alignItems: "center",
          animation: "checkinFadeIn 0.3s ease-out",
        }}>
          {mood !== null && (
            <span style={tagStyle} onClick={() => jumpToStep(0)}>
              {moodFace && (
                <svg viewBox="0 0 32 32" width="14" height="14">
                  <circle cx="16" cy="16" r="14" fill="#FFD93D" stroke="#E6B800" strokeWidth="1.5" />
                  <path d={moodFace.mouth} fill="none" stroke="#5D4E00" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {MOOD_LABELS[String(mood)]}
            </span>
          )}
          {sleep !== null && step > 1 && (
            <span style={tagStyle} onClick={() => jumpToStep(1)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              {SLEEP_LABELS[sleep]}
            </span>
          )}
        </div>
      )}

      {/* Current question */}
      {step === 0 && (
        <div key="mood" style={fadeIn}>
          <CheckinMoodPicker value={mood} onChange={handleMoodChange} colors={colors} />
        </div>
      )}
      {step === 1 && (
        <div key="sleep" style={fadeIn}>
          <SleepPicker value={sleep} onChange={handleSleepChange} colors={colors} />
        </div>
      )}
      {step === 2 && (
        <>
          <div key="pain" style={fadeIn}>
            <PainAreaPills painMap={painMap} onChange={handlePainChange} colors={colors} />
          </div>
          <div key="actions" style={{ ...fadeIn, display: "flex", justifyContent: "center", gap: 16, paddingTop: 4 }}>
            {Object.keys(painMap).length > 0 ? (
              <button
                onClick={handleSubmit}
                style={{
                  background: "transparent", border: "none",
                  color: colors.text, cursor: "pointer",
                  fontSize: 13, opacity: 0.4,
                  transition: "opacity 0.15s",
                }}
                onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              >
                Done
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  background: "transparent", border: "none",
                  color: colors.text, cursor: "pointer",
                  fontSize: 13, opacity: 0.4,
                  transition: "opacity 0.15s",
                }}
                onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              >
                No pain, I'm good
              </button>
            )}
          </div>
        </>
      )}

      {/* Step dots */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: colors.text,
              opacity: i === step ? 0.5 : 0.15,
              transition: "opacity 0.2s",
            }}
          />
        ))}
      </div>
      {/* Dismiss */}
      <button
        onClick={handleCollapse}
        style={{
          background: "transparent", border: "none",
          color: colors.text, cursor: "pointer",
          fontSize: 12, opacity: 0.25,
          transition: "opacity 0.15s",
        }}
        onPointerEnter={(e) => { e.currentTarget.style.opacity = "0.4"; }}
        onPointerLeave={(e) => { e.currentTarget.style.opacity = "0.25"; }}
      >
        Dismiss
      </button>
    </div>
  );
}
