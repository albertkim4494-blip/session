import React, { useState, useMemo, useRef, useEffect } from "react";
import { Modal } from "./Modal";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch, normalizeQuery } from "../lib/exerciseCatalogUtils";

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
];

/**
 * Collect unique exercises from the user's workouts, deduplicating by
 * lowercase name. Returns array of { name, unit, catalogId?, ... }.
 */
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

/**
 * Get the most-recently-used exercise IDs (by date), return up to `limit`
 * unique exercises. Used for the "Recent" section.
 */
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

export function CatalogBrowseModal({
  open, onClose, onSelectCatalogExercise, onSelectUserExercise,
  onCustomExercise, styles, colors, workouts, logsByDate,
}) {
  const [query, setQuery] = useState("");
  const [movementFilter, setMovementFilter] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setMovementFilter(null);
    }
  }, [open]);

  // Catalog search results
  const catalogResults = useMemo(
    () => catalogSearch(EXERCISE_CATALOG, query, { movement: movementFilter, limit: 50 }),
    [query, movementFilter]
  );

  // Build set of catalog result names (lowercase) for dedup
  const catalogNameSet = useMemo(
    () => new Set(catalogResults.map((r) => r.name.toLowerCase())),
    [catalogResults]
  );

  // User exercises: recent (no query) or search-matched (with query)
  const userResults = useMemo(() => {
    const q = normalizeQuery(query);

    // Only show in "All" filter — user exercises don't have movement categories
    if (movementFilter) return [];

    if (!q) {
      // No search — show recent, exclude any that match catalog results
      return getRecentUserExercises(workouts, logsByDate, 5)
        .filter((ex) => !catalogNameSet.has(ex.name.toLowerCase()));
    }

    // Search — filter user exercises by name match, exclude catalog dupes
    const all = collectUserExercises(workouts);
    return all.filter((ex) => {
      if (catalogNameSet.has(ex.name.toLowerCase())) return false;
      return ex.name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [query, movementFilter, workouts, logsByDate, catalogNameSet]);

  if (!open) return null;

  const chipStyle = (active) => ({
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${colors.border}`,
    background: active ? colors.primaryBg : colors.cardAltBg,
    color: active ? colors.primaryText : colors.text,
    fontWeight: 700,
    fontSize: 12,
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
    background: colors.appBg === "#0d1117" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
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

  return (
    <Modal open={open} title="Add Exercise" onClose={onClose} styles={styles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.textInput}
          placeholder="Search exercises..."
        />

        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
          {MOVEMENT_FILTERS.map((f) => (
            <button
              key={f.key || "all"}
              style={chipStyle(movementFilter === f.key)}
              onClick={() => setMovementFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "45vh", overflowY: "auto" }}>
          {!hasResults && (
            <div style={{ ...styles.emptyText, textAlign: "center", padding: 20 }}>
              No exercises found. Try a different search or add a custom exercise below.
            </div>
          )}

          {/* User exercises section */}
          {showRecentLabel && (
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, padding: "2px 2px 0" }}>Recent</div>
          )}
          {userResults.map((ex) => (
            <button
              key={"user-" + ex.id}
              style={resultBtnStyle}
              onClick={() => onSelectUserExercise(ex)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</span>
                <span style={userLabelStyle}>your exercise</span>
              </div>
            </button>
          ))}

          {/* Divider between sections when both present */}
          {hasUserResults && catalogResults.length > 0 && !q && (
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, padding: "6px 2px 0" }}>Catalog</div>
          )}

          {/* Catalog results */}
          {catalogResults.map((entry) => (
            <button
              key={entry.id}
              style={resultBtnStyle}
              onClick={() => onSelectCatalogExercise(entry)}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.name}</div>
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

        <button
          className="btn-press"
          style={{
            ...styles.secondaryBtn,
            textAlign: "center",
            width: "100%",
            marginTop: 4,
          }}
          onClick={onCustomExercise}
        >
          + Custom Exercise
        </button>
      </div>
    </Modal>
  );
}
