import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "./Modal";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch, normalizeQuery } from "../lib/exerciseCatalogUtils";
import { ExerciseDetailModal } from "./ExerciseDetailModal";

const MOVEMENT_FILTERS = [
  { key: null, label: "All" },
  { key: "push", label: "Push" },
  { key: "pull", label: "Pull" },
  { key: "legs", label: "Legs" },
  { key: "shoulders", label: "Shoulders" },
  { key: "arms", label: "Arms" },
  { key: "core", label: "Core" },
  { key: "cardio", label: "Cardio" },
  { key: "sport", label: "Sport" },
  { key: "mobility", label: "Mobility" },
  { key: "stretch", label: "Stretch" },
];

function collectUserExercises(workouts) {
  const seen = new Map();
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      const key = ex.name.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, ex);
      }
    }
  }
  return Array.from(seen.values());
}

function getRecentUserExercises(workouts, logsByDate, limit) {
  const idToEx = new Map();
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      idToEx.set(ex.id, ex);
    }
  }

  const seen = new Set();
  const results = [];
  const dates = Object.keys(logsByDate || {})
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  for (const date of dates) {
    const dayLogs = logsByDate[date];
    if (!dayLogs || dayLogs === null || typeof dayLogs !== "object") continue;
    for (const exerciseId of Object.keys(dayLogs)) {
      const ex = idToEx.get(exerciseId);
      if (!ex) continue;
      const key = ex.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(ex);
      if (results.length >= limit) return results;
    }
  }
  return results;
}

export function ExerciseCatalogModal({
  open, onClose, onAddExercise, onCustomExercise,
  styles, colors, workouts, logsByDate,
  targetWorkoutId, catalog,
}) {
  const [query, setQuery] = useState("");
  const [movementFilter, setMovementFilter] = useState(null);
  const [detailEntry, setDetailEntry] = useState(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setMovementFilter(null);
      setDetailEntry(null);
    }
  }, [open]);

  const catalogResults = useMemo(
    () => catalogSearch(catalog || EXERCISE_CATALOG, query, { movement: movementFilter, limit: 50 }),
    [query, movementFilter, catalog]
  );

  const catalogNameSet = useMemo(
    () => new Set(catalogResults.map((r) => r.name.toLowerCase())),
    [catalogResults]
  );

  const userResults = useMemo(() => {
    if (!targetWorkoutId) return [];
    const q = normalizeQuery(query);
    if (movementFilter) return [];

    if (!q) {
      return getRecentUserExercises(workouts, logsByDate, 5)
        .filter((ex) => !catalogNameSet.has(ex.name.toLowerCase()));
    }

    const all = collectUserExercises(workouts);
    return all.filter((ex) => {
      if (catalogNameSet.has(ex.name.toLowerCase())) return false;
      return ex.name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [query, movementFilter, workouts, logsByDate, catalogNameSet, targetWorkoutId]);

  if (!open) return null;

  const chipStyle = (active) => ({
    padding: "5px 10px",
    borderRadius: 999,
    border: `1px solid ${colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 11,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
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

  const equipChipStyle = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.65,
  };

  const userLabelStyle = {
    fontSize: 10,
    fontWeight: 700,
    opacity: 0.55,
    marginLeft: "auto",
    flexShrink: 0,
  };

  const resultBtnStyle = {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    background: colors.cardAltBg,
    color: colors.text,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const hasUserResults = userResults.length > 0;
  const hasResults = hasUserResults || catalogResults.length > 0;
  const q = normalizeQuery(query);
  const showRecentLabel = hasUserResults && !q;

  const title = targetWorkoutId ? "Add Exercise" : "Exercise Catalog";

  // Both modes get a footer so the modal is full height (same as log modal)
  const footer = onCustomExercise ? (
    <button
      className="btn-press"
      style={{ ...styles.secondaryBtn, textAlign: "center", width: "100%" }}
      onClick={onCustomExercise}
    >
      + Custom Exercise
    </button>
  ) : (
    <div style={{ fontSize: 11, opacity: 0.4, textAlign: "center", padding: "2px 0" }}>
      {(catalog || EXERCISE_CATALOG).length} exercises available
    </div>
  );

  return (
    <>
      <Modal open={open && !detailEntry} title={title} onClose={onClose} styles={styles} footer={footer}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.textInput}
            placeholder="Search exercises..."
          />

          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch", flexShrink: 0 }}>
            {MOVEMENT_FILTERS.map((f) => (
              <button
                key={f.key || "all"}
                style={chipStyle(movementFilter === f.key)}
                onClick={() => setMovementFilter(movementFilter === f.key ? null : f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: "auto", minHeight: 0 }}>
            {!hasResults && (
              <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
                No exercises found.
              </div>
            )}

            {showRecentLabel && (
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, padding: "2px 2px 0" }}>Recent</div>
            )}
            {userResults.map((ex) => (
              <button
                key={"user-" + ex.id}
                style={resultBtnStyle}
                onClick={() => {
                  if (targetWorkoutId && onAddExercise) {
                    onAddExercise(null, targetWorkoutId, ex);
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</span>
                  <span style={userLabelStyle}>your exercise</span>
                </div>
              </button>
            ))}

            {hasUserResults && catalogResults.length > 0 && !q && (
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, padding: "6px 2px 0" }}>Catalog</div>
            )}

            {catalogResults.map((entry) => (
              <button
                key={entry.id}
                style={resultBtnStyle}
                onClick={() => setDetailEntry(entry)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.name}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {entry.muscles.primary.map((m) => (
                    <span key={m} style={muscleChipStyle}>
                      {m.replace(/_/g, " ").toLowerCase()}
                    </span>
                  ))}
                  {entry.equipment.filter((e) => e !== "bodyweight").map((e) => (
                    <span key={e} style={equipChipStyle}>{e}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <ExerciseDetailModal
        open={!!detailEntry}
        entry={detailEntry}
        onClose={() => setDetailEntry(null)}
        onAddExercise={onAddExercise ? (entry, workoutId) => onAddExercise(entry, workoutId) : undefined}
        workouts={workouts}
        styles={styles}
        colors={colors}
        targetWorkoutId={targetWorkoutId}
      />
    </>
  );
}
