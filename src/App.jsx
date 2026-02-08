import React, { useEffect, useMemo, useState, useRef, useReducer, useCallback } from "react";
import { fetchCloudState, saveCloudState, createDebouncedSaver } from "./lib/supabaseSync";
import { supabase } from "./lib/supabase";
import { fetchCoachInsights } from "./lib/coachApi";
import { classifyActivity, buildNormalizedAnalysis, detectImbalancesNormalized } from "./lib/coachNormalize";
import { avatarInitial } from "./lib/userIdentity";

// Extracted lib modules
import { REP_UNITS, getUnit } from "./lib/constants";
import {
  yyyyMmDd, addDays, formatDateLabel, monthKeyFromDate, daysInMonth,
  weekdaySunday0, shiftMonth, formatMonthLabel,
  startOfWeekSunday, startOfMonth, startOfYear, inRangeInclusive, isValidDateKey,
} from "./lib/dateUtils";
import { uid, loadState, persistState, makeDefaultState, safeParse } from "./lib/stateUtils";
import {
  validateExerciseName, validateWorkoutName,
  toNumberOrNull, formatMaxWeight,
} from "./lib/validation";
import { computeCoachSignature, COACH_COOLDOWN_MS, COACH_CACHE_TTL_MS, COACH_CHANGE_THRESHOLD } from "./lib/coachSignature";
import { initialModalState, modalReducer } from "./lib/modalReducer";

// Extracted hooks
import { useSwipe } from "./hooks/useSwipe";

// Extracted components
import { Modal, ConfirmModal, InputModal } from "./components/Modal";
import { PillTabs } from "./components/PillTabs";
import { CategoryAutocomplete } from "./components/CategoryAutocomplete";
import { ProfileModal, ChangeUsernameModal } from "./components/ProfileModal";
import { CoachInsightsCard, CoachNudge, AddSuggestedExerciseModal } from "./components/CoachInsights";
import { CatalogBrowseModal } from "./components/CatalogBrowseModal";
import { GenerateWizardModal } from "./components/GenerateWizardModal";
import { GenerateTodayModal } from "./components/GenerateTodayModal";

// Exercise catalog
import { EXERCISE_CATALOG, exerciseFitsEquipment } from "./lib/exerciseCatalog";
import { buildCatalogMap } from "./lib/exerciseCatalogUtils";
import { generateProgram, generateTodayWorkout, parseScheme } from "./lib/workoutGenerator";
import { generateTodayAI } from "./lib/workoutGeneratorApi";
import { selectGreeting, selectAcknowledgment } from "./lib/greetings";

// Extracted styles
import { getColors, getStyles } from "./styles/theme";

