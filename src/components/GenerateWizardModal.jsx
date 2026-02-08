import React, { useEffect, useRef } from "react";
import { Modal } from "./Modal";
import {
  generateProgram,
} from "../lib/workoutGenerator";
import { generateProgramAI } from "../lib/workoutGeneratorApi";
import { EXERCISE_CATALOG, EQUIPMENT_LABELS } from "../lib/exerciseCatalog";

const EQUIPMENT_KEYS = ["home", "basic", "gym"];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DURATION_OPTIONS = [
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90+ min" },
];

export function GenerateWizardModal({
  open,
  wizardState,
  dispatch,
  onAccept,
  onClose,
  catalog,
  profile,
  state,
  styles,
  colors,
}) {
  const {
    step,
    daysPerWeek,
    equipment,
    duration,
    preview,
    loading,
    error,
    sportDays,
  } = wizardState;

  const goal = profile?.goal || "General Fitness";

  // Determine if sport step should show
  const hasSport = !!(profile?.sports && profile.sports.trim());
  const sportName = hasSport ? profile.sports.trim() : "";

  // Steps: sport? → days → duration → equipment → preview
  // With sport: 1=Sport Days, 2=Workout Days, 3=Duration, 4=Equipment, 5=Preview
  // Without:   1=Workout Days, 2=Duration, 3=Equipment, 4=Preview
  const TOTAL_STEPS = hasSport ? 5 : 4;

  function getStepContent(s) {
    if (hasSport) {
      return ["", "sport", "days", "duration", "equipment", "preview"][s];
    }
    return ["", "days", "duration", "equipment", "preview"][s];
  }

  const currentContent = getStepContent(step);

  // Track the generation request to avoid stale results
  const genRef = useRef(0);

  // Generate preview when entering preview step
  useEffect(() => {
    if (currentContent !== "preview" || preview || loading) return;

    const genId = ++genRef.current;

    async function generate() {
      update({ loading: true, error: null });

      const result = await generateProgramAI({
        goal,
        daysPerWeek,
        equipment,
        duration,
        profile: profile || {},
        state: state || {},
        catalog: catalog || EXERCISE_CATALOG,
        sportName: hasSport ? sportName : "",
        sportDays: hasSport ? sportDays : [],
      });

      // Don't apply if a newer generation was triggered
      if (genRef.current !== genId) return;

      if (result.success) {
        update({ preview: result.data, loading: false });
      } else {
        // Fallback to deterministic
        const fallback = generateProgram({
          goal,
          daysPerWeek,
          equipment,
          duration,
          catalog: catalog || EXERCISE_CATALOG,
        });
        console.error("AI generation failed:", result.error);
        update({
          preview: fallback,
          loading: false,
          error: `AI unavailable — used smart defaults (${result.error || "unknown error"})`,
        });
      }
    }

    generate();
  }, [step, preview, loading]);

  if (!open) return null;

  const update = (payload) =>
    dispatch({ type: "UPDATE_GENERATE_WIZARD", payload });

  const canNext =
    currentContent === "sport" ||
    currentContent === "days" ||
    currentContent === "duration" ||
    currentContent === "equipment" ||
    currentContent === "preview";

  const goNext = () => {
    if (step < TOTAL_STEPS) update({ step: step + 1 });
  };
  const goBack = () => {
    if (currentContent === "preview") update({ step: step - 1, preview: null, loading: false, error: null });
    else if (step > 1) update({ step: step - 1 });
  };

  const handleRegenerate = () => {
    update({ preview: null, loading: false, error: null });
  };

  const handleAccept = () => {
    if (!preview) return;
    onAccept(preview.workouts, { goal, daysPerWeek, equipment, duration });
  };

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

  const stepTitles = hasSport
    ? ["", `How many days do you play ${sportName}?`, "How many gym days?", "Session duration?", "Equipment?", "Your Program"]
    : ["", "How many workout days?", "Session duration?", "Equipment?", "Your Program"];

  const stepTitle = stepTitles[step] || "";

  const toggleSportDay = (day) => {
    const current = sportDays || [];
    if (current.includes(day)) {
      update({ sportDays: current.filter((d) => d !== day) });
    } else {
      update({ sportDays: [...current, day] });
    }
  };

  return (
    <Modal open={open} title={stepTitle} onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Sport days — Mon-Sun toggle chips */}
        {currentContent === "sport" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {DAY_LABELS.map((day) => (
                <button
                  key={day}
                  style={smallChipStyle((sportDays || []).includes(day))}
                  onClick={() => toggleSportDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {sportDays.length > 0 && (
              <div style={{ fontSize: 12, opacity: 0.5, textAlign: "center" }}>
                {sportDays.length} sport day{sportDays.length !== 1 ? "s" : ""} — {sportDays.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Days per week */}
        {currentContent === "days" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", paddingTop: 12 }}>
            {hasSport && (
              <div style={{ fontSize: 13, opacity: 0.6, textAlign: "center" }}>
                Not counting {sportName} days
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  style={smallChipStyle(daysPerWeek === d)}
                  onClick={() => update({ daysPerWeek: d })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        {currentContent === "duration" && (
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
        {currentContent === "equipment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EQUIPMENT_KEYS.map((key) => (
              <button
                key={key}
                style={chipStyle(equipment === key)}
                onClick={() => update({ equipment: key })}
              >
                {EQUIPMENT_LABELS[key]}
              </button>
            ))}
          </div>
        )}

        {/* Preview — loading */}
        {currentContent === "preview" && loading && (
          <div style={{ textAlign: "center", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, border: `3px solid ${colors.border}`,
              borderTopColor: colors.primaryBg, borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              Designing your personalized program...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Preview — content */}
        {currentContent === "preview" && !loading && preview && (
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
              {daysPerWeek}-day {goal} program — {preview.scheme} per exercise — {duration} min sessions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "45vh", overflowY: "auto" }}>
              {preview.workouts.map((w) => (
                <div
                  key={w.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardAltBg,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                    {w.name}
                    {w.scheme === "sport" && (
                      <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.6, marginLeft: 6 }}>
                        (sport day)
                      </span>
                    )}
                  </div>
                  {w.exercises.map((ex) => (
                    <div key={ex.id} style={{ fontSize: 13, padding: "2px 0", opacity: 0.85 }}>
                      {ex.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preview — no content, not loading (shouldn't happen but safe) */}
        {currentContent === "preview" && !loading && !preview && (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.5 }}>
            Generating...
          </div>
        )}

        {/* Footer */}
        <div style={styles.modalFooter}>
          {step > 1 && !loading && (
            <button style={styles.secondaryBtn} onClick={goBack}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentContent !== "preview" && (
            <button
              style={{
                ...styles.primaryBtn,
                opacity: canNext ? 1 : 0.4,
              }}
              disabled={!canNext}
              onClick={goNext}
            >
              Next
            </button>
          )}
          {currentContent === "preview" && !loading && (
            <>
              <button style={styles.secondaryBtn} onClick={handleRegenerate}>
                Regenerate
              </button>
              <button
                style={{ ...styles.primaryBtn, marginLeft: 8 }}
                onClick={handleAccept}
                disabled={!preview}
              >
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
