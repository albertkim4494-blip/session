import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";
import { CoachCheckin } from "./CoachCheckin";

const DURATION_OPTIONS = [
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90+ min" },
];

const MUSCLE_LABELS = {
  CHEST: "Chest",
  BACK: "Back",
  QUADS: "Quads",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",
  ANTERIOR_DELT: "Front Delts",
  LATERAL_DELT: "Side Delts",
  POSTERIOR_DELT: "Rear Delts",
  TRICEPS: "Triceps",
  BICEPS: "Biceps",
  ABS: "Abs",
};

export function GenerateTodayModal({
  open,
  todayState,
  dispatch,
  onGenerate,
  todayCheckin,
  onCheckinSubmit,
  onAccept,
  onClose,
  isPro,
  genUsage,
  onRegenerate,
  onFeedback,
  styles,
  colors,
}) {
  const { step, duration, equipment, preview, loading, error } = todayState || {};

  // Live streaming state — the coaching "why" line and exercises as they arrive.
  const [streamNote, setStreamNote] = useState(null);
  const [streamExercises, setStreamExercises] = useState([]);
  // 👍/👎 on the generated workout (WS5). Reset per generation.
  const [feedback, setFeedback] = useState(null);

  const update = (payload) =>
    dispatch({ type: "UPDATE_GENERATE_TODAY", payload });

  // Auto-generate when entering step 4 (preview)
  useEffect(() => {
    if (!open || step !== 4 || preview || loading) return;
    setStreamNote(null);
    setStreamExercises([]);
    setFeedback(null);
    onGenerate({
      equipment,
      duration,
      checkinData: todayCheckin,
      onPreamble: (text) => setStreamNote(text),
      onExercise: (ex) => setStreamExercises((prev) => [...prev, ex]),
    });
    // onGenerate handles setting loading/preview state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, preview, loading, equipment, duration, todayCheckin]);

  if (!open) return null;

  const TOTAL_STEPS = 4; // 1=duration, 2=equipment, 3=check-in, 4=preview

  const stepTitles = ["", "How much time do you have?", "Equipment?", "Quick check-in", "Generated Workout"];
  const stepTitle = stepTitles[step] || "";

  const goNext = () => {
    if (step < TOTAL_STEPS) update({ step: step + 1 });
  };
  const goBack = () => {
    if (step === 4) update({ step: step - 1, preview: null, loading: false, error: null });
    else if (step > 1) update({ step: step - 1 });
  };

  const handleRegenerate = () => {
    onRegenerate?.();
    update({ preview: null, loading: false, error: null });
    // useEffect will re-trigger generation
  };

  const chooseFeedback = (rating) => {
    setFeedback(rating);
    onFeedback?.(rating);
  };

  // Free-tier allowance display (soft — never blocks). Pro = unlimited.
  const genRemaining = genUsage ? Math.max(0, (genUsage.limit || 0) - (genUsage.used || 0)) : null;

  const smallChipStyle = (active) => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: `2px solid ${active ? colors.primaryBg : colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    minWidth: 44,
    textAlign: "center",
  });

  const chipStyle = (active) => ({
    padding: "10px 16px",
    borderRadius: 12,
    border: `2px solid ${active ? colors.primaryBg : colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
  });

  const muscleChipStyle = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
    background: colors.subtleBg,
    border: `1px solid ${colors.border}`,
    opacity: 0.85,
  };

  return (
    <Modal open={open} title={stepTitle} onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Step 1: Duration */}
        {step === 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", paddingTop: 12 }}>
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                style={smallChipStyle(duration === opt.value)}
                onClick={() => update({ duration: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Equipment */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[{ key: "no_equipment", label: "No Equipment" }, ...Object.entries(EQUIPMENT_LABELS).map(([key, label]) => ({ key, label }))].map((opt) => {
                const eq = Array.isArray(equipment) ? equipment : ["full_gym"];
                const isActive = opt.key === "no_equipment"
                  ? eq.length === 0
                  : eq.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    style={smallChipStyle(isActive)}
                    onClick={() => {
                      if (opt.key === "no_equipment") {
                        update({ equipment: [] });
                      } else if (opt.key === "full_gym") {
                        update({ equipment: ["full_gym"] });
                      } else {
                        const without = eq.filter((k) => k !== "full_gym");
                        const next = without.includes(opt.key)
                          ? without.filter((k) => k !== opt.key)
                          : [...without, opt.key];
                        update({ equipment: next });
                      }
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 12, opacity: 0.5, textAlign: "center" }}>
              {Array.isArray(equipment) && equipment.length === 0 ? "Bodyweight exercises only" : "Bodyweight always included"}
            </div>
          </div>
        )}

        {/* Step 3: Required check-in */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 13, opacity: 0.65, textAlign: "center", lineHeight: 1.5 }}>
              Today&apos;s workout uses how you feel right now, not just your history.
            </div>
            <CoachCheckin
              colors={colors}
              onSubmit={(checkinData) => {
                onCheckinSubmit(checkinData);
                update({ step: 4 });
              }}
              editValues={todayCheckin || null}
              showAll
            />
          </div>
        )}

        {/* Step 4: Preview — loading. If streaming has started, build the
            workout live (preamble + exercises appearing); else a spinner. */}
        {step === 4 && loading && !preview && (
          (streamNote || streamExercises.length > 0) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {streamNote && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>{streamNote}</div>
              )}
              <div style={{
                padding: "10px 12px", borderRadius: 12,
                border: `1px solid ${colors.border}`, background: colors.cardAltBg,
              }}>
                {streamExercises.map((ex, i) => (
                  <div key={i} style={{
                    fontSize: 13, padding: "3px 0", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    animation: "genFadeIn 0.25s ease",
                  }}>
                    <span>✓ {ex.name}</span>
                    {ex.scheme && (
                      <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, marginLeft: 8, whiteSpace: "nowrap" }}>
                        {ex.scheme}
                      </span>
                    )}
                  </div>
                ))}
                <div style={{ fontSize: 13, padding: "3px 0", opacity: 0.5 }}>Designing…</div>
              </div>
              <style>{`@keyframes genFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Reading your recent training &amp; recovery…</div>
              <div style={{
                padding: "16px 12px", borderRadius: 12,
                border: `1px solid ${colors.border}`, background: colors.cardAltBg,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 18, height: 18, border: `2px solid ${colors.border}`,
                  borderTopColor: colors.primaryBg, borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, opacity: 0.7 }}>Designing your workout…</span>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )
        )}

        {/* Step 4: Preview — content */}
        {step === 4 && preview && (
          <>
            {error && (
              <div style={{
                fontSize: 12, padding: "6px 10px", borderRadius: 8,
                background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.3)",
                color: colors.text, opacity: 0.8,
              }}>
                {error}
              </div>
            )}

            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {preview.note || `Based on your recent training — targets muscles you haven't worked recently. ${duration} min session.`}
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: colors.cardAltBg,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {preview.name}
                </div>
                {preview.scheme && (
                  <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 600 }}>
                    {preview.scheme}
                  </span>
                )}
              </div>

              {preview.targetMuscles && preview.targetMuscles.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                  {preview.targetMuscles.map((m) => (
                    <span key={m} style={muscleChipStyle}>
                      {MUSCLE_LABELS[m] || m.replace(/_/g, " ").toLowerCase()}
                    </span>
                  ))}
                </div>
              )}

              {preview.exercises.map((ex) => (
                <div key={ex.id} style={{ fontSize: 13, padding: "3px 0", opacity: 0.85, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{ex.name}</span>
                  {ex.scheme && (
                    <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 600, marginLeft: 8, whiteSpace: "nowrap" }}>
                      {ex.scheme}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback (👍/👎) + free-tier usage line */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, opacity: 0.55 }}>Good workout?</span>
              {["up", "down"].map((r) => (
                <button
                  key={r}
                  className="btn-press"
                  onClick={() => chooseFeedback(r)}
                  aria-label={r === "up" ? "Thumbs up" : "Thumbs down"}
                  style={{
                    border: `1px solid ${feedback === r ? colors.primaryBg : colors.border}`,
                    background: feedback === r ? colors.primaryBg : "transparent",
                    borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontSize: 14, lineHeight: 1,
                  }}
                >
                  {r === "up" ? "👍" : "👎"}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              {!isPro && genRemaining != null && (
                <span style={{ fontSize: 11, opacity: 0.5, textAlign: "right" }}>
                  {genRemaining > 0
                    ? `${genRemaining} of ${genUsage.limit} free AI workouts left`
                    : "Free limit reached — free during beta"}
                </span>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={styles.modalFooter}>
          {step > 1 && !loading && (
            <button className="btn-press" style={styles.secondaryBtn} onClick={goBack}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 && (
            <button className="btn-press" style={styles.primaryBtn} onClick={goNext}>
              Next
            </button>
          )}
          {step === 4 && !loading && (
            <>
              <button className="btn-press" style={styles.secondaryBtn} onClick={handleRegenerate}>
                Regenerate
              </button>
              <button
                className="btn-press"
                style={{ ...styles.primaryBtn, marginLeft: 8 }}
                onClick={() => onAccept(preview)}
                disabled={!preview}
              >
                Use Today
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