// ============================================================================
// CSS ANIMATIONS (injected once)
// ============================================================================
let _animInjected = false;
function ensureAnimations() {
  if (_animInjected) return;
  _animInjected = true;
  const s = document.createElement("style");
  s.textContent = `
@keyframes tabFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes toastSlideUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
`;
  document.head.appendChild(s);
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App({ session, onLogout, showGenerateWizard, onGenerateWizardShown }) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  ensureAnimations();
  const [state, setState] = useState(() => loadState());
  const [dataReady, setDataReady] = useState(false);
  const cloudSaver = useRef(null);
  const [tab, setTab] = useState(() => sessionStorage.getItem("wt_tab") || "train");
  const [summaryMode, setSummaryMode] = useState("wtd");
  const [dateKey, setDateKey] = useState(() => yyyyMmDd(new Date()));
  const [manageWorkoutId, setManageWorkoutId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("wt_theme") || "dark");
  const [equipment, setEquipment] = useState(() => localStorage.getItem("wt_equipment") || "gym");
  const [reorderWorkouts, setReorderWorkouts] = useState(false);
  const [reorderExercises, setReorderExercises] = useState(false);
  const [workoutMenuId, setWorkoutMenuId] = useState(null);
  const [exerciseMenuId, setExerciseMenuId] = useState(null);

  const [collapsedToday, setCollapsedToday] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_today"))); } catch { return new Set(); }
  });
  const [collapsedSummary, setCollapsedSummary] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_summary"))); } catch { return new Set(); }
  });
  const [autoCollapseEmpty, setAutoCollapseEmpty] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wt_auto_collapse_empty")) === true; } catch { return false; }
  });
  const manualExpandRef = useRef(new Set());

  // Acknowledgment toast
  const [toast, setToast] = useState(null); // { message, coachLine }
  const toastTimerRef = useRef(null);

  // AI Coach state
  const [profile, setProfile] = useState(null);
  const [coachInsights, setCoachInsights] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(null);
  const coachReqIdRef = useRef(0);
  const coachCacheRef = useRef(new Map());
  const coachLastSignatureRef = useRef(null);
  const coachLastFetchRef = useRef(0);

  // Swipe navigation between tabs
  const touchRef = useRef({ startX: 0, startY: 0, swiping: false, locked: false });
  const bodyRef = useRef(null);
  const TAB_ORDER = ["train", "progress", "plan"];

  const handleTouchStart = useCallback((e) => {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.swiping = false;
    touchRef.current.locked = false;
    try { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); } catch {}
    if (bodyRef.current) {
      bodyRef.current.style.transition = "none";
      bodyRef.current.style.willChange = "transform, opacity";
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;

    if (touchRef.current.locked) return;

    if (!touchRef.current.swiping && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      if (Math.abs(dx) > Math.abs(dy)) {
        touchRef.current.swiping = true;
      } else {
        touchRef.current.locked = true;
        return;
      }
    }

    if (touchRef.current.swiping && bodyRef.current) {
      const idx = TAB_ORDER.indexOf(tab);
      let clamped = dx;
      if (dx > 0 && idx === 0) clamped = dx * 0.2;
      if (dx < 0 && idx === TAB_ORDER.length - 1) clamped = dx * 0.2;

      bodyRef.current.style.transform = `translateX(${clamped}px)`;
      bodyRef.current.style.opacity = `${1 - Math.min(Math.abs(clamped) / 600, 0.3)}`;
      e.preventDefault();
    }
  }, [tab]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchRef.current.swiping || !bodyRef.current) {
      touchRef.current.swiping = false;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const idx = TAB_ORDER.indexOf(tab);
    const threshold = 60;

    if (Math.abs(dx) > threshold) {
      const goNext = dx < 0 && idx < TAB_ORDER.length - 1;
      const goPrev = dx > 0 && idx > 0;

      if (goNext || goPrev) {
        const direction = goNext ? -1 : 1;
        bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        bodyRef.current.style.transform = `translateX(${direction * window.innerWidth}px)`;
        bodyRef.current.style.opacity = "0.3";

        setTimeout(() => {
          setTab(goNext ? TAB_ORDER[idx + 1] : TAB_ORDER[idx - 1]);
          if (bodyRef.current) {
            bodyRef.current.style.transition = "none";
            bodyRef.current.style.transform = `translateX(${-direction * window.innerWidth * 0.3}px)`;
            bodyRef.current.style.opacity = "0.3";
            bodyRef.current.offsetHeight;
            bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
            bodyRef.current.style.transform = "translateX(0)";
            bodyRef.current.style.opacity = "1";
          }
        }, 200);
      } else {
        bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        bodyRef.current.style.transform = "translateX(0)";
        bodyRef.current.style.opacity = "1";
      }
    } else {
      bodyRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      bodyRef.current.style.transform = "translateX(0)";
      bodyRef.current.style.opacity = "1";
    }

    touchRef.current.swiping = false;
    setTimeout(() => { if (bodyRef.current) bodyRef.current.style.willChange = "auto"; }, 450);
  }, [tab]);

  function toggleCollapse(setter, id) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function collapseAll(setter, ids) {
    setter(new Set(ids));
  }

  function expandAll(setter) {
    setter(new Set());
  }

  const [modals, dispatchModal] = useReducer(modalReducer, {
    ...initialModalState,
    datePicker: {
      ...initialModalState.datePicker,
      monthCursor: monthKeyFromDate(dateKey),
    },
  });

  // Auto-open generate wizard after onboarding
  useEffect(() => {
    if (showGenerateWizard) {
      setTab("plan");
      dispatchModal({ type: "OPEN_GENERATE_WIZARD", payload: { equipment } });
      onGenerateWizardShown?.();
    }
  }, [showGenerateWizard]);

  // ---------------------------------------------------------------------------
  // CLOUD SYNC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    cloudSaver.current = createDebouncedSaver(2000);

    let cancelled = false;

    async function init() {
      try {
        const cloudState = await fetchCloudState(session.user.id);

        if (cancelled) return;

        if (cloudState && typeof cloudState === "object" && Object.keys(cloudState).length > 0) {
          setState(cloudState);
          persistState(cloudState);
        } else {
          const localState = loadState();
          await saveCloudState(session.user.id, localState);
        }
      } catch (err) {
        console.error("Cloud sync init failed, using localStorage:", err);
      }

      if (!cancelled) setDataReady(true);
    }

    init();

    return () => {
      cancelled = true;
      cloudSaver.current?.cancel();
    };
  }, [session.user.id]);

  // Fetch user profile
  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, display_name, username_last_changed_at, username_change_count, birthdate, gender, age, weight_lbs, goal, about, sports")
          .eq("id", session.user.id)
          .single();
        if (!cancelled && data && !error) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [session.user.id]);

  const todayKey = yyyyMmDd(new Date());

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const colors = useMemo(() => getColors(theme), [theme]);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const workouts = state.program.workouts;

  const categoryOptions = useMemo(() => {
    const defaults = ["Workout", "Push", "Pull", "Legs", "Upper", "Lower", "Cardio", "Stretch", "Abs"];
    const existing = workouts.map((w) => (w.category || "Workout").trim());
    const seen = new Set();
    const result = [];
    for (const c of [...existing, ...defaults]) {
      const key = c.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }
    return result;
  }, [workouts]);

  const workoutById = useMemo(() => {
    const m = new Map();
    for (const w of workouts) m.set(w.id, w);
    return m;
  }, [workouts]);

  const catalogMap = useMemo(() => buildCatalogMap(EXERCISE_CATALOG), []);

  const logsForDate = state.logsByDate[dateKey] ?? {};

  const summaryRange = useMemo(() => {
    if (summaryMode === "wtd") {
      return { start: startOfWeekSunday(dateKey), end: dateKey, label: "WTD" };
    }
    if (summaryMode === "mtd") {
      return { start: startOfMonth(dateKey), end: dateKey, label: "MTD" };
    }
    return { start: startOfYear(dateKey), end: dateKey, label: "YTD" };
  }, [dateKey, summaryMode]);

  const summaryDaysLogged = useMemo(() => {
    let logged = 0;
    let total = 0;
    let d = summaryRange.start;
    while (d <= summaryRange.end) {
      total++;
      const dayLogs = state.logsByDate[d];
      if (dayLogs && typeof dayLogs === "object" && Object.keys(dayLogs).length > 0) {
        logged++;
      }
      d = addDays(d, 1);
    }
    return { logged, total };
  }, [state.logsByDate, summaryRange]);

  const loggedDaysInMonth = useMemo(() => {
    const set = new Set();
    const prefix = modals.datePicker.monthCursor + "-";

    for (const dk of Object.keys(state.logsByDate || {})) {
      if (!isValidDateKey(dk)) continue;
      if (!dk.startsWith(prefix)) continue;

      const dayLogs = state.logsByDate[dk];
      if (dayLogs && typeof dayLogs === "object" && Object.keys(dayLogs).length > 0) {
        set.add(dk);
      }
    }
    return set;
  }, [state.logsByDate, modals.datePicker.monthCursor]);

  // AI Coach signature
  const { signature: coachSignature, totalReps: coachTotalReps } = useMemo(
    () => computeCoachSignature(state, summaryRange),
    [state.logsByDate, state.program.workouts, summaryRange]
  );

  // AI Coach — load from cache, fetch when needed
  useEffect(() => {
    if (!dataReady || !profile) return;

    const userId = session.user.id;
    const cacheKey = `wt_coach_v2:${userId}:${summaryMode}:${dateKey}`;

    // 1. Try localStorage persisted cache
    if (coachInsights.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem(cacheKey));
        if (stored && stored.insights?.length > 0 && Date.now() - stored.createdAt < COACH_CACHE_TTL_MS) {
          setCoachInsights(stored.insights);
          coachLastSignatureRef.current = stored.signature;
          coachLastFetchRef.current = stored.createdAt;
          if (stored.signature === coachSignature) return;
        }
      } catch {}
    }

    // 2. Check in-memory cache
    const memCached = coachCacheRef.current.get(coachSignature);
    if (memCached && Date.now() - memCached.createdAt < COACH_CACHE_TTL_MS) {
      setCoachInsights(memCached.insights);
      setCoachError(null);
      return;
    }

    // 3. Cooldown check
    const timeSinceLastFetch = Date.now() - coachLastFetchRef.current;
    if (timeSinceLastFetch < COACH_COOLDOWN_MS && coachInsights.length > 0) {
      const prevSig = coachLastSignatureRef.current;
      if (prevSig) {
        const prevReps = parseInt(prevSig.split("|")[4]) || 0;
        const change = prevReps > 0 ? Math.abs(coachTotalReps - prevReps) / prevReps : 1;
        if (change < COACH_CHANGE_THRESHOLD) return;
      }
    }

    // 4. Fetch from AI
    let cancelled = false;
    const reqId = ++coachReqIdRef.current;

    setCoachLoading(true);

    const userExNames = workouts.flatMap((w) => (w.exercises || []).map((e) => e.name));
    const filteredCatalog = EXERCISE_CATALOG.filter((e) => exerciseFitsEquipment(e, equipment));
    const coachOpts = { catalog: filteredCatalog, userExerciseNames: userExNames };

    fetchCoachInsights({ profile, state, dateRange: summaryRange, catalog: filteredCatalog, equipment })
      .then(({ insights }) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        setCoachInsights(insights);
        setCoachError(null);
        coachLastSignatureRef.current = coachSignature;
        coachLastFetchRef.current = Date.now();
        coachCacheRef.current.set(coachSignature, { insights, createdAt: Date.now() });
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            insights, signature: coachSignature, createdAt: Date.now(),
          }));
        } catch {}
      })
      .catch((err) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        console.error("AI Coach error:", err);
        if (coachInsights.length === 0) {
          const analysis = buildNormalizedAnalysis(state.program.workouts, state.logsByDate, summaryRange, catalogMap);
          setCoachInsights(detectImbalancesNormalized(analysis, coachOpts));
        }
        setCoachError("AI coach unavailable \u2014 showing basic analysis");
      })
      .finally(() => {
        if (!cancelled && coachReqIdRef.current === reqId) {
          setCoachLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [dataReady, profile, coachSignature]);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    dispatchModal({
      type: "UPDATE_MONTH_CURSOR",
      payload: monthKeyFromDate(dateKey),
    });
  }, [dateKey]);

  useEffect(() => {
    localStorage.setItem("wt_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("wt_equipment", equipment);
  }, [equipment]);

  useEffect(() => {
    sessionStorage.setItem("wt_tab", tab);
  }, [tab]);

  useEffect(() => {
    localStorage.setItem("wt_collapsed_today", JSON.stringify([...collapsedToday]));
  }, [collapsedToday]);

  useEffect(() => {
    localStorage.setItem("wt_collapsed_summary", JSON.stringify([...collapsedSummary]));
  }, [collapsedSummary]);

  useEffect(() => {
    localStorage.setItem("wt_auto_collapse_empty", JSON.stringify(autoCollapseEmpty));
  }, [autoCollapseEmpty]);

  useEffect(() => {
    manualExpandRef.current.clear();
    if (!autoCollapseEmpty) return;
    const dayLogs = state.logsByDate[dateKey] ?? {};
    const emptyIds = workouts
      .filter((w) => !w.exercises.some((ex) => dayLogs[ex.id]?.sets?.length > 0))
      .map((w) => w.id);
    const filledIds = workouts
      .filter((w) => w.exercises.some((ex) => dayLogs[ex.id]?.sets?.length > 0))
      .map((w) => w.id);
    setCollapsedToday((prev) => {
      const next = new Set(prev);
      for (const id of emptyIds) {
        if (!manualExpandRef.current.has(id)) next.add(id);
      }
      for (const id of filledIds) next.delete(id);
      return next;
    });
  }, [dateKey, autoCollapseEmpty]);

  useEffect(() => {
    setReorderExercises(false);
    setWorkoutMenuId(null);
    setExerciseMenuId(null);
  }, [manageWorkoutId]);

  // Persist state changes
  useEffect(() => {
    const stateWithMeta = {
      ...state,
      meta: { ...(state.meta ?? {}), updatedAt: Date.now() },
    };

    const result = persistState(stateWithMeta);

    if (!result.success) {
      console.error(result.error);
    }

    if (dataReady) {
      cloudSaver.current?.trigger(session.user.id, stateWithMeta);
    }
  }, [state, dataReady, session.user.id]);

  // ---------------------------------------------------------------------------
  // BACK-BUTTON CLOSES MODALS (Android / PWA)
  // ---------------------------------------------------------------------------

  const anyModalOpen = modals.log.isOpen || modals.confirm.isOpen || modals.input.isOpen ||
    modals.datePicker.isOpen || modals.addWorkout.isOpen || modals.addExercise.isOpen ||
    modals.addSuggestion.isOpen || modals.profile.isOpen || modals.changeUsername.isOpen ||
    modals.editUnit.isOpen || modals.catalogBrowse.isOpen ||
    modals.generateWizard.isOpen || modals.generateToday.isOpen;

  const modalHistoryRef = useRef(false);
  const closingViaCodeRef = useRef(false);

  useEffect(() => {
    if (anyModalOpen && !modalHistoryRef.current) {
      // Modal just opened — push history entry so back button pops it
      history.pushState({ modal: true }, "");
      modalHistoryRef.current = true;
    } else if (!anyModalOpen && modalHistoryRef.current) {
      // Modal closed programmatically (X button / save) — pop the history entry
      modalHistoryRef.current = false;
      closingViaCodeRef.current = true;
      history.back();
    }
  }, [anyModalOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (closingViaCodeRef.current) {
        // Ignore the popstate triggered by our own history.back()
        closingViaCodeRef.current = false;
        return;
      }
      if (modalHistoryRef.current) {
        modalHistoryRef.current = false;
        dispatchModal({ type: "CLOSE_ALL" });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  function updateState(updater) {
    setState((prev) => {
      const next = updater(structuredClone(prev));
      next.meta = { ...(next.meta ?? {}), updatedAt: Date.now() };
      return next;
    });
  }

  function findMostRecentLogBefore(exerciseId, beforeDateKey) {
    const keys = Object.keys(state.logsByDate).filter(
      (k) => isValidDateKey(k) && k < beforeDateKey
    );
    keys.sort((a, b) => (a > b ? -1 : 1));
    for (const k of keys) {
      const exLog = state.logsByDate[k]?.[exerciseId];
      if (exLog && Array.isArray(exLog.sets)) return exLog;
    }
    return null;
  }

  function computeExerciseSummary(exerciseId, startKey, endKey, unit) {
    let totalReps = 0;
    let maxNum = null;
    let hasBW = false;

    for (const dk of Object.keys(state.logsByDate)) {
      if (!isValidDateKey(dk)) continue;
      if (!inRangeInclusive(dk, startKey, endKey)) continue;

      const exLog = state.logsByDate[dk]?.[exerciseId];
      if (!exLog || !Array.isArray(exLog.sets)) continue;

      for (const set of exLog.sets) {
        const reps = Number(set.reps ?? 0);
        if (Number.isFinite(reps)) totalReps += reps;

        const w = String(set.weight ?? "").trim();
        if (w.toUpperCase() === "BW") {
          hasBW = true;
        } else {
          const n = toNumberOrNull(w);
          if (n != null) maxNum = maxNum == null ? n : Math.max(maxNum, n);
        }
      }
    }

    const displayTotal = unit?.allowDecimal
      ? parseFloat(totalReps.toFixed(2))
      : Math.floor(totalReps);

    return { totalReps: displayTotal, maxWeight: formatMaxWeight(maxNum, hasBW) };
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const openLog = useCallback(
    (workoutId, exercise) => {
      const exerciseId = exercise.id;
      const existing = state.logsByDate[dateKey]?.[exerciseId] ?? null;
      const prior = existing ?? findMostRecentLogBefore(exerciseId, dateKey);

      let sets;
      if (prior?.sets?.length) {
        sets = prior.sets.map((s) => ({
          reps: Number(s.reps ?? 0) || 0,
          weight: typeof s.weight === "string" ? s.weight : "",
        }));
      } else {
        sets = [{ reps: 0, weight: "" }];
      }

      const normalizedSets = sets.map((s) => {
        const isBW = String(s.weight).toUpperCase() === "BW";
        return { reps: s.reps, weight: isBW ? "BW" : String(s.weight ?? "").trim() };
      });

      const workout = workoutById.get(workoutId);
      dispatchModal({
        type: "OPEN_LOG",
        payload: {
          context: {
            workoutId,
            exerciseId,
            exerciseName: exercise.name,
            unit: exercise.unit || "reps",
            customUnitAbbr: exercise.customUnitAbbr || "",
            customUnitAllowDecimal: exercise.customUnitAllowDecimal ?? false,
            scheme: workout?.scheme || null,
          },
          sets: normalizedSets,
          notes: prior?.notes ?? "",
          mood: existing?.mood ?? null,
        },
      });
    },
    [state.logsByDate, dateKey]
  );

  const saveLog = useCallback(() => {
    if (!modals.log.context) return;

    const logCtx = modals.log.context;

    updateState((st) => {
      let logExercise = null;
      for (const wk of st.program.workouts) {
        const found = wk.exercises.find((e) => e.id === logCtx.exerciseId);
        if (found) { logExercise = found; break; }
      }
      const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");

      const cleanedSets = (Array.isArray(modals.log.sets) ? modals.log.sets : [])
        .map((s) => {
          const reps = Number(s.reps ?? 0);
          const repsClean = Number.isFinite(reps) && reps > 0
            ? (logUnit.allowDecimal ? parseFloat(reps.toFixed(2)) : Math.floor(reps))
            : 0;
          const w = String(s.weight ?? "").trim();
          const weight = w.toUpperCase() === "BW" ? "BW" : w.replace(/[^\d.]/g, "");
          return { reps: repsClean, weight: weight || "" };
        })
        .filter((s) => s.reps > 0);

      st.logsByDate[dateKey] = st.logsByDate[dateKey] ?? {};
      const logEntry = {
        sets: cleanedSets.length ? cleanedSets : [{ reps: 0, weight: "BW" }],
        notes: modals.log.notes ?? "",
      };
      if (modals.log.mood != null) logEntry.mood = modals.log.mood;
      st.logsByDate[dateKey][logCtx.exerciseId] = logEntry;

      return st;
    });

    // Show acknowledgment toast
    const ack = selectAcknowledgment(modals.log.mood, dateKey, state.logsByDate);
    setToast(ack);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);

    dispatchModal({ type: "CLOSE_LOG" });
  }, [modals.log, dateKey]);

  const deleteLogForExercise = useCallback(
    (exerciseId) => {
      updateState((st) => {
        if (!st.logsByDate[dateKey]) return st;
        delete st.logsByDate[dateKey][exerciseId];
        return st;
      });
    },
    [dateKey]
  );

  function addWorkout() {
    dispatchModal({ type: "OPEN_ADD_WORKOUT" });
  }

  const renameWorkout = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Rename workout",
          label: "Workout name",
          placeholder: "e.g. Push Day",
          initialValue: w.name,
          onConfirm: (val) => {
            const validation = validateWorkoutName(val, workouts.filter((x) => x.id !== workoutId));
            if (!validation.valid) {
              alert("\u26a0\ufe0f " + validation.error);
              return;
            }

            const name = val.trim();
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (ww) ww.name = name;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById, workouts]
  );

  const setWorkoutCategory = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Set category",
          label: "Workout category",
          placeholder: "e.g. Push / Pull / Legs / Stretch",
          initialValue: (w.category || "Workout").trim(),
          onConfirm: (val) => {
            const next = (val || "").trim() || "Workout";
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (ww) ww.category = next;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById]
  );

  const deleteWorkout = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;

      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Delete workout?",
          message: `Delete ${w.name}? This will NOT delete past logs.`,
          confirmText: "Delete",
          onConfirm: () => {
            updateState((st) => {
              st.program.workouts = st.program.workouts.filter((x) => x.id !== workoutId);
              return st;
            });
            if (manageWorkoutId === workoutId) setManageWorkoutId(null);
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
    },
    [workoutById, manageWorkoutId]
  );

  const addExercise = useCallback(
    (workoutId) => {
      const workout = workoutById.get(workoutId);
      if (!workout) return;

      dispatchModal({
        type: "OPEN_CATALOG_BROWSE",
        payload: { workoutId },
      });
    },
    [workoutById]
  );

  const renameExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_INPUT",
        payload: {
          title: "Rename exercise",
          label: "Exercise name",
          placeholder: "e.g. Bench Press",
          initialValue: ex.name,
          onConfirm: (val) => {
            const otherExercises = w.exercises.filter((e) => e.id !== exerciseId);
            const validation = validateExerciseName(val, otherExercises);
            if (!validation.valid) {
              alert("\u26a0\ufe0f " + validation.error);
              return;
            }

            const name = val.trim();
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              const ee = ww?.exercises?.find((e) => e.id === exerciseId);
              if (ee) ee.name = name;
              return st;
            });
            dispatchModal({ type: "CLOSE_INPUT" });
          },
        },
      });
    },
    [workoutById]
  );

  const deleteExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Delete exercise?",
          message: `Delete "${ex.name}"? This will NOT delete past logs.`,
          confirmText: "Delete",
          onConfirm: () => {
            updateState((st) => {
              const ww = st.program.workouts.find((x) => x.id === workoutId);
              if (!ww) return st;
              ww.exercises = ww.exercises.filter((e) => e.id !== exerciseId);
              return st;
            });
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
    },
    [workoutById]
  );

  const editUnitExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;

      dispatchModal({
        type: "OPEN_EDIT_UNIT",
        payload: {
          workoutId,
          exerciseId,
          unit: ex.unit || "reps",
          customUnitAbbr: ex.customUnitAbbr || "",
          customUnitAllowDecimal: ex.customUnitAllowDecimal ?? false,
        },
      });
    },
    [workoutById]
  );

  const saveEditUnit = useCallback(() => {
    const { workoutId, exerciseId, unit, customUnitAbbr, customUnitAllowDecimal } = modals.editUnit;

    if (unit === "custom" && !customUnitAbbr?.trim()) {
      alert("\u26a0\ufe0f Please enter a custom unit abbreviation");
      return;
    }

    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return st;
      ex.unit = unit;
      if (unit === "custom") {
        ex.customUnitAbbr = customUnitAbbr.trim();
        ex.customUnitAllowDecimal = customUnitAllowDecimal ?? false;
      } else {
        delete ex.customUnitAbbr;
        delete ex.customUnitAllowDecimal;
      }
      return st;
    });

    dispatchModal({ type: "CLOSE_EDIT_UNIT" });
  }, [modals.editUnit]);

  function moveWorkout(workoutId, direction) {
    updateState((st) => {
      const arr = st.program.workouts;
      const idx = arr.findIndex((w) => w.id === workoutId);
      if (idx < 0) return st;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return st;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return st;
    });
  }

  function moveExercise(workoutId, exerciseId, direction) {
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (!w) return st;
      const arr = w.exercises;
      const idx = arr.findIndex((e) => e.id === exerciseId);
      if (idx < 0) return st;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return st;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return st;
    });
  }

  const exportJson = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workout-tracker-export-${yyyyMmDd(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export data: " + error.message);
    }
  }, [state]);

  async function importJsonFromFile(file) {
    try {
      const text = await file.text();
      const incoming = safeParse(text, null);

      if (!incoming || typeof incoming !== "object") {
        alert("Invalid JSON file.");
        return;
      }

      const program = incoming.program && typeof incoming.program === "object" ? incoming.program : null;
      const logsByDate = incoming.logsByDate && typeof incoming.logsByDate === "object" ? incoming.logsByDate : null;

      if (!program || !Array.isArray(program.workouts) || !logsByDate) {
        alert("Import file missing required fields (program.workouts, logsByDate).");
        return;
      }

      if (!confirm("Import will REPLACE your current data. Continue?")) return;

      const next = {
        ...makeDefaultState(),
        ...incoming,
        program: incoming.program,
        logsByDate,
        meta: { ...(incoming.meta ?? {}), updatedAt: Date.now() },
      };

      setState(next);
      alert("Import complete!");
    } catch (error) {
      alert("Failed to import: " + error.message);
    }
  }

  function handleAddSuggestion(exerciseName) {
    dispatchModal({
      type: "OPEN_ADD_SUGGESTION",
      payload: { exerciseName },
    });
  }

  const confirmAddSuggestion = useCallback((workoutId, exerciseName) => {
    const workout = workoutById.get(workoutId);
    if (!workout) {
      alert("Workout not found");
      return;
    }

    const exists = workout.exercises.some(
      ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
    );

    if (exists) {
      alert(`"${exerciseName}" already exists in ${workout.name}`);
      dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
      return;
    }

    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (!w) return st;
      w.exercises.push({ id: uid("ex"), name: exerciseName, unit: "reps" });
      return st;
    });

    dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
    alert(`Added "${exerciseName}" to ${workout.name}!`);
  }, [workoutById]);

  function handleAcceptGeneratedProgram(workouts, prefs) {
    updateState((st) => {
      // Append generated workouts — never delete existing ones
      for (const w of workouts) st.program.workouts.push(w);
      st.program.generationPrefs = prefs;
      return st;
    });
    setManageWorkoutId(null);
    dispatchModal({ type: "CLOSE_GENERATE_WIZARD" });
  }

  async function handleGenerateToday() {
    // Open modal immediately with loading state
    dispatchModal({ type: "OPEN_GENERATE_TODAY", payload: { preview: null } });
    dispatchModal({ type: "UPDATE_GENERATE_TODAY", payload: { loading: true, error: null } });

    const result = await generateTodayAI({
      equipment,
      profile,
      state,
      catalog: EXERCISE_CATALOG,
      todayKey: dateKey,
    });

    if (result.success) {
      dispatchModal({ type: "UPDATE_GENERATE_TODAY", payload: { preview: result.data, loading: false } });
    } else {
      // Fallback to deterministic
      const fallback = generateTodayWorkout({
        state,
        equipment,
        profile,
        catalog: EXERCISE_CATALOG,
        todayKey: dateKey,
      });
      dispatchModal({
        type: "UPDATE_GENERATE_TODAY",
        payload: { preview: fallback, loading: false, error: "AI unavailable — used smart defaults" },
      });
    }
  }

  function handleAcceptTodayWorkout(workout) {
    updateState((st) => {
      st.program.workouts.push(workout);
      return st;
    });
    dispatchModal({ type: "CLOSE_GENERATE_TODAY" });
  }

  const saveProfile = useCallback(async (updates) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: session.user.id, ...updates });

      if (error) {
        dispatchModal({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false, error: error.message } });
        return;
      }

      setProfile((prev) => ({ ...prev, ...updates }));
      dispatchModal({ type: "CLOSE_PROFILE_MODAL" });
    } catch (err) {
      dispatchModal({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false, error: "Failed to save. Try again." } });
    }
  }, [session.user.id]);

  // Swipe hook for calendar
  const swipe = useSwipe({
    onSwipeLeft: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, +1),
      }),
    onSwipeRight: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, -1),
      }),
    onSwipeUp: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, +12),
      }),
    onSwipeDown: () =>
      dispatchModal({
        type: "UPDATE_MONTH_CURSOR",
        payload: shiftMonth(modals.datePicker.monthCursor, -12),
      }),
  });

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (!dataReady) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f14",
        color: "#64748b",
      }}>
        Loading your workouts...
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Main content column */}
      <div style={styles.content}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={styles.navArrow}
                onClick={() => setDateKey((k) => addDays(k, -1))}
                aria-label="Previous day"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                style={styles.dateBtn}
                onClick={() =>
                  dispatchModal({
                    type: "OPEN_DATE_PICKER",
                    payload: { monthCursor: monthKeyFromDate(dateKey) },
                  })
                }
                aria-label="Pick date"
                type="button"
              >
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.55, textTransform: "uppercase" }}>
                  {new Date(dateKey + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>
                  {formatDateLabel(dateKey)}
                </div>
              </button>
              <button
                style={styles.navArrow}
                onClick={() => setDateKey((k) => addDays(k, +1))}
                aria-label="Next day"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              {dateKey !== yyyyMmDd(new Date()) && (
                <button
                  style={styles.todayChip}
                  onClick={() => setDateKey(yyyyMmDd(new Date()))}
                  type="button"
                >
                  Today
                </button>
              )}
            </div>
            <button
              onClick={() => dispatchModal({
                type: "OPEN_PROFILE_MODAL",
                payload: {
                  username: profile?.username || "",
                  displayName: profile?.display_name || "",
                  birthdate: profile?.birthdate || "",
                  gender: profile?.gender || "",
                  weightLbs: profile?.weight_lbs || "",
                  goal: profile?.goal || "",
                  sports: profile?.sports || "",
                  about: profile?.about || "",
                },
              })}
              style={styles.avatarBtn}
              aria-label="Profile"
              type="button"
            >
              {avatarInitial(profile?.display_name, profile?.username)}
            </button>
          </div>

          {/* Tab-specific sticky toolbar */}
          {tab === "train" && workouts.length > 0 && (
            <div style={{ ...styles.collapseAllRow, justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, opacity: 0.6, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoCollapseEmpty}
                  onChange={(e) => setAutoCollapseEmpty(e.target.checked)}
                  style={styles.checkbox}
                />
                Hide empty
              </label>
              <button
                style={styles.collapseAllBtn}
                onClick={() => {
                  const allCollapsed = workouts.every((w) => collapsedToday.has(w.id));
                  allCollapsed ? expandAll(setCollapsedToday) : collapseAll(setCollapsedToday, workouts.map((w) => w.id));
                }}
                type="button"
              >
                {workouts.every((w) => collapsedToday.has(w.id)) ? "Expand All" : "Collapse All"}
              </button>
            </div>
          )}

          {tab === "progress" && (
            <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              <PillTabs
                styles={styles}
                value={summaryMode}
                onChange={setSummaryMode}
                tabs={[
                  { value: "wtd", label: "WTD" },
                  { value: "mtd", label: "MTD" },
                  { value: "ytd", label: "YTD" },
                ]}
              />
              <div style={styles.rangeRow}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={styles.rangeText}>
                    {formatDateLabel(summaryRange.start)} {"\u2013"} {formatDateLabel(summaryRange.end)}
                  </div>
                  <span style={styles.tagMuted}>{summaryDaysLogged.logged} / {summaryDaysLogged.total} days</span>
                </div>
                <button
                  style={styles.collapseAllBtn}
                  onClick={() => {
                    const allIds = [...workouts.map((w) => w.id), "__coach__"];
                    const allCollapsed = allIds.every((id) => collapsedSummary.has(id));
                    allCollapsed ? expandAll(setCollapsedSummary) : collapseAll(setCollapsedSummary, allIds);
                  }}
                  type="button"
                >
                  {[...workouts.map((w) => w.id), "__coach__"].every((id) => collapsedSummary.has(id)) ? "Expand All" : "Collapse All"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main body */}
        <div ref={bodyRef} style={styles.body} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          {/* Set Username banner */}
          {profile && !profile.username && (
            <div style={{
              ...styles.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 16px",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Set your username to complete your profile.
              </div>
              <button
                type="button"
                style={{ ...styles.primaryBtn, whiteSpace: "nowrap", padding: "6px 14px", fontSize: 12 }}
                onClick={() => dispatchModal({
                  type: "OPEN_CHANGE_USERNAME",
                  payload: { value: "", cooldownMs: 0 },
                })}
              >
                Set Username
              </button>
            </div>
          )}

          {/* TODAY TAB */}
          {tab === "train" ? (
            <div key="train" style={{ ...styles.section, animation: "tabFadeIn 0.2s ease-out" }}>
              <CoachNudge insights={coachInsights} colors={colors} />
              {workouts.length === 0 ? (
                <div style={{
                  ...styles.card,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "32px 20px",
                  gap: 12,
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <path d="M4 12h16" /><rect x="2" y="8" width="4" height="8" rx="1" /><rect x="18" y="8" width="4" height="8" rx="1" /><rect x="6" y="6" width="3" height="12" rx="1" /><rect x="15" y="6" width="3" height="12" rx="1" />
                  </svg>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>No workouts yet</div>
                  <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>
                    Head to the <b>Plan</b> tab to create your program, or generate one with AI.
                  </div>
                  <button
                    style={{ ...styles.primaryBtn, marginTop: 4, padding: "10px 20px" }}
                    onClick={() => setTab("plan")}
                  >
                    Go to Plan
                  </button>
                </div>
              ) : (
                <>
                  {workouts.map((w) => (
                    <WorkoutCard
                      key={w.id}
                      workout={w}
                      collapsed={collapsedToday.has(w.id)}
                      onToggle={() => {
                        if (collapsedToday.has(w.id)) {
                          manualExpandRef.current.add(w.id);
                        } else {
                          manualExpandRef.current.delete(w.id);
                        }
                        toggleCollapse(setCollapsedToday, w.id);
                      }}
                      logsForDate={logsForDate}
                      openLog={openLog}
                      deleteLogForExercise={deleteLogForExercise}
                      styles={styles}
                    />
                  ))}
                  <button
                    style={{
                      ...styles.secondaryBtn,
                      width: "100%",
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                    onClick={handleGenerateToday}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    Generate Workout for Today
                  </button>
                </>
              )}
            </div>
          ) : null}

          {/* SUMMARY TAB */}
          {tab === "progress" ? (
            <div key="progress" style={{ ...styles.section, animation: "tabFadeIn 0.2s ease-out" }}>
              <CoachInsightsCard
                insights={coachInsights}
                onAddExercise={handleAddSuggestion}
                styles={styles}
                colors={colors}
                loading={coachLoading}
                error={coachError}
                userExerciseNames={workouts.flatMap((w) => (w.exercises || []).map((e) => e.name))}
                onRefresh={() => {
                  const reqId = ++coachReqIdRef.current;
                  setCoachLoading(true);
                  setCoachError(null);
                  const refreshExNames = workouts.flatMap((w) => (w.exercises || []).map((e) => e.name));
                  const refreshCatalog = EXERCISE_CATALOG.filter((e) => exerciseFitsEquipment(e, equipment));
                  fetchCoachInsights({ profile, state, dateRange: summaryRange, options: { forceRefresh: true }, catalog: refreshCatalog, equipment })
                    .then(({ insights }) => {
                      if (coachReqIdRef.current !== reqId) return;
                      setCoachInsights(insights);
                      coachLastSignatureRef.current = coachSignature;
                      coachLastFetchRef.current = Date.now();
                      coachCacheRef.current.set(coachSignature, { insights, createdAt: Date.now() });
                      const cacheKey = `wt_coach_v2:${session.user.id}:${summaryMode}:${dateKey}`;
                      try { localStorage.setItem(cacheKey, JSON.stringify({ insights, signature: coachSignature, createdAt: Date.now() })); } catch {}
                    })
                    .catch((err) => {
                      if (coachReqIdRef.current !== reqId) return;
                      console.error("AI Coach refresh error:", err);
                      if (coachInsights.length === 0) {
                        const analysis = buildNormalizedAnalysis(state.program.workouts, state.logsByDate, summaryRange, catalogMap);
                        setCoachInsights(detectImbalancesNormalized(analysis, { catalog: refreshCatalog, userExerciseNames: refreshExNames }));
                      }
                      setCoachError("AI coach unavailable \u2014 showing basic analysis");
                    })
                    .finally(() => {
                      if (coachReqIdRef.current === reqId) setCoachLoading(false);
                    });
                }}
              />

              {summaryDaysLogged.logged === 0 && !coachLoading && coachInsights.length === 0 ? (
                <div style={{
                  ...styles.card,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "32px 20px",
                  gap: 12,
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <path d="M3 20h18" /><path d="M7 20V10" /><path d="M12 20V4" /><path d="M17 20V14" />
                  </svg>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>No data yet</div>
                  <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>
                    Log a workout on the <b>Train</b> tab and your progress will show up here.
                  </div>
                </div>
              ) : (
                workouts.map((w) => (
                  <SummaryBlock
                    key={w.id}
                    workout={w}
                    collapsed={collapsedSummary.has(w.id)}
                    onToggle={() => toggleCollapse(setCollapsedSummary, w.id)}
                    summaryRange={summaryRange}
                    computeExerciseSummary={computeExerciseSummary}
                    styles={styles}
                  />
                ))
              )}
            </div>
          ) : null}

          {/* MANAGE TAB */}
          {tab === "plan" ? (
            <div key="plan" style={{ ...styles.section, animation: "tabFadeIn 0.2s ease-out" }}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>Structure</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={{ ...(reorderWorkouts ? styles.primaryBtn : styles.secondaryBtn), display: "flex", alignItems: "center", gap: 4 }}
                      onClick={() => setReorderWorkouts((v) => !v)}
                    >
                      {reorderWorkouts ? "Done" : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" /></svg>
                          Reorder
                        </>
                      )}
                    </button>
                    <button style={styles.primaryBtn} onClick={addWorkout}>
                      + Add
                    </button>
                  </div>
                </div>

                {workouts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "16px 12px", opacity: 0.5, fontSize: 13, lineHeight: 1.5 }}>
                    No workouts yet. Add one manually or generate a full program with AI.
                  </div>
                ) : (
                  <div style={styles.manageList}>
                    {workouts.map((w, wi) => {
                      const active = manageWorkoutId === w.id;
                      const isFirst = wi === 0;
                      const isLast = wi === workouts.length - 1;

                      const kebabDot = (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
                          <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                        </svg>
                      );

                      const menuStyle = {
                        position: "absolute", top: "100%", right: 0, marginTop: 4,
                        minWidth: 160, background: colors.cardBg,
                        border: `1px solid ${colors.border}`, borderRadius: 12,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.35)", zIndex: 41,
                        overflow: "hidden",
                      };

                      const menuItemStyle = {
                        display: "block", width: "100%", textAlign: "left",
                        padding: "11px 16px", background: "transparent", border: "none",
                        color: colors.text, fontWeight: 600, fontSize: 14, cursor: "pointer",
                      };

                      return (
                        <div key={w.id}>
                          {/* Workout row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, maxWidth: "100%" }}>
                            <div
                              style={{
                                ...styles.manageItem, flex: 1, minWidth: 0,
                                ...(active ? styles.manageItemActive : {}),
                                display: "flex", alignItems: "center", gap: 8,
                              }}
                            >
                              <button
                                style={{ flex: 1, minWidth: 0, textAlign: "left", background: "transparent", border: "none", color: "inherit", padding: 0, cursor: "pointer" }}
                                onClick={() => setManageWorkoutId(active ? null : w.id)}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{w.name}</div>
                                  <span style={styles.tagMuted}>{(w.category || "Workout").trim()}</span>
                                </div>
                                <div style={styles.smallText}>{w.exercises.length} exercises</div>
                              </button>
                              {!reorderWorkouts && (
                                <div style={{ position: "relative", flexShrink: 0 }}>
                                  <button
                                    style={{ background: "transparent", border: "none", color: "inherit", padding: 6, cursor: "pointer", display: "flex" }}
                                    onClick={(e) => { e.stopPropagation(); setWorkoutMenuId(workoutMenuId === w.id ? null : w.id); setExerciseMenuId(null); }}
                                    aria-label="Workout options"
                                  >
                                    {kebabDot}
                                  </button>
                                  {workoutMenuId === w.id && (
                                    <>
                                      <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setWorkoutMenuId(null)} />
                                      <div style={menuStyle}>
                                        <button style={menuItemStyle} onClick={() => { setWorkoutMenuId(null); renameWorkout(w.id); }}>Rename</button>
                                        <button style={menuItemStyle} onClick={() => { setWorkoutMenuId(null); setWorkoutCategory(w.id); }}>Change category</button>
                                        <button style={{ ...menuItemStyle, color: colors.dangerText }} onClick={() => { setWorkoutMenuId(null); deleteWorkout(w.id); }}>Delete</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            {reorderWorkouts && (
                              <div style={styles.reorderBtnGroup}>
                                <button style={styles.reorderBtn} disabled={isFirst} onClick={() => moveWorkout(w.id, -1)} title="Move up">&#9650;</button>
                                <button style={styles.reorderBtn} disabled={isLast} onClick={() => moveWorkout(w.id, 1)} title="Move down">&#9660;</button>
                              </div>
                            )}
                          </div>

                          {/* Inline workout detail — accordion */}
                          {active && !reorderWorkouts && (
                            <div style={{
                              marginTop: 6,
                              marginLeft: 4,
                              padding: "12px 12px 8px",
                              borderLeft: `2px solid ${colors.border}`,
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                              animation: "tabFadeIn 0.15s ease-out",
                            }}>
                              {/* Action row */}
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <button style={{ ...styles.addExerciseFullBtn, flex: 1 }} onClick={() => addExercise(w.id)}>
                                  + Add Exercise
                                </button>
                                {w.exercises.length > 1 && (
                                  <button
                                    style={{ ...(reorderExercises ? styles.primaryBtn : styles.secondaryBtn), display: "flex", alignItems: "center", gap: 4 }}
                                    onClick={() => setReorderExercises((v) => !v)}
                                  >
                                    {reorderExercises ? "Done" : (
                                      <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" /></svg>
                                        Reorder
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>

                              {/* Exercise list */}
                              {w.exercises.length === 0 ? (
                                <div style={styles.emptyText}>No exercises yet.</div>
                              ) : (
                                w.exercises.map((ex, ei) => {
                                  const isFirstEx = ei === 0;
                                  const isLastEx = ei === w.exercises.length - 1;
                                  return (
                                    <div key={ex.id} style={{ ...styles.manageExerciseRow, position: "relative" }}>
                                      <div style={styles.manageExerciseLeft}>
                                        <div style={styles.manageExerciseName}>{ex.name}</div>
                                        <span style={styles.unitPill}>{getUnit(ex.unit, ex).abbr}</span>
                                      </div>
                                      {reorderExercises ? (
                                        <div style={styles.reorderBtnGroup}>
                                          <button style={styles.reorderBtn} disabled={isFirstEx} onClick={() => moveExercise(w.id, ex.id, -1)} title="Move up">&#9650;</button>
                                          <button style={styles.reorderBtn} disabled={isLastEx} onClick={() => moveExercise(w.id, ex.id, 1)} title="Move down">&#9660;</button>
                                        </div>
                                      ) : (
                                        <div style={{ position: "relative", flexShrink: 0 }}>
                                          <button
                                            style={{ background: "transparent", border: "none", color: "inherit", padding: 6, cursor: "pointer", display: "flex" }}
                                            onClick={() => { setExerciseMenuId(exerciseMenuId === ex.id ? null : ex.id); setWorkoutMenuId(null); }}
                                            aria-label="Exercise options"
                                          >
                                            {kebabDot}
                                          </button>
                                          {exerciseMenuId === ex.id && (
                                            <>
                                              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setExerciseMenuId(null)} />
                                              <div style={menuStyle}>
                                                <button style={menuItemStyle} onClick={() => { setExerciseMenuId(null); editUnitExercise(w.id, ex.id); }}>Change unit</button>
                                                <button style={menuItemStyle} onClick={() => { setExerciseMenuId(null); renameExercise(w.id, ex.id); }}>Rename</button>
                                                <button style={{ ...menuItemStyle, color: colors.dangerText }} onClick={() => { setExerciseMenuId(null); deleteExercise(w.id, ex.id); }}>Delete</button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  style={{
                    ...styles.secondaryBtn,
                    width: "100%",
                    marginTop: 8,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  onClick={() => dispatchModal({ type: "OPEN_GENERATE_WIZARD", payload: { equipment } })}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Generate Plan
                </button>
              </div>

              {/* Backup section */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}>Data</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.cardAltBg, color: colors.text, cursor: "pointer", textAlign: "left", width: "100%" }}
                    onClick={exportJson}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Export</div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>Download your data as JSON</div>
                    </div>
                  </button>

                  <label
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.cardAltBg, color: colors.text, cursor: "pointer", textAlign: "left", width: "100%" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Import</div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>Load data from a JSON file</div>
                    </div>
                    <input
                      type="file"
                      accept="application/json"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) importJsonFromFile(f);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  <button
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${colors.dangerBorder}`, background: colors.dangerBg, color: colors.dangerText, cursor: "pointer", textAlign: "left", width: "100%", marginTop: 4 }}
                    onClick={() => {
                      if (!confirm("Reset ALL data? This cannot be undone.")) return;
                      setState(makeDefaultState());
                      setManageWorkoutId(null);
                      alert("Reset complete.");
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Reset All</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>Delete all workouts and logs</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom navigation */}
        <div style={styles.nav}>
          <button style={{ ...styles.navBtn, ...(tab === "train" ? styles.navBtnActive : {}) }} onClick={() => setTab("train")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16" /><rect x="2" y="8" width="4" height="8" rx="1" /><rect x="18" y="8" width="4" height="8" rx="1" /><rect x="6" y="6" width="3" height="12" rx="1" /><rect x="15" y="6" width="3" height="12" rx="1" />
            </svg>
            Train
          </button>
          <button style={{ ...styles.navBtn, ...(tab === "progress" ? styles.navBtnActive : {}) }} onClick={() => setTab("progress")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20h18" /><path d="M7 20V10" /><path d="M12 20V4" /><path d="M17 20V14" />
            </svg>
            Progress
          </button>
          <button style={{ ...styles.navBtn, ...(tab === "plan" ? styles.navBtnActive : {}) }} onClick={() => setTab("plan")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 12h8" /><path d="M8 17h4" />
            </svg>
            Plan
          </button>
        </div>
      </div>

      {/* Acknowledgment toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: colors.cardBg, color: colors.text, border: `1px solid ${colors.border}`,
          borderRadius: 14, padding: "10px 20px", boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
          zIndex: 9999, textAlign: "center", animation: "toastSlideUp 0.3s ease-out",
          maxWidth: "80vw",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{toast.message}</div>
          {toast.coachLine && (
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{toast.coachLine}</div>
          )}
        </div>
      )}

      {/* MODALS */}

      {/* Log Modal */}
      <Modal open={modals.log.isOpen} title={modals.log.context?.exerciseName || "Log"} onClose={() => dispatchModal({ type: "CLOSE_LOG" })} styles={styles}>
        {modals.log.isOpen && (() => {
          const logCtx = modals.log.context;
          let logExercise = null;
          for (const wk of state.program.workouts) {
            const found = wk.exercises.find((e) => e.id === logCtx?.exerciseId);
            if (found) { logExercise = found; break; }
          }
          const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");
          const logScheme = logCtx?.scheme;
          return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {logScheme && (
            <div style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 10,
              background: colors.primaryBg + "18", border: `1px solid ${colors.primaryBg}44`,
              color: colors.text,
            }}>
              Suggested: <b>{logScheme}</b> (sets x reps)
            </div>
          )}
          <div style={styles.smallText}>
            Prefilled from your most recent log. Unit: <b>{logUnit.label}</b>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {modals.log.sets.map((s, i) => {
              const isBW = String(s.weight).toUpperCase() === "BW";
              return (
                <div key={i} style={styles.setRow}>
                  <div style={styles.setIndex}>{i + 1}</div>

                  <div style={styles.fieldCol}>
                    <label style={styles.label}>{logUnit.label}</label>
                    <input
                      value={String(s.reps ?? "")}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        const regex = logUnit.allowDecimal ? /[^\d.]/g : /[^\d]/g;
                        newSets[i] = { ...newSets[i], reps: e.target.value.replace(regex, "") };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      inputMode={logUnit.allowDecimal ? "decimal" : "numeric"}
                      pattern={logUnit.allowDecimal ? "[0-9.]*" : "[0-9]*"}
                      style={styles.numInput}
                      placeholder="0"
                    />
                  </div>

                  <div style={styles.fieldCol}>
                    <label style={styles.label}>Weight</label>
                    <input
                      value={isBW ? "BW" : String(s.weight ?? "")}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        newSets[i] = { ...newSets[i], weight: e.target.value };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ ...styles.numInput, ...(isBW ? styles.disabledInput : {}) }}
                      placeholder="e.g. 185"
                      disabled={isBW}
                    />
                  </div>

                  <div style={styles.bwCol}>
                    <label style={styles.label}>BW</label>
                    <input
                      type="checkbox"
                      checked={isBW}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        newSets[i] = { ...newSets[i], weight: e.target.checked ? "BW" : "" };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      style={styles.checkbox}
                    />
                  </div>

                  <button
                    style={{ ...styles.deleteLogBtn, opacity: modals.log.sets.length <= 1 ? 0.2 : 0.5 }}
                    onClick={() => {
                      const newSets = modals.log.sets.filter((_, idx) => idx !== i);
                      dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                    }}
                    disabled={modals.log.sets.length <= 1}
                    aria-label="Remove set"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <button
            style={styles.secondaryBtn}
            onClick={() => {
              const last = modals.log.sets[modals.log.sets.length - 1];
              const nextSet = last ? { reps: last.reps ?? 0, weight: last.weight ?? "" } : { reps: 0, weight: "" };
              dispatchModal({ type: "UPDATE_LOG_SETS", payload: [...modals.log.sets, nextSet] });
            }}
          >
            + Add Set
          </button>

          <MoodPicker
            value={modals.log.mood}
            onChange={(v) => dispatchModal({ type: "UPDATE_LOG_MOOD", payload: v })}
            colors={colors}
          />

          <div style={styles.fieldCol}>
            <label style={styles.label}>Notes (optional)</label>
            <textarea
              value={modals.log.notes}
              onChange={(e) => dispatchModal({ type: "UPDATE_LOG_NOTES", payload: e.target.value })}
              style={styles.textarea}
              rows={2}
              placeholder="Quick notes..."
            />
          </div>

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_LOG" })}>
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={saveLog}>
              Save
            </button>
          </div>
        </div>
          );
        })()}
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        open={modals.datePicker.isOpen}
        title="Pick a date"
        onClose={() => dispatchModal({ type: "CLOSE_DATE_PICKER" })}
        styles={styles}
      >
        {(() => {
          const [yy, mm] = modals.datePicker.monthCursor.split("-").map(Number);
          const year = yy;
          const monthIndex0 = mm - 1;

          const firstDayKey = `${modals.datePicker.monthCursor}-01`;
          const padLeft = weekdaySunday0(firstDayKey);
          const dim = daysInMonth(year, monthIndex0);

          const cells = [];
          for (let i = 0; i < padLeft; i++) cells.push(null);
          for (let d = 1; d <= dim; d++) cells.push(d);
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <button
                  style={styles.secondaryBtn}
                  onClick={() =>
                    dispatchModal({
                      type: "UPDATE_MONTH_CURSOR",
                      payload: shiftMonth(modals.datePicker.monthCursor, -1),
                    })
                  }
                  type="button"
                >
                  Prev
                </button>

                <div style={{ fontWeight: 900, alignSelf: "center" }}>{formatMonthLabel(modals.datePicker.monthCursor)}</div>

                <button
                  style={styles.secondaryBtn}
                  onClick={() =>
                    dispatchModal({
                      type: "UPDATE_MONTH_CURSOR",
                      payload: shiftMonth(modals.datePicker.monthCursor, +1),
                    })
                  }
                  type="button"
                >
                  Next
                </button>
              </div>

              <div {...swipe} style={styles.calendarSwipeArea}>
                <div style={styles.calendarGrid}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                    <div key={w} style={styles.calendarDow}>
                      {w}
                    </div>
                  ))}

                  {cells.map((day, idx) => {
                    if (!day) return <div key={idx} />;

                    const dayKey = `${modals.datePicker.monthCursor}-${String(day).padStart(2, "0")}`;
                    const selected = dayKey === dateKey;
                    const hasLog = loggedDaysInMonth.has(dayKey);
                    const isToday = dayKey === todayKey;

                    return (
                      <button
                        key={idx}
                        style={{
                          ...styles.calendarCell,
                          ...(isToday && !selected ? styles.calendarCellToday : {}),
                          ...(selected ? styles.calendarCellActive : {}),
                        }}
                        onClick={() => {
                          setDateKey(dayKey);
                          dispatchModal({ type: "CLOSE_DATE_PICKER" });
                        }}
                        type="button"
                      >
                        <div style={styles.calendarCellNum}>{day}</div>
                        <div style={{ height: 10, display: "flex", justifyContent: "center" }}>
                          {hasLog && !selected ? <span style={styles.calendarDot} /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_DATE_PICKER" })} type="button">
                  Close
                </button>
                <button
                  style={styles.primaryBtn}
                  onClick={() => {
                    setDateKey(yyyyMmDd(new Date()));
                    dispatchModal({ type: "CLOSE_DATE_PICKER" });
                  }}
                  type="button"
                >
                  Today
                </button>
              </div>

              <div style={styles.smallText}>Tip: swipe left/right for months, up/down for years. Dots = days with logs.</div>
            </div>
          );
        })()}
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        open={modals.confirm.isOpen}
        title={modals.confirm.title}
        message={modals.confirm.message}
        confirmText={modals.confirm.confirmText}
        onCancel={() => dispatchModal({ type: "CLOSE_CONFIRM" })}
        onConfirm={modals.confirm.onConfirm}
        styles={styles}
      />

      {/* Input Modal */}
      <InputModal
        open={modals.input.isOpen}
        title={modals.input.title}
        label={modals.input.label}
        placeholder={modals.input.placeholder}
        value={modals.input.value}
        confirmText={modals.input.confirmText}
        onCancel={() => dispatchModal({ type: "CLOSE_INPUT" })}
        onConfirm={modals.input.onConfirm}
        onChange={(val) => dispatchModal({ type: "UPDATE_INPUT_VALUE", payload: val })}
        styles={styles}
      />

      {/* Add Workout Modal */}
      <Modal
        open={modals.addWorkout.isOpen}
        title="Add Workout"
        onClose={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout name</label>
            <input
              value={modals.addWorkout.name}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_WORKOUT",
                  payload: { name: e.target.value },
                })
              }
              style={styles.textInput}
              placeholder="e.g. Workout C"
              autoFocus
            />
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout category</label>
            <CategoryAutocomplete
              value={modals.addWorkout.category}
              onChange={(val) =>
                dispatchModal({
                  type: "UPDATE_ADD_WORKOUT",
                  payload: { category: val },
                })
              }
              suggestions={categoryOptions}
              placeholder="e.g. Push / Pull / Legs / Stretch"
              styles={styles}
            />
          </div>

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}>
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => {
                const validation = validateWorkoutName(modals.addWorkout.name, workouts);
                if (!validation.valid) {
                  alert("\u26a0\ufe0f " + validation.error);
                  return;
                }

                const name = modals.addWorkout.name.trim();
                const category = (modals.addWorkout.category || "Workout").trim() || "Workout";
                const newId = uid("w");

                updateState((st) => {
                  st.program.workouts.push({
                    id: newId,
                    name,
                    category,
                    exercises: [],
                  });
                  return st;
                });

                dispatchModal({ type: "CLOSE_ADD_WORKOUT" });
                setManageWorkoutId(newId);
                setTab("plan");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Catalog Browse Modal */}
      <CatalogBrowseModal
        open={modals.catalogBrowse.isOpen}
        onClose={() => dispatchModal({ type: "CLOSE_CATALOG_BROWSE" })}
        styles={styles}
        colors={colors}
        workouts={workouts}
        logsByDate={state.logsByDate}
        onSelectCatalogExercise={(entry) => {
          const wId = modals.catalogBrowse.workoutId;
          const workout = workoutById.get(wId);
          if (!workout) return;
          updateState((st) => {
            const w = st.program.workouts.find((x) => x.id === wId);
            if (!w) return st;
            w.exercises.push({
              id: uid("ex"),
              name: entry.name,
              unit: entry.defaultUnit,
              catalogId: entry.id,
            });
            return st;
          });
          dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
        }}
        onSelectUserExercise={(ex) => {
          const wId = modals.catalogBrowse.workoutId;
          const workout = workoutById.get(wId);
          if (!workout) return;
          updateState((st) => {
            const w = st.program.workouts.find((x) => x.id === wId);
            if (!w) return st;
            const newEx = { id: uid("ex"), name: ex.name, unit: ex.unit || "reps" };
            if (ex.catalogId) newEx.catalogId = ex.catalogId;
            if (ex.customUnitAbbr) newEx.customUnitAbbr = ex.customUnitAbbr;
            if (ex.customUnitAllowDecimal) newEx.customUnitAllowDecimal = ex.customUnitAllowDecimal;
            w.exercises.push(newEx);
            return st;
          });
          dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
        }}
        onCustomExercise={() => {
          const wId = modals.catalogBrowse.workoutId;
          dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
          dispatchModal({
            type: "OPEN_ADD_EXERCISE",
            payload: { workoutId: wId },
          });
        }}
      />

      {/* Add Exercise Modal (custom / free-text fallback) */}
      <Modal
        open={modals.addExercise.isOpen}
        title="Add Exercise"
        onClose={() => dispatchModal({ type: "CLOSE_ADD_EXERCISE" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Exercise name</label>
            <input
              value={modals.addExercise.name}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_EXERCISE",
                  payload: { name: e.target.value },
                })
              }
              style={styles.textInput}
              placeholder="e.g. Bench Press"
              autoFocus
            />
          </div>

          <div style={styles.fieldCol}>
            <label style={styles.label}>Unit</label>
            <select
              value={modals.addExercise.unit}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_ADD_EXERCISE",
                  payload: { unit: e.target.value },
                })
              }
              style={styles.textInput}
            >
              {REP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.abbr})
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
          </div>

          {modals.addExercise.unit === "custom" && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Abbreviation</label>
                <input
                  value={modals.addExercise.customUnitAbbr || ""}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_ADD_EXERCISE",
                      payload: { customUnitAbbr: e.target.value.slice(0, 10) },
                    })
                  }
                  style={styles.textInput}
                  placeholder="e.g. cal"
                />
              </div>
              <div style={{ ...styles.fieldCol, alignItems: "center" }}>
                <label style={styles.label}>Decimals</label>
                <input
                  type="checkbox"
                  checked={modals.addExercise.customUnitAllowDecimal || false}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_ADD_EXERCISE",
                      payload: { customUnitAllowDecimal: e.target.checked },
                    })
                  }
                  style={styles.checkbox}
                />
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_ADD_EXERCISE" })}>
              Cancel
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => {
                const workout = workoutById.get(modals.addExercise.workoutId);
                if (!workout) return;

                const validation = validateExerciseName(modals.addExercise.name, workout.exercises);
                if (!validation.valid) {
                  alert("\u26a0\ufe0f " + validation.error);
                  return;
                }

                if (modals.addExercise.unit === "custom" && !modals.addExercise.customUnitAbbr?.trim()) {
                  alert("\u26a0\ufe0f Please enter a custom unit abbreviation");
                  return;
                }

                const name = modals.addExercise.name.trim();
                const unit = modals.addExercise.unit;
                const wId = modals.addExercise.workoutId;
                updateState((st) => {
                  const w = st.program.workouts.find((x) => x.id === wId);
                  if (!w) return st;
                  const newEx = { id: uid("ex"), name, unit };
                  if (unit === "custom") {
                    newEx.customUnitAbbr = modals.addExercise.customUnitAbbr.trim();
                    newEx.customUnitAllowDecimal = modals.addExercise.customUnitAllowDecimal ?? false;
                  }
                  w.exercises.push(newEx);
                  return st;
                });
                dispatchModal({ type: "CLOSE_ADD_EXERCISE" });
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal
        open={modals.profile.isOpen}
        modalState={modals.profile}
        dispatch={dispatchModal}
        profile={profile}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        equipment={equipment}
        onSetEquipment={setEquipment}
        onLogout={onLogout}
        onSave={saveProfile}
        styles={styles}
      />

      {/* Change Username Modal */}
      <ChangeUsernameModal
        open={modals.changeUsername.isOpen}
        modalState={modals.changeUsername}
        dispatch={dispatchModal}
        profile={profile}
        session={session}
        onProfileUpdate={(updates) => setProfile((prev) => ({ ...prev, ...updates }))}
        styles={styles}
      />

      {/* Add Suggested Exercise Modal */}
      <AddSuggestedExerciseModal
        open={modals.addSuggestion.isOpen}
        exerciseName={modals.addSuggestion.exerciseName}
        workouts={workouts}
        onCancel={() => dispatchModal({ type: "CLOSE_ADD_SUGGESTION" })}
        onConfirm={confirmAddSuggestion}
        styles={styles}
      />

      {/* Edit Unit Modal */}
      <Modal
        open={modals.editUnit.isOpen}
        title="Change Unit"
        onClose={() => dispatchModal({ type: "CLOSE_EDIT_UNIT" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={styles.fieldCol}>
            <label style={styles.label}>Unit</label>
            <select
              value={modals.editUnit.unit}
              onChange={(e) =>
                dispatchModal({
                  type: "UPDATE_EDIT_UNIT",
                  payload: { unit: e.target.value },
                })
              }
              style={styles.textInput}
            >
              {REP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label} ({u.abbr})
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
          </div>

          {modals.editUnit.unit === "custom" && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ ...styles.fieldCol, flex: 1 }}>
                <label style={styles.label}>Abbreviation</label>
                <input
                  value={modals.editUnit.customUnitAbbr || ""}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_EDIT_UNIT",
                      payload: { customUnitAbbr: e.target.value.slice(0, 10) },
                    })
                  }
                  style={styles.textInput}
                  placeholder="e.g. cal"
                />
              </div>
              <div style={{ ...styles.fieldCol, alignItems: "center" }}>
                <label style={styles.label}>Decimals</label>
                <input
                  type="checkbox"
                  checked={modals.editUnit.customUnitAllowDecimal || false}
                  onChange={(e) =>
                    dispatchModal({
                      type: "UPDATE_EDIT_UNIT",
                      payload: { customUnitAllowDecimal: e.target.checked },
                    })
                  }
                  style={styles.checkbox}
                />
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_EDIT_UNIT" })}>
              Cancel
            </button>
            <button style={styles.primaryBtn} onClick={saveEditUnit}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Generate Wizard Modal */}
      <GenerateWizardModal
        open={modals.generateWizard.isOpen}
        wizardState={modals.generateWizard}
        dispatch={dispatchModal}
        onAccept={handleAcceptGeneratedProgram}
        onClose={() => dispatchModal({ type: "CLOSE_GENERATE_WIZARD" })}
        catalog={EXERCISE_CATALOG}
        profile={profile}
        state={state}
        styles={styles}
        colors={colors}
      />

      {/* Generate Today Modal */}
      <GenerateTodayModal
        open={modals.generateToday.isOpen}
        preview={modals.generateToday.preview}
        loading={modals.generateToday.loading}
        error={modals.generateToday.error}
        onRegenerate={handleGenerateToday}
        onAccept={handleAcceptTodayWorkout}
        onClose={() => dispatchModal({ type: "CLOSE_GENERATE_TODAY" })}
        styles={styles}
        colors={colors}
      />
    </div>
  );
}

// ============================================================================
// MOOD PICKER - SVG face icons for workout feel
// ============================================================================

const MOOD_FACES = [
  { value: 2, label: "Great", mouth: "M12,18 Q16,22 20,18", eyes: "happy" },
  { value: 1, label: "Good", mouth: "M13,19 Q16,21 19,19", eyes: "normal" },
  { value: 0, label: "Okay", mouth: "M13,19 L19,19", eyes: "normal" },
  { value: -1, label: "Tough", mouth: "M13,20 Q16,18 19,20", eyes: "normal" },
  { value: -2, label: "Brutal", mouth: "M12,21 Q16,17 20,21", eyes: "squint" },
];

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

function MoodPicker({ value, onChange, colors }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>How did this feel?</div>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 260 }}>
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

// ============================================================================
// SUB-COMPONENTS - Extracted from render to avoid re-creation per render
// ============================================================================

function ExerciseRow({ workoutId, exercise, logsForDate, openLog, deleteLogForExercise, styles }) {
  const exLog = logsForDate[exercise.id] ?? null;
  const hasLog = !!exLog && Array.isArray(exLog.sets);
  const exUnit = getUnit(exercise.unit, exercise);
  const setsText = hasLog
    ? exLog.sets
        .filter((s) => Number(s.reps) > 0)
        .map((s) => {
          const isBW = String(s.weight).toUpperCase() === "BW";
          const w = isBW ? "BW" : s.weight;
          if (exUnit.key === "reps") {
            return `${s.reps}x${w}`;
          }
          const hasWeight = w && w !== "BW" && w !== "" && w !== "0";
          return hasWeight ? `${s.reps}${exUnit.abbr} @ ${w}` : `${s.reps}${exUnit.abbr}`;
        })
        .join(", ")
    : "";

  return (
    <div style={styles.exerciseRow}>
      <button
        style={{ ...styles.exerciseBtn, ...(hasLog ? styles.exerciseBtnLogged : {}) }}
        onClick={() => openLog(workoutId, exercise)}
        aria-label={`Log ${exercise.name}`}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{ ...styles.exerciseName, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exercise.name}</div>
            <span style={styles.unitPill}>{exUnit.abbr}</span>
          </div>
          {hasLog ? <span style={styles.badge}>Done</span> : <span style={styles.badgeMuted}>Tap to log</span>}
        </div>
        {hasLog && setsText ? <div style={styles.exerciseSub}>{setsText}</div> : null}
      </button>

      {hasLog && (
        <button
          style={styles.deleteLogBtn}
          onClick={() => deleteLogForExercise(exercise.id)}
          aria-label={`Delete log for ${exercise.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function WorkoutCard({ workout, collapsed, onToggle, logsForDate, openLog, deleteLogForExercise, styles }) {
  const cat = (workout.category || "Workout").trim();
  const totalEx = workout.exercises.length;
  const loggedEx = totalEx > 0
    ? workout.exercises.filter((ex) => {
        const log = logsForDate[ex.id];
        return log && Array.isArray(log.sets) && log.sets.length > 0;
      }).length
    : 0;
  const allDone = totalEx > 0 && loggedEx === totalEx;

  return (
    <div style={styles.card}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <div style={styles.cardTitle}>{workout.name}</div>
          <span style={styles.tagMuted}>{cat}</span>
        </div>
        {totalEx > 0 && (
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            background: allDone ? "rgba(46, 204, 113, 0.18)" : "transparent",
            color: allDone ? "#2ecc71" : "inherit",
            opacity: allDone ? 1 : 0.45,
            whiteSpace: "nowrap",
          }}>
            {allDone ? "Complete" : `${loggedEx}/${totalEx}`}
          </span>
        )}
        <span style={styles.collapseToggle}>{collapsed ? "\u25B6" : "\u25BC"}</span>
      </div>

      {!collapsed && (
        workout.exercises.length === 0 ? (
          <div style={styles.emptyText}>No exercises yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {workout.exercises.map((ex) => (
              <ExerciseRow
                key={ex.id}
                workoutId={workout.id}
                exercise={ex}
                logsForDate={logsForDate}
                openLog={openLog}
                deleteLogForExercise={deleteLogForExercise}
                styles={styles}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function SummaryBlock({ workout, collapsed, onToggle, summaryRange, computeExerciseSummary, styles }) {
  const cat = (workout.category || "Workout").trim();
  return (
    <div style={styles.card}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardTitle}>{workout.name}</div>
        <span style={styles.tagMuted}>{cat}</span>
        <span style={styles.collapseToggle}>{collapsed ? "\u25B6" : "\u25BC"}</span>
      </div>

      {!collapsed && (
        workout.exercises.length === 0 ? (
          <div style={styles.emptyText}>No exercises yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {workout.exercises.map((ex) => {
              const exUnit = getUnit(ex.unit, ex);
              const s = computeExerciseSummary(ex.id, summaryRange.start, summaryRange.end, exUnit);
              return (
                <div key={ex.id} style={styles.summaryRow}>
                  <div style={styles.exerciseName}>{ex.name}</div>
                  <div style={styles.summaryRight}>
                    <span style={styles.summaryChip}>{s.totalReps} {exUnit.abbr}</span>
                    <span style={styles.summaryChip}>Max {s.maxWeight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
