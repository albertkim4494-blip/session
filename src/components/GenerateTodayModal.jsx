import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { EQUIPMENT_LABELS } from "../lib/exerciseCatalog";
import { CoachCheckin } from "./CoachCheckin";
import { getSplitOptions } from "../lib/splitTemplates";

const DURATION_OPTIONS = [
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90+ min" },
];

// Status captions shown while waiting for the first streamed token. These mirror
// the data the generator actually sends (recency, fatigue, trait vector, trends),
// so the wait reads as real work rather than a dead spinner.
const BUILD_STAGES = [
  "Reading your recent training…",
  "Checking recovery & fatigue…",
  "Balancing muscle groups…",
  "Writing your workout…",
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
  weeklyPlan,
  suggestedFocusKey,
  onCreateWeeklyPlan,
  styles,
  colors,
}) {
  const { step, duration, equipment, preview, loading, error, planningMode, weeklyDays, todayFocus } = todayState || {};

  // Dynamic step flow: "setup" (no active weekly plan → ask days + pick a split)
  // vs. "daily" (active plan → pick today's focus). Preview always generates.
  const stepFlow = planningMode === "setup"
    ? ["days", "duration", "equipment", "split", "checkin", "preview"]
    : ["focus", "checkin", "preview"];
  const stepKey = stepFlow[(step || 1) - 1] || "preview";
  const TOTAL_STEPS = stepFlow.length;
  const STEP_TITLES = {
    days: "How many days this week?",
    duration: "How much time do you have?",
    equipment: "Equipment?",
    split: "Pick your split",
    focus: "What are you training today?",
    checkin: "Quick check-in",
    preview: "Generated Workout",
  };
  const stepTitle = STEP_TITLES[stepKey] || "";

  // Live streaming state — the coaching "why" line and exercises as they arrive.
  const [streamNote, setStreamNote] = useState(null);
  const [streamExercises, setStreamExercises] = useState([]);
  // Cycling status caption during the pre-token wait.
  const [stageIdx, setStageIdx] = useState(0);

  // Advance the build-stage caption while waiting for the first streamed content.
  const buildingWait = open && stepKey === "preview" && loading && !preview && !streamNote && streamExercises.length === 0;
  useEffect(() => {
    if (!buildingWait) return;
    const id = setInterval(() => setStageIdx((i) => Math.min(i + 1, BUILD_STAGES.length - 1)), 1800);
    return () => clearInterval(id);
  }, [buildingWait]);

  const update = (payload) =>
    dispatch({ type: "UPDATE_GENERATE_TODAY", payload });

  // Auto-generate on entering the preview step.
  useEffect(() => {
    if (!open || stepKey !== "preview" || preview || loading) return;
    setStreamNote(null);
    setStreamExercises([]);
    setStageIdx(0);
    onGenerate({
      equipment,
      duration,
      focus: todayFocus,
      checkinData: todayCheckin,
      onPreamble: (text) => setStreamNote(text),
      onExercise: (ex) => setStreamExercises((prev) => [...prev, ex]),
    });
    // onGenerate handles setting loading/preview state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepKey, preview, loading, equipment, duration, todayFocus, todayCheckin]);

  if (!open) return null;

  const goNext = () => {
    if (step < TOTAL_STEPS) update({ step: step + 1 });
  };
  const goBack = () => {
    if (stepKey === "preview") update({ step: step - 1, preview: null, loading: false, error: null });
    else if (step > 1) update({ step: step - 1 });
  };

  // --- Weekly-plan step handlers ---
  const splitOptions = planningMode === "setup" ? getSplitOptions(weeklyDays) : [];
  const pickSplit = (opt) => {
    onCreateWeeklyPlan?.({
      daysPerWeek: weeklyDays,
      duration,
      equipment,
      splitId: opt.id,
      splitLabel: opt.label,
      slots: opt.slots,
    });
    // Start the first day of the new plan on its first slot.
    update({ todayFocus: opt.slots?.[0]?.focus || "full_body", step: step + 1 });
  };
  const pickFocus = (focus) => update({ todayFocus: focus, step: step + 1 });

  // Daily focus options: the plan's slots (App passes the suggested next focus).
  const focusSlots = (weeklyPlan?.slots || []);

  const handleRegenerate = () => {
    onRegenerate?.();
    update({ preview: null, loading: false, error: null });
    // useEffect will re-trigger generation
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

        {/* Days per week (weekly-plan setup) */}
        {stepKey === "days" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", paddingTop: 12 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} style={smallChipStyle(weeklyDays === n)} onClick={() => update({ weeklyDays: n })}>
                {n}
              </button>
            ))}
            <div style={{ width: "100%", textAlign: "center", fontSize: 12, opacity: 0.55, marginTop: 4 }}>
              days you plan to train this week — a target, not a rule
            </div>
          </div>
        )}

        {/* Pick a split (weekly-plan setup) */}
        {stepKey === "split" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            {splitOptions.map((opt) => (
              <button
                key={opt.id}
                className="btn-press"
                style={{ ...chipStyle(false), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}
                onClick={() => pickSplit(opt)}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</span>
                <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>{opt.blurb}</span>
              </button>
            ))}
            <div style={{ textAlign: "center", fontSize: 11, opacity: 0.45 }}>
              You can pick any day from your split each session — or do something else entirely.
            </div>
          </div>
        )}

        {/* Today's focus (daily, active plan) */}
        {stepKey === "focus" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
            {weeklyPlan?.splitLabel && (
              <div style={{ fontSize: 12, opacity: 0.55, textAlign: "center", marginBottom: 2 }}>
                {weeklyPlan.splitLabel} — pick today
              </div>
            )}
            {(() => {
              let hl = false;
              return focusSlots.map((slot) => {
                const isSuggested = !hl && slot.focus === suggestedFocusKey;
                if (isSuggested) hl = true;
                return (
                  <button
                    key={slot.id}
                    className="btn-press"
                    style={chipStyle(isSuggested)}
                    onClick={() => pickFocus(slot.focus)}
                  >
                    {slot.label}{isSuggested ? "  ·  suggested" : ""}
                  </button>
                );
              });
            })()}
            <button className="btn-press" style={{ ...chipStyle(false), opacity: 0.85 }} onClick={() => pickFocus("full_body")}>
              Something else — quick full body
            </button>
          </div>
        )}

        {/* Duration */}
        {stepKey === "duration" && (
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

        {/* Equipment */}
        {stepKey === "equipment" && (
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

        {/* Required check-in */}
        {stepKey === "checkin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 13, opacity: 0.65, textAlign: "center", lineHeight: 1.5 }}>
              Today&apos;s workout uses how you feel right now, not just your history.
            </div>
            <CoachCheckin
              colors={colors}
              onSubmit={(checkinData) => {
                onCheckinSubmit(checkinData);
                update({ step: step + 1 });
              }}
              editValues={todayCheckin || null}
              showAll
            />
          </div>
        )}

        {/* Preview — loading. If streaming has started, build the workout live
            (preamble + exercises appearing); else a spinner. */}
        {stepKey === "preview" && loading && !preview && (
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
            // Pre-token wait: cycling status caption + shimmering skeleton rows,
            // in the same card that will fill with real exercises — so the
            // stream reads as one continuous "building" motion, not a spinner.
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.65, transition: "opacity 0.3s" }}>
                {BUILD_STAGES[stageIdx]}
              </div>
              <div style={{
                padding: "10px 12px", borderRadius: 12,
                border: `1px solid ${colors.border}`, background: colors.cardAltBg,
              }}>
                {[72, 56, 80, 50].map((w, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0" }}>
                    <div style={{
                      height: 10, width: `${w}%`, borderRadius: 6, background: colors.border,
                      animation: `genPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                    <div style={{
                      height: 10, width: 30, borderRadius: 6, background: colors.border,
                      animation: `genPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  </div>
                ))}
              </div>
              <style>{`@keyframes genPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.6; } }`}</style>
            </div>
          )
        )}

        {/* Preview — content */}
        {stepKey === "preview" && preview && (
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
                {/* No workout-level scheme here — each exercise carries its own
                    tailored sets×reps below, so a single title-level "3×10"
                    would contradict them. */}
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

            {/* Free-tier usage line (non-Pro only; soft, never blocks).
                Post-workout "how was that session?" feedback — the signal that
                should feed future generations — is a planned separate feature. */}
            {!isPro && genRemaining != null && (
              <div style={{ fontSize: 11, opacity: 0.5, textAlign: "right" }}>
                {genRemaining > 0
                  ? `${genRemaining} of ${genUsage.limit} free AI workouts left`
                  : "Free limit reached — free during beta"}
              </div>
            )}
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
          {/* Only the free-text steps need a manual Next; split/focus/check-in
              auto-advance on selection, and preview has its own buttons. */}
          {["days", "duration", "equipment"].includes(stepKey) && (
            <button className="btn-press" style={styles.primaryBtn} onClick={goNext}>
              Next
            </button>
          )}
          {stepKey === "preview" && !loading && (
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
