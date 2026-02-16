import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Modal } from "./Modal";
import { EXERCISE_CATALOG } from "../lib/exerciseCatalog";
import { catalogSearch, normalizeQuery, filterCatalog } from "../lib/exerciseCatalogUtils";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { useSwipe } from "../hooks/useSwipe";
import { getSportIconUrl } from "../lib/sportIcons";
import { BodyDiagram, SLUG_TO_MUSCLES } from "./BodyDiagram";
import { MUSCLE_LABELS, UI_MUSCLE_GROUPS, UI_GROUP_CONFIG, muscleToUiGroup } from "../lib/muscleGroups";

const TYPE_CHIPS = [
  { key: "exercise", label: "Exercise" },
  { key: "stretch", label: "Stretch" },
  { key: "sport", label: "Sport" },
  { key: "custom", label: "Custom" },
];

function collectUserExercises(workouts) {
  const seen = new Map();
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      if (!ex?.name) continue;
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
      if (!ex?.name) continue;
      const key = ex.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(ex);
      if (results.length >= limit) return results;
    }
  }
  return results;
}

// Back arrow SVG icon
function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ExerciseCatalogModal({
  open, onClose, onAddExercise, onCustomExercise, onDeleteCustomExercise,
  styles, colors, workouts, logsByDate,
  targetWorkoutId, catalog, backOverrideRef,
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("home"); // "home" | "list"
  const [selectedMuscles, setSelectedMuscles] = useState(new Set());
  const [typeFilter, setTypeFilter] = useState("exercise"); // "exercise" | "stretch" | "sport"
  const [hoveredMuscles, setHoveredMuscles] = useState(new Set());
  const [activeGroups, setActiveGroups] = useState(new Set()); // which UI groups are expanded
  const [detailEntry, setDetailEntry] = useState(null);
  const [slideDir, setSlideDir] = useState(null);

  const src = catalog || EXERCISE_CATALOG;

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setView("home");
      setSelectedMuscles(new Set());
      setTypeFilter("exercise");
      setHoveredMuscles(new Set());
      setActiveGroups(new Set());
      setDetailEntry(null);
      setSlideDir(null);
    }
  }, [open]);

  // Navigation helpers
  const goToList = useCallback(({ muscles } = {}) => {
    if (muscles) setSelectedMuscles(muscles);
    setView("list");
  }, []);

  const goHome = useCallback(() => {
    setView("home");
    setQuery("");
    setSelectedMuscles(new Set());
    setTypeFilter("exercise");
    setHoveredMuscles(new Set());
    setActiveGroups(new Set());
  }, []);

  // Back button override: detail → list → home → close
  useEffect(() => {
    if (!backOverrideRef) return;
    if (open && detailEntry) {
      backOverrideRef.current = () => {
        setDetailEntry(null);
        setSlideDir(null);
        return true;
      };
    } else if (open && view === "list") {
      backOverrideRef.current = () => {
        goHome();
        return true;
      };
    } else {
      backOverrideRef.current = null;
    }
    return () => { backOverrideRef.current = null; };
  }, [open, !!detailEntry, view, backOverrideRef, goHome]);

  // Two-step filter pipeline: structural filters → text search
  const filteredCatalog = useMemo(() => {
    const filters = {};
    if (selectedMuscles.size > 0) filters.muscles = [...selectedMuscles];
    if (typeFilter) filters.typeFilter = typeFilter;
    return filterCatalog(src, filters);
  }, [src, selectedMuscles, typeFilter]);

  const catalogResults = useMemo(() => {
    return catalogSearch(filteredCatalog, query, { limit: Infinity });
  }, [filteredCatalog, query]);

  // Home search: filter full catalog (no muscle/type filters) when typing on home screen
  const homeSearchResults = useMemo(() => {
    if (view !== "home" || !query.trim()) return [];
    return catalogSearch(src, query, { limit: 30 });
  }, [src, query, view]);

  const catalogNameSet = useMemo(
    () => new Set(catalogResults.map((r) => r.name.toLowerCase())),
    [catalogResults]
  );

  const userResults = useMemo(() => {
    if (!targetWorkoutId || view === "home") return [];
    const q = normalizeQuery(query);
    if (selectedMuscles.size > 0) return [];

    if (!q) {
      return getRecentUserExercises(workouts, logsByDate, 5)
        .filter((ex) => !catalogNameSet.has(ex.name.toLowerCase()));
    }

    const all = collectUserExercises(workouts);
    return all.filter((ex) => {
      if (catalogNameSet.has(ex.name.toLowerCase())) return false;
      return ex.name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [query, selectedMuscles, workouts, logsByDate, catalogNameSet, targetWorkoutId, view]);

  // Swipe between exercises in detail view
  const navigateDetail = useCallback((dir) => {
    if (!detailEntry) return;
    const list = view === "home" ? homeSearchResults : catalogResults;
    const idx = list.findIndex((e) => e.id === detailEntry.id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next >= 0 && next < list.length) {
      setSlideDir(dir > 0 ? "left" : "right");
      setDetailEntry(list[next]);
    }
  }, [detailEntry, catalogResults, homeSearchResults, view]);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => navigateDetail(1),
    onSwipeRight: () => navigateDetail(-1),
    thresholdPx: 50,
  });

  // Exercise count for the browse button (filtered by hovered muscles)
  const browseCount = useMemo(() => {
    if (hoveredMuscles.size === 0) return src.length;
    return filterCatalog(src, { muscles: [...hoveredMuscles] }).length;
  }, [src, hoveredMuscles]);

  // Collect sub-muscles for all active groups that have >1 muscle
  const subMuscles = useMemo(() => {
    const muscles = [];
    for (const g of activeGroups) {
      const cfg = UI_GROUP_CONFIG[g];
      if (cfg.muscles.length > 1) muscles.push(...cfg.muscles);
    }
    return muscles;
  }, [activeGroups]);

  if (!open) return null;

  // --- Shared styles ---
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

  const invertFilter = colors.appBg.startsWith("#0") || colors.appBg.startsWith("#1") ? "invert(1)" : "none";

  // --- List title ---
  const listTitle = selectedMuscles.size > 0
    ? [...selectedMuscles].map((m) => MUSCLE_LABELS[m]).filter(Boolean).join(" + ")
    : "All Exercises";

  const isAddMode = !!targetWorkoutId;
  const modalTitle = isAddMode ? "Add Exercise" : "Exercise Catalog";

  // Footer
  const footer = onCustomExercise ? (
    <button
      className="btn-press"
      style={{ ...styles.secondaryBtn, textAlign: "center", width: "100%" }}
      onClick={onCustomExercise}
    >
      + Custom Exercise <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none" style={{ verticalAlign: -1, marginLeft: 2 }}><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" /><path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" /></svg>
    </button>
  ) : (
    <div style={{ fontSize: 11, opacity: 0.4, textAlign: "center", padding: "2px 0" }}>
      {src.length} exercises available
    </div>
  );

  // --- Render a single exercise result button ---
  const renderExerciseBtn = (entry) => {
    const sportIcon = !entry.gifUrl ? getSportIconUrl(entry.name) : null;
    return (
      <button
        key={entry.id}
        style={resultBtnStyle}
        onClick={() => setDetailEntry(entry)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {sportIcon && (
            <img
              src={sportIcon}
              alt=""
              style={{
                width: 28, height: 28, objectFit: "contain", flexShrink: 0,
                filter: invertFilter,
                opacity: 0.85,
              }}
            />
          )}
          <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.name}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(entry.muscles?.primary || []).map((m) => (
            <span key={m} style={muscleChipStyle}>
              {m.replace(/_/g, " ").toLowerCase()}
            </span>
          ))}
          {(entry.equipment || []).filter((e) => e !== "bodyweight").map((e) => (
            <span key={e} style={equipChipStyle}>{e}</span>
          ))}
        </div>
      </button>
    );
  };

  // --- Result list rendering (for list view) ---
  const renderResultList = () => {
    const hasUserResults = userResults.length > 0;
    const hasResults = hasUserResults || catalogResults.length > 0;
    const q = normalizeQuery(query);
    const showRecentLabel = hasUserResults && !q;

    return (
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

        {catalogResults.map(renderExerciseBtn)}
      </div>
    );
  };

  // --- HOME VIEW ---
  const homeHasQuery = query.trim().length > 0;

  const renderHomeView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
      {/* Search bar */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        style={styles.textInput}
        placeholder="Search exercises..."
        enterKeyHint="search"
        aria-label="Search exercises"
      />

      {homeHasQuery ? (
        /* Inline search results */
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, overflowY: "auto", minHeight: 0 }}>
          {homeSearchResults.length === 0 && (
            <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
              No exercises found.
            </div>
          )}
          {homeSearchResults.map(renderExerciseBtn)}
        </div>
      ) : (
        /* Browse by muscle group */
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Body diagram — tap a muscle to toggle its group */}
            <BodyDiagram
              highlightedMuscles={[...hoveredMuscles]}
              secondaryMuscles={[]}
              colors={colors}
              onBodyPartPress={(part) => {
                const muscles = SLUG_TO_MUSCLES[part.slug];
                if (!muscles?.length) return;
                const group = muscleToUiGroup[muscles[0]];
                if (!group) return;
                const cfg = UI_GROUP_CONFIG[group];
                setActiveGroups((prev) => {
                  const next = new Set(prev);
                  if (next.has(group)) {
                    // Deselect the group
                    next.delete(group);
                  } else {
                    next.add(group);
                  }
                  return next;
                });
                setHoveredMuscles((prev) => {
                  const next = new Set(prev);
                  const allSelected = cfg.muscles.every((m) => next.has(m));
                  for (const m of cfg.muscles) {
                    if (allSelected) next.delete(m); else next.add(m);
                  }
                  return next;
                });
              }}
            />

            {/* High-level muscle group chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {UI_MUSCLE_GROUPS.map((group) => {
                const cfg = UI_GROUP_CONFIG[group];
                const groupHasAny = cfg.muscles.some((m) => hoveredMuscles.has(m));
                return (
                  <button
                    key={group}
                    className="btn-press"
                    style={chipStyle(groupHasAny)}
                    aria-pressed={groupHasAny}
                    onClick={() => {
                      if (groupHasAny) {
                        // Deselect all muscles in group
                        setHoveredMuscles((prev) => {
                          const next = new Set(prev);
                          for (const m of cfg.muscles) next.delete(m);
                          return next;
                        });
                        setActiveGroups((prev) => {
                          const next = new Set(prev);
                          next.delete(group);
                          return next;
                        });
                      } else {
                        // Select all muscles in group
                        setHoveredMuscles((prev) => {
                          const next = new Set(prev);
                          for (const m of cfg.muscles) next.add(m);
                          return next;
                        });
                        if (cfg.muscles.length > 1) {
                          setActiveGroups((prev) => {
                            const next = new Set(prev);
                            next.add(group);
                            return next;
                          });
                        }
                      }
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-muscle fine-tuning — shown for all active groups with >1 muscle */}
            {subMuscles.length > 0 && (
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center",
                padding: "8px 10px", borderRadius: 12,
                background: colors.subtleBg,
                border: `1px solid ${colors.border}`,
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.4, width: "100%", textAlign: "center", marginBottom: 2 }}>
                  Fine-tune
                </span>
                {subMuscles.map((muscle) => (
                  <button
                    key={muscle}
                    className="btn-press"
                    style={{
                      ...chipStyle(hoveredMuscles.has(muscle)),
                      fontSize: 11,
                      padding: "4px 10px",
                    }}
                    aria-pressed={hoveredMuscles.has(muscle)}
                    onClick={() => {
                      const group = muscleToUiGroup[muscle];
                      setHoveredMuscles((prev) => {
                        const next = new Set(prev);
                        if (next.has(muscle)) next.delete(muscle); else next.add(muscle);
                        // If no muscles left from this group, collapse it
                        if (group) {
                          const cfg = UI_GROUP_CONFIG[group];
                          if (!cfg.muscles.some((m) => next.has(m))) {
                            setActiveGroups((ag) => {
                              const nag = new Set(ag);
                              nag.delete(group);
                              return nag;
                            });
                          }
                        }
                        return next;
                      });
                    }}
                  >
                    {MUSCLE_LABELS[muscle]}
                  </button>
                ))}
              </div>
            )}

            {/* Browse button */}
            <button
              className="btn-press"
              style={{
                ...styles.primaryBtn,
                textAlign: "center",
                width: "100%",
              }}
              onClick={() => {
                if (hoveredMuscles.size > 0) {
                  goToList({ muscles: new Set(hoveredMuscles) });
                } else {
                  setSelectedMuscles(new Set());
                  setView("list");
                }
              }}
            >
              {hoveredMuscles.size > 0
                ? `Browse Exercises (${browseCount})`
                : `Browse All Exercises (${browseCount})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // --- LIST VIEW ---
  const renderListView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minHeight: 0 }}>
      {/* Search bar */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
        style={styles.textInput}
        placeholder="Search exercises..."
        enterKeyHint="search"
        aria-label="Search exercises"
      />

      {/* Row 1: Type filter chips (single-select) */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {TYPE_CHIPS.map((t) => (
          <button
            key={t.key}
            style={chipStyle(typeFilter === t.key)}
            aria-pressed={typeFilter === t.key}
            onClick={() => setTypeFilter(typeFilter === t.key ? null : t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {renderResultList()}
    </div>
  );

  // --- List view header with back arrow ---
  const listHeaderContent = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={goHome}
        style={{
          background: "transparent",
          border: "none",
          color: colors.text,
          padding: 4,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Back"
      >
        <BackArrow />
      </button>
      <div style={styles.modalTitle}>{listTitle}</div>
    </div>
  );

  // Detail view: resolve position from the active result set
  const activeResults = view === "home" ? homeSearchResults : catalogResults;

  return (
    <>
      <Modal
        open={open && !detailEntry}
        title={view === "home" ? modalTitle : undefined}
        headerContent={view === "list" ? listHeaderContent : undefined}
        onClose={onClose}
        styles={styles}
        footer={footer}
      >
        {view === "home" ? renderHomeView() : renderListView()}
      </Modal>

      <ExerciseDetailModal
        open={!!detailEntry}
        entry={detailEntry}
        onBack={() => { setSlideDir(null); setDetailEntry(null); }}
        onClose={() => { setSlideDir(null); setDetailEntry(null); onClose(); }}
        onAddExercise={onAddExercise ? (entry, workoutId) => onAddExercise(entry, workoutId) : undefined}
        onDeleteCustomExercise={onDeleteCustomExercise ? (entry) => {
          onDeleteCustomExercise(entry);
          setSlideDir(null);
          setDetailEntry(null);
        } : undefined}
        workouts={workouts}
        styles={styles}
        colors={colors}
        targetWorkoutId={targetWorkoutId}
        swipeHandlers={swipeHandlers}
        slideDir={slideDir}
        position={detailEntry ? activeResults.findIndex((e) => e.id === detailEntry.id) + 1 : 0}
        total={activeResults.length}
      />
    </>
  );
}
