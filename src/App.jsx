import React, { useEffect, useMemo, useState, useRef, useReducer, useCallback } from "react";
import { fetchCloudState, saveCloudState, createDebouncedSaver } from "./lib/supabaseSync";
import { supabase } from "./lib/supabase";
import { fetchCoachInsights } from "./lib/coachApi";
import { buildNormalizedAnalysis, detectImbalancesNormalized, classifyExerciseMuscles } from "./lib/coachNormalize";
import { avatarInitial } from "./lib/userIdentity";

// Extracted lib modules
import { REP_UNITS, getUnit, getWeightLabel } from "./lib/constants";
import {
  yyyyMmDd, addDays, formatDateLabel, monthKeyFromDate, daysInMonth,
  weekdayIndex, shiftMonth, formatMonthLabel,
  startOfWeek, endOfWeek,
  startOfMonth, startOfYear,
  endOfMonth, endOfYear,
  orderedDayValues, DAY_LABELS_SHORT,
  inRangeInclusive, isValidDateKey,
} from "./lib/dateUtils";
import { uid, loadState, normalizeState, persistState, makeDefaultState, safeParse, findExerciseById, forEachExercise } from "./lib/stateUtils";
import {
  validateExerciseName, validateWorkoutName,
  toNumberOrNull, formatMaxWeight,
} from "./lib/validation";
import { computeCoachSignature, COACH_CACHE_TTL_MS } from "./lib/coachSignature";
import { getDailyRefreshCount, incrementDailyRefresh } from "./lib/aiMetrics";
import { initialModalState, modalReducer } from "./lib/modalReducer";

// Extracted hooks
import { useSwipe } from "./hooks/useSwipe";
import { useDragReorder } from "./hooks/useDragReorder";
import { useClickOutside } from "./hooks/useClickOutside";

// Extracted components
import { Modal, ConfirmModal, InputModal } from "./components/Modal";
import { PillTabs } from "./components/PillTabs";
import { CategoryAutocomplete } from "./components/CategoryAutocomplete";
import { CadenceEditor } from "./components/CadenceEditor";
import { SplitEditorModal } from "./components/SplitEditorModal";
import { SplitDetailSheet } from "./components/SplitDetailSheet";
import { WorkoutDetailSheet } from "./components/WorkoutDetailSheet";
import { WorkoutsList } from "./components/WorkoutsList";
import { SplitsList } from "./components/SplitsList";
import { DISPLAY_DAYS } from "./components/CadenceEditor";
import { CadenceDriftPrompt } from "./components/CadenceDriftPrompt";
import { SunArc } from "./components/SunArc";
import { Atmosphere } from "./components/Atmosphere";
import { ProfileModal } from "./components/ProfileModal";
import { ChangeUsernameModal } from "./components/profile/ChangeUsernameModal";
import { ChangePasswordModal } from "./components/profile/ChangePasswordModal";
import { RestoreFromHistoryModal } from "./components/profile/RestoreFromHistoryModal";
import { AddSuggestedExerciseModal } from "./components/CoachInsights";
import { TimeRangeControl } from "./components/TimeRangeControl";
import { ExerciseListTable } from "./components/ExerciseListTable";
import { ExerciseCatalogSection } from "./components/ExerciseCatalogSection";
import { ExerciseCatalogModal } from "./components/ExerciseCatalogModal";
import { GenerateWizardModal } from "./components/GenerateWizardModal";
import { GenerateTodayModal } from "./components/GenerateTodayModal";
import { CustomExerciseModal } from "./components/CustomExerciseModal";
import { EditExerciseModal } from "./components/EditExerciseModal";
import { getSportIconUrl } from "./lib/sportIcons";
import { enrichExercise } from "./lib/exerciseEnrichmentApi";
import { ExerciseGif } from "./components/ExerciseGif";
import { BodyDiagram } from "./components/BodyDiagram";
import { FriendSearchModal } from "./components/FriendSearchModal";
import { ShareWorkoutModal } from "./components/ShareWorkoutModal";
import { WorkoutPreviewModal } from "./components/WorkoutPreviewModal";
import { ImportPreviewModal } from "./components/ImportPreviewModal";
import { stateToCSV, detectCSVFormat, parseStrongCSV, parseHevyCSV, buildImportState, mergeImportedData } from "./lib/importExport";
import { CircuitTimer } from "./components/CircuitTimer";
import {
  getFriends, getPendingRequests, getInbox, getUnreadCount,
  acceptFriendRequest, declineFriendRequest, removeFriend,
  acceptSharedWorkout, dismissSharedWorkout,
} from "./lib/socialApi";

// Exercise catalog
import { EXERCISE_CATALOG, exerciseFitsEquipment } from "./lib/exerciseCatalog";
import { buildCatalogMap, isBodyweightOnly, classifyLoadType } from "./lib/exerciseCatalogUtils";
import { generateTodayWorkout, parseScheme } from "./lib/workoutGenerator";
import { generateTodayAI } from "./lib/workoutGeneratorApi";
import { selectAcknowledgment, selectSetCompletionToast, selectMotivationLine } from "./lib/greetings";
import { CADENCE_MODES, SPLIT_MODES, normalizeCadence, normalizeSplit, getScheduledForDate, getContinuousNextUp, detectAnchorDrift } from "./lib/cadence";
import { isSetCompleted, dayHasCompletedSets, calculateWeekStreak, longestWeekStreak } from "./lib/setHelpers";
import { isPro as selectIsPro } from "./lib/entitlements";
import { buildStrengthSeries, buildRepsSeries, buildWeeklyVolumeSeries, computePRs } from "./lib/progressCharts";
import { buildMuscleBalance } from "./lib/muscleBalance";
import { fromLbs } from "./lib/units";
import { buildDayActivity, buildCalendarWeeks } from "./lib/activityCalendar";
import { LineChart } from "./components/charts/LineChart";
import { BarChart } from "./components/charts/BarChart";
import { MuscleBalance } from "./components/charts/MuscleBalance";
import { ActivityHeatmap } from "./components/charts/ActivityHeatmap";
import { getUpNextSuggestion } from "./lib/weeklyPatterns";
import { isTimerEligible, updateRestAverage } from "./lib/timerUtils";
import { CoachCard } from "./components/CoachCard";
import { getTodayCheckin, saveCheckin, buildCheckinContext, loadCheckins, loadCoachNotes, mergeCoachNotes, saveCoachNotes } from "./lib/coachCheckin";

// Extracted components (timer)
import { ExerciseTimer } from "./components/ExerciseTimer";
import { RestTimerBar } from "./components/RestTimerBar";

// Extracted styles
import { getColors, getStyles, TIME_OF_DAY, getTimeOfDay } from "./styles/theme";

// ============================================================================
// CSS ANIMATIONS (injected once)
// ============================================================================
let _animInjected = false;
function ensureAnimations() {
  if (_animInjected) return;
  _animInjected = true;
  const s = document.createElement("style");
  s.textContent = `
@keyframes tabFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes toastPop { from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
@keyframes modalSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes chipPop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 60%{transform:scale(0.95)} 100%{transform:scale(1)} }
@keyframes checkDraw { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
@keyframes rowPulse { 0% { box-shadow: inset 0 0 20px rgba(46,204,113,0.35); } 100% { box-shadow: none; } }
@keyframes restBarSlideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes restBarSlideDown { from{transform:translateY(0);opacity:1} to{transform:translateY(100%);opacity:0} }
@keyframes timerPulse { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
@keyframes setBreathe { 0%{box-shadow:0 0 0 0 rgba(46,204,113,0.35)} 50%{box-shadow:0 0 0 4px rgba(46,204,113,0.15)} 100%{box-shadow:0 0 0 0 rgba(46,204,113,0)} }
@keyframes micPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes fabPanelIn { from { opacity: 0; transform: translateY(16px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes fabGlow { 0%,100% { box-shadow: 0 4px 16px rgba(0,0,0,0.15); } 50% { box-shadow: 0 0 28px 8px var(--fab-glow, rgba(217,119,6,0.6)), 0 4px 16px rgba(0,0,0,0.15); } }
@keyframes fabTipIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fabTipOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes workoutSheetSlideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes workoutSheetSlideInLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
.btn-press { transition: transform 0.15s ease, opacity 0.15s ease; }
.btn-press:active { transform: scale(0.97); opacity: 0.85; }
@media (hover: hover) {
  .card-hover { transition: box-shadow 0.2s ease; }
  .card-hover:hover { box-shadow: 0 0 0 1px rgba(128,128,128,0.18); }
}
.nav-press:active { transform: scale(0.92); }
.nav-press { transition: transform 0.12s ease; }
.input-focus:focus { outline: none; border-color: rgba(125,211,252,0.4) !important; box-shadow: 0 0 0 3px rgba(125,211,252,0.08); }
.input-focus-light:focus { outline: none; border-color: rgba(43,91,122,0.3) !important; box-shadow: 0 0 0 3px rgba(43,91,122,0.06); }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
`;
  document.head.appendChild(s);
}


// ============================================================================
// TARGET COLUMN HELPERS
// ============================================================================
const TARGET_COL_ORDER = ["rpe", "pace", "custom"];
const TARGET_LABELS = { rpe: "RPE", pace: "Pace", custom: "Target" };

function parsePace(str) {
  if (!str) return { h: 0, m: 0, s: 0 };
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return { h: parts[0] || 0, m: parts[1] || 0, s: parts[2] || 0 };
  if (parts.length === 2) return { h: 0, m: parts[0] || 0, s: parts[1] || 0 };
  return { h: 0, m: 0, s: parts[0] || 0 };
}

function formatPace(h, m, s) {
  if (!h && !m && !s) return "";
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${m}:${ss}`;
}

function serializeCoachCheckin(checkin) {
  if (!checkin) return "none";
  const pain = (checkin.pain || [])
    .map((entry) => `${entry.area || ""}:${entry.severity || ""}`)
    .sort()
    .join("|");
  return `${checkin.mood ?? ""}|${checkin.sleep ?? ""}|${pain}`;
}

function buildCoachContextSignature(coachTodayKey, coachSignature, todayCheckin) {
  return `${coachTodayKey}|${coachSignature}|${serializeCoachCheckin(todayCheckin)}`;
}

function getCoachCacheKey(userId, coachTodayKey) {
  return `wt_coach_v2:${userId}:${coachTodayKey}`;
}

// Stable empty-collection fallbacks for `state.x?.[key] || EMPTY_ARRAY` patterns.
// Module-scope so the same reference is reused across renders without useMemo.
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJ = Object.freeze({});

// Look up an exercise definition by id across program workouts, session additions,
// and daily workouts. Used when matching historical logs whose original instance id
// may have churned across program rebuilds, swaps, or copies.
function resolveExerciseMeta(state, eid, dk) {
  for (const w of state.program?.workouts || []) {
    const hit = (w.exercises || []).find((e) => e.id === eid);
    if (hit) return hit;
  }
  const adds = state.sessionAdditions?.[dk];
  if (adds) {
    for (const arr of Object.values(adds)) {
      const hit = (arr || []).find((e) => e.id === eid);
      if (hit) return hit;
    }
  }
  const daily = state.dailyWorkouts?.[dk];
  if (daily) {
    for (const w of daily) {
      const hit = (w.exercises || []).find((e) => e.id === eid);
      if (hit) return hit;
    }
  }
  return null;
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
  // localReady gates only the splash screen — true as soon as localStorage has
  // user data, so returning users see the app instantly. dataReady still waits
  // for cloud reconciliation to gate save-back, coach fetch, etc.
  const [localReady, setLocalReady] = useState(false);
  const cloudSaver = useRef(null);
  const [tab, setTab] = useState(() => sessionStorage.getItem("wt_tab") || "train");
  const tabRef = useRef("train");
  tabRef.current = tab;
  const [summaryMode, setSummaryMode] = useState("week");
  const [summaryOffset, setSummaryOffset] = useState(0);
  const [dateKey, setDateKey] = useState(() => yyyyMmDd(new Date()));
  const [coachTodayKey, setCoachTodayKey] = useState(() => yyyyMmDd(new Date()));
  const [manageWorkoutId, setManageWorkoutId] = useState(null);
  const [collapsedManage, setCollapsedManage] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wt_collapsed_manage"));
      return saved ? new Set(saved) : new Set(["programs", "data"]);
    } catch { return new Set(["programs", "data"]); }
  });
  const theme = state.preferences?.theme || "dark";
  const equipment = state.preferences?.equipment || ["full_gym"];
  const weekStartsOn = Number.isInteger(state.preferences?.weekStartsOn) ? state.preferences.weekStartsOn : 0;
  // Pro entitlement. Manual DEV toggle today; RevenueCat in Phase 3. Gate Pro
  // features on this (never read preferences.isPro directly). See entitlements.js.
  const isPro = selectIsPro(state);
  const [reorderWorkouts, setReorderWorkouts] = useState(false);
  const [reorderSplits, setReorderSplits] = useState(false);
  const [reorderExercises, setReorderExercises] = useState(false);
  const [trainSearch, setTrainSearch] = useState("");
  const [trainSearchOpen, setTrainSearchOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const fabOpenRef = useRef(false);
  fabOpenRef.current = fabOpen;
  const [highlightCardId, setHighlightCardId] = useState(null);
  const [fabVisible, setFabVisible] = useState(true);

  const [collapsedToday, setCollapsedToday] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_today"))); } catch { return new Set(); }
  });
  // Target config popover state
  const [showTargetConfig, setShowTargetConfig] = useState(false);
  const [showStatsConfig, setShowStatsConfig] = useState(false);
  const statsConfigRef = useRef(null);
  const targetConfigRef = useRef(null);
  // Pace popover state
  const [pacePopoverIdx, setPacePopoverIdx] = useState(null);
  const pacePopoverRef = useRef(null);
  // RPE popover state
  const [rpePopoverIdx, setRpePopoverIdx] = useState(null);
  const rpePopoverRef = useRef(null);
  // Intensity popover state
  const [intensityPopoverIdx, setIntensityPopoverIdx] = useState(null);
  const intensityPopoverRef = useRef(null);

  // Social state
  const [socialBadge, setSocialBadge] = useState(0);
  const [socialFriends, setSocialFriends] = useState([]);
  const [socialPending, setSocialPending] = useState([]);
  const [socialInbox, setSocialInbox] = useState([]);
  const [socialLoading, setSocialLoading] = useState(false);

  // Log card flip state (log ↔ exercise detail)
  const [logFlipped, setLogFlipped] = useState(false);
  const [logFlipAngle, setLogFlipAngle] = useState(0); // 0 | 180 | -180
  const logFlipAngleRef = useRef(0);
  const logFlipTimeoutRef = useRef(null);
  const logBodyRef = useRef(null);
  const logDetailBodyRef = useRef(null);
  const logNavAnimRef = useRef(null);
  const logCardRef = useRef(null);
  const logFooterRef = useRef(null);
  const logDragRef = useRef({ active: false, startY: 0, startX: 0, currentY: 0, captured: false, direction: 0, isHorizontal: false, captureY: 0, swipeZone: null });

  // Circuit timer state
  const [circuitWorkout, setCircuitWorkout] = useState(null);

  // Rest timer state
  const [restTimer, setRestTimer] = useState({ active: false, exerciseId: null, exerciseName: "", restSec: 90, completedSetIndex: -1 });
  const [autoStartTimer, setAutoStartTimer] = useState(false);
  const [autoStartSignal, setAutoStartSignal] = useState(0);

  // Toast notification
  const [toast, setToast] = useState(null); // { message, coachLine }
  const toastTimerRef = useRef(null);
  const showToast = useCallback((message, ms = 2500) => {
    setToast({ message });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), ms);
  }, []);
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // AI Coach state
  // Profile is fetched from Supabase on every open. Seed from a per-user
  // localStorage cache so username/avatar survive backend downtime (e.g. a
  // paused project) instead of silently rendering blank.
  const profileCacheKey = `wt_profile_cache_${session.user.id}`;
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem(profileCacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [profileStale, setProfileStale] = useState(false);
  // Merge updates into profile state AND the localStorage cache in one step.
  const mergeProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem(profileCacheKey, JSON.stringify(next)); } catch { /* quota / private mode */ }
      return next;
    });
  }, [profileCacheKey]);
  const [coachInsights, setCoachInsights] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(null);
  const [coachStreaming, setCoachStreaming] = useState(false);
  const coachReqIdRef = useRef(0);
  const coachCacheRef = useRef(new Map());
  const coachLastSignatureRef = useRef(null);
  const coachLastFetchRef = useRef(0);
  const coachFetchingRef = useRef(false);  // lock to prevent concurrent fetches
  const MAX_DAILY_REFRESHES = 10;
  const [todayCheckin, setTodayCheckin] = useState(() => getTodayCheckin(yyyyMmDd(new Date())));
  const [checkinEditSection, setCheckinEditSection] = useState(null); // null | "full" | "mood" | "sleep" | "pain"

  // Coach check-in is anchored to actual today, not the browsed calendar date.
  useEffect(() => {
    setTodayCheckin(getTodayCheckin(coachTodayKey));
    setCheckinEditSection(null);
  }, [coachTodayKey]);
  const [coachExpanded, setCoachExpanded] = useState(false);
  // Expanded workouts in the Today's Plan card (multi-workout list view).
  const [expandedPlanRows, setExpandedPlanRows] = useState(() => new Set());
  const togglePlanRow = useCallback((id) => {
    setExpandedPlanRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const checkinEditSectionRef = useRef(null);
  checkinEditSectionRef.current = checkinEditSection;

  // Swipe navigation between tabs.
  const touchRef = useRef({ startX: 0, startY: 0, swiping: false, locked: false });
  const bodyRef = useRef(null);
  const TAB_ORDER = ["train", "progress", "program", "social"];

  const handleTouchStart = useCallback((e) => {
    // If the touch lands inside an element that owns horizontal gestures
    // (the carousel), defer this touch entirely so the body doesn't compete.
    if (e.target?.closest?.("[data-owns-horizontal-gesture]")) {
      touchRef.current.deferToChild = true;
      return;
    }
    touchRef.current.deferToChild = false;
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
    if (touchRef.current.deferToChild) return;
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
    if (touchRef.current.deferToChild) {
      touchRef.current.deferToChild = false;
      return;
    }
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

  useClickOutside(targetConfigRef, showTargetConfig, () => setShowTargetConfig(false));
  useClickOutside(statsConfigRef, showStatsConfig, () => setShowStatsConfig(false));
  useClickOutside(pacePopoverRef, pacePopoverIdx !== null, () => setPacePopoverIdx(null));
  useClickOutside(rpePopoverRef, rpePopoverIdx !== null, () => setRpePopoverIdx(null));
  useClickOutside(intensityPopoverRef, intensityPopoverIdx !== null, () => setIntensityPopoverIdx(null));

  // After onboarding, show welcome choice modal
  useEffect(() => {
    if (showGenerateWizard) {
      dispatchModal({ type: "OPEN_WELCOME_CHOICE" });
      onGenerateWizardShown?.();
    }
  }, [showGenerateWizard]);

  // TEMP (pre-launch dev tooling — remove before shipping): visiting the app with
  // ?dev=1 enables hidden dev tools (e.g. the Pro entitlement toggle in Settings)
  // on production builds too; ?dev=0 disables them. The flag persists in
  // localStorage so it survives into the installed PWA (same origin). See
  // APP_STORE_ROADMAP.md — remove alongside the DEV Pro toggle at launch.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("dev")) {
        const v = params.get("dev");
        if (v === "0" || v === "false") localStorage.removeItem("wt_dev");
        else localStorage.setItem("wt_dev", "1");
      }
    } catch {
      // window/localStorage may be unavailable — ignore.
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CLOUD SYNC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    cloudSaver.current = createDebouncedSaver(2000);

    let cancelled = false;

    // Reveal the app immediately if localStorage already has user data. Cloud
    // reconciliation runs in the background. Only fresh-device / empty-LS
    // sign-ins block on the network fetch.
    const initialLocal = loadState();
    const initialLocalIsEmpty =
      Object.keys(initialLocal.logsByDate || {}).length === 0 &&
      Object.keys(initialLocal.dailyWorkouts || {}).length === 0 &&
      (initialLocal.customExercises || []).length === 0 &&
      Object.keys(initialLocal.todaySessions || {}).length === 0 &&
      Object.keys(initialLocal.sessionAdditions || {}).length === 0 &&
      Object.keys(initialLocal.sessionOverrides || {}).length === 0;
    if (!initialLocalIsEmpty) {
      setLocalReady(true);
    }

    async function init() {
      try {
        const cloudState = await fetchCloudState(session.user.id);

        if (cancelled) return;

        const localState = loadState();
        const cloudHasData =
          cloudState && typeof cloudState === "object" && Object.keys(cloudState).length > 0;

        // "Empty default" = no logs, no daily workouts, no custom exercises, no session data.
        // This is what loadState() returns when LS_KEY is missing (fresh device, browser eviction,
        // PWA reinstall, post-logout). It must NEVER overwrite a populated cloud state.
        const localIsEmptyDefault =
          Object.keys(localState.logsByDate || {}).length === 0 &&
          Object.keys(localState.dailyWorkouts || {}).length === 0 &&
          (localState.customExercises || []).length === 0 &&
          Object.keys(localState.todaySessions || {}).length === 0 &&
          Object.keys(localState.sessionAdditions || {}).length === 0 &&
          Object.keys(localState.sessionOverrides || {}).length === 0;

        if (cloudHasData) {
          const normalized = normalizeState(cloudState);

          if (localIsEmptyDefault) {
            // Fresh device / wiped localStorage — always trust cloud, never push empty up
            setState(normalized);
            persistState(normalized);
          } else {
            // Both have data — use whichever is newer
            const cloudTs = normalized.meta?.updatedAt || 0;
            const localTs = localState.meta?.updatedAt || 0;

            if (localTs > cloudTs) {
              setState(localState);
              await saveCloudState(session.user.id, localState);
            } else {
              setState(normalized);
              persistState(normalized);
            }
          }
        } else {
          // No cloud row yet — first sign-in for this user
          setState(localState);
          await saveCloudState(session.user.id, localState);
        }
      } catch (err) {
        console.error("Cloud sync init failed, using localStorage:", err);
      }

      if (!cancelled) {
        setLocalReady(true);
        setDataReady(true);
      }
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
          .select("username, display_name, username_last_changed_at, username_change_count, birthdate, gender, age, weight_lbs, height_inches, goal, about, sports, avatar_url")
          .eq("id", session.user.id)
          .single();
        if (cancelled) return;
        if (data && !error) {
          setProfile(data);
          setProfileStale(false);
          try { localStorage.setItem(profileCacheKey, JSON.stringify(data)); } catch { /* quota / private mode */ }
        } else if (error) {
          // Backend reachable but query failed — keep any cached profile, flag as stale.
          console.error("Failed to load profile:", error);
          setProfileStale(true);
        }
      } catch (err) {
        // Network/backend unreachable (e.g. paused project). Keep the cached
        // profile seeded at init rather than blanking the UI.
        if (!cancelled) setProfileStale(true);
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [session.user.id, profileCacheKey]);

  // Social badge polling
  useEffect(() => {
    let cancelled = false;
    async function pollBadge() {
      const { data } = await getUnreadCount();
      if (!cancelled) setSocialBadge(data || 0);
    }
    pollBadge();
    const iv = setInterval(pollBadge, 60000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [session.user.id]);

  // Fetch social data when social tab is opened
  const refreshSocial = useCallback(async () => {
    setSocialLoading(true);
    try {
      const [friendsRes, pendingRes, inboxRes, badgeRes] = await Promise.all([
        getFriends(),
        getPendingRequests(),
        getInbox(),
        getUnreadCount(),
      ]);
      setSocialFriends(friendsRes.data || []);
      setSocialPending(pendingRes.data || []);
      setSocialInbox(inboxRes.data || []);
      setSocialBadge(badgeRes.data || 0);
    } catch (err) {
      console.warn("Social refresh failed:", err.message);
    } finally {
      setSocialLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "social") {
      refreshSocial();
    }
  }, [tab]);

  // Auto-advance dateKey at midnight if user was viewing "today".
  //
  // Subtle bug we hit before: the check has to know whether the calendar day
  // ACTUALLY changed between two ticks. Comparing only against "today" makes
  // every check while the user is on yesterday look like a midnight crossover,
  // which yanks them back to today as soon as visibilitychange fires (modal
  // focus shifts on Android, etc). Track the last-seen today in a ref and
  // only advance when it changes.
  useEffect(() => {
    let lastSeenToday = yyyyMmDd(new Date());
    const checkMidnight = () => {
      const now = yyyyMmDd(new Date());
      if (now === lastSeenToday) return; // no calendar rollover; do nothing
      const previousToday = lastSeenToday;
      lastSeenToday = now;
      setCoachTodayKey(now);
      setDateKey(prev => {
        // Only advance if the user was sitting on the day that was "today"
        // before this rollover. If they're browsing an older date, leave them.
        if (prev === previousToday) return now;
        return prev;
      });
    };
    const iv = setInterval(checkMidnight, 60000);
    const onVisible = () => { if (!document.hidden) checkMidnight(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  const todayKey = yyyyMmDd(new Date());

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const colors = useMemo(() => getColors(theme), [theme]);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const workouts = state.program.workouts;
  const dailyWorkoutsToday = state.dailyWorkouts?.[dateKey] || EMPTY_ARRAY;

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

  const todayOverrides = state.sessionOverrides?.[dateKey] || EMPTY_OBJ;
  const todayAdditions = state.sessionAdditions?.[dateKey] || EMPTY_OBJ;

  const effectiveWorkouts = useMemo(() => {
    const hasOverrides = Object.keys(todayOverrides).length > 0;
    const hasAdditions = Object.keys(todayAdditions).length > 0;
    if (!hasOverrides && !hasAdditions) return workouts;
    return workouts.map((w) => {
      const ov = todayOverrides[w.id];
      const adds = todayAdditions[w.id];
      if (!ov && !adds) return w;
      let exercises = w.exercises;
      if (ov) {
        exercises = [];
        for (const ex of w.exercises) {
          const o = ov[ex.id];
          if (!o) { exercises.push(ex); continue; }
          if (o.type === "skip") continue;
          if (o.type === "swap") exercises.push(o.replacement);
        }
      }
      if (adds && adds.length > 0) {
        exercises = [...exercises, ...adds];
      }
      return { ...w, exercises };
    });
  }, [workouts, todayOverrides, todayAdditions]);

  const todaySessionIds = state.todaySessions?.[dateKey] || EMPTY_ARRAY;

  const isToday = dateKey === yyyyMmDd(new Date());

  const todayProgramWorkouts = useMemo(() => {
    if (todaySessionIds.length === 0) return EMPTY_ARRAY;
    return todaySessionIds
      .map(id => effectiveWorkouts.find(w => w.id === id))
      .filter(Boolean);
  }, [todaySessionIds, effectiveWorkouts]);

  const workoutById = useMemo(() => {
    const m = new Map();
    for (const w of effectiveWorkouts) m.set(w.id, w);
    for (const w of dailyWorkoutsToday) m.set(w.id, w);
    return m;
  }, [effectiveWorkouts, dailyWorkoutsToday]);

  const fullCatalog = useMemo(() => [...EXERCISE_CATALOG, ...(state.customExercises || [])], [state.customExercises]);
  const catalogMap = useMemo(() => buildCatalogMap(fullCatalog), [fullCatalog]);

  // Weekly summary for the Coach Carousel "Your Week" card
  const weeklySummary = useMemo(() => {
    const weekStart = startOfWeek(dateKey, weekStartsOn);
    const weekEnd = addDays(weekStart, 6);

    const sessionsSet = new Set();
    let totalSets = 0;

    // Build day-of-week row data, ordered from the user's chosen first day.
    const shortByDow = { 0: "Su", 1: "M", 2: "Tu", 3: "W", 4: "Th", 5: "F", 6: "Sa" };
    const days = orderedDayValues(weekStartsOn).map((dow, i) => {
      const d = addDays(weekStart, i);
      const logs = (state.logsByDate || {})[d];
      const hasSession = logs ? dayHasCompletedSets(logs) : false;
      return { label: shortByDow[dow], dateKey: d, hasSession, isToday: d === dateKey };
    });

    // Count sessions + sets
    for (const day of days) {
      if (!day.hasSession) continue;
      sessionsSet.add(day.dateKey);
      const dayLogs = state.logsByDate[day.dateKey];
      if (!dayLogs) continue;
      for (const exId of Object.keys(dayLogs)) {
        const log = dayLogs[exId];
        if (!log?.sets || !Array.isArray(log.sets)) continue;
        totalSets += log.sets.filter(s => isSetCompleted(s)).length;
      }
    }

    // Progress bar: sessions vs goal
    const daysPerWeek = state.program?.daysPerWeek || state.preferences?.daysPerWeek || 4;

    // Week streak (week buckets keyed by the user's chosen week-start day)
    const weekMap = {};
    for (const [ds, dl] of Object.entries(state.logsByDate || {})) {
      if (!dl || !dayHasCompletedSets(dl)) continue;
      const ws = startOfWeek(ds, weekStartsOn);
      weekMap[ws] = (weekMap[ws] || 0) + 1;
    }
    const weekStreak = calculateWeekStreak(weekMap);

    // Up next suggestion
    const upNext = getUpNextSuggestion(
      state.logsByDate,
      state.program?.workouts || [],
      state.dailyWorkouts || {},
      dateKey,
    );

    return {
      sessions: sessionsSet.size, totalSets, days,
      daysPerWeek, weekStreak, upNext,
    };
  }, [state.logsByDate, state.program?.workouts, state.program?.daysPerWeek, state.preferences?.daysPerWeek, state.dailyWorkouts, dateKey, weekStartsOn]);

  const heroMotivationLine = useMemo(
    () => selectMotivationLine(state.logsByDate, dateKey),
    [state.logsByDate, dateKey]
  );

  // Catalog entry for the back face of the log card flip
  const logDetailEntry = useMemo(() => {
    const cid = modals.log.context?.catalogId;
    return cid ? catalogMap.get(cid) : null;
  }, [modals.log.context?.catalogId, catalogMap]);

  // Reset flip state when log closes
  useEffect(() => {
    if (!modals.log.isOpen) {
      clearTimeout(logFlipTimeoutRef.current);
      logFlipAngleRef.current = 0;
      logNavAnimRef.current = null;
      setLogFlipped(false);
      setLogFlipAngle(0);
      // Reset any inline drag styles on the card
      const card = logCardRef.current;
      if (card) { card.style.transform = ""; card.style.opacity = ""; card.style.transition = ""; card.style.willChange = ""; }
    }
  }, [modals.log.isOpen]);

  const logsForDate = state.logsByDate[dateKey] ?? EMPTY_OBJ;

  // For non-today dates, auto-detect program workouts that have logs (backward compat)
  const logDetectedWorkouts = useMemo(() => {
    if (isToday) return EMPTY_ARRAY;
    if (!logsForDate || Object.keys(logsForDate).length === 0) return EMPTY_ARRAY;
    // Only count exercises that have at least one completed set
    const loggedExIds = new Set(
      Object.keys(logsForDate).filter(exId => {
        const exLog = logsForDate[exId];
        return exLog?.sets && Array.isArray(exLog.sets) && exLog.sets.some(isSetCompleted);
      })
    );
    if (loggedExIds.size === 0) return EMPTY_ARRAY;
    const already = new Set(todaySessionIds);
    return effectiveWorkouts.filter(w => !already.has(w.id) && w.exercises?.some(ex => loggedExIds.has(ex.id)));
  }, [isToday, logsForDate, todaySessionIds, effectiveWorkouts]);

  // Combine explicitly-added sessions + auto-detected from logs
  const displayedProgramWorkouts = useMemo(() => {
    if (logDetectedWorkouts.length === 0) return todayProgramWorkouts;
    if (todayProgramWorkouts.length === 0) return logDetectedWorkouts;
    return [...todayProgramWorkouts, ...logDetectedWorkouts];
  }, [todayProgramWorkouts, logDetectedWorkouts]);

  // Splits — derived early so the home-screen layers below can reference them.
  const splits = useMemo(() => state.program?.splits || [], [state.program]);
  // Map: workoutId → split (used to render members nested + filter standalone workouts).
  const workoutToSplit = useMemo(() => {
    const m = new Map();
    for (const s of splits) {
      for (const member of s.members || []) m.set(member.workoutId, s);
    }
    return m;
  }, [splits]);

  // Workouts surfaced today by their cadence (anchor or weekly preferred), excluding
  // any already explicitly added or that the user dismissed for this date.
  const scheduledTodayWorkouts = useMemo(() => {
    if (!isToday) return EMPTY_ARRAY;
    const dismissed = new Set(state.todayDismissed?.[dateKey] || []);
    const explicit = new Set(todaySessionIds);
    return getScheduledForDate(effectiveWorkouts, dateKey).filter(
      (w) => !explicit.has(w.id) && !dismissed.has(w.id)
    );
  }, [isToday, state.todayDismissed, dateKey, todaySessionIds, effectiveWorkouts]);

  // "Next up" entries from continuous splits — one per active continuous split.
  // Filtered to avoid duplicates with explicit sessions or scheduled cards.
  const continuousNextUpEntries = useMemo(() => {
    if (!isToday) return EMPTY_ARRAY;
    const explicit = new Set(todaySessionIds);
    const dismissed = new Set(state.todayDismissed?.[dateKey] || []);
    const scheduledIds = new Set(scheduledTodayWorkouts.map((w) => w.id));
    const out = [];
    for (const s of splits) {
      const next = getContinuousNextUp(s, effectiveWorkouts);
      if (!next) continue;
      if (explicit.has(next.workout.id)) continue;
      if (scheduledIds.has(next.workout.id)) continue;
      if (dismissed.has(next.workout.id)) continue;
      out.push(next);
    }
    return out;
  }, [isToday, splits, effectiveWorkouts, todaySessionIds, scheduledTodayWorkouts, state.todayDismissed, dateKey]);

  // Scheduled workouts (anchors / weekly preferred / continuous next-up) are
  // intentionally NOT counted here — the hero state should stay visible until
  // the user explicitly starts something. The Today's Plan card surfaces those
  // scheduled items inside the carousel instead.
  const hasSessions = displayedProgramWorkouts.length > 0
    || dailyWorkoutsToday.length > 0;

  const summaryRange = useMemo(() => {
    // Shift the anchor date by offset periods
    let anchor = dateKey;
    if (summaryOffset !== 0) {
      const d = new Date(dateKey + "T00:00:00");
      if (summaryMode === "week") {
        d.setDate(d.getDate() + summaryOffset * 7);
      } else if (summaryMode === "month") {
        d.setMonth(d.getMonth() + summaryOffset);
      } else if (summaryMode === "year") {
        d.setFullYear(d.getFullYear() + summaryOffset);
      }
      anchor = yyyyMmDd(d);
    }

    if (summaryMode === "week") {
      const start = startOfWeek(anchor, weekStartsOn);
      const end = summaryOffset === 0 ? dateKey : endOfWeek(anchor, weekStartsOn);
      return { start, end, label: "This week" };
    }
    if (summaryMode === "month") {
      const start = startOfMonth(anchor);
      const end = summaryOffset === 0 ? dateKey : endOfMonth(anchor);
      return { start, end, label: "Month" };
    }
    if (summaryMode === "year") {
      const start = startOfYear(anchor);
      const end = summaryOffset === 0 ? dateKey : endOfYear(anchor);
      return { start, end, label: "Year" };
    }
    // "all" mode
    const allDates = Object.keys(state.logsByDate).filter(isValidDateKey).sort();
    const start = allDates.length > 0 ? allDates[0] : dateKey;
    return { start, end: dateKey, label: "All Time" };
  }, [dateKey, summaryMode, summaryOffset, state.logsByDate, weekStartsOn]);

  const progressWorkouts = useMemo(() => {
    const dailyExercises = [];
    const coachExercises = [];
    for (const [date, ws] of Object.entries(state.dailyWorkouts || {})) {
      if (inRangeInclusive(date, summaryRange.start, summaryRange.end)) {
        for (const w of ws) {
          if (w.source === "coach") {
            coachExercises.push(...(w.exercises || []));
          } else {
            dailyExercises.push(...(w.exercises || []));
          }
        }
      }
    }
    const result = [...workouts];
    // Include swap replacements from sessionOverrides so summaries reflect actual work
    const swapExercises = [];
    for (const [date, wOverrides] of Object.entries(state.sessionOverrides || {})) {
      if (!inRangeInclusive(date, summaryRange.start, summaryRange.end)) continue;
      for (const ov of Object.values(wOverrides)) {
        for (const o of Object.values(ov)) {
          if (o.type === "swap" && o.replacement) swapExercises.push(o.replacement);
        }
      }
    }
    // Include session-added exercises (exercises added to a workout for a specific day)
    const addedExercises = [];
    for (const [date, wAdds] of Object.entries(state.sessionAdditions || {})) {
      if (!inRangeInclusive(date, summaryRange.start, summaryRange.end)) continue;
      for (const adds of Object.values(wAdds)) {
        if (Array.isArray(adds)) addedExercises.push(...adds);
      }
    }
    if (swapExercises.length > 0) {
      result.push({ id: "__swaps__", name: "Swapped Exercises", category: "Swap", exercises: swapExercises });
    }
    if (addedExercises.length > 0) {
      result.push({ id: "__added__", name: "Session Additions", category: "Added", exercises: addedExercises });
    }
    if (dailyExercises.length > 0) {
      result.push({ id: "__daily__", name: "Daily Workouts", category: "Daily", exercises: dailyExercises });
    }
    if (coachExercises.length > 0) {
      result.push({ id: "__coach__", name: "Coach Suggestions", category: "Coach", exercises: coachExercises });
    }
    return result;
  }, [workouts, state.dailyWorkouts, state.sessionOverrides, state.sessionAdditions, summaryRange]);

  const summaryStats = useMemo(() => {
    // Build exercise ID → name/unit maps from all workout sources
    const exNameMap = {};
    const exUnitMap = {};
    for (const w of progressWorkouts) {
      for (const ex of w.exercises || []) {
        exNameMap[ex.id] = ex.name;
        exUnitMap[ex.id] = getUnit(ex.unit, ex);
      }
    }

    let logged = 0;
    let total = 0;
    let totalSets = 0;
    const weekMap = {};
    const exReps = {};   // exId → total reps
    const exVol = {};    // exId → total volume (weight × reps)
    const exLift = {};   // exId → max single weight

    const processDayLogs = (d, dayLogs) => {
      if (!dayHasCompletedSets(dayLogs)) return;
      const keys = Object.keys(dayLogs);
      logged++;
      const weekStart = startOfWeek(d, weekStartsOn);
      weekMap[weekStart] = (weekMap[weekStart] || 0) + 1;
      for (const exId of keys) {
        const exLog = dayLogs[exId];
        if (exLog?.sets && Array.isArray(exLog.sets)) {
          for (const s of exLog.sets) {
            if (!isSetCompleted(s)) continue;
            totalSets++;
            const reps = Number(s.reps ?? 0);
            if (Number.isFinite(reps)) exReps[exId] = (exReps[exId] || 0) + reps;
            const wt = String(s.weight ?? "").trim();
            if (wt && wt.toUpperCase() !== "BW") {
              const n = Number(wt);
              if (Number.isFinite(n) && n > 0) {
                exLift[exId] = Math.max(exLift[exId] || 0, n);
                if (Number.isFinite(reps)) exVol[exId] = (exVol[exId] || 0) + n * reps;
              }
            }
          }
        }
      }
    };

    // For short ranges (week/month), iterate day-by-day to get accurate total count.
    // For large ranges (year/all), iterate log keys directly to avoid thousands of empty-day checks.
    const rangeSize = Math.round((new Date(summaryRange.end) - new Date(summaryRange.start)) / 86400000) + 1;
    if (rangeSize <= 35) {
      // Day-by-day: accurate total count for progress bar
      let d = summaryRange.start;
      while (d <= summaryRange.end) {
        total++;
        const dayLogs = state.logsByDate[d];
        if (dayLogs) processDayLogs(d, dayLogs);
        d = addDays(d, 1);
      }
    } else {
      // Iterate log entries directly for large ranges
      total = rangeSize;
      for (const [d, dayLogs] of Object.entries(state.logsByDate)) {
        if (d >= summaryRange.start && d <= summaryRange.end && dayLogs) {
          processDayLogs(d, dayLogs);
        }
      }
    }

    // Find best exercise for each metric
    const bestOf = (map) => {
      let bestId = null, bestVal = 0;
      for (const [id, val] of Object.entries(map)) {
        if (val > bestVal) { bestVal = val; bestId = id; }
      }
      return bestId ? { value: bestVal, name: exNameMap[bestId] || "Unknown", unit: exUnitMap[bestId] || null } : null;
    };

    return {
      logged, total, totalSets,
      weekStreak: calculateWeekStreak(weekMap),
      longestStreak: longestWeekStreak(weekMap),
      bestReps: bestOf(exReps),
      bestVolume: bestOf(exVol),
      bestLift: bestOf(exLift),
    };
  }, [state.logsByDate, summaryRange, progressWorkouts, weekStartsOn]);

  // All-time stats for profile modal (not tied to summary range)
  const profileStats = useMemo(() => {
    // Build exercise ID → name map from all workout sources
    const exNameMap = {};
    for (const w of progressWorkouts) {
      for (const ex of w.exercises || []) {
        exNameMap[ex.id] = ex.name;
      }
    }

    let logged = 0;
    let totalSets = 0;
    const weekMap = {};
    const exReps = {};
    const exVol = {};
    const exLift = {};

    for (const [d, dayLogs] of Object.entries(state.logsByDate)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !dayHasCompletedSets(dayLogs)) continue;
      logged++;
      const weekStart = startOfWeek(d, weekStartsOn);
      weekMap[weekStart] = (weekMap[weekStart] || 0) + 1;
      for (const exId of Object.keys(dayLogs)) {
        const exLog = dayLogs[exId];
        if (!exLog?.sets || !Array.isArray(exLog.sets)) continue;
        for (const s of exLog.sets) {
          if (!isSetCompleted(s)) continue;
          totalSets++;
          const reps = Number(s.reps ?? 0);
          if (Number.isFinite(reps)) exReps[exId] = (exReps[exId] || 0) + reps;
          const wt = String(s.weight ?? "").trim();
          if (wt && wt.toUpperCase() !== "BW") {
            const n = Number(wt);
            if (Number.isFinite(n) && n > 0) {
              exLift[exId] = Math.max(exLift[exId] || 0, n);
              if (Number.isFinite(reps)) exVol[exId] = (exVol[exId] || 0) + n * reps;
            }
          }
        }
      }
    }

    const bestOf = (map) => {
      let bestId = null, bestVal = 0;
      for (const [id, val] of Object.entries(map)) {
        if (val > bestVal) { bestVal = val; bestId = id; }
      }
      return bestId ? { value: bestVal, name: exNameMap[bestId] || "Unknown" } : null;
    };

    return {
      logged,
      totalSets,
      weekStreak: calculateWeekStreak(weekMap),
      bestReps: bestOf(exReps),
      bestVolume: bestOf(exVol),
      bestLift: bestOf(exLift),
    };
  }, [state.logsByDate, progressWorkouts, weekStartsOn]);

  // Flat exercise list for progress tab — grouped by name so swapped/re-added
  // exercises with different IDs but the same name merge their stats.
  const flatExerciseList = useMemo(() => {
    const byName = new Map(); // name (lowercase) → { ids: Set, exercise }
    for (const w of progressWorkouts) {
      for (const ex of w.exercises || []) {
        const key = ex.name.toLowerCase();
        if (!byName.has(key)) {
          byName.set(key, { ids: new Set([ex.id]), exercise: ex });
        } else {
          byName.get(key).ids.add(ex.id);
        }
      }
    }
    const result = [];
    for (const [, { ids, exercise }] of byName) {
      const exUnit = getUnit(exercise.unit, exercise);
      const allIds = [...ids];
      const s = computeExerciseSummary(allIds, summaryRange.start, summaryRange.end, exUnit);
      result.push({
        id: exercise.id,
        ids: allIds,
        catalogId: exercise.catalogId,
        equipment: exercise.equipment,
        name: exercise.name,
        sessions: s.sessions,
        totalSets: s.totalSets,
        totalReps: s.totalReps,
        totalVolume: s.totalVolume,
        maxReps: s.maxReps,
        maxWeight: s.maxWeight,
        unitAbbr: exUnit.abbr,
        unitKey: exUnit.key,
      });
    }
    return result;
  }, [progressWorkouts, summaryRange, state.logsByDate]);

  // Week-over-week total training volume for the Progress volume-trend chart.
  const weeklyVolume = useMemo(
    () => buildWeeklyVolumeSeries(state.logsByDate, summaryRange.start, summaryRange.end, weekStartsOn),
    [state.logsByDate, summaryRange, weekStartsOn]
  );

  // Sets-per-muscle-group over the range for the Progress balance view.
  const muscleBalance = useMemo(
    () => buildMuscleBalance(state.logsByDate, progressWorkouts, summaryRange.start, summaryRange.end, catalogMap, classifyExerciseMuscles),
    [state.logsByDate, progressWorkouts, summaryRange, catalogMap]
  );

  // Day-by-day activity laid out as week columns for the consistency heatmap.
  const calendarWeeks = useMemo(() => {
    const activity = buildDayActivity(state.logsByDate, summaryRange.start, summaryRange.end);
    return buildCalendarWeeks(activity, summaryRange.start, summaryRange.end, weekStartsOn);
  }, [state.logsByDate, summaryRange, weekStartsOn]);

  const loggedDaysInMonth = useMemo(() => {
    const set = new Set();
    const prefix = modals.datePicker.monthCursor + "-";

    for (const dk of Object.keys(state.logsByDate || {})) {
      if (!isValidDateKey(dk)) continue;
      if (!dk.startsWith(prefix)) continue;

      const dayLogs = state.logsByDate[dk];
      if (dayHasCompletedSets(dayLogs)) {
        set.add(dk);
      }
    }
    return set;
  }, [state.logsByDate, modals.datePicker.monthCursor]);

  // AI Coach signature (decoupled from time range — always analyzes all history)
  const { signature: coachSignature } = useMemo(
    () => computeCoachSignature(state),
    [state.logsByDate, state.program.workouts]
  );
  const coachContextSignature = useMemo(
    () => buildCoachContextSignature(coachTodayKey, coachSignature, todayCheckin),
    [coachTodayKey, coachSignature, todayCheckin]
  );
  const coachDateRange = useMemo(() => {
    const end = coachTodayKey;
    return { start: addDays(end, -90), end };
  }, [coachTodayKey]);

  useEffect(() => {
    if (!dataReady || !profile || !session?.user?.id) return;

    const cacheKey = getCoachCacheKey(session.user.id, coachTodayKey);

    try {
      const stored = JSON.parse(localStorage.getItem(cacheKey));
      const isFresh = stored && Date.now() - stored.createdAt < COACH_CACHE_TTL_MS;
      const isMatch = stored?.contextSignature === coachContextSignature;
      if (isFresh && isMatch && stored.insights?.length > 0) {
        setCoachInsights(stored.insights);
        setCoachError(null);
        coachLastSignatureRef.current = stored.signature || coachSignature;
        coachLastFetchRef.current = stored.createdAt;
      }
    } catch {}

    const memCached = coachCacheRef.current.get(coachContextSignature);
    if (memCached && Date.now() - memCached.createdAt < COACH_CACHE_TTL_MS) {
      setCoachInsights(memCached.insights);
      setCoachError(null);
      coachLastSignatureRef.current = coachSignature;
      coachLastFetchRef.current = memCached.createdAt;
    }
  }, [coachContextSignature, coachSignature, coachTodayKey, dataReady, profile, session?.user?.id]);

  // AI Coach — once-per-day auto-fetch, cached insights otherwise
  // Coach always analyzes last 90 days (decoupled from progress tab time range)
  useEffect(() => {
    if (!dataReady || !profile || !session?.user?.id) return;
    if (coachFetchingRef.current) return;

    const userId = session.user.id;
    const cacheKey = getCoachCacheKey(userId, coachTodayKey);
    const autoDateKey = `wt_coach_last_auto_date:${userId}`;

    // Once-per-session auto-fetch: fetch once per app launch for today's coach.
    const today = coachTodayKey;
    const lastAutoDate = sessionStorage.getItem(autoDateKey);
    if (lastAutoDate === today) return;

    // If we already have a fresh cache for the same workout + check-in context, skip the paid call.
    try {
      const stored = JSON.parse(localStorage.getItem(cacheKey));
      const isFresh = stored && Date.now() - stored.createdAt < COACH_CACHE_TTL_MS;
      const isMatch = stored?.contextSignature === coachContextSignature;
      if (isFresh && isMatch && stored.insights?.length > 0) {
        sessionStorage.setItem(autoDateKey, today);
        return;
      }
    } catch {}

    // Fetch from AI with streaming
    coachLastSignatureRef.current = coachSignature;
    let cancelled = false;
    const reqId = ++coachReqIdRef.current;

    coachFetchingRef.current = true;
    setCoachLoading(true);
    setCoachStreaming(true);

    const filteredCatalog = fullCatalog.filter((e) => exerciseFitsEquipment(e, equipment));
    const coachOpts = { catalog: filteredCatalog };

    const autoCheckinCtx = todayCheckin
      ? buildCheckinContext(todayCheckin, loadCheckins(), state.logsByDate)
      : null;
    const autoCoachNotes = loadCoachNotes();

    fetchCoachInsights({
      profile, state, dateRange: coachDateRange, catalog: filteredCatalog, equipment,
      measurementSystem: state.preferences?.measurementSystem,
      checkinContext: autoCheckinCtx, coachNotesFromStorage: autoCoachNotes,
      onInsight: () => {},
    })
      .then(({ insights, fromCache, coachNotes: returnedNotes }) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        setCoachInsights(insights);
        setCoachError(null);
        coachLastSignatureRef.current = coachSignature;
        coachLastFetchRef.current = Date.now();
        coachCacheRef.current.set(coachContextSignature, { insights, createdAt: Date.now() });
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            insights,
            signature: coachSignature,
            contextSignature: coachContextSignature,
            createdAt: Date.now(),
          }));
        } catch {}
        try { sessionStorage.setItem(autoDateKey, today); } catch {}
        if (returnedNotes?.length > 0) {
          const existing = loadCoachNotes();
          const merged = mergeCoachNotes(existing, returnedNotes);
          saveCoachNotes(merged);
        }
      })
      .catch((err) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        console.error("AI Coach error:", err);
        if (coachInsights.length === 0) {
          const analysis = buildNormalizedAnalysis(state.program.workouts, state.logsByDate, coachDateRange, catalogMap);
          setCoachInsights(detectImbalancesNormalized(analysis, {
            ...coachOpts,
            checkin: todayCheckin,
            userExerciseNames: (state.program?.workouts || []).flatMap((w) => (w.exercises || []).map((ex) => ex.name)),
          }));
        }
        const detail = err?.message || String(err);
        setCoachError(`AI coach unavailable \u2014 showing basic analysis (${detail})`);
      })
      .finally(() => {
        coachFetchingRef.current = false;
        if (!cancelled && coachReqIdRef.current === reqId) {
          setCoachLoading(false);
          setCoachStreaming(false);
        }
      });

    return () => { cancelled = true; };
  }, [
    catalogMap,
    coachContextSignature,
    coachDateRange,
    coachSignature,
    coachTodayKey,
    dataReady,
    equipment,
    fullCatalog,
    profile,
    session?.user?.id,
    state,
    todayCheckin,
  ]);

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
    sessionStorage.setItem("wt_tab", tab);
  }, [tab]);

  // Close FAB when switching tabs or dates
  useEffect(() => { setFabOpen(false); }, [tab, dateKey]);

  // FAB scroll-fade effect
  useEffect(() => {
    if (tab !== "train") return;
    const el = bodyRef.current;
    if (!el) return;
    let timer = null;
    const onScroll = () => {
      setFabVisible(false);
      clearTimeout(timer);
      timer = setTimeout(() => setFabVisible(true), 300);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, [tab]);

  useEffect(() => {
    localStorage.setItem("wt_collapsed_today", JSON.stringify([...collapsedToday]));
  }, [collapsedToday]);

  useEffect(() => {
    localStorage.setItem("wt_collapsed_manage", JSON.stringify([...collapsedManage]));
  }, [collapsedManage]);

  useEffect(() => {
    setReorderExercises(false);
  }, [manageWorkoutId]);

  // Persist state changes
  const latestStateRef = useRef(state);
  useEffect(() => {
    const stateWithMeta = {
      ...state,
      meta: { ...(state.meta ?? {}), updatedAt: Date.now() },
    };
    latestStateRef.current = stateWithMeta;

    const result = persistState(stateWithMeta);

    if (!result.success) {
      console.error(result.error);
    }

    if (dataReady) {
      cloudSaver.current?.trigger(session.user.id, stateWithMeta);
    }
  }, [state, dataReady, session.user.id]);

  // Flush pending cloud sync when the app is being put away.
  // beforeunload is unreliable on mobile/PWA — pagehide and visibilitychange:hidden
  // are the events that actually fire when an Android PWA gets backgrounded or closed.
  // localStorage remains the safety net if the network request gets cut off.
  useEffect(() => {
    const flushIfPending = () => {
      if (cloudSaver.current && latestStateRef.current && dataReady) {
        cloudSaver.current.flushSync();
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") flushIfPending();
    };
    window.addEventListener("pagehide", flushIfPending);
    window.addEventListener("beforeunload", flushIfPending);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pagehide", flushIfPending);
      window.removeEventListener("beforeunload", flushIfPending);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [session.user.id, dataReady]);

  // ---------------------------------------------------------------------------
  // CATALOG-ID BACKFILL MIGRATION (one-time)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!dataReady) return;
    // Check if migration is needed
    const allExercises = state.program.workouts.flatMap((w) => w.exercises || []);
    const dailyExercises = Object.values(state.dailyWorkouts || {}).flatMap(
      (dayArr) => (dayArr || []).flatMap((w) => w.exercises || [])
    );
    const missing = [...allExercises, ...dailyExercises].some((ex) => !ex.catalogId);
    if (!missing) return;

    updateState((st) => {
      // Build name→id map from full catalog (built-in + custom)
      const nameMap = new Map();
      for (const entry of fullCatalog) {
        nameMap.set(entry.name.toLowerCase(), entry.id);
      }
      // Backfill program workouts
      for (const w of st.program.workouts) {
        for (const ex of w.exercises || []) {
          if (!ex.catalogId) {
            const match = nameMap.get(ex.name.toLowerCase());
            if (match) ex.catalogId = match;
          }
        }
      }
      // Backfill daily workouts
      for (const dayArr of Object.values(st.dailyWorkouts || {})) {
        for (const w of dayArr || []) {
          for (const ex of w.exercises || []) {
            if (!ex.catalogId) {
              const match = nameMap.get(ex.name.toLowerCase());
              if (match) ex.catalogId = match;
            }
          }
        }
      }
      return st;
    });
  }, [dataReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // BACK-BUTTON CLOSES MODALS (Android / PWA)
  // ---------------------------------------------------------------------------

  const anyModalOpen = modals.log.isOpen || modals.confirm.isOpen || modals.input.isOpen ||
    modals.datePicker.isOpen || modals.addWorkout.isOpen ||
    modals.addSuggestion.isOpen || modals.profile.isOpen || modals.changeUsername.isOpen ||
    modals.changePassword.isOpen || modals.welcomeChoice.isOpen || modals.editWorkout?.isOpen ||
    modals.editExercise?.isOpen || modals.editSplit?.isOpen || modals.catalogBrowse.isOpen ||
    modals.generateWizard.isOpen || modals.generateToday.isOpen ||
    modals.customExercise?.isOpen || modals.billing?.isOpen ||
    modals.friendSearch?.isOpen ||
    modals.shareWorkout?.isOpen || modals.workoutPreview?.isOpen ||
    modals.workoutDetail?.isOpen || modals.splitDetail?.isOpen;

  const backOverrideRef = useRef(null);
  const anyModalOpenRef = useRef(false);
  anyModalOpenRef.current = anyModalOpen;

  // ---------------------------------------------------------------------------
  // BACK BUTTON / HISTORY MANAGEMENT (Android PWA)
  // Primary: CloseWatcher API (Chrome 126+) — directly intercepts back button.
  // Fallback: history entries pushed during user activation.
  // ---------------------------------------------------------------------------
  const handleBackRef = useRef(null);

  handleBackRef.current = () => {
    // Close checkin edit section if open
    if (checkinEditSectionRef.current) {
      setCheckinEditSection(null);
      return;
    }
    // Close FAB panel if open (before modal/exit checks)
    if (fabOpenRef.current) {
      setFabOpen(false);
      return;
    }
    // Reorder mode (workout detail sheet exercises): cancel without saving.
    if (modals.workoutDetail.isOpen && modals.workoutDetail.reorderExercises) {
      cancelReorderExercises();
      return;
    }
    // Edit Exercise / Edit Workout / Edit Split sub-modals: back closes just
    // the sub-modal so the user returns to where they were (workout sheet or
    // plans tab) instead of dropping to the train tab.
    if (modals.editExercise?.isOpen) {
      dispatchModal({ type: "CLOSE_EDIT_EXERCISE" });
      return;
    }
    if (modals.editWorkout?.isOpen) {
      dispatchModal({ type: "CLOSE_EDIT_WORKOUT" });
      return;
    }
    if (modals.editSplit?.isOpen) {
      dispatchModal({ type: "CLOSE_EDIT_SPLIT" });
      return;
    }
    if (modals.splitDetail?.isOpen) {
      dispatchModal({ type: "CLOSE_SPLIT_DETAIL" });
      return;
    }
    if (anyModalOpenRef.current) {
      if (backOverrideRef.current) {
        try {
          const result = backOverrideRef.current();
          if (result) return;
        } catch (_) {}
      }
      dispatchModal({ type: "CLOSE_ALL" });
      return;
    }
    // Reorder mode (plans tab workouts list): cancel without saving.
    if (reorderWorkoutsRef.current) {
      cancelReorderWorkouts();
      return;
    }
    if (tabRef.current !== "train") {
      setTab("train");
      sessionStorage.setItem("wt_tab", "train");
      return;
    }
    // On train tab with no modals — show toast and let next back exit
    showToast("Press back again to exit", 2000);
    return "prepare_exit";
  };

  useEffect(() => {
    const hasCW = typeof CloseWatcher !== "undefined";

    // --- PRIMARY: CloseWatcher API (Chrome 126+, Samsung Internet 28+) ---
    // Directly intercepts Android back button without needing history entries.
    let watcher = null;
    let cwWorking = false;
    let exiting = false;
    let exitTimer = null;
    let exitAt = 0;

    const prepareExit = () => {
      exiting = true;
      exitAt = Date.now();
      cwWorking = false;
      if (watcher) { try { watcher.destroy(); } catch (_) {} watcher = null; }
      // Drain history buffer so next back goes straight to OS
      if (buffer > 0) { history.go(-buffer); buffer = 0; }
      // Re-enable after 2.5s if user doesn't exit
      clearTimeout(exitTimer);
      exitTimer = setTimeout(() => {
        if (!exiting) return;
        cancelExit();
      }, 2500);
    };

    const cancelExit = () => {
      exiting = false;
      clearTimeout(exitTimer);
      setupWatcher();
      // Only replenish history buffer if CloseWatcher is not active (fallback)
      if (!cwWorking) {
        setTimeout(() => { while (buffer < 5) push(); }, 50);
      }
    };

    const setupWatcher = () => {
      if (!hasCW) return;
      // Destroy any existing watcher first to prevent duplicates
      if (watcher) { try { watcher.destroy(); } catch (_) {} watcher = null; }
      try {
        watcher = new CloseWatcher();
        watcher.addEventListener("close", () => {
          watcher = null;
          const result = handleBackRef.current?.();
          if (result === "prepare_exit") { prepareExit(); return; }
          setupWatcher(); // chain for next back press
        });
        cwWorking = true;
      } catch (_) {
        cwWorking = false;
      }
    };
    setupWatcher();

    // --- FALLBACK: History entries during user activation ---
    let seq = 0, lastHash = "", initialized = false, buffer = 0;
    const push = () => {
      seq++;
      lastHash = "#wt" + seq;
      location.hash = lastHash;
      buffer++;
    };

    const ensureEntries = (e) => {
      if (exiting) {
        // Cancel exit on deliberate app taps (click), not pointerdown.
        // Grace period: back button taps also fire click events (~50ms after
        // prepareExit), so ignore clicks within 600ms to avoid immediately
        // cancelling the exit the user just triggered.
        if (e.type === "click" && Date.now() - exitAt > 600) {
          cancelExit();
        }
        return;
      }
      if (!initialized) {
        initialized = true;
        history.replaceState(null, "", location.pathname + location.search);
      }
      // Only push history entries when CloseWatcher is NOT active (fallback).
      // When CW works, history entries are unnecessary and create exit issues
      // because history.go(-buffer) races with the user's next back press.
      if (!cwWorking && buffer < 5) push();
    };

    document.addEventListener("pointerdown", ensureEntries, { passive: true });
    document.addEventListener("click", ensureEntries, { passive: true });

    let lastBackTime = 0;
    const onBack = () => {
      if (exiting) return;
      if (location.hash === lastHash) return;
      const now = Date.now();
      if (now - lastBackTime < 200) return;
      lastBackTime = now;
      buffer = Math.max(0, buffer - 1);
      lastHash = location.hash; // Sync to prevent stale hash checks
      // Only handle via history if CloseWatcher is NOT active
      if (!cwWorking) {
        const result = handleBackRef.current?.();
        if (result === "prepare_exit") { prepareExit(); return; }
      }
    };

    window.addEventListener("popstate", onBack);
    window.addEventListener("hashchange", onBack);

    return () => {
      clearTimeout(exitTimer);
      watcher?.destroy();
      document.removeEventListener("pointerdown", ensureEntries);
      document.removeEventListener("click", ensureEntries);
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("hashchange", onBack);
    };
  }, []);

  // Back button override for log modal (flipped state → flip back; normal → close log)
  const logBackHandlerRef = useRef(null);
  useEffect(() => {
    if (modals.log.isOpen && logFlipped) {
      const handler = () => {
        if (logFlipAngleRef.current === 0) {
          // Already flipping back — close the log instead
          clearTimeout(logFlipTimeoutRef.current);
          setLogFlipped(false);
          setShowTargetConfig(false);
          setPacePopoverIdx(null);
          setRpePopoverIdx(null);
          dispatchModal({ type: "CLOSE_LOG" });
          return "close";
        } else {
          flipLogToFront();
          return true;
        }
      };
      backOverrideRef.current = handler;
      logBackHandlerRef.current = handler;
    } else if (modals.log.isOpen) {
      const handler = () => {
        setShowTargetConfig(false);
        setPacePopoverIdx(null);
        setRpePopoverIdx(null);
        dispatchModal({ type: "CLOSE_LOG" });
        return "close";
      };
      backOverrideRef.current = handler;
      logBackHandlerRef.current = handler;
    } else {
      if (backOverrideRef.current === logBackHandlerRef.current) {
        backOverrideRef.current = null;
      }
      logBackHandlerRef.current = null;
    }
  }, [modals.log.isOpen, logFlipped]);

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

  function findMostRecentLogBefore(exerciseId, beforeDateKey, matchMeta = null) {
    const keys = Object.keys(state.logsByDate).filter(
      (k) => isValidDateKey(k) && k < beforeDateKey
    );
    keys.sort((a, b) => (a > b ? -1 : 1));

    // Pass 1: exact instance-id match
    for (const k of keys) {
      const exLog = state.logsByDate[k]?.[exerciseId];
      if (exLog && Array.isArray(exLog.sets)) return exLog;
    }

    // Pass 2: match by catalogId or name across other instance ids
    const wantCatalog = matchMeta?.catalogId || null;
    const wantName = matchMeta?.name ? matchMeta.name.toLowerCase() : null;
    if (!wantCatalog && !wantName) return null;

    for (const k of keys) {
      const dayLogs = state.logsByDate[k];
      if (!dayLogs) continue;
      for (const [eid, exLog] of Object.entries(dayLogs)) {
        if (!exLog || !Array.isArray(exLog.sets) || exLog.sets.length === 0) continue;
        const meta = resolveExerciseMeta(state, eid, k);
        if (!meta) continue;
        if (wantCatalog && meta.catalogId && meta.catalogId === wantCatalog) return exLog;
        if (!wantCatalog && wantName && (meta.name || "").toLowerCase() === wantName) return exLog;
      }
    }
    return null;
  }

  // Collect every prior set (any reps > 0) for the exercise across instance ids that
  // share its catalogId or name. Used by the toast selector for first-ever and PR detection.
  function getPriorSetsForExercise(exerciseId, beforeDateKey, matchMeta = null) {
    const keys = Object.keys(state.logsByDate).filter(
      (k) => isValidDateKey(k) && k < beforeDateKey
    );
    const wantCatalog = matchMeta?.catalogId || null;
    const wantName = matchMeta?.name ? matchMeta.name.toLowerCase() : null;

    const collected = [];
    for (const k of keys) {
      const dayLogs = state.logsByDate[k];
      if (!dayLogs) continue;
      for (const [eid, exLog] of Object.entries(dayLogs)) {
        if (!exLog || !Array.isArray(exLog.sets) || exLog.sets.length === 0) continue;
        let matches = eid === exerciseId;
        if (!matches && (wantCatalog || wantName)) {
          const meta = resolveExerciseMeta(state, eid, k);
          if (meta) {
            if (wantCatalog && meta.catalogId === wantCatalog) matches = true;
            else if (!wantCatalog && wantName && (meta.name || "").toLowerCase() === wantName) matches = true;
          }
        }
        if (!matches) continue;
        for (const s of exLog.sets) {
          if (Number(s.reps) > 0) collected.push({ reps: s.reps, weight: s.weight });
        }
      }
    }
    return collected;
  }

  function computeExerciseSummary(exerciseIdOrIds, startKey, endKey, unit) {
    const ids = Array.isArray(exerciseIdOrIds) ? exerciseIdOrIds : [exerciseIdOrIds];
    let totalReps = 0;
    let totalVolume = 0;
    let maxReps = 0;
    let maxNum = null;
    let hasBW = false;
    let sessions = 0;
    let totalSets = 0;

    for (const dk of Object.keys(state.logsByDate)) {
      if (!isValidDateKey(dk)) continue;
      if (!inRangeInclusive(dk, startKey, endKey)) continue;

      let dayHit = false;
      for (const exerciseId of ids) {
        const exLog = state.logsByDate[dk]?.[exerciseId];
        if (!exLog || !Array.isArray(exLog.sets)) continue;

        const completedInDay = exLog.sets.filter((s) => isSetCompleted(s));
        if (completedInDay.length === 0) continue;

        if (!dayHit) { sessions++; dayHit = true; }
        totalSets += completedInDay.length;

        for (const set of completedInDay) {
          const reps = Number(set.reps ?? 0);
          if (Number.isFinite(reps)) {
            totalReps += reps;
            if (reps > maxReps) maxReps = reps;
          }

          const w = String(set.weight ?? "").trim();
          if (w.toUpperCase() === "BW") {
            hasBW = true;
          } else {
            const n = toNumberOrNull(w);
            if (n != null) {
              maxNum = maxNum == null ? n : Math.max(maxNum, n);
              if (Number.isFinite(reps)) totalVolume += reps * n;
            }
          }
        }
      }
    }

    const displayTotal = unit?.allowDecimal
      ? parseFloat(totalReps.toFixed(2))
      : Math.floor(totalReps);
    const displayMaxReps = unit?.allowDecimal
      ? parseFloat(maxReps.toFixed(2))
      : Math.floor(maxReps);

    return { totalReps: displayTotal, totalVolume: Math.round(totalVolume), maxReps: displayMaxReps, maxWeight: formatMaxWeight(maxNum, hasBW), sessions, totalSets };
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const openLog = useCallback(
    (workoutId, exercise) => {
      const exerciseId = exercise.id;
      const existing = state.logsByDate[dateKey]?.[exerciseId] ?? null;
      const template = findMostRecentLogBefore(exerciseId, dateKey, {
        catalogId: exercise.catalogId || null,
        name: exercise.name || null,
      });
      const prior = existing ?? template;

      const workout = workoutById.get(workoutId);
      const schemeStr = exercise.scheme || workout?.scheme || null;
      let sets;
      if (prior?.sets?.length) {
        sets = prior.sets.map((s) => ({
          reps: Number(s.reps ?? 0) || 0,
          weight: typeof s.weight === "string" ? s.weight : "",
          targetRpe: s.targetRpe || "",
          targetPace: s.targetPace || "",
          targetCustom: s.targetCustom || "",
          targetIntensity: s.targetIntensity || "",
        }));
      } else {
        // Pre-fill from scheme (e.g. "3x8-12" → 3 sets of 8 reps)
        const scheme = schemeStr ? parseScheme(schemeStr) : null;
        if (scheme) {
          sets = Array.from({ length: scheme.sets }, () => ({ reps: scheme.reps, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" }));
        } else {
          const emptySet = () => ({ reps: 0, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" });
          sets = [emptySet(), emptySet(), emptySet()];
        }
      }

      // Pad partial logs with remaining template sets — only when no existing
      // log for today. If the user already saved, respect their set count.
      if (!existing && template?.sets?.length && sets.length < template.sets.length) {
        for (let i = sets.length; i < template.sets.length; i++) {
          const ts = template.sets[i];
          sets.push({
            reps: Number(ts.reps ?? 0) || 0,
            weight: typeof ts.weight === "string" ? ts.weight : "",
            targetRpe: ts.targetRpe || "",
            targetPace: ts.targetPace || "",
            targetCustom: ts.targetCustom || "",
            targetIntensity: ts.targetIntensity || "",
          });
        }
      }

      // Pad from scheme if still fewer sets than scheme specifies — same guard
      const parsedScheme = schemeStr ? parseScheme(schemeStr) : null;
      if (!existing && parsedScheme && sets.length < parsedScheme.sets) {
        for (let i = sets.length; i < parsedScheme.sets; i++) {
          sets.push({ reps: parsedScheme.reps, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" });
        }
      }

      const existingSets = existing?.sets;
      const normalizedSets = sets.map((s, i) => {
        const isBW = String(s.weight).toUpperCase() === "BW";
        return {
          reps: s.reps,
          weight: isBW ? "BW" : String(s.weight ?? "").trim(),
          targetRpe: s.targetRpe || "",
          targetPace: s.targetPace || "",
          targetCustom: s.targetCustom || "",
          targetIntensity: s.targetIntensity || "",
          completed: !!(existingSets?.[i] && isSetCompleted(existingSets[i])),
        };
      });

      setShowTargetConfig(false);
      setPacePopoverIdx(null);
      setRpePopoverIdx(null);
      setIntensityPopoverIdx(null);
      dispatchModal({
        type: "OPEN_LOG",
        payload: {
          context: {
            workoutId,
            exerciseId,
            exerciseName: exercise.name,
            catalogId: exercise.catalogId || null,
            unit: exercise.unit || "reps",
            customUnitAbbr: exercise.customUnitAbbr || "",
            customUnitAllowDecimal: exercise.customUnitAllowDecimal ?? false,
            scheme: schemeStr,
            workoutExercises: workout?.exercises || [],
          },
          sets: normalizedSets,
          notes: prior?.notes ?? "",
          mood: existing?.mood ?? null,
        },
      });
    },
    [state.logsByDate, dateKey]
  );

  // Save log data to state without closing the modal
  const saveLogData = useCallback(() => {
    if (!modals.log.context) return;

    const logCtx = modals.log.context;

    updateState((st) => {
      const logExercise = findExerciseById(st, logCtx.exerciseId);
      const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");

      const cleanSet = (s) => {
        const reps = Number(s.reps ?? 0);
        const repsClean = Number.isFinite(reps) && reps > 0
          ? (logUnit.allowDecimal ? parseFloat(reps.toFixed(2)) : Math.floor(reps))
          : 0;
        const w = String(s.weight ?? "").trim();
        const weight = w.toUpperCase() === "BW" ? "BW" : w.replace(/[^\d.]/g, "");
        const result = { reps: repsClean, weight: weight || "" };
        if (s.targetRpe) result.targetRpe = s.targetRpe;
        if (s.targetPace) result.targetPace = s.targetPace;
        if (s.targetCustom) result.targetCustom = s.targetCustom;
        if (s.targetIntensity) result.targetIntensity = s.targetIntensity;
        return result;
      };

      // Save all modal sets, including completion flags from modal state
      const allSets = (Array.isArray(modals.log.sets) ? modals.log.sets : []).map((modalSet) => {
        const cleaned = cleanSet(modalSet);
        return { ...cleaned, completed: !!modalSet.completed };
      });

      st.logsByDate[dateKey] = st.logsByDate[dateKey] ?? {};
      const logEntry = {
        sets: allSets,
        notes: modals.log.notes ?? "",
      };
      if (modals.log.mood != null) logEntry.mood = modals.log.mood;
      st.logsByDate[dateKey][logCtx.exerciseId] = logEntry;

      // Advance the continuous-split queue once per day when the user logs a
      // completed set against the current next-up member. Multiple set saves
      // within a day stay idempotent thanks to the lastAdvancedAt date check.
      const hasCompleted = allSets.some((s) => s.completed);
      if (hasCompleted) {
        for (const s of st.program?.splits || []) {
          if (s.mode !== SPLIT_MODES.CONTINUOUS) continue;
          if (!Array.isArray(s.members) || s.members.length === 0) continue;
          const lastAdvancedDate = s.lastAdvancedAt
            ? new Date(s.lastAdvancedAt).toISOString().slice(0, 10)
            : null;
          if (lastAdvancedDate === dateKey) continue;

          const memberCount = s.members.length;
          const idx = (((s.queuePosition || 0) % memberCount) + memberCount) % memberCount;
          const member = s.members[idx];
          if (!member) continue;
          const memberWorkout = st.program.workouts.find((w) => w.id === member.workoutId);
          if (!memberWorkout) continue;
          const matchesNextUp = (memberWorkout.exercises || []).some((ex) => ex.id === logCtx.exerciseId);
          if (!matchesNextUp) continue;

          s.queuePosition = (idx + 1) % memberCount;
          s.lastAdvancedAt = Date.now();
        }
      }

      return st;
    });

  }, [modals.log, dateKey]);

  const saveLog = useCallback(() => {
    if (!modals.log.context) return;

    const exId = modals.log.context.exerciseId;
    const existing = state.logsByDate[dateKey]?.[exId];
    saveLogData();

    // New-PR detection: compare today's best completed sets against the all-time
    // best from every OTHER day (pre-save state). Only celebrate when a prior
    // record existed (so a first-ever log isn't a "PR") and only when logging for
    // TODAY — editing/backfilling a past date shouldn't trigger a live PR toast.
    let prMsg = null;
    if (dateKey === todayKey) {
      const prior = computePRs(state.logsByDate, [exId], dateKey);
      let tW = 0;
      let tReps = 0;
      for (const s of modals.log.sets || []) {
        if (!s.completed) continue;
        const r = Number(s.reps) || 0;
        if (r > tReps) tReps = r;
        const wRaw = String(s.weight ?? "").trim();
        if (wRaw.toUpperCase() !== "BW") {
          const w = parseFloat(wRaw.replace(/[^\d.]/g, ""));
          if (Number.isFinite(w)) tW = Math.max(tW, w);
        }
      }
      const unit = getWeightLabel(state.preferences?.measurementSystem);
      if (tW > 0 && prior.topWeight && tW > prior.topWeight.value) prMsg = `🏆 New PR! ${tW}${unit}`;
      else if (tW === 0 && tReps > 0 && prior.maxReps && tReps > prior.maxReps.value) prMsg = `🏆 New PR! ${tReps} reps`;
    }

    // Toast only for meaningful changes (not template-only saves)
    const notesChanged = (modals.log.notes ?? "") !== (existing?.notes ?? "");
    const moodChanged = modals.log.mood !== (existing?.mood ?? null);

    if (prMsg) {
      setToast(prMsg);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    } else if (notesChanged || moodChanged) {
      const ack = selectAcknowledgment(modals.log.mood, dateKey, state.logsByDate);
      setToast(ack);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 2500);
    }

    // Dismiss rest timer when closing modal
    setRestTimer((prev) => prev.active ? { ...prev, active: false } : prev);
    setShowTargetConfig(false);
    setPacePopoverIdx(null);
    setRpePopoverIdx(null);

    dispatchModal({ type: "CLOSE_LOG" });
  }, [modals.log, dateKey, state.logsByDate, state.dailyWorkouts, state.preferences, saveLogData, session]);

  // Check if navigation to next/prev exercise is possible
  const canNavLogExercise = useCallback((direction) => {
    const ctx = modals.log.context;
    if (!ctx) return null;
    const exList = ctx.workoutExercises || [];
    const idx = exList.findIndex((e) => e.id === ctx.exerciseId);
    return exList[idx + direction] || null;
  }, [modals.log.context]);

  // Swap to target exercise (called after fly-off animation)
  const swapLogExercise = useCallback((target) => {
    const ctx = modals.log.context;
    if (!ctx) return;
    setRestTimer((prev) => prev.active ? { ...prev, active: false } : prev);
    setShowTargetConfig(false);
    setPacePopoverIdx(null);
    setRpePopoverIdx(null);
    saveLogData();
    openLog(ctx.workoutId, target);
  }, [modals.log.context, saveLogData, openLog]);

  // Flip log card to show exercise detail (back face) or return to log (front face)
  const flipLogToDetail = useCallback((dir) => {
    if (!logDetailEntry) return;
    // Blur any focused input (e.g. notes textarea) so native selection
    // handles (Android blue bubble) don't persist on the detail face.
    try { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); } catch (_) {}
    clearTimeout(logFlipTimeoutRef.current);
    const angle = dir === "right" ? -180 : 180;
    logFlipAngleRef.current = angle;
    setLogFlipAngle(angle);
    setLogFlipped(true);
  }, [logDetailEntry]);

  const flipLogToFront = useCallback(() => {
    clearTimeout(logFlipTimeoutRef.current);
    logFlipAngleRef.current = 0;
    setLogFlipAngle(0);
    logFlipTimeoutRef.current = setTimeout(() => setLogFlipped(false), 450);
  }, []);

  // --- Real-time drag-to-navigate touch system ---
  // ALL touch listeners are passive addEventListener (not React props) so the
  // browser never delays native scrolling waiting for JS.
  // Swipe DOWN (prev): works from anywhere when at scroll top
  // Swipe UP (next): footer only — avoids bottom-boundary scroll conflicts
  // Horizontal swipe (flip): works from anywhere on the card
  const logTouchEndRef = useRef(null);
  logTouchEndRef.current = { canNavLogExercise, swapLogExercise, flipLogToDetail, flipLogToFront };

  useEffect(() => {
    const el = logCardRef.current;
    if (!el) return;

    const onStart = (e) => {
      if (logNavAnimRef.current) return;
      const angle = logFlipAngleRef.current;
      if (angle !== 0 && angle !== 180 && angle !== -180) return;
      const t = e.touches?.[0];
      if (!t) return;
      const isFlipped = angle === 180 || angle === -180;
      const d = logDragRef.current;
      d.active = true;
      d.startY = t.clientY;
      d.startX = t.clientX;
      d.currentY = t.clientY;
      d.captured = false;
      d.direction = 0;
      d.isHorizontal = false;
      d.captureY = 0;
      if (isFlipped) {
        d.swipeZone = null;
      } else if (logFooterRef.current?.contains(e.target)) {
        d.swipeZone = "footer";
      } else {
        d.swipeZone = "body";
      }
    };

    const onMove = (e) => {
      const d = logDragRef.current;
      if (!d.active) return;
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - d.startX;
      const dy = t.clientY - d.startY;

      // Axis detection: first 10px decides horizontal vs vertical
      if (!d.captured && !d.isHorizontal && Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (!d.captured && !d.isHorizontal) {
        if (Math.abs(dx) > Math.abs(dy)) {
          d.isHorizontal = true;
          return;
        }
      }
      if (d.isHorizontal) return;

      if (!d.swipeZone) { d.active = false; return; }

      if (!d.captured) {
        const direction = dy < 0 ? 1 : -1;
        if (d.swipeZone === "body") {
          if (direction !== -1) { d.active = false; return; }
          const scrollEl = logBodyRef.current;
          if (!scrollEl || scrollEl.scrollTop > 5) { d.active = false; return; }
        }
        const fns = logTouchEndRef.current;
        const target = fns.canNavLogExercise(direction);
        if (!target) { d.active = false; return; }
        d.captured = true;
        d.direction = direction;
        d.captureY = t.clientY;
        const card = logCardRef.current;
        if (card) card.style.willChange = "transform, opacity";
        return;
      }

      // Drag captured — update card transform
      d.currentY = t.clientY;
      const rawDy = t.clientY - d.captureY;
      const screenH = window.innerHeight;
      const progress = Math.min(Math.abs(rawDy) / screenH, 1);
      const rotation = (rawDy / screenH) * 8;
      const scale = 1 - progress * 0.06;
      const opacity = 1 - progress * 0.5;
      const card = logCardRef.current;
      if (card) {
        card.style.transform = `translateY(${rawDy}px) rotate(${rotation}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
      }
    };

    const onEnd = (e) => {
      const d = logDragRef.current;
      if (!d.active) return;
      d.active = false;
      const card = logCardRef.current;
      const fns = logTouchEndRef.current;

      if (d.isHorizontal) {
        const end = e.changedTouches?.[0];
        if (end) {
          const dx = end.clientX - d.startX;
          if (Math.abs(dx) >= 50) {
            const isFlipped = logFlipAngleRef.current === 180 || logFlipAngleRef.current === -180;
            if (isFlipped) fns.flipLogToFront();
            else fns.flipLogToDetail(dx < 0 ? "left" : "right");
          }
        }
        return;
      }

      if (!d.captured || !card) return;
      const rawDy = (e.changedTouches?.[0]?.clientY ?? d.currentY) - d.captureY;
      const screenH = window.innerHeight;
      const progress = Math.abs(rawDy) / screenH;

      if (progress >= 0.15) {
        const target = fns.canNavLogExercise(d.direction);
        if (!target) { resetCard(); return; }
        logNavAnimRef.current = "flying";
        if (d.direction > 0) {
          card.style.transition = "transform 0.25s ease-in, opacity 0.25s ease-in";
          card.style.transform = `translateY(${-screenH}px) rotate(-15deg)`;
          card.style.opacity = "0";
          setTimeout(() => {
            fns.swapLogExercise(target);
            card.style.transition = "none";
            card.style.transform = "translateY(40px) scale(0.95)";
            card.style.opacity = "0";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = "transform 0.35s cubic-bezier(.2,.8,.3,1), opacity 0.35s ease-out";
                card.style.transform = "none";
                card.style.opacity = "1";
                setTimeout(() => { card.style.willChange = ""; card.style.transition = ""; logNavAnimRef.current = null; }, 350);
              });
            });
          }, 250);
        } else {
          fns.swapLogExercise(target);
          card.style.transition = "none";
          card.style.transform = `translateY(${-screenH}px) rotate(-8deg)`;
          card.style.opacity = "0";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = "transform 0.35s cubic-bezier(.2,.8,.3,1), opacity 0.35s ease-out";
              card.style.transform = "none";
              card.style.opacity = "1";
              setTimeout(() => { card.style.willChange = ""; card.style.transition = ""; logNavAnimRef.current = null; }, 350);
            });
          });
        }
      } else {
        resetCard();
      }

      function resetCard() {
        card.style.transition = "transform 0.45s cubic-bezier(.25,1.5,.35,1), opacity 0.3s ease-out";
        card.style.transform = "none";
        card.style.opacity = "1";
        setTimeout(() => { card.style.willChange = ""; card.style.transition = ""; logNavAnimRef.current = null; }, 450);
      }
    };

    const onCancel = () => {
      const d = logDragRef.current;
      d.active = false;
      d.captured = false;
      const card = logCardRef.current;
      if (card) { card.style.transform = ""; card.style.opacity = ""; card.style.transition = ""; card.style.willChange = ""; }
      logNavAnimRef.current = null;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onCancel);
    };
  }, [modals.log.isOpen]);

  const completeSet = useCallback(
    (exerciseId, setIndex, setData, workoutId, modalSetCount) => {
      // Haptic feedback
      navigator.vibrate?.(10);

      // Stage completion in modal state (not persisted until Save)
      dispatchModal({ type: "COMPLETE_LOG_SET", payload: { setIndex } });

      // Smart toast — compute context using modal state for current exercise, persisted state for others
      const workout = workoutById.get(workoutId);
      const exercises = workout?.exercises || [];

      // For current exercise: modal sets with this set marked completed
      const modalSets = [...(modals.log.sets || [])];
      while (modalSets.length <= setIndex) modalSets.push({ reps: 0, weight: "", completed: false });
      modalSets[setIndex] = { ...modalSets[setIndex], completed: true };

      // Build combined day logs: persisted state for other exercises, modal state for current
      const updatedDayLogs = { ...state.logsByDate[dateKey] };
      updatedDayLogs[exerciseId] = { sets: modalSets };

      const isWorkoutComplete = exercises.length > 0 && exercises.every((ex) => {
        const exLog = updatedDayLogs[ex.id];
        if (!exLog?.sets?.length) return false;
        const completedCount = exLog.sets.filter((s) => isSetCompleted(s)).length;
        const exPrior = findMostRecentLogBefore(ex.id, dateKey);
        const exScheme = ex.scheme || workout?.scheme || null;
        const exSchemeParsed = exScheme ? parseScheme(exScheme) : null;
        const exTotal = exLog.sets.length;
        return exTotal > 0 ? completedCount >= exTotal : completedCount > 0;
      });

      // Count exercises logged today
      const exercisesDoneToday = Object.keys(updatedDayLogs).filter(
        (eid) => updatedDayLogs[eid]?.sets?.some((s) => isSetCompleted(s))
      ).length;

      // Compute totalSets from today's template
      const prior = findMostRecentLogBefore(exerciseId, dateKey);
      const schemeStr = exercises.find((e) => e.id === exerciseId)?.scheme || workout?.scheme || null;
      const schemeParsed = schemeStr ? parseScheme(schemeStr) : null;
      const totalSets = modalSets.length;

      // Cross-instance prior-sets lookup so first-ever / PR detection survives id churn
      // (same exercise re-added to a new program day, swapped, or copied gets a fresh id).
      const exerciseObjForToast = exercises.find((e) => e.id === exerciseId) || findExerciseById(state, exerciseId);
      const matchMeta = exerciseObjForToast
        ? { catalogId: exerciseObjForToast.catalogId || null, name: exerciseObjForToast.name || null }
        : null;
      const priorSetsForToast = getPriorSetsForExercise(exerciseId, dateKey, matchMeta);

      // Recently-shown toast messages — used to suppress repeats across the day/week.
      let recentMessages = [];
      try {
        const raw = localStorage.getItem("wt_recent_toasts");
        if (raw) recentMessages = JSON.parse(raw) || [];
      } catch {}

      const toastObj = selectSetCompletionToast({
        exerciseId,
        setData,
        setIndex,
        totalSets,
        logsByDate: state.logsByDate,
        dateKey,
        isWorkoutComplete,
        exercisesDoneToday,
        priorSets: priorSetsForToast,
        recentMessages,
      });

      if (toastObj) {
        try {
          const next = [toastObj.message, ...recentMessages.filter((m) => m !== toastObj.message)].slice(0, 6);
          localStorage.setItem("wt_recent_toasts", JSON.stringify(next));
        } catch {}
        setToast(toastObj);
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), isWorkoutComplete ? 3500 : 2000);
      }
      // If toastObj is null we stay silent — any in-flight toast finishes its scheduled time.

      // Rest timer decision
      const completedSetsCount = modalSets.filter((s) => isSetCompleted(s)).length;
      const hasMoreSets = completedSetsCount < totalSets;
      const exerciseObj = exercises.find((e) => e.id === exerciseId) || findExerciseById(state, exerciseId);
      const exRestEnabled = exerciseObj?.restTimer !== undefined
        ? exerciseObj.restTimer
        : state.preferences?.restTimerEnabled !== false;
      // Fire rest timer if enabled and there are more sets (even if workout is "complete" —
      // historical data can make isWorkoutComplete true prematurely)
      if (exRestEnabled && hasMoreSets) {
        const exName = exerciseObj?.name || "";
        const learnedKey = exName.toLowerCase().trim();
        const learnedRest = state.preferences?.exerciseRestTimes?.[learnedKey];
        const restSec = learnedRest || exerciseObj?.restSec || state.preferences?.defaultRestSec || 90;
        setRestTimer({ active: true, exerciseId, exerciseName: exName, restSec, completedSetIndex: setIndex });
      } else {
        setRestTimer((prev) => prev.active ? { ...prev, active: false } : prev);
        if (autoStartTimer) {
          setTimeout(() => setAutoStartSignal((s) => s + 1), 100);
        }
      }
    },
    [dateKey, state.logsByDate, state.preferences, workoutById, autoStartTimer, modals.log.sets]
  );

  const uncompleteSet = useCallback(
    (exerciseId, setIndex) => {
      // Stage uncompletion in modal state (not persisted until Save)
      dispatchModal({ type: "UNCOMPLETE_LOG_SET", payload: { setIndex } });

      setRestTimer((prev) =>
        prev.active && prev.exerciseId === exerciseId && prev.completedSetIndex === setIndex
          ? { ...prev, active: false }
          : prev
      );
    },
    []
  );

  const toggleExerciseTarget = useCallback(
    (exerciseId, targetKey) => {
      updateState((st) => {
        forEachExercise(st, (ex) => {
          if (ex.id !== exerciseId) return;
          const cur = ex.targets || [];
          ex.targets = cur.includes(targetKey) ? cur.filter((t) => t !== targetKey) : [...cur, targetKey];
        });
        return st;
      });
    },
    []
  );

  const toggleExerciseBodyweight = useCallback(
    (exerciseId) => {
      updateState((st) => {
        forEachExercise(st, (ex) => {
          if (ex.id !== exerciseId) return;
          ex.bodyweight = !ex.bodyweight;
        });
        return st;
      });
    },
    []
  );

  const toggleExerciseRestTimer = useCallback(
    (exerciseId) => {
      updateState((st) => {
        const globalEnabled = st.preferences?.restTimerEnabled !== false;
        forEachExercise(st, (ex) => {
          if (ex.id !== exerciseId) return;
          const current = ex.restTimer !== undefined ? ex.restTimer : globalEnabled;
          ex.restTimer = !current;
        });
        return st;
      });
    },
    []
  );

  const toggleWorkoutRestTimer = useCallback(
    (workoutId) => {
      updateState((st) => {
        const globalEnabled = st.preferences?.restTimerEnabled !== false;
        const findWk = (wk) => wk.id === workoutId;
        const wk = st.program.workouts.find(findWk)
          || Object.values(st.dailyWorkouts || {}).flat().find(findWk);
        // Collect session additions for this workout to include in the toggle
        const allDateAdds = Object.values(st.sessionAdditions || {});
        const addedExercises = allDateAdds.flatMap(dateObj => dateObj[workoutId] || []);
        // Collect swap replacements for this workout (sessionOverrides) — otherwise they're
        // visible in the rollup but invisible to the toggle, leaving icon stuck in "mixed"
        const swapReplacements = [];
        for (const wOverrides of Object.values(st.sessionOverrides || {})) {
          const exOverrides = wOverrides?.[workoutId];
          if (!exOverrides) continue;
          for (const ov of Object.values(exOverrides)) {
            if (ov?.type === "swap" && ov.replacement) swapReplacements.push(ov.replacement);
          }
        }
        if (!wk && addedExercises.length === 0 && swapReplacements.length === 0) return st;
        // Compute current state: are any exercises enabled?
        const allExercises = [...(wk?.exercises || []), ...addedExercises, ...swapReplacements];
        const anyOn = allExercises.some((ex) =>
          ex.restTimer !== undefined ? ex.restTimer : globalEnabled
        );
        // If any are on → turn all off. If all off → turn all on.
        const newVal = !anyOn;
        const setAll = (w) => {
          if (w.id !== workoutId) return;
          for (const ex of w.exercises) ex.restTimer = newVal;
        };
        for (const w of st.program.workouts) setAll(w);
        for (const key of Object.keys(st.dailyWorkouts || {})) {
          for (const w of st.dailyWorkouts[key]) setAll(w);
        }
        for (const ex of addedExercises) ex.restTimer = newVal;
        for (const ex of swapReplacements) ex.restTimer = newVal;
        return st;
      });
    },
    []
  );

  const handleRestTimeObserved = useCallback((exerciseName, observedSec) => {
    if (!exerciseName || observedSec < 5) return;
    updateState((st) => {
      const key = exerciseName.toLowerCase().trim();
      const current = st.preferences?.exerciseRestTimes?.[key];
      if (!st.preferences) st.preferences = {};
      if (!st.preferences.exerciseRestTimes) st.preferences.exerciseRestTimes = {};
      st.preferences.exerciseRestTimes[key] = updateRestAverage(current, observedSec);
      return st;
    });
  }, []);

  const updatePreference = useCallback((key, value) => {
    updateState((st) => {
      if (!st.preferences) st.preferences = {};
      st.preferences[key] = value;
      return st;
    });
  }, []);

  const findPriorForExercise = useCallback(
    (exerciseId) => findMostRecentLogBefore(exerciseId, dateKey),
    [state.logsByDate, dateKey]
  );

  const deleteLogForExercise = useCallback(
    (exerciseId) => {
      updateState((st) => {
        if (!st.logsByDate[dateKey]) return st;
        delete st.logsByDate[dateKey][exerciseId];
        if (Object.keys(st.logsByDate[dateKey]).length === 0) {
          delete st.logsByDate[dateKey];
        }
        return st;
      });
    },
    [dateKey]
  );

  function addWorkout() {
    dispatchModal({ type: "OPEN_ADD_WORKOUT" });
  }

  const openEditWorkout = useCallback(
    (workoutId) => {
      const w = workoutById.get(workoutId);
      if (!w) return;
      dispatchModal({
        type: "OPEN_EDIT_WORKOUT",
        payload: {
          workoutId,
          name: w.name,
          category: (w.category || "Workout").trim(),
          cadence: w.cadence || { mode: "whenever" },
        },
      });
    },
    [workoutById]
  );

  const saveEditWorkout = useCallback(() => {
    if (!modals.editWorkout) return;
    const { workoutId, name, category, cadence } = modals.editWorkout;
    const validation = validateWorkoutName(name, workouts.filter((x) => x.id !== workoutId));
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (w) {
        w.name = name.trim();
        w.category = (category || "Workout").trim() || "Workout";
        w.cadence = normalizeCadence(cadence);
      }
      return st;
    });
    dispatchModal({ type: "CLOSE_EDIT_WORKOUT" });
  }, [modals.editWorkout, workouts]);

  // ---------------------------------------------------------------------------
  // Splits — CRUD + cadence side effects
  // (splits + workoutToSplit are derived earlier so home-screen layers can
  //  reference them; only the handlers live here.)
  // ---------------------------------------------------------------------------
  const openCreateSplit = useCallback(() => {
    dispatchModal({
      type: "OPEN_EDIT_SPLIT",
      payload: { splitId: null, name: "", mode: SPLIT_MODES.WEEKLY, members: [], restPattern: null },
    });
  }, []);

  // Pencil from SplitDetailSheet — edit name/mode/rest + add/remove/reorder members.
  // Members are staged in modal state and persisted on Save.
  const openEditSplit = useCallback(
    (splitId) => {
      const s = splits.find((x) => x.id === splitId);
      if (!s) return;
      dispatchModal({
        type: "OPEN_EDIT_SPLIT",
        payload: {
          splitId: s.id,
          name: s.name,
          mode: s.mode,
          members: (s.members || []).map((m) => ({
            workoutId: m.workoutId,
            days: Array.isArray(m.days) ? [...m.days] : [],
          })),
          restPattern: s.restPattern || null,
        },
      });
    },
    [splits]
  );

  // Tap a split row in the Plans tab — opens the detail sheet (members live there).
  const openSplitDetail = useCallback(
    (splitId) => {
      dispatchModal({ type: "OPEN_SPLIT_DETAIL", payload: { splitId } });
    },
    []
  );

  // Persists staged name / mode / restPattern AND members. Cadence diffs are
  // applied: new members get the split's cadence; removed members revert to
  // whenever (unless they're still in another split).
  const saveEditSplit = useCallback(() => {
    if (!modals.editSplit) return;
    const { splitId, name, mode, members, restPattern } = modals.editSplit;
    const trimmedName = (name || "").trim();
    if (!trimmedName) {
      showToast("Give your split a name.");
      return;
    }

    const isNew = !splitId;
    const id = splitId || uid("split");
    const stagedMemberIds = new Set((members || []).map((m) => m.workoutId));

    updateState((st) => {
      if (!st.program.splits) st.program.splits = [];

      // Members of every OTHER split — used to skip cadence reverts for workouts
      // that still live elsewhere.
      const otherSplitMemberIds = new Set();
      for (const s of (st.program.splits || [])) {
        if (s.id === id) continue;
        for (const m of (s.members || [])) otherSplitMemberIds.add(m.workoutId);
      }

      const prev = st.program.splits.find((s) => s.id === id);
      const prevMemberIds = new Set((prev?.members || []).map((m) => m.workoutId));

      // Members dropped in this save → revert their cadence if not held elsewhere.
      for (const wid of prevMemberIds) {
        if (stagedMemberIds.has(wid)) continue;
        if (otherSplitMemberIds.has(wid)) continue;
        const w = st.program.workouts.find((x) => x.id === wid);
        if (w) w.cadence = { mode: CADENCE_MODES.WHENEVER };
      }

      // Apply cadence to current staged members based on split mode.
      for (const m of (members || [])) {
        const w = st.program.workouts.find((x) => x.id === m.workoutId);
        if (!w) continue;
        if (mode === SPLIT_MODES.CONTINUOUS) {
          w.cadence = { mode: CADENCE_MODES.CONTINUOUS };
        } else {
          const days = Array.isArray(m.days) ? m.days : [];
          w.cadence = days.length > 0
            ? { mode: CADENCE_MODES.ANCHOR, days }
            : { mode: CADENCE_MODES.WHENEVER };
        }
      }

      const splitData = normalizeSplit({
        id,
        name: trimmedName,
        mode,
        members: (members || []).map((m, i) => ({
          workoutId: m.workoutId,
          order: i,
          days: Array.isArray(m.days) ? m.days : [],
        })),
        restPattern: mode === SPLIT_MODES.CONTINUOUS ? restPattern : null,
        queuePosition: prev?.queuePosition || 0,
      });

      if (prev) {
        const idx = st.program.splits.findIndex((s) => s.id === id);
        st.program.splits[idx] = splitData;
      } else {
        st.program.splits.push(splitData);
      }
      return st;
    });

    dispatchModal({ type: "CLOSE_EDIT_SPLIT" });
    if (isNew) {
      // Open the detail sheet for the freshly-created split.
      setTimeout(() => dispatchModal({ type: "OPEN_SPLIT_DETAIL", payload: { splitId: id } }), 0);
    }
  }, [modals.editSplit]);

  // --- Immediate member handlers used by SplitDetailSheet ---
  // Cadence applied/reverted in step with each change.
  const applyMemberCadence = (w, splitMode, days) => {
    if (splitMode === SPLIT_MODES.CONTINUOUS) {
      w.cadence = { mode: CADENCE_MODES.CONTINUOUS };
    } else {
      w.cadence = (days || []).length > 0
        ? { mode: CADENCE_MODES.ANCHOR, days: [...days] }
        : { mode: CADENCE_MODES.WHENEVER };
    }
  };

  const addSplitMember = useCallback((splitId, workoutId) => {
    updateState((st) => {
      const s = (st.program.splits || []).find((x) => x.id === splitId);
      if (!s) return st;
      if ((s.members || []).some((m) => m.workoutId === workoutId)) return st;
      const order = (s.members || []).length;
      s.members = [...(s.members || []), { workoutId, order, days: [] }];
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (w) applyMemberCadence(w, s.mode, []);
      return st;
    });
  }, []);

  const removeSplitMember = useCallback((splitId, workoutId) => {
    updateState((st) => {
      const s = (st.program.splits || []).find((x) => x.id === splitId);
      if (!s) return st;
      s.members = (s.members || [])
        .filter((m) => m.workoutId !== workoutId)
        .map((m, i) => ({ ...m, order: i }));
      // Revert cadence unless the workout is still in another split.
      const otherSplitMemberIds = new Set();
      for (const other of (st.program.splits || [])) {
        if (other.id === splitId) continue;
        for (const m of (other.members || [])) otherSplitMemberIds.add(m.workoutId);
      }
      if (!otherSplitMemberIds.has(workoutId)) {
        const w = st.program.workouts.find((x) => x.id === workoutId);
        if (w) w.cadence = { mode: CADENCE_MODES.WHENEVER };
      }
      return st;
    });
  }, []);

  const reorderSplitMembers = useCallback((splitId, fromIdx, toIdx) => {
    updateState((st) => {
      const s = (st.program.splits || []).find((x) => x.id === splitId);
      if (!s) return st;
      const arr = s.members || [];
      if (fromIdx < 0 || fromIdx >= arr.length) return st;
      if (toIdx < 0 || toIdx >= arr.length) return st;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      arr.forEach((m, i) => { m.order = i; });
      return st;
    });
  }, []);

  const setSplitMemberDays = useCallback((splitId, workoutId, days) => {
    updateState((st) => {
      const s = (st.program.splits || []).find((x) => x.id === splitId);
      if (!s) return st;
      const m = (s.members || []).find((mm) => mm.workoutId === workoutId);
      if (m) m.days = [...days];
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (w && s.mode === SPLIT_MODES.WEEKLY) applyMemberCadence(w, SPLIT_MODES.WEEKLY, days);
      return st;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Cadence drift detection — surface "your schedule shifted" prompts
  // ---------------------------------------------------------------------------

  // For each workout, the dateKeys in [today - 30 days, today) where any of its
  // exercises have completed sets. Cheap enough to compute on render — only
  // touched when state.logsByDate or workouts changes.
  const workoutLogDates = useMemo(() => {
    if (!isToday) return EMPTY_OBJ;
    const result = {};
    const startKey = addDays(dateKey, -30);
    const allLogs = state.logsByDate || EMPTY_OBJ;
    const allLogKeys = Object.keys(allLogs).filter((k) => k >= startKey && k < dateKey);

    for (const w of workouts) {
      if (!Array.isArray(w.exercises) || w.exercises.length === 0) continue;
      const exerciseIds = new Set(w.exercises.map((ex) => ex.id));
      const dates = [];
      for (const dk of allLogKeys) {
        const dayLogs = allLogs[dk];
        if (!dayLogs) continue;
        let matched = false;
        for (const exId of Object.keys(dayLogs)) {
          if (!exerciseIds.has(exId)) continue;
          const sets = dayLogs[exId]?.sets;
          if (Array.isArray(sets) && sets.some(isSetCompleted)) { matched = true; break; }
        }
        if (matched) dates.push(dk);
      }
      result[w.id] = dates;
    }
    return result;
  }, [isToday, dateKey, state.logsByDate, workouts]);

  // Single drift suggestion — pick the workout with the strongest signal.
  const driftSuggestion = useMemo(() => {
    if (!isToday) return null;
    const now = Date.now();
    const dismissals = state.cadenceDriftDismissals || EMPTY_OBJ;

    let best = null;
    for (const w of workouts) {
      if (!w.cadence || w.cadence.mode !== CADENCE_MODES.ANCHOR) continue;
      const dismissal = dismissals[w.id];
      if (dismissal?.until && dismissal.until > now) continue;

      const dates = workoutLogDates[w.id] || EMPTY_ARRAY;
      const drift = detectAnchorDrift(w.cadence, dates, dateKey);
      if (!drift) continue;

      if (!best || drift.occurrences > best.suggestion.occurrences) {
        best = { workout: w, suggestion: drift };
      }
    }
    return best;
  }, [isToday, workouts, workoutLogDates, dateKey, state.cadenceDriftDismissals]);

  const applyDriftSuggestion = useCallback(() => {
    if (!driftSuggestion) return;
    const { workout, suggestion } = driftSuggestion;
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workout.id);
      if (!w) return st;
      const newDays = suggestion.action === "replace"
        ? [suggestion.suggestedDay]
        : [...new Set([...suggestion.originalDays, suggestion.suggestedDay])].sort((a, b) => a - b);
      w.cadence = { mode: CADENCE_MODES.ANCHOR, days: newDays };
      if (st.cadenceDriftDismissals?.[workout.id]) {
        delete st.cadenceDriftDismissals[workout.id];
      }
      return st;
    });
    showToast("Schedule updated.");
  }, [driftSuggestion]);

  const snoozeDriftSuggestion = useCallback(() => {
    if (!driftSuggestion) return;
    const wid = driftSuggestion.workout.id;
    updateState((st) => {
      if (!st.cadenceDriftDismissals) st.cadenceDriftDismissals = {};
      st.cadenceDriftDismissals[wid] = { until: Date.now() + 28 * 24 * 60 * 60 * 1000 };
      return st;
    });
  }, [driftSuggestion]);

  const dismissDriftPermanently = useCallback(() => {
    if (!driftSuggestion) return;
    const wid = driftSuggestion.workout.id;
    updateState((st) => {
      if (!st.cadenceDriftDismissals) st.cadenceDriftDismissals = {};
      st.cadenceDriftDismissals[wid] = { until: Date.now() + 365 * 24 * 60 * 60 * 1000 };
      return st;
    });
  }, [driftSuggestion]);

  const restartContinuousSplit = useCallback(
    (splitId) => {
      const s = splits.find((x) => x.id === splitId);
      if (!s) return;
      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Restart sequence?",
          message: `Reset "${s.name}" to Day 1. Logs and history are preserved — only the queue position resets.`,
          confirmText: "Restart",
          onConfirm: () => {
            updateState((st) => {
              const target = (st.program.splits || []).find((x) => x.id === splitId);
              if (target) {
                target.queuePosition = 0;
                target.lastAdvancedAt = null;
              }
              return st;
            });
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
    },
    [splits]
  );

  const deleteSplit = useCallback(
    (splitId) => {
      const s = splits.find((x) => x.id === splitId);
      if (!s) return;
      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Delete split?",
          message: `"${s.name}" will be removed. Member workouts will revert to "Whenever — no schedule" but the workouts themselves stay.`,
          confirmText: "Delete",
          onConfirm: () => {
            updateState((st) => {
              // Only revert cadence for members not also in another split.
              const otherSplitMemberIds = new Set();
              for (const other of (st.program.splits || [])) {
                if (other.id === splitId) continue;
                for (const m of (other.members || [])) otherSplitMemberIds.add(m.workoutId);
              }
              for (const m of s.members || []) {
                if (otherSplitMemberIds.has(m.workoutId)) continue;
                const w = st.program.workouts.find((x) => x.id === m.workoutId);
                if (w) w.cadence = { mode: CADENCE_MODES.WHENEVER };
              }
              st.program.splits = (st.program.splits || []).filter((x) => x.id !== splitId);
              return st;
            });
            dispatchModal({ type: "CLOSE_EDIT_SPLIT" });
          },
        },
      });
    },
    [splits]
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
              // Purge deleted workout from todaySessions
              if (st.todaySessions) {
                for (const dk of Object.keys(st.todaySessions)) {
                  st.todaySessions[dk] = st.todaySessions[dk].filter(id => id !== workoutId);
                  if (st.todaySessions[dk].length === 0) delete st.todaySessions[dk];
                }
              }
              // Remove from any split it belongs to
              if (Array.isArray(st.program.splits)) {
                for (const s of st.program.splits) {
                  if (!Array.isArray(s.members)) continue;
                  s.members = s.members
                    .filter((m) => m.workoutId !== workoutId)
                    .map((m, i) => ({ ...m, order: i }));
                }
              }
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

  const renameWorkout = useCallback((workoutId, newName) => {
    const trimmed = (newName || "").trim();
    if (!trimmed) return;
    const validation = validateWorkoutName(trimmed, workouts.filter((x) => x.id !== workoutId));
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (w) w.name = trimmed;
      return st;
    });
  }, [workouts, showToast]);

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

  const addExerciseForToday = useCallback((workoutId, isDaily) => {
    dispatchModal({
      type: "OPEN_CATALOG_BROWSE",
      payload: { workoutId, sessionAddMode: true, sessionAddIsDaily: isDaily },
    });
  }, []);

  const removeSessionAddition = useCallback((workoutId, exerciseId) => {
    const adds = state.sessionAdditions?.[dateKey]?.[workoutId] || [];
    const ex = adds.find(e => e.id === exerciseId);
    const hasLog = (state.logsByDate?.[dateKey]?.[exerciseId]?.sets || []).some(s => isSetCompleted(s));

    const doRemove = () => {
      updateState((st) => {
        const curAdds = st.sessionAdditions?.[dateKey]?.[workoutId];
        if (!curAdds) return st;
        st.sessionAdditions[dateKey][workoutId] = curAdds.filter(e => e.id !== exerciseId);
        if (st.sessionAdditions[dateKey][workoutId].length === 0) delete st.sessionAdditions[dateKey][workoutId];
        if (Object.keys(st.sessionAdditions[dateKey] || {}).length === 0) delete st.sessionAdditions[dateKey];
        if (st.logsByDate[dateKey]?.[exerciseId]) {
          delete st.logsByDate[dateKey][exerciseId];
          if (Object.keys(st.logsByDate[dateKey]).length === 0) delete st.logsByDate[dateKey];
        }
        return st;
      });
      showToast("Exercise removed");
    };

    if (hasLog) {
      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Remove exercise?",
          message: `Remove "${ex?.name || "this exercise"}"? Your logged sets for today will also be deleted.`,
          confirmText: "Remove",
          onConfirm: () => { dispatchModal({ type: "CLOSE_CONFIRM" }); doRemove(); },
        },
      });
    } else {
      doRemove();
    }
  }, [dateKey, showToast, state.sessionAdditions, state.logsByDate]);

  const promoteSessionAddition = useCallback((workoutId, exerciseId) => {
    const adds = state.sessionAdditions?.[dateKey]?.[workoutId];
    const ex = adds?.find(e => e.id === exerciseId);
    if (!ex) return;
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Add to plan?",
        message: `Add "${ex.name}" to this workout permanently? It will appear in all future sessions.`,
        confirmText: "Add to Plan",
        onConfirm: () => {
          updateState((st) => {
            // Add to program workout (without _addedForToday flag)
            const w = st.program.workouts.find(x => x.id === workoutId);
            if (w) {
              const { _addedForToday, ...cleanEx } = ex;
              w.exercises.push(cleanEx);
            }
            // Remove from sessionAdditions
            const sAdds = st.sessionAdditions?.[dateKey]?.[workoutId];
            if (sAdds) {
              st.sessionAdditions[dateKey][workoutId] = sAdds.filter(e => e.id !== exerciseId);
              if (st.sessionAdditions[dateKey][workoutId].length === 0) delete st.sessionAdditions[dateKey][workoutId];
              if (Object.keys(st.sessionAdditions[dateKey] || {}).length === 0) delete st.sessionAdditions[dateKey];
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CONFIRM" });
          showToast("Exercise added to plan");
        },
      },
    });
  }, [dateKey, state.sessionAdditions, showToast]);

  const openEditExercise = useCallback(
    (workoutId, exerciseId) => {
      const w = workoutById.get(workoutId);
      const ex = w?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return;
      dispatchModal({
        type: "OPEN_EDIT_EXERCISE",
        payload: {
          workoutId,
          exerciseId,
          name: ex.name,
          unit: ex.unit || "reps",
          customUnitAbbr: ex.customUnitAbbr || "",
          customUnitAllowDecimal: ex.customUnitAllowDecimal ?? false,
          catalogId: ex.catalogId || null,
        },
      });
    },
    [workoutById]
  );

  const saveEditExercise = useCallback(() => {
    if (!modals.editExercise) return;
    const { workoutId, exerciseId, name, unit, customUnitAbbr, customUnitAllowDecimal, catalogId } = modals.editExercise;
    const w = workoutById.get(workoutId);
    const otherExercises = w?.exercises?.filter((e) => e.id !== exerciseId) || [];
    const validation = validateExerciseName(name, otherExercises);
    if (!validation.valid) {
      showToast(validation.error);
      return;
    }
    if (unit === "custom" && !customUnitAbbr?.trim()) {
      showToast("Please enter a custom unit abbreviation");
      return;
    }

    // No catalog match — route through AI enrichment flow
    if (!catalogId) {
      dispatchModal({ type: "CLOSE_EDIT_EXERCISE" });
      dispatchModal({
        type: "OPEN_CUSTOM_EXERCISE",
        payload: {
          name: name.trim(),
          unit,
          customUnitAbbr: unit === "custom" ? customUnitAbbr : "",
          customUnitAllowDecimal: unit === "custom" ? customUnitAllowDecimal : false,
          editExerciseId: exerciseId,
          editWorkoutId: workoutId,
        },
      });
      return;
    }

    updateState((st) => {
      const ww = st.program.workouts.find((x) => x.id === workoutId);
      const ex = ww?.exercises?.find((e) => e.id === exerciseId);
      if (!ex) return st;
      ex.name = name.trim();
      ex.unit = unit;
      if (catalogId) ex.catalogId = catalogId;
      if (unit === "custom") {
        ex.customUnitAbbr = customUnitAbbr.trim();
        ex.customUnitAllowDecimal = customUnitAllowDecimal ?? false;
      } else {
        delete ex.customUnitAbbr;
        delete ex.customUnitAllowDecimal;
      }
      return st;
    });
    dispatchModal({ type: "CLOSE_EDIT_EXERCISE" });
  }, [modals.editExercise, workoutById]);

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

  // Reorder snapshots — captured when entering reorder mode so a back press
  // can restore the original order. Cleared when the user explicitly taps Done.
  const workoutsReorderSnapshotRef = useRef(null);
  const exercisesReorderSnapshotRef = useRef(null);
  const reorderWorkoutsRef = useRef(false);
  reorderWorkoutsRef.current = reorderWorkouts;

  const toggleReorderWorkouts = useCallback(() => {
    setReorderWorkouts((prev) => {
      const next = !prev;
      if (next) {
        // Enter — snapshot current order so back can restore it.
        workoutsReorderSnapshotRef.current = (state.program?.workouts || []).map((w) => w.id);
      } else {
        // Done — clear snapshot, keep changes.
        workoutsReorderSnapshotRef.current = null;
      }
      return next;
    });
  }, [state.program]);

  const cancelReorderWorkouts = useCallback(() => {
    const snapshot = workoutsReorderSnapshotRef.current;
    workoutsReorderSnapshotRef.current = null;
    if (snapshot) {
      updateState((st) => {
        const byId = new Map((st.program.workouts || []).map((w) => [w.id, w]));
        st.program.workouts = snapshot.map((id) => byId.get(id)).filter(Boolean);
        return st;
      });
    }
    setReorderWorkouts(false);
  }, []);

  const toggleReorderExercises = useCallback((workoutId) => {
    const current = !!modals.workoutDetail.reorderExercises;
    const next = !current;
    if (next) {
      const w = workoutById.get(workoutId);
      exercisesReorderSnapshotRef.current = w
        ? { workoutId, ids: (w.exercises || []).map((ex) => ex.id) }
        : null;
    } else {
      // Done — clear snapshot, keep changes.
      exercisesReorderSnapshotRef.current = null;
    }
    dispatchModal({ type: "UPDATE_WORKOUT_DETAIL", payload: { reorderExercises: next } });
  }, [modals.workoutDetail.reorderExercises, workoutById]);

  const cancelReorderExercises = useCallback(() => {
    const snap = exercisesReorderSnapshotRef.current;
    exercisesReorderSnapshotRef.current = null;
    if (snap) {
      updateState((st) => {
        const w = st.program.workouts.find((x) => x.id === snap.workoutId);
        if (!w) return st;
        const byId = new Map((w.exercises || []).map((ex) => [ex.id, ex]));
        w.exercises = snap.ids.map((id) => byId.get(id)).filter(Boolean);
        return st;
      });
    }
    dispatchModal({ type: "UPDATE_WORKOUT_DETAIL", payload: { reorderExercises: false } });
  }, []);

  // If the workout detail closes while a reorder snapshot is still pending
  // (e.g. user tapped X mid-reorder), restore the snapshot before unmounting.
  useEffect(() => {
    if (!modals.workoutDetail.isOpen && exercisesReorderSnapshotRef.current) {
      const snap = exercisesReorderSnapshotRef.current;
      exercisesReorderSnapshotRef.current = null;
      updateState((st) => {
        const w = st.program.workouts.find((x) => x.id === snap.workoutId);
        if (!w) return st;
        const byId = new Map((w.exercises || []).map((ex) => [ex.id, ex]));
        w.exercises = snap.ids.map((id) => byId.get(id)).filter(Boolean);
        return st;
      });
    }
  }, [modals.workoutDetail.isOpen]);

  // Reorder a workout from one index to another (used by drag-to-reorder).
  function reorderWorkoutsByIndex(fromIdx, toIdx) {
    updateState((st) => {
      const arr = st.program.workouts;
      if (fromIdx < 0 || fromIdx >= arr.length) return st;
      if (toIdx < 0 || toIdx >= arr.length) return st;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return st;
    });
  }

  // Reorder an exercise within a workout by index (drag-to-reorder).
  function reorderExercisesByIndex(workoutId, fromIdx, toIdx) {
    updateState((st) => {
      const w = st.program.workouts.find((x) => x.id === workoutId);
      if (!w) return st;
      const arr = w.exercises;
      if (fromIdx < 0 || fromIdx >= arr.length) return st;
      if (toIdx < 0 || toIdx >= arr.length) return st;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return st;
    });
  }

  function moveSplit(splitId, direction) {
    updateState((st) => {
      const arr = st.program.splits || [];
      const idx = arr.findIndex((s) => s.id === splitId);
      if (idx < 0) return st;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return st;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return st;
    });
  }

  function reorderSplitsByIndex(fromIdx, toIdx) {
    updateState((st) => {
      const arr = st.program.splits || [];
      if (fromIdx < 0 || fromIdx >= arr.length) return st;
      if (toIdx < 0 || toIdx >= arr.length) return st;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return st;
    });
  }

  const exportJson = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-export-${yyyyMmDd(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("Failed to export data");
    }
  }, [state]);

  const exportCSV = useCallback(() => {
    try {
      const csv = stateToCSV(state);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workout-history-${yyyyMmDd(new Date())}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("Failed to export CSV");
    }
  }, [state]);

  async function importFile(file) {
    try {
      const text = await file.text();
      const ext = (file.name || "").split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        // CSV import — detect format, parse, open preview
        const format = detectCSVFormat(text);
        let parsed;
        if (format === "strong") {
          parsed = parseStrongCSV(text);
        } else if (format === "hevy") {
          parsed = parseHevyCSV(text);
        } else {
          // Try Strong format as fallback (our export is Strong-compatible)
          parsed = parseStrongCSV(text);
        }

        if (parsed.sessions.length === 0) {
          showToast(parsed.errors.length > 0
            ? "Could not parse CSV: " + parsed.errors[0]
            : "No workout sessions found in file");
          return;
        }

        const importData = buildImportState(parsed.sessions, EXERCISE_CATALOG);

        dispatchModal({
          type: "OPEN_IMPORT_PREVIEW",
          payload: {
            format,
            sessions: parsed.sessions,
            stats: importData.stats,
            importData,
          },
        });
        return;
      }

      // JSON import — existing flow
      const incoming = safeParse(text, null);

      if (!incoming || typeof incoming !== "object") {
        showToast("Invalid JSON file");
        return;
      }

      const program = incoming.program && typeof incoming.program === "object" ? incoming.program : null;
      const logsByDate = incoming.logsByDate && typeof incoming.logsByDate === "object" ? incoming.logsByDate : null;

      if (!program || !Array.isArray(program.workouts) || !logsByDate) {
        showToast("Import file missing required fields");
        return;
      }

      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Import Data",
          message: "This will REPLACE all your current data. Continue?",
          confirmText: "Import",
          onConfirm: () => {
            const next = {
              ...makeDefaultState(),
              ...incoming,
              program: incoming.program,
              logsByDate,
              meta: { ...(incoming.meta ?? {}), updatedAt: Date.now() },
            };
            setState(next);
            dispatchModal({ type: "CLOSE_CONFIRM" });
          },
        },
      });
      return;
    } catch (error) {
      showToast("Failed to import file");
    }
  }

  function handleImportConfirm(mode) {
    const importData = modals.importPreview.importData;
    if (!importData) {
      dispatchModal({ type: "CLOSE_IMPORT_PREVIEW" });
      return;
    }

    if (mode === "replace") {
      const next = normalizeState({
        ...makeDefaultState(),
        program: { workouts: importData.workouts },
        logsByDate: importData.logsByDate,
        meta: { updatedAt: Date.now() },
      });
      setState(next);
    } else {
      const merged = normalizeState(mergeImportedData(state, importData));
      setState(merged);
    }

    dispatchModal({ type: "CLOSE_IMPORT_PREVIEW" });
    const count = importData.stats?.sessionCount ?? 0;
    showToast(`Imported ${count} session${count !== 1 ? "s" : ""}`);
  }

  function handleAddSuggestion(exerciseName) {
    dispatchModal({
      type: "OPEN_ADD_SUGGESTION",
      payload: { exerciseName },
    });
  }

  // Shared coach fetch logic used by both refresh and check-in submit
  const doCoachFetch = useCallback(({ checkinData, checkinOverride, showLimitToast, forceNoCheckin = false, bypassLimit = false } = {}) => {
    if (coachFetchingRef.current) return;
    if (!bypassLimit && getDailyRefreshCount() >= MAX_DAILY_REFRESHES) {
      if (showLimitToast) showToast("Daily refresh limit reached \u2014 insights update automatically each day");
      return;
    }
    incrementDailyRefresh();
    const reqId = ++coachReqIdRef.current;
    coachFetchingRef.current = true;
    setCoachLoading(true);
    setCoachStreaming(true);
    setCoachError(null);

    const refreshCatalog = fullCatalog.filter((e) => exerciseFitsEquipment(e, equipment));
    const checkinForFetch = forceNoCheckin ? null : (checkinData || checkinOverride || getTodayCheckin(coachTodayKey));
    const fetchContextSignature = buildCoachContextSignature(coachTodayKey, coachSignature, checkinForFetch);
    let checkinCtx = null;
    const coachNotesData = loadCoachNotes();
    if (checkinForFetch) {
      checkinCtx = buildCheckinContext(checkinForFetch, loadCheckins(), state.logsByDate);
    }

    fetchCoachInsights({
      profile, state, dateRange: coachDateRange,
      options: { forceRefresh: true }, catalog: refreshCatalog, equipment,
      measurementSystem: state.preferences?.measurementSystem,
      checkinContext: checkinCtx, coachNotesFromStorage: coachNotesData,
      onInsight: () => {},
    })
      .then(({ insights, coachNotes: returnedNotes }) => {
        if (coachReqIdRef.current !== reqId) return;
        setCoachInsights(insights);
        coachLastSignatureRef.current = coachSignature;
        coachLastFetchRef.current = Date.now();
        coachCacheRef.current.set(fetchContextSignature, { insights, createdAt: Date.now() });
        const cacheKey = getCoachCacheKey(session.user.id, coachTodayKey);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            insights,
            signature: coachSignature,
            contextSignature: fetchContextSignature,
            createdAt: Date.now(),
          }));
        } catch {}
        try {
          sessionStorage.setItem(`wt_coach_last_auto_date:${session.user.id}`, coachTodayKey);
        } catch {}
        if (returnedNotes?.length > 0) {
          const existing = loadCoachNotes();
          const merged = mergeCoachNotes(existing, returnedNotes);
          saveCoachNotes(merged);
        }
      })
      .catch((err) => {
        if (coachReqIdRef.current !== reqId) return;
        const analysis = buildNormalizedAnalysis(state.program.workouts, state.logsByDate, coachDateRange, catalogMap);
        setCoachInsights(detectImbalancesNormalized(analysis, {
          catalog: refreshCatalog,
          checkin: checkinForFetch,
          userExerciseNames: (state.program?.workouts || []).flatMap((w) => (w.exercises || []).map((ex) => ex.name)),
        }));
        const detail = err?.message || String(err);
        setCoachError(`AI coach unavailable \u2014 showing basic analysis${detail ? ` (${detail})` : ""}`);
      })
      .finally(() => {
        coachFetchingRef.current = false;
        if (coachReqIdRef.current === reqId) {
          setCoachLoading(false);
          setCoachStreaming(false);
        }
      });
  }, [coachDateRange, coachSignature, coachTodayKey, fullCatalog, equipment, profile, showToast, state, session?.user?.id, catalogMap]);

  const handleCoachRefresh = useCallback((checkinOverride) => {
    doCoachFetch({ checkinOverride, showLimitToast: true });
  }, [doCoachFetch]);

  // Save check-in without triggering coach refresh (for inline pill edits)
  const handleCheckinUpdate = useCallback((checkinData) => {
    saveCheckin(coachTodayKey, checkinData);
    setTodayCheckin(checkinData);
    setCheckinEditSection(null);
  }, [coachTodayKey]);

  const handleGenerateTodayCheckin = useCallback((checkinData) => {
    saveCheckin(coachTodayKey, checkinData);
    setTodayCheckin(checkinData);
  }, [coachTodayKey]);

  const handleCheckinSubmit = useCallback((checkinData) => {
    saveCheckin(coachTodayKey, checkinData);
    setTodayCheckin(checkinData);
    setCheckinEditSection(null);
    doCoachFetch({ checkinData, bypassLimit: true });
  }, [coachTodayKey, doCoachFetch]);

  const clearTodayCheckinAndCoach = useCallback(() => {
    saveCheckin(coachTodayKey, null);
    setTodayCheckin(null);
    setCheckinEditSection(null);
    doCoachFetch({ forceNoCheckin: true, bypassLimit: true });
  }, [coachTodayKey, doCoachFetch]);

  const confirmAddSuggestion = useCallback((workoutIdOrIds, exerciseName) => {
    // Look up catalogId by name
    const nameLower = exerciseName.toLowerCase();
    let matchedCatalogId = null;
    for (const entry of fullCatalog) {
      if (entry.name.toLowerCase() === nameLower) {
        matchedCatalogId = entry.id;
        break;
      }
    }

    if (workoutIdOrIds === "__today__") {
      let coachWId = null;
      updateState((st) => {
        if (!st.dailyWorkouts) st.dailyWorkouts = {};
        if (!st.dailyWorkouts[dateKey]) st.dailyWorkouts[dateKey] = [];
        let coachWorkout = st.dailyWorkouts[dateKey].find(w => w.source === "coach");
        if (!coachWorkout) {
          coachWorkout = { id: uid("w"), name: "Coach Suggestions", category: "Coach", source: "coach", exercises: [] };
          st.dailyWorkouts[dateKey].push(coachWorkout);
        }
        coachWId = coachWorkout.id;
        const newEx = { id: uid("ex"), name: exerciseName, unit: "reps" };
        if (matchedCatalogId) newEx.catalogId = matchedCatalogId;
        coachWorkout.exercises.push(newEx);
        return st;
      });
      if (coachWId) setCollapsedToday((prev) => new Set(prev).add(coachWId));
      dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
      showToast(`Added "${exerciseName}" for today`);
      return;
    }

    const ids = Array.isArray(workoutIdOrIds) ? workoutIdOrIds : [workoutIdOrIds];
    const addedNames = [];

    updateState((st) => {
      for (const wId of ids) {
        const w = st.program.workouts.find((x) => x.id === wId);
        if (!w) continue;
        const exists = w.exercises.some(ex => ex.name.toLowerCase() === exerciseName.toLowerCase());
        if (exists) continue;
        const newEx = { id: uid("ex"), name: exerciseName, unit: "reps" };
        if (matchedCatalogId) newEx.catalogId = matchedCatalogId;
        w.exercises.push(newEx);
        addedNames.push(w.name);
      }
      return st;
    });

    dispatchModal({ type: "CLOSE_ADD_SUGGESTION" });
    if (addedNames.length === 0) {
      showToast(`"${exerciseName}" already exists in selected workouts`);
    } else if (addedNames.length === 1) {
      showToast(`Exercise added to workout`);
    } else {
      showToast(`Exercise added to workouts`);
    }
  }, [workoutById, dateKey, fullCatalog]);

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

  function openGenerateToday() {
    dispatchModal({ type: "OPEN_GENERATE_TODAY", payload: { equipment: equipment || ["full_gym"] } });
  }

  async function handleGenerateToday(opts) {
    const eq = opts?.equipment || modals.generateToday.equipment || equipment;
    const dur = opts?.duration || modals.generateToday.duration || 60;
    const checkinData = opts?.checkinData || todayCheckin;
    if (checkinData) {
      saveCheckin(dateKey, checkinData);
      setTodayCheckin(checkinData);
    }
    const checkinContext = buildCheckinContext(
      checkinData || getTodayCheckin(dateKey),
      loadCheckins(),
      state.logsByDate
    );

    dispatchModal({ type: "UPDATE_GENERATE_TODAY", payload: { loading: true, error: null, preview: null } });

    const result = await generateTodayAI({
      equipment: eq,
      duration: dur,
      profile,
      state,
      catalog: fullCatalog,
      todayKey: dateKey,
      measurementSystem: state.preferences?.measurementSystem,
      checkinContext,
    });

    if (result.success) {
      dispatchModal({ type: "UPDATE_GENERATE_TODAY", payload: { preview: result.data, loading: false } });
    } else {
      // Fallback to deterministic
      const fallback = generateTodayWorkout({
        state,
        equipment: eq,
        profile,
        catalog: fullCatalog,
        todayKey: dateKey,
        duration: dur,
      });
      dispatchModal({
        type: "UPDATE_GENERATE_TODAY",
        payload: { preview: fallback, loading: false, error: "AI unavailable — used smart defaults" },
      });
    }
  }

  function handleAcceptTodayWorkout(workout) {
    updateState((st) => {
      if (!st.dailyWorkouts) st.dailyWorkouts = {};
      if (!st.dailyWorkouts[dateKey]) st.dailyWorkouts[dateKey] = [];
      st.dailyWorkouts[dateKey].push({ ...workout, source: "generate_today" });
      return st;
    });
    setCollapsedToday((prev) => new Set(prev).add(workout.id));
    dispatchModal({ type: "CLOSE_GENERATE_TODAY" });
  }

  const deleteDailyWorkout = useCallback((workoutId) => {
    const w = workoutById.get(workoutId);
    const dayLogs = state.logsByDate?.[dateKey] || {};
    const hasLoggedSets = (w?.exercises || []).some(ex =>
      (dayLogs[ex.id]?.sets || []).some(s => isSetCompleted(s))
    );
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Remove workout?",
        message: hasLoggedSets
          ? `Remove "${w?.name || "this workout"}"? Your logged sets for today will also be deleted.`
          : `Remove "${w?.name || "this workout"}"?`,
        confirmText: "Remove",
        onConfirm: () => {
          updateState((st) => {
            if (!st.dailyWorkouts?.[dateKey]) return st;
            const removed = st.dailyWorkouts[dateKey].find(dw => dw.id === workoutId);
            st.dailyWorkouts[dateKey] = st.dailyWorkouts[dateKey].filter(dw => dw.id !== workoutId);
            if (st.dailyWorkouts[dateKey].length === 0) delete st.dailyWorkouts[dateKey];
            if (removed && st.logsByDate?.[dateKey]) {
              for (const ex of removed.exercises || []) {
                delete st.logsByDate[dateKey][ex.id];
              }
              if (Object.keys(st.logsByDate[dateKey]).length === 0) delete st.logsByDate[dateKey];
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CONFIRM" });
        },
      },
    });
  }, [dateKey, workoutById]);

  const deleteDailyExercise = useCallback((workoutId, exerciseId) => {
    const w = workoutById.get(workoutId);
    const ex = w?.exercises?.find(e => e.id === exerciseId);
    const isLast = w?.exercises?.length <= 1;
    const dayLogs = state.logsByDate?.[dateKey] || {};
    const exHasLog = (dayLogs[exerciseId]?.sets || []).some(s => isSetCompleted(s));
    const anyHasLog = isLast
      ? (w?.exercises || []).some(e => (dayLogs[e.id]?.sets || []).some(s => isSetCompleted(s)))
      : exHasLog;
    const logNote = anyHasLog ? " Your logged sets for today will also be deleted." : "";
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: isLast ? "Remove workout?" : "Remove exercise?",
        message: isLast
          ? `"${ex?.name || "This exercise"}" is the last exercise. This will remove the entire workout.${logNote}`
          : `Remove "${ex?.name || "this exercise"}" from ${w?.name || "this workout"}?${logNote}`,
        confirmText: "Remove",
        onConfirm: () => {
          updateState((st) => {
            const dayWs = st.dailyWorkouts?.[dateKey];
            if (!dayWs) return st;
            const wk = dayWs.find(dw => dw.id === workoutId);
            if (!wk) return st;
            if (wk.exercises.length <= 1) {
              st.dailyWorkouts[dateKey] = dayWs.filter(dw => dw.id !== workoutId);
              if (st.dailyWorkouts[dateKey].length === 0) delete st.dailyWorkouts[dateKey];
              if (st.logsByDate?.[dateKey]) {
                for (const ex of wk.exercises || []) {
                  delete st.logsByDate[dateKey][ex.id];
                }
                if (Object.keys(st.logsByDate[dateKey]).length === 0) delete st.logsByDate[dateKey];
              }
            } else {
              wk.exercises = wk.exercises.filter(e => e.id !== exerciseId);
              if (st.logsByDate?.[dateKey]?.[exerciseId]) {
                delete st.logsByDate[dateKey][exerciseId];
                if (Object.keys(st.logsByDate[dateKey]).length === 0) delete st.logsByDate[dateKey];
              }
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CONFIRM" });
        },
      },
    });
  }, [dateKey, workoutById]);

  // ===== TODAY SESSION HANDLERS =====

  // Direct add — no conflict checks. Used by the conflict-resolution handlers
  // and as the fast path inside addSessionToToday.
  const addSessionToTodayDirect = useCallback((workoutId) => {
    updateState((st) => {
      if (!st.todaySessions) st.todaySessions = {};
      if (!st.todaySessions[dateKey]) st.todaySessions[dateKey] = [];
      if (!st.todaySessions[dateKey].includes(workoutId)) {
        st.todaySessions[dateKey].push(workoutId);
      }
      if (st.todayDismissed?.[dateKey]) {
        st.todayDismissed[dateKey] = st.todayDismissed[dateKey].filter((id) => id !== workoutId);
        if (st.todayDismissed[dateKey].length === 0) delete st.todayDismissed[dateKey];
      }
      return st;
    });
    setCollapsedToday((prev) => new Set(prev).add(workoutId));
  }, [dateKey]);

  // Start a workout from the Today's Plan card. Adds the picked workout AND
  // pulls in every other workout the day's schedule says should be done —
  // explicitly ignoring todayDismissed so a user-dismissed-then-restarted day
  // still pulls the full plan. Re-adding clears the dismissal on those ids.
  const startFromPlan = useCallback((workoutId) => {
    const otherIds = [];
    const seenOthers = new Set([workoutId]);
    for (const s of splits) {
      const next = getContinuousNextUp(s, effectiveWorkouts);
      if (!next) continue;
      if (seenOthers.has(next.workout.id)) continue;
      seenOthers.add(next.workout.id);
      otherIds.push(next.workout.id);
    }
    for (const w of getScheduledForDate(effectiveWorkouts, dateKey)) {
      if (seenOthers.has(w.id)) continue;
      seenOthers.add(w.id);
      otherIds.push(w.id);
    }

    updateState((st) => {
      if (!st.todaySessions) st.todaySessions = {};
      if (!st.todaySessions[dateKey]) st.todaySessions[dateKey] = [];
      const list = st.todaySessions[dateKey];
      const seen = new Set(list);
      for (const id of [workoutId, ...otherIds]) {
        if (!seen.has(id)) {
          list.push(id);
          seen.add(id);
        }
      }
      if (st.todayDismissed?.[dateKey]) {
        st.todayDismissed[dateKey] = st.todayDismissed[dateKey].filter((id) => !seen.has(id));
        if (st.todayDismissed[dateKey].length === 0) delete st.todayDismissed[dateKey];
      }
      return st;
    });
    setCollapsedToday((prev) => {
      const next = new Set(prev);
      for (const id of [workoutId, ...otherIds]) next.add(id);
      return next;
    });
  }, [dateKey, splits, effectiveWorkouts]);

  function addSessionToToday(workoutId) {
    const existing = state.todaySessions?.[dateKey] || [];
    // Already visible? Just scroll to it.
    const scheduledIds = new Set(scheduledTodayWorkouts.map((w) => w.id));
    const nextUpIds = new Set(continuousNextUpEntries.map((e) => e.workout.id));
    if (existing.includes(workoutId) || scheduledIds.has(workoutId) || nextUpIds.has(workoutId)) {
      setFabOpen(false);
      highlightAndScrollToCard(workoutId);
      return;
    }

    // Continuous-split conflict: workout is a member of a continuous split, but
    // not the current next-up. Surface the do-instead / alongside choice.
    for (const s of splits) {
      if (s.mode !== SPLIT_MODES.CONTINUOUS) continue;
      const isMember = (s.members || []).some((m) => m.workoutId === workoutId);
      if (!isMember) continue;
      const next = getContinuousNextUp(s, effectiveWorkouts);
      if (!next || next.workout.id === workoutId) continue;

      const pickedWorkout = effectiveWorkouts.find((w) => w.id === workoutId);
      dispatchModal({
        type: "OPEN_CONTINUOUS_CONFLICT",
        payload: {
          pickedWorkoutId: workoutId,
          pickedWorkoutName: pickedWorkout?.name || "This workout",
          splitId: s.id,
          splitName: s.name,
          nextUpWorkoutId: next.workout.id,
          nextUpWorkoutName: next.workout.name,
        },
      });
      setFabOpen(false);
      return;
    }

    addSessionToTodayDirect(workoutId);
    setFabOpen(false);
  }

  // "Do instead" — log the picked workout, dismiss the original next-up for today.
  // The queue stays where it was (the next-up wasn't logged, so queuePosition
  // doesn't advance — that property comes for free from the saveLogData rule).
  const continuousConflictDoInstead = useCallback(() => {
    const cc = modals.continuousConflict;
    if (!cc?.isOpen) return;
    addSessionToTodayDirect(cc.pickedWorkoutId);
    if (cc.nextUpWorkoutId) {
      updateState((st) => {
        if (!st.todayDismissed) st.todayDismissed = {};
        const list = st.todayDismissed[dateKey] || [];
        if (!list.includes(cc.nextUpWorkoutId)) {
          st.todayDismissed[dateKey] = [...list, cc.nextUpWorkoutId];
        }
        return st;
      });
    }
    dispatchModal({ type: "CLOSE_CONTINUOUS_CONFLICT" });
  }, [modals.continuousConflict, dateKey, addSessionToTodayDirect]);

  // "Add alongside" — log both. Queue still doesn't advance from the picked
  // workout (it's not next-up). User can complete next-up separately to advance.
  const continuousConflictAddAlongside = useCallback(() => {
    const cc = modals.continuousConflict;
    if (!cc?.isOpen) return;
    addSessionToTodayDirect(cc.pickedWorkoutId);
    dispatchModal({ type: "CLOSE_CONTINUOUS_CONFLICT" });
  }, [modals.continuousConflict, addSessionToTodayDirect]);

  function removeSessionFromToday(workoutId) {
    const w = workoutById.get(workoutId);
    const dayLogs = state.logsByDate?.[dateKey] || {};
    const adds = state.sessionAdditions?.[dateKey]?.[workoutId] || [];
    const exIds = [
      ...((w?.exercises || []).map(e => e.id)),
      ...adds.map(e => e.id),
    ];
    const hasLoggedSets = exIds.some(id =>
      (dayLogs[id]?.sets || []).some(s => isSetCompleted(s))
    );

    const doRemove = () => {
      updateState((st) => {
        if (st.todaySessions?.[dateKey]) {
          st.todaySessions[dateKey] = st.todaySessions[dateKey].filter(id => id !== workoutId);
          if (st.todaySessions[dateKey].length === 0) delete st.todaySessions[dateKey];
        }
        if (st.logsByDate?.[dateKey]) {
          for (const id of exIds) delete st.logsByDate[dateKey][id];
          if (Object.keys(st.logsByDate[dateKey]).length === 0) delete st.logsByDate[dateKey];
        }
        if (st.sessionAdditions?.[dateKey]?.[workoutId]) {
          delete st.sessionAdditions[dateKey][workoutId];
          if (Object.keys(st.sessionAdditions[dateKey]).length === 0) delete st.sessionAdditions[dateKey];
        }
        // Dismiss for today so the underlying schedule (anchor / continuous
        // next-up / weekly preferred) doesn't instantly re-add it. The user's
        // intent in clicking X is "not today" — applies whether the workout
        // came from the schedule or was added manually. Re-adding via the
        // FAB or Get Started clears the dismissal.
        if (!st.todayDismissed) st.todayDismissed = {};
        const dlist = st.todayDismissed[dateKey] || [];
        if (!dlist.includes(workoutId)) {
          st.todayDismissed[dateKey] = [...dlist, workoutId];
        }
        return st;
      });
    };

    if (hasLoggedSets) {
      dispatchModal({
        type: "OPEN_CONFIRM",
        payload: {
          title: "Remove from today?",
          message: `Remove "${w?.name || "this workout"}" from today? Your logged sets for today will also be deleted.`,
          confirmText: "Remove",
          onConfirm: () => { dispatchModal({ type: "CLOSE_CONFIRM" }); doRemove(); },
        },
      });
    } else {
      doRemove();
    }
  }

  // Dismiss an auto-surfaced scheduled workout for today only. The schedule itself
  // is unchanged — the workout will reappear on its next scheduled day.
  function dismissScheduledForToday(workoutId) {
    updateState((st) => {
      if (!st.todayDismissed) st.todayDismissed = {};
      const list = st.todayDismissed[dateKey] || [];
      if (!list.includes(workoutId)) {
        st.todayDismissed[dateKey] = [...list, workoutId];
      }
      return st;
    });
  }

  function highlightAndScrollToCard(workoutId) {
    setHighlightCardId(workoutId);
    setTimeout(() => {
      const el = document.getElementById(`today-card-${workoutId}`);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 50);
    setTimeout(() => setHighlightCardId(null), 1500);
  }

  // ===== SESSION OVERRIDE HANDLERS (swap / skip / undo / promote) =====

  const skipExercise = useCallback((workoutId, exerciseId, isDaily) => {
    if (isDaily) {
      deleteDailyExercise(workoutId, exerciseId);
      return;
    }
    const w = workoutById.get(workoutId);
    const ex = w?.exercises?.find(e => e.id === exerciseId);
    updateState((st) => {
      if (!st.sessionOverrides) st.sessionOverrides = {};
      if (!st.sessionOverrides[dateKey]) st.sessionOverrides[dateKey] = {};
      if (!st.sessionOverrides[dateKey][workoutId]) st.sessionOverrides[dateKey][workoutId] = {};
      st.sessionOverrides[dateKey][workoutId][exerciseId] = { type: "skip" };
      return st;
    });
    showToast(`${ex?.name || "Exercise"} skipped for today`);
  }, [dateKey, workoutById, deleteDailyExercise, showToast]);

  const openSwapExercise = useCallback((workoutId, exerciseId, isDaily) => {
    const w = workoutById.get(workoutId);
    const ex = w?.exercises?.find(e => e.id === exerciseId);
    dispatchModal({
      type: "OPEN_CATALOG_BROWSE",
      payload: {
        workoutId,
        swapMode: true,
        swapExerciseId: exerciseId,
        swapExerciseName: ex?.name || "",
        swapSource: ex ? { catalogId: ex.catalogId || null, name: ex.name || "", unit: ex.unit || "reps" } : null,
        swapIsDaily: isDaily,
      },
    });
  }, [workoutById]);

  const undoOverride = useCallback((workoutId, originalExerciseId) => {
    const ov = state.sessionOverrides?.[dateKey]?.[workoutId]?.[originalExerciseId];
    const replacementId = ov?.type === "swap" ? ov.replacement?.id : null;
    updateState((st) => {
      const wOv = st.sessionOverrides?.[dateKey]?.[workoutId];
      if (!wOv) return st;
      delete wOv[originalExerciseId];
      if (Object.keys(wOv).length === 0) delete st.sessionOverrides[dateKey][workoutId];
      if (Object.keys(st.sessionOverrides[dateKey] || {}).length === 0) delete st.sessionOverrides[dateKey];
      // Clear logs for the replacement exercise
      if (replacementId && st.logsByDate[dateKey]?.[replacementId]) {
        delete st.logsByDate[dateKey][replacementId];
      }
      return st;
    });
    showToast("Change undone");
  }, [dateKey, state.sessionOverrides, showToast]);

  const promoteOverride = useCallback((workoutId, originalExerciseId) => {
    const ov = state.sessionOverrides?.[dateKey]?.[workoutId]?.[originalExerciseId];
    if (!ov || ov.type !== "swap") return;
    const replacement = ov.replacement;
    const originalName = ov.originalName || "Original";
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Update program?",
        message: `Replace "${originalName}" with "${replacement.name}" in your program? This changes all future sessions.`,
        confirmText: "Confirm",
        onConfirm: () => {
          updateState((st) => {
            // Find and replace in program template
            const w = st.program.workouts.find(x => x.id === workoutId);
            if (w) {
              const idx = w.exercises.findIndex(e => e.id === originalExerciseId);
              if (idx !== -1) {
                w.exercises[idx] = { ...replacement, id: originalExerciseId };
              }
            }
            // Remove the override
            const wOv = st.sessionOverrides?.[dateKey]?.[workoutId];
            if (wOv) {
              delete wOv[originalExerciseId];
              if (Object.keys(wOv).length === 0) delete st.sessionOverrides[dateKey][workoutId];
              if (Object.keys(st.sessionOverrides[dateKey] || {}).length === 0) delete st.sessionOverrides[dateKey];
            }
            // Migrate logs from replacement id to original id
            if (st.logsByDate[dateKey]?.[replacement.id]) {
              st.logsByDate[dateKey][originalExerciseId] = st.logsByDate[dateKey][replacement.id];
              delete st.logsByDate[dateKey][replacement.id];
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CONFIRM" });
          showToast("Exercise updated in program");
        },
      },
    });
  }, [dateKey, state.sessionOverrides, showToast]);

  const saveProfile = useCallback(async (updates) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: session.user.id, ...updates });

      if (error) {
        dispatchModal({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false, error: error.message } });
        return;
      }

      mergeProfile(updates);
      dispatchModal({ type: "CLOSE_PROFILE_MODAL" });
    } catch (err) {
      dispatchModal({ type: "UPDATE_PROFILE_MODAL", payload: { saving: false, error: "Failed to save. Try again." } });
    }
  }, [session.user.id, mergeProfile]);

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

  if (!localReady) {
    return (
      <div style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        background: "#E8E0D4",
        color: "#3D3530",
        height: "100dvh",
        width: "100%",
      }}>
        <div style={{
          position: "fixed",
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          width: "100%",
          textAlign: "center",
          fontSize: 13,
          opacity: 0.35,
        }}>
          Loading your workouts...
        </div>
      </div>
    );
  }

  // Time-of-day atmosphere wash — rendered at the app root so it spans the
  // full viewport behind the topBar, not just the body. Only on the Train tab
  // hero state (no sessions today) since that's where the design calls for it.
  const showAtmosphere = tab === "train" && isToday && !hasSessions;
  const atmosphereTimeKey = getTimeOfDay();

  return (
    <div style={styles.app}>
      {showAtmosphere && (
        <Atmosphere themeKey={theme} time={atmosphereTimeKey} />
      )}
      {/* Main content column */}
      <div style={styles.content}>
        {/* Top bar */}
        <div style={styles.topBar}>
            <div style={styles.topBarRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button
                  style={styles.navArrow}
                  onClick={() => setDateKey((k) => addDays(k, -1))}
                  aria-label="Previous day"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
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
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {new Date(dateKey + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "short", month: "short", day: "numeric"
                    })}
                  </div>
                </button>
                <button
                  style={styles.navArrow}
                  onClick={() => setDateKey((k) => addDays(k, +1))}
                  aria-label="Next day"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                {!trainSearchOpen && dateKey !== yyyyMmDd(new Date()) && (
                  <button
                    style={styles.todayChip}
                    onClick={() => setDateKey(yyyyMmDd(new Date()))}
                    type="button"
                  >
                    Today
                  </button>
                )}
              </div>
          {trainSearchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                <input
                  value={trainSearch}
                  onChange={(e) => setTrainSearch(e.target.value)}
                  placeholder={tab === "social" ? "Search friends" : "Search exercises"}
                  autoFocus
                  style={{ ...styles.textInput, padding: "6px 10px", fontSize: 13, flex: 1, minWidth: 0 }}
                />
                <button
                  style={{ background: "transparent", border: "none", color: colors.text, opacity: 0.5, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "4px 2px", flexShrink: 0 }}
                  onClick={() => { setTrainSearchOpen(false); setTrainSearch(""); }}
                >
                  Cancel
                </button>
              </div>
          ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {tab === "train" && workouts.length > 0 && (() => {
                  const setter = setCollapsedToday;
                  const collapsed = collapsedToday;
                  const allCards = [...displayedProgramWorkouts, ...dailyWorkoutsToday];
                  const allCollapsed = allCards.every((w) => collapsed.has(w.id));
                  return (
                    <button
                      style={{ ...styles.navArrow, opacity: 0.45 }}
                      onClick={() => allCollapsed ? expandAll(setter) : collapseAll(setter, allCards.map((w) => w.id))}
                      title={allCollapsed ? "Expand all" : "Collapse all"}
                      type="button"
                    >
                      {allCollapsed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2l5 5 5-5" /><path d="M7 8l5 5 5-5" /><line x1="4" y1="16" x2="20" y2="16" /><line x1="4" y1="20" x2="20" y2="20" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5-5 5 5" /><path d="M7 19l5-5 5 5" /><line x1="4" y1="4" x2="20" y2="4" /><line x1="4" y1="8" x2="20" y2="8" /></svg>
                      )}
                    </button>
                  );
                })()}
                <button
                  style={{ ...styles.navArrow, opacity: 0.45 }}
                  onClick={() => { setTrainSearchOpen(true); }}
                  title={tab === "social" ? "Search friends" : "Search exercises"}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </button>
                <button
                  onClick={() => dispatchModal({
                    type: "OPEN_PROFILE_MODAL",
                    payload: {
                      username: profile?.username || "",
                      displayName: profile?.display_name || "",
                      birthdate: profile?.birthdate || "",
                      gender: profile?.gender || "",
                      weightLbs: profile?.weight_lbs != null && profile?.weight_lbs !== ""
                        ? (fromLbs(profile.weight_lbs, state.preferences?.measurementSystem) ?? "")
                        : "",
                      goal: profile?.goal || "",
                      sports: profile?.sports || "",
                      about: profile?.about || "",
                      heightInches: profile?.height_inches || "",
                      avatarUrl: profile?.avatar_url || null,
                    },
                  })}
                  style={styles.avatarBtn}
                  aria-label="Profile"
                  type="button"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    avatarInitial(profile?.display_name, profile?.username)
                  )}
                </button>
              </div>
          )}
            </div>

          {/* Search results (tab-aware) */}
          {trainSearchOpen && trainSearch.trim() && tab === "social" && (() => {
            const q = trainSearch.trim().toLowerCase();
            const matches = socialFriends.filter((f) =>
              (f.username || "").toLowerCase().includes(q) ||
              (f.display_name || "").toLowerCase().includes(q)
            );
            if (matches.length === 0) {
              return <div style={{ padding: "8px 4px", opacity: 0.5, fontSize: 12 }}>No friends found</div>;
            }
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 6 }}>
                {matches.map((f) => (
                  <button key={f.id} style={{
                    textAlign: "left", padding: "8px 10px", borderRadius: 8,
                    border: `1px solid ${colors.border}`, background: colors.cardAltBg,
                    color: colors.text, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "inherit",
                  }}
                    onClick={() => {
                      dispatchModal({ type: "OPEN_SHARE_WORKOUT", payload: { selectedFriendId: f.id } });
                      setTrainSearchOpen(false); setTrainSearch("");
                    }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999,
                      background: colors.accent + "22", color: colors.accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                      overflow: "hidden",
                    }}>
                      {f.avatar_url ? (
                        <img src={f.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }} />
                      ) : (
                        (f.username || "?")[0].toUpperCase()
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>@{f.username}</span>
                      {f.display_name && <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 6 }}>{f.display_name}</span>}
                    </div>
                  </button>
                ))}
              </div>
            );
          })()}
          {trainSearchOpen && trainSearch.trim() && tab !== "social" && (() => {
            const q = trainSearch.trim().toLowerCase();
            const results = [];
            for (const w of [...displayedProgramWorkouts, ...dailyWorkoutsToday]) {
              for (const ex of w.exercises) {
                if (ex.name.toLowerCase().includes(q)) {
                  results.push({ workout: w, exercise: ex });
                }
              }
              if (results.length >= 8) break;
            }
            if (results.length === 0) {
              return <div style={{ padding: "8px 4px", opacity: 0.5, fontSize: 12 }}>No exercises found</div>;
            }
            const resultBtnStyle = {
              textAlign: "left", padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${colors.border}`, background: colors.cardAltBg,
              color: colors.text, cursor: "pointer",
            };
            if (tab === "train") {
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 6 }}>
                  {results.map((r) => (
                    <button key={r.exercise.id} style={{ ...resultBtnStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      onClick={() => { openLog(r.workout.id, r.exercise); setTrainSearchOpen(false); setTrainSearch(""); }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{r.exercise.name}</span>
                      <span style={{ fontSize: 11, opacity: 0.5 }}>{r.workout.name}</span>
                    </button>
                  ))}
                </div>
              );
            }
            if (tab === "progress") {
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 6 }}>
                  {results.map((r) => {
                    const exUnit = getUnit(r.exercise.unit, r.exercise);
                    const summary = computeExerciseSummary(r.exercise.id, summaryRange.start, summaryRange.end, exUnit);
                    return (
                      <div key={r.exercise.id} style={{ ...resultBtnStyle, display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{r.exercise.name}</span>
                          <span style={{ fontSize: 11, opacity: 0.5 }}>{r.workout.name}</span>
                        </div>
                        {summary.sessions > 0 ? (
                          <div style={{ fontSize: 11, opacity: 0.6 }}>
                            {summary.sessions} sessions · {summary.totalSets} sets · {summary.totalReps} {exUnit.abbr}
                            {summary.maxWeight ? ` · Best: ${summary.maxWeight}` : ""}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, opacity: 0.4 }}>No activity this period</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            // Program tab
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 6 }}>
                {results.map((r) => (
                  <button key={r.exercise.id} style={{ ...resultBtnStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    onClick={() => { setManageWorkoutId(r.workout.id); setTrainSearchOpen(false); setTrainSearch(""); setTab("program"); }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{r.exercise.name}</span>
                    <span style={{ fontSize: 11, opacity: 0.5 }}>{r.workout.name}</span>
                  </button>
                ))}
              </div>
            );
          })()}

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
                className="btn-press"
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

          {/* SESSIONS TAB */}
          {tab === "train" ? (
            <div key="train" style={{
              ...styles.section,
              animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)",
              ...(isToday && !hasSessions ? { flex: 1 } : {}),
            }}>
              {isToday && driftSuggestion && (
                <CadenceDriftPrompt
                  workoutName={driftSuggestion.workout.name}
                  suggestion={driftSuggestion.suggestion}
                  onUpdate={applyDriftSuggestion}
                  onSnooze={snoozeDriftSuggestion}
                  onDismiss={dismissDriftPermanently}
                  styles={styles}
                  colors={colors}
                />
              )}
              {isToday && !hasSessions ? (
                /* HERO STATE: sun arc + greeting + swipeable coach carousel
                 * (atmosphere wash is rendered at the app root so it spans
                 * behind the topBar — not here) */
                (() => {
                  const todKey = atmosphereTimeKey;
                  const tod = TIME_OF_DAY[todKey];
                  const userName = (profile?.display_name || profile?.username || "").trim();
                  return (
                <div style={{
                  display: "flex", flexDirection: "column",
                  flex: 1, gap: 12,
                  padding: "12px 0 0",
                  minHeight: 0,
                }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <SunArc time={todKey} size={56} color={tod.sun} muted={colors.borderStrong} />
                    <div style={{
                      fontSize: 28, fontWeight: 700, lineHeight: 1.2,
                      letterSpacing: -0.5, marginTop: 8,
                    }}>
                      {tod.greeting}{userName ? `, ${userName.split(" ")[0]}` : ""}
                    </div>
                    <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                      {heroMotivationLine}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                  <div style={{
                    height: "56vh",
                    borderRadius: 16,
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 600, opacity: 0.4,
                      textTransform: "uppercase", letterSpacing: 1,
                      padding: "14px 18px 0",
                    }}>
                      Today's Plan
                    </div>
                    <div style={{ flex: 1, overflow: "auto", padding: "10px 18px 18px", display: "flex", flexDirection: "column" }}>
                      {(() => {
                          const accent = colors.accent;
                          const secondary = colors.textSecondary;

                          // Build Today's Plan list directly from the schedule — ignoring
                          // todayDismissed on purpose. The carousel always reflects what
                          // the day's plan IS (anchors / continuous next-up / weekly
                          // preferred), regardless of whether the user X'd one earlier.
                          // Only workouts already started (in todaySessions) are filtered
                          // out, since they belong to the session list at that point.
                          const scheduledList = (() => {
                            const seen = new Set();
                            const explicit = new Set(todaySessionIds);
                            const out = [];
                            // Continuous next-up first.
                            for (const s of splits) {
                              const next = getContinuousNextUp(s, effectiveWorkouts);
                              if (!next) continue;
                              if (explicit.has(next.workout.id)) continue;
                              if (seen.has(next.workout.id)) continue;
                              seen.add(next.workout.id);
                              out.push(next.workout);
                            }
                            // Anchors + weekly preferred.
                            for (const w of getScheduledForDate(effectiveWorkouts, dateKey)) {
                              if (explicit.has(w.id)) continue;
                              if (seen.has(w.id)) continue;
                              seen.add(w.id);
                              out.push(w);
                            }
                            return out;
                          })();

                          // Fallback when nothing is scheduled \u2014 suggest from training pattern.
                          const upNext = weeklySummary.upNext;
                          const programWorkouts = state.program?.workouts || [];
                          let fallbackSuggested = null;
                          if (scheduledList.length === 0) {
                            if (upNext && !upNext.allDone && !upNext.isRestDay && upNext.workouts?.length) {
                              fallbackSuggested = programWorkouts.find((w) => w.name === upNext.workouts[0]) || null;
                            }
                            if (!fallbackSuggested) fallbackSuggested = programWorkouts[0] || null;
                          }

                          // Empty state \u2014 no schedule and no fallback workout to suggest.
                          if (scheduledList.length === 0 && !fallbackSuggested) {
                            return (
                              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 6 }}>
                                <div style={{ fontSize: 13, color: secondary }}>No plan yet.</div>
                                <div style={{ fontSize: 12, color: colors.textTertiary, lineHeight: 1.5 }}>
                                  Add a workout in Plan to get a suggestion here.
                                </div>
                              </div>
                            );
                          }

                          // Single-workout layout (one scheduled, OR fallback). Detail format.
                          const focused = scheduledList.length === 1
                            ? scheduledList[0]
                            : (scheduledList.length === 0 ? fallbackSuggested : null);

                          const eyebrow = scheduledList.length > 0
                            ? "Scheduled for today"
                            : (upNext?.dayName ? `Suggested \u00B7 ${upNext.dayName}s` : "Suggested for today");

                          if (focused) {
                            const lifts = focused.exercises || [];
                            const exerciseCount = lifts.length;
                            const onStart = scheduledList.length > 0
                              ? () => startFromPlan(focused.id)
                              : () => addSessionToToday(focused.id);

                            return (
                              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                                {/* Frozen header */}
                                <div style={{ flexShrink: 0 }}>
                                  <div style={{ fontSize: 13, color: secondary }}>{eyebrow}</div>
                                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>
                                    {focused.name}
                                  </div>
                                  <div style={{ fontSize: 13, color: secondary, marginTop: 2 }}>
                                    {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
                                  </div>
                                </div>
                                {/* Middle scroll area — lifts only */}
                                <div style={{ flex: 1, minHeight: 0, overflow: "auto", marginTop: 12 }}>
                                  {lifts.length > 0 && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                      {lifts.map((ex, i) => (
                                        <div key={ex.id} style={{
                                          display: "flex", alignItems: "center", gap: 10,
                                          padding: "8px 0",
                                          borderTop: i === 0 ? "none" : `1px solid ${colors.border}`,
                                        }}>
                                          <div style={{
                                            width: 22, height: 22, borderRadius: 6,
                                            background: colors.subtleBg,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 11, fontWeight: 700, color: secondary,
                                            flexShrink: 0,
                                          }}>
                                            {i + 1}
                                          </div>
                                          <div style={{ fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {ex.name}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div style={{ paddingTop: 12 }}>
                                  <button
                                    className="btn-press"
                                    onClick={onStart}
                                    style={{
                                      width: "100%",
                                      padding: 12, borderRadius: 12,
                                      background: accent,
                                      color: colors.appBg,
                                      border: "none",
                                      fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                                      cursor: "pointer",
                                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    }}
                                  >
                                    Start session
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 12h14M13 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          // Multi-workout list layout (2+ scheduled). Each row is expandable
                          // to show its exercises. A single bottom CTA starts the whole day.
                          return (
                            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                              {/* Frozen header */}
                              <div style={{ flexShrink: 0 }}>
                                <div style={{ fontSize: 13, color: secondary }}>Scheduled for today</div>
                                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginTop: 2 }}>
                                  {scheduledList.length} sessions planned
                                </div>
                              </div>
                              {/* Middle scroll area — workout rows only */}
                              <div style={{ flex: 1, minHeight: 0, overflow: "auto", marginTop: 10 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {scheduledList.map((w) => {
                                  const lifts = w.exercises || [];
                                  const liftCount = lifts.length;
                                  const isExpanded = expandedPlanRows.has(w.id);
                                  return (
                                    <div
                                      key={w.id}
                                      style={{
                                        borderRadius: 12,
                                        background: colors.subtleBg,
                                        border: `1px solid ${colors.border}`,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <button
                                        className="btn-press"
                                        onClick={() => togglePlanRow(w.id)}
                                        aria-expanded={isExpanded}
                                        style={{
                                          display: "flex", alignItems: "center", gap: 10,
                                          padding: "12px 14px",
                                          background: "transparent",
                                          border: "none",
                                          color: colors.text,
                                          cursor: "pointer", fontFamily: "inherit",
                                          textAlign: "left", width: "100%",
                                        }}
                                      >
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                                          <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {w.name}
                                          </div>
                                          <div style={{ fontSize: 12, color: secondary }}>
                                            {liftCount} {liftCount === 1 ? "exercise" : "exercises"}
                                          </div>
                                        </div>
                                        <svg
                                          width="16" height="16" viewBox="0 0 24 24"
                                          fill="none" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"
                                          style={{
                                            opacity: 0.5,
                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease",
                                          }}
                                        >
                                          <path d="M6 9l6 6 6-6" />
                                        </svg>
                                      </button>
                                      {isExpanded && lifts.length > 0 && (
                                        <div style={{
                                          padding: "0 14px 12px",
                                          display: "flex", flexDirection: "column", gap: 0,
                                        }}>
                                          {lifts.map((ex, i) => (
                                            <div key={ex.id} style={{
                                              display: "flex", alignItems: "center", gap: 10,
                                              padding: "6px 0",
                                              borderTop: `1px solid ${colors.border}`,
                                            }}>
                                              <div style={{
                                                width: 20, height: 20, borderRadius: 6,
                                                background: colors.cardBg,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 10, fontWeight: 700, color: secondary,
                                                flexShrink: 0,
                                              }}>
                                                {i + 1}
                                              </div>
                                              <div style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {ex.name}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {isExpanded && lifts.length === 0 && (
                                        <div style={{ padding: "0 14px 12px", fontSize: 12, color: colors.textTertiary }}>
                                          No exercises yet.
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                </div>
                              </div>
                              <div style={{ paddingTop: 12 }}>
                                <button
                                  className="btn-press"
                                  onClick={() => startFromPlan(scheduledList[0].id)}
                                  style={{
                                    width: "100%",
                                    padding: 12, borderRadius: 12,
                                    background: accent,
                                    color: colors.appBg,
                                    border: "none",
                                    fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                                    cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                  }}
                                >
                                  Get started
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                      })()}
                    </div>
                  </div>
                  </div>
                </div>
                  );
                })()
              ) : !isToday && !hasSessions ? (
                /* NON-TODAY EMPTY: no logs or sessions — backfill-friendly */
                (() => {
                  const pattern = getUpNextSuggestion(
                    state.logsByDate || {},
                    state.program?.workouts || [],
                    state.dailyWorkouts || {},
                    dateKey,
                  );
                  let contextLine = null;
                  if (pattern?.isRestDay && pattern.dayName) {
                    contextLine = `Looks like a typical rest day on ${pattern.dayName}s.`;
                  } else if (pattern?.workouts?.length && pattern.confidence >= 0.5 && pattern.dayName) {
                    contextLine = `You usually train ${pattern.workouts.join(" + ")} on ${pattern.dayName}s.`;
                  }

                  return (
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      textAlign: "center", padding: "56px 20px 24px", gap: 14,
                    }}>
                      {/* Muted moon glyph — quiet day */}
                      <svg width="32" height="32" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" strokeWidth="1.5"
                           strokeLinecap="round" strokeLinejoin="round"
                           style={{ opacity: 0.25, color: colors.text }}>
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      <div style={{ fontSize: 14, opacity: 0.55, fontWeight: 600 }}>
                        No sessions logged
                      </div>
                      {contextLine && (
                        <div style={{ fontSize: 12, opacity: 0.4, lineHeight: 1.5, maxWidth: 280 }}>
                          {contextLine}
                        </div>
                      )}
                      <button
                        className="btn-press"
                        onClick={() => setFabOpen(true)}
                        style={{
                          marginTop: 4,
                          padding: "10px 18px",
                          borderRadius: 999,
                          border: `1px solid ${colors.accentBorder}`,
                          background: colors.accentBg,
                          color: colors.accent,
                          fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                          cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: 6,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add session
                      </button>
                    </div>
                  );
                })()
              ) : (
                /* HAS SESSIONS: header + cards */
                <>
                  <div style={{ fontSize: 20, fontWeight: 700, padding: "4px 0 8px" }}>
                    {isToday ? "Today\u2019s sessions" : "Sessions logged"}
                  </div>
                  {isToday && (
                    <div
                      onClick={() => setCoachExpanded((v) => !v)}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 16,
                        background: `color-mix(in srgb, ${colors.cardBg} 40%, ${colors.appBg})`,
                        border: `1px solid ${colors.border}`,
                        marginBottom: 14,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        fontSize: 12, fontWeight: 700, opacity: 0.4,
                        letterSpacing: 0.5, textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: 5, marginBottom: 10,
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
                          <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
                          <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
                        </svg>
                        Coach's insight
                      </div>
                      <CoachCard
                        expanded={coachExpanded}
                        todayCheckin={todayCheckin}
                        onCheckinSubmit={handleCheckinSubmit}
                        onCheckinUpdate={handleCheckinUpdate}
                        checkinEditSection={checkinEditSection}
                        setCheckinEditSection={setCheckinEditSection}
                        coachInsights={coachInsights}
                        coachLoading={coachLoading}
                        coachStreaming={coachStreaming}
                        coachError={coachError}
                        onCoachRefresh={handleCoachRefresh}
                        onAddSuggestion={handleAddSuggestion}
                        userExerciseNames={progressWorkouts.flatMap((w) => (w.exercises || []).map((e) => e.name))}
                        colors={colors}
                        onClearCheckin={clearTodayCheckinAndCoach}
                      />
                    </div>
                  )}
                  {/* Explicitly added sessions (with remove button) — newest first */}
                  {[...todayProgramWorkouts].reverse().map((w) => (
                    <WorkoutCard
                      key={w.id}
                      cardId={`today-card-${w.id}`}
                      workout={w}
                      collapsed={collapsedToday.has(w.id)}
                      onToggle={() => toggleCollapse(setCollapsedToday, w.id)}
                      logsForDate={logsForDate}
                      openLog={openLog}
                      deleteLogForExercise={deleteLogForExercise}
                      styles={styles}
                      findPrior={findPriorForExercise}
                      colors={colors}
                      onToggleRestTimer={toggleWorkoutRestTimer}
                      globalRestEnabled={state.preferences?.restTimerEnabled !== false}
                      weightLabel={getWeightLabel(state.preferences?.measurementSystem)}
                      onStartCircuit={(w) => setCircuitWorkout(w)}
                      onSwapExercise={(exId) => openSwapExercise(w.id, exId, false)}
                      onSkipExercise={(exId) => skipExercise(w.id, exId, false)}
                      overrides={todayOverrides[w.id] || null}
                      onUndoOverride={(origExId) => undoOverride(w.id, origExId)}
                      onPromoteOverride={(origExId) => promoteOverride(w.id, origExId)}
                      onRemoveFromToday={() => removeSessionFromToday(w.id)}
                      highlightBorder={highlightCardId === w.id}
                      catalogMap={catalogMap}
                      onAddExercise={() => addExerciseForToday(w.id, false)}
                      onRemoveSessionAddition={(exId) => removeSessionAddition(w.id, exId)}
                      onPromoteSessionAddition={(exId) => promoteSessionAddition(w.id, exId)}
                    />
                  ))}
                  {/* Auto-surfaced from cadence schedule — anchors and weekly preferred days */}
                  {scheduledTodayWorkouts.map((w) => (
                    <WorkoutCard
                      key={`sched-${w.id}`}
                      cardId={`today-card-${w.id}`}
                      workout={w}
                      collapsed={collapsedToday.has(w.id)}
                      onToggle={() => toggleCollapse(setCollapsedToday, w.id)}
                      logsForDate={logsForDate}
                      openLog={openLog}
                      deleteLogForExercise={deleteLogForExercise}
                      styles={styles}
                      findPrior={findPriorForExercise}
                      colors={colors}
                      onToggleRestTimer={toggleWorkoutRestTimer}
                      globalRestEnabled={state.preferences?.restTimerEnabled !== false}
                      weightLabel={getWeightLabel(state.preferences?.measurementSystem)}
                      onStartCircuit={(w) => setCircuitWorkout(w)}
                      onSwapExercise={(exId) => openSwapExercise(w.id, exId, false)}
                      onSkipExercise={(exId) => skipExercise(w.id, exId, false)}
                      overrides={todayOverrides[w.id] || null}
                      onUndoOverride={(origExId) => undoOverride(w.id, origExId)}
                      onPromoteOverride={(origExId) => promoteOverride(w.id, origExId)}
                      onRemoveFromToday={() => dismissScheduledForToday(w.id)}
                      highlightBorder={highlightCardId === w.id}
                      catalogMap={catalogMap}
                      onAddExercise={() => addExerciseForToday(w.id, false)}
                      onRemoveSessionAddition={(exId) => removeSessionAddition(w.id, exId)}
                      onPromoteSessionAddition={(exId) => promoteSessionAddition(w.id, exId)}
                      scheduledBadge
                    />
                  ))}
                  {/* Continuous splits — next-up workout in each active sequence */}
                  {continuousNextUpEntries.map((entry) => (
                    <div key={`cont-${entry.splitId}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <WorkoutCard
                        cardId={`today-card-${entry.workout.id}`}
                        workout={entry.workout}
                        collapsed={collapsedToday.has(entry.workout.id)}
                        onToggle={() => toggleCollapse(setCollapsedToday, entry.workout.id)}
                        logsForDate={logsForDate}
                        openLog={openLog}
                        deleteLogForExercise={deleteLogForExercise}
                        styles={styles}
                        findPrior={findPriorForExercise}
                        colors={colors}
                        onToggleRestTimer={toggleWorkoutRestTimer}
                        globalRestEnabled={state.preferences?.restTimerEnabled !== false}
                        weightLabel={getWeightLabel(state.preferences?.measurementSystem)}
                        onStartCircuit={(w) => setCircuitWorkout(w)}
                        onSwapExercise={(exId) => openSwapExercise(entry.workout.id, exId, false)}
                        onSkipExercise={(exId) => skipExercise(entry.workout.id, exId, false)}
                        overrides={todayOverrides[entry.workout.id] || null}
                        onUndoOverride={(origExId) => undoOverride(entry.workout.id, origExId)}
                        onPromoteOverride={(origExId) => promoteOverride(entry.workout.id, origExId)}
                        onRemoveFromToday={() => dismissScheduledForToday(entry.workout.id)}
                        highlightBorder={highlightCardId === entry.workout.id}
                        catalogMap={catalogMap}
                        onAddExercise={() => addExerciseForToday(entry.workout.id, false)}
                        onRemoveSessionAddition={(exId) => removeSessionAddition(entry.workout.id, exId)}
                        onPromoteSessionAddition={(exId) => promoteSessionAddition(entry.workout.id, exId)}
                        continuousMeta={{
                          splitName: entry.splitName,
                          memberIndex: entry.memberIndex,
                          totalMembers: entry.totalMembers,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => restartContinuousSplit(entry.splitId)}
                        style={{
                          alignSelf: "flex-end",
                          background: "transparent", border: "none",
                          color: colors.text, opacity: 0.45,
                          fontSize: 11, fontFamily: "inherit",
                          padding: "2px 6px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                        Restart sequence
                      </button>
                    </div>
                  ))}
                  {/* Auto-detected workouts from logs (no remove button) */}
                  {logDetectedWorkouts.map((w) => (
                    <WorkoutCard
                      key={w.id}
                      workout={w}
                      collapsed={collapsedToday.has(w.id)}
                      onToggle={() => toggleCollapse(setCollapsedToday, w.id)}
                      logsForDate={logsForDate}
                      openLog={openLog}
                      deleteLogForExercise={deleteLogForExercise}
                      styles={styles}
                      findPrior={findPriorForExercise}
                      colors={colors}
                      onToggleRestTimer={toggleWorkoutRestTimer}
                      globalRestEnabled={state.preferences?.restTimerEnabled !== false}
                      weightLabel={getWeightLabel(state.preferences?.measurementSystem)}
                      onStartCircuit={(w) => setCircuitWorkout(w)}
                      onSwapExercise={(exId) => openSwapExercise(w.id, exId, false)}
                      onSkipExercise={(exId) => skipExercise(w.id, exId, false)}
                      overrides={todayOverrides[w.id] || null}
                      onUndoOverride={(origExId) => undoOverride(w.id, origExId)}
                      onPromoteOverride={(origExId) => promoteOverride(w.id, origExId)}
                      catalogMap={catalogMap}
                      onAddExercise={() => addExerciseForToday(w.id, false)}
                      onRemoveSessionAddition={(exId) => removeSessionAddition(w.id, exId)}
                      onPromoteSessionAddition={(exId) => promoteSessionAddition(w.id, exId)}
                    />
                  ))}
                  {[...dailyWorkoutsToday].reverse().map((w) => (
                    <WorkoutCard
                      key={w.id}
                      workout={w}
                      collapsed={collapsedToday.has(w.id)}
                      onToggle={() => toggleCollapse(setCollapsedToday, w.id)}
                      logsForDate={logsForDate}
                      openLog={openLog}
                      deleteLogForExercise={deleteLogForExercise}
                      styles={styles}
                      daily
                      onDelete={() => deleteDailyWorkout(w.id)}
                      onDeleteExercise={(exId) => deleteDailyExercise(w.id, exId)}
                      findPrior={findPriorForExercise}
                      colors={colors}
                      onToggleRestTimer={toggleWorkoutRestTimer}
                      globalRestEnabled={state.preferences?.restTimerEnabled !== false}
                      weightLabel={getWeightLabel(state.preferences?.measurementSystem)}
                      onStartCircuit={(w) => setCircuitWorkout(w)}
                      onSwapExercise={(exId) => openSwapExercise(w.id, exId, true)}
                      onSkipExercise={(exId) => deleteDailyExercise(w.id, exId)}
                      catalogMap={catalogMap}
                      onAddExercise={() => addExerciseForToday(w.id, true)}
                    />
                  ))}
                </>
              )}
            </div>
          ) : null}

          {/* SUMMARY TAB */}
          {tab === "progress" ? (
            <div key="progress" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              <div style={{ position: "sticky", top: -14, zIndex: 10, background: colors.appBg, marginTop: -14, paddingTop: 14, paddingBottom: 10, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
                <TimeRangeControl
                  value={summaryMode}
                  onChange={setSummaryMode}
                  offset={summaryOffset}
                  onOffsetChange={setSummaryOffset}
                  dateLabel={`${formatDateLabel(summaryRange.start)} \u2013 ${formatDateLabel(summaryRange.end)}`}
                  colors={colors}
                />
              {(() => {
                const formatNum = (n) => n >= 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : n.toLocaleString();
                const weightUnit = getWeightLabel(state.preferences?.measurementSystem);
                const selectedStats = state.preferences?.progressStats || ["totalReps"];
                const toggleStat = (key) => {
                  const cur = state.preferences?.progressStats || ["totalReps"];
                  const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
                  updatePreference("progressStats", next.length > 0 ? next : cur);
                };

                const badgeStyle = { textAlign: "center", padding: "10px 4px", borderRadius: 12, background: colors.cardAltBg, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };
                const valStyle = { fontSize: 18, fontWeight: 700 };
                const subStyle = { fontSize: 10, fontWeight: 600, opacity: 0.5 };
                const exStyle = { fontSize: 9, fontWeight: 600, opacity: 0.4, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

                const statBadges = [];
                if (selectedStats.includes("totalReps") && summaryStats.bestReps) {
                  const bestUnit = summaryStats.bestReps.unit;
                  const unitLabel = bestUnit ? bestUnit.label : "Reps";
                  statBadges.push(
                    <div key="reps" style={badgeStyle}>
                      <div style={exStyle}>{summaryStats.bestReps.name}</div>
                      <div style={{ ...valStyle, color: colors.accent }}>{formatNum(summaryStats.bestReps.value)}</div>
                      <div style={subStyle}>Total {unitLabel}</div>
                    </div>
                  );
                }
                if (selectedStats.includes("volume") && summaryStats.bestVolume) {
                  statBadges.push(
                    <div key="vol" style={badgeStyle}>
                      <div style={exStyle}>{summaryStats.bestVolume.name}</div>
                      <div style={valStyle}>{formatNum(Math.round(summaryStats.bestVolume.value))}</div>
                      <div style={subStyle}>Volume ({weightUnit})</div>
                    </div>
                  );
                }
                if (selectedStats.includes("topLift") && summaryStats.bestLift) {
                  statBadges.push(
                    <div key="lift" style={badgeStyle}>
                      <div style={exStyle}>{summaryStats.bestLift.name}</div>
                      <div style={valStyle}>{summaryStats.bestLift.value} {weightUnit}</div>
                      <div style={subStyle}>Top Lift ({weightUnit})</div>
                    </div>
                  );
                }

                const topRowCols = statBadges.length === 1 ? "1fr 1fr 1fr" : "1fr 1fr";
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Highlights header — label + gear icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.4 }}>
                        Highlights
                      </span>
                      <div ref={statsConfigRef} style={{ position: "relative" }}>
                        <button
                          onClick={() => setShowStatsConfig((v) => !v)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: colors.text, opacity: 0.35, display: "flex", alignItems: "center", justifyContent: "center" }}
                          aria-label="Configure stats"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
                          </svg>
                        </button>
                        {showStatsConfig && (
                          <div style={{
                            position: "absolute", right: 0, top: "100%", marginTop: 4, zIndex: 50,
                            background: colors.appBg, border: `1px solid ${colors.border}`,
                            borderRadius: 10, padding: "10px 14px", minWidth: 160,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                            display: "flex", flexDirection: "column", gap: 6,
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginBottom: 2 }}>Show Highlights</div>
                            {[
                              { key: "totalReps", label: "Top Exercise" },
                              { key: "volume", label: `Volume (${weightUnit})` },
                              { key: "topLift", label: `Top Lift (${weightUnit})` },
                            ].map((opt) => (
                              <label key={opt.key} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                fontSize: 13, color: colors.text, cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}>
                                <input
                                  type="checkbox"
                                  checked={selectedStats.includes(opt.key)}
                                  onChange={() => toggleStat(opt.key)}
                                  style={{ accentColor: colors.primaryBg }}
                                />
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Stats grid — row 1: Sessions + Days Active (+ 1 stat if only 1 selected) */}
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: topRowCols, gap: 8 }}>
                        <div style={badgeStyle}>
                          <div style={valStyle}>{summaryStats.logged}</div>
                          <div style={subStyle}>Sessions</div>
                        </div>
                        {summaryMode === "week" ? (
                          <div style={badgeStyle}>
                            <div style={{ ...valStyle, color: summaryStats.logged > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.logged}/{summaryStats.total}</div>
                            <div style={subStyle}>Days Active</div>
                          </div>
                        ) : (
                          <div style={badgeStyle}>
                            <div style={{ ...valStyle, color: summaryStats.longestStreak > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.longestStreak}</div>
                            <div style={subStyle}>Best Streak</div>
                          </div>
                        )}
                        {statBadges.length === 1 && statBadges[0]}
                      </div>
                    </div>
                    {/* Stats grid — row 2: 2 or 3 selected stats */}
                    {statBadges.length >= 2 && (
                      <div style={{ display: "grid", gridTemplateColumns: statBadges.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8 }}>
                        {statBadges}
                      </div>
                    )}
                  </div>
                );
              })()}
              </div>

              {/* Volume trend — week-over-week total training volume (Pro-gated) */}
              {summaryStats.logged > 0 && (
                <div style={{ ...styles.card, padding: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.4, display: "block", marginBottom: 10 }}>
                    Weekly volume · {getWeightLabel(state.preferences?.measurementSystem)}
                  </span>
                  {isPro && weeklyVolume.length >= 2 && (
                    <div style={{ fontSize: 11, opacity: 0.45, marginTop: -4, marginBottom: 8, lineHeight: 1.4 }}>
                      Weight × reps from completed weighted sets. Bodyweight sets aren&apos;t included. Volume reflects exercise choice and frequency — up isn&apos;t always better.
                    </div>
                  )}
                  {!isPro ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: colors.subtleBg, border: `1px solid ${colors.border}` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Volume trend is a Pro feature</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>See your weekly training volume rise and fall over time.</div>
                      </div>
                    </div>
                  ) : weeklyVolume.length < 2 ? (
                    <div style={{ fontSize: 12, opacity: 0.55, padding: "6px 2px", lineHeight: 1.5 }}>
                      Log weighted sets across at least 2 weeks to see your volume trend.
                    </div>
                  ) : (
                    <BarChart
                      data={weeklyVolume}
                      xKey="weekStart"
                      valueKey="volume"
                      label="Volume"
                      color={colors.accent}
                      colors={colors}
                      formatValue={(v) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(Math.round(v)))}
                      formatX={(dk) => { const p = String(dk).split("-"); return `${Number(p[1])}/${Number(p[2])}`; }}
                      formatXLong={(dk) => { const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; const p = String(dk).split("-"); return `Week of ${M[Number(p[1]) - 1]} ${Number(p[2])}`; }}
                    />
                  )}
                </div>
              )}

              {/* Muscle balance — sets per muscle group over the range (Pro-gated) */}
              {summaryStats.logged > 0 && (
                <div style={{ ...styles.card, padding: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.4, display: "block", marginBottom: 12 }}>
                    Muscle balance
                  </span>
                  {!isPro ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: colors.subtleBg, border: `1px solid ${colors.border}` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Muscle balance is a Pro feature</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>See how your logged strength sets distribute across muscle groups.</div>
                      </div>
                    </div>
                  ) : (
                    <MuscleBalance data={muscleBalance} colors={colors} />
                  )}
                </div>
              )}

              {/* Consistency heatmap — training days by intensity (Pro-gated) */}
              {summaryStats.logged > 0 && (
                <div style={{ ...styles.card, padding: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.4, display: "block", marginBottom: 12 }}>
                    Consistency
                  </span>
                  {!isPro ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: colors.subtleBg, border: `1px solid ${colors.border}` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Consistency heatmap is a Pro feature</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>See your training frequency day by day.</div>
                      </div>
                    </div>
                  ) : (
                    <ActivityHeatmap weeks={calendarWeeks} colors={colors} />
                  )}
                </div>
              )}

              {summaryStats.logged === 0 ? (
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
                  <div style={{ fontWeight: 600, fontSize: 16 }}>No data yet</div>
                  <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>
                    Log a session on the <b>Sessions</b> tab and your history will show up here.
                  </div>
                </div>
              ) : (
                <ExerciseListTable
                  exercises={flatExerciseList}
                  colors={colors}
                  styles={styles}
                  isPro={isPro}
                  weightUnit={getWeightLabel(state.preferences?.measurementSystem)}
                  getSeries={(ex) => {
                    const ids = ex.ids || [ex.id];
                    // All-time PRs (not range-limited) shown above the chart.
                    const prs = computePRs(state.logsByDate, ids);
                    const weight = buildStrengthSeries(state.logsByDate, ids, summaryRange.start, summaryRange.end);
                    const reps = buildRepsSeries(state.logsByDate, ids, summaryRange.start, summaryRange.end);
                    // Pick the chart by exercise metadata first (equipment), so a
                    // weighted lift logged only a couple times isn't misread as
                    // bodyweight. Bodyweight-only → reps. Otherwise show weight when
                    // any weighted data exists, else fall back to reps.
                    const loadType = classifyLoadType(ex, catalogMap);
                    const mode = loadType === "bodyweight"
                      ? "reps"
                      : weight.length > 0
                        ? "weight"
                        : "reps";
                    return { mode, data: mode === "weight" ? weight : reps, prs };
                  }}
                />
              )}
            </div>
          ) : null}

          {/* MANAGE TAB */}
          {tab === "program" ? (
            <div key="program" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              {/* Empty state — no workouts AND no splits */}
              {splits.length === 0 && workouts.length === 0 && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "40px 16px 16px", textAlign: "center",
                }}>
                  <div style={{
                    width: 56, height: 56, marginBottom: 14,
                    borderRadius: 16, background: colors.accentSoft,
                    border: `1px solid ${colors.accentBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3, marginBottom: 4 }}>
                    Build your first workout
                  </div>
                  <div style={{
                    fontSize: 13, color: colors.textSecondary,
                    lineHeight: 1.5, maxWidth: 260, marginBottom: 18,
                  }}>
                    Start from scratch, or have AI build a full program from your goal and equipment.
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatchModal({ type: "OPEN_GENERATE_WIZARD", payload: { equipment } })}
                    style={{
                      width: "100%", padding: "13px 14px", borderRadius: 12, border: "none",
                      background: colors.accent, color: colors.appBg,
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: 14, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.appBg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></svg>
                    Generate with AI
                  </button>
                  <button
                    type="button"
                    onClick={addWorkout}
                    style={{
                      marginTop: 8, width: "100%", padding: "12px 14px", borderRadius: 12,
                      background: "transparent", color: colors.text,
                      border: `1px solid ${colors.border}`,
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: 13.5, fontWeight: 600,
                    }}
                  >
                    Start from scratch
                  </button>
                </div>
              )}

              {/* Exercise catalog browse — no section header */}
              <ExerciseCatalogSection
                styles={styles}
                colors={colors}
                catalogCount={fullCatalog.length}
                onOpen={() => dispatchModal({ type: "OPEN_CATALOG_BROWSE", payload: { workoutId: null } })}
              />

              {/* ===== WORKOUTS SECTION ===== */}
              {(workouts.length > 0 || splits.length > 0) && (() => {
                const isCollapsed = collapsedManage.has("workouts");
                return (
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    boxShadow: colors.shadow,
                    overflow: "hidden",
                  }}>
                    {/* Section header — tap to collapse/expand */}
                    <div
                      onClick={() => toggleCollapse(setCollapsedManage, "workouts")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px",
                        cursor: "pointer", userSelect: "none", gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        <div style={{
                          fontSize: 11, fontWeight: 600, opacity: 0.4,
                          textTransform: "uppercase", letterSpacing: 1,
                        }}>
                          Workouts
                        </div>
                      </div>
                      {!isCollapsed && workouts.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleReorderWorkouts(); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: reorderWorkouts ? colors.accentSoft : "transparent",
                            border: `1px solid ${reorderWorkouts ? colors.accentBorder : colors.border}`,
                            color: reorderWorkouts ? colors.accent : colors.textSecondary,
                            fontFamily: "inherit",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            cursor: "pointer",
                            minHeight: 32,
                          }}
                        >{reorderWorkouts ? "Done" : "Reorder"}</button>
                      )}
                    </div>

                    {/* Body — workout rows styled like exercise rows in WorkoutDetailSheet,
                        with a dashed "+ Add workout" button at the bottom. */}
                    {!isCollapsed && (
                      <WorkoutsList
                        workouts={workouts}
                        reorderWorkouts={reorderWorkouts}
                        onOpenDetail={(wid) => dispatchModal({ type: "OPEN_WORKOUT_DETAIL", payload: { workoutId: wid } })}
                        onCommitReorder={reorderWorkoutsByIndex}
                        onAddWorkout={addWorkout}
                        colors={colors}
                        weekStartsOn={weekStartsOn}
                      />
                    )}
                  </div>
                );
              })()}

              {/* ===== SPLITS SECTION ===== */}
              {(workouts.length > 0 || splits.length > 0) && (() => {
                const isCollapsed = collapsedManage.has("splits");
                return (
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    boxShadow: colors.shadow,
                    overflow: "hidden",
                  }}>
                    {/* Section header — tap to collapse/expand */}
                    <div
                      onClick={() => toggleCollapse(setCollapsedManage, "splits")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 16px",
                        cursor: "pointer", userSelect: "none", gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        <div style={{
                          fontSize: 11, fontWeight: 600, opacity: 0.4,
                          textTransform: "uppercase", letterSpacing: 1,
                        }}>
                          Splits
                        </div>
                      </div>
                      {!isCollapsed && splits.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setReorderSplits((v) => !v); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: reorderSplits ? colors.accentSoft : "transparent",
                            border: `1px solid ${reorderSplits ? colors.accentBorder : colors.border}`,
                            color: reorderSplits ? colors.accent : colors.textSecondary,
                            fontFamily: "inherit",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            cursor: "pointer",
                            minHeight: 32,
                          }}
                        >{reorderSplits ? "Done" : "Reorder"}</button>
                      )}
                    </div>

                    {/* Body — splits as compact rows; drag-grip reorder mirrors
                        the Workouts section. Tap opens the detail sheet. */}
                    {!isCollapsed && (
                      <SplitsList
                        splits={splits}
                        reorderSplits={reorderSplits}
                        onOpenDetail={openSplitDetail}
                        onCommitReorder={reorderSplitsByIndex}
                        onAddSplit={openCreateSplit}
                        colors={colors}
                      />
                    )}
                  </div>
                );
              })()}

            </div>
          ) : null}

          {/* SOCIAL TAB — inbox only */}
          {tab === "social" ? (
            <div key="social" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* Editorial headline + friend search */}
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
                    Stay in sync with your circle.
                  </div>
                  <div
                    onClick={() => dispatchModal({ type: "OPEN_FRIEND_SEARCH" })}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "14px 16px", borderRadius: 999,
                      background: colors.subtleBg, cursor: "pointer",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ fontSize: 14, opacity: 0.35 }}>Find friends or trainers...</span>
                  </div>
                </div>

                {socialLoading && socialInbox.length === 0 && socialFriends.length === 0 && (
                  <div style={{ textAlign: "center", padding: 24, opacity: 0.5, fontSize: 13 }}>Loading...</div>
                )}

                {/* Shared with You */}
                {socialInbox.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>Shared with You</div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.45 }}>
                        {socialInbox.filter(sw => sw.status === "pending").length} New Workouts
                      </div>
                    </div>
                    {socialInbox.map((sw) => {
                      const workout = sw.workout_snapshot;
                      const fromUser = sw.from_profile;
                      const exCount = workout?.exercises?.length || 0;
                      const isPending = sw.status === "pending";
                      return (
                        <div key={sw.id} style={{ background: colors.cardBg, borderRadius: 16, overflow: "hidden", opacity: isPending ? 1 : 0.55 }}>
                          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 24, height: 24, borderRadius: 999, background: colors.accent + "22", color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                                {fromUser?.avatar_url ? <img src={fromUser.avatar_url} alt="" style={{ width: 24, height: 24, borderRadius: 999, objectFit: "cover" }} /> : (fromUser?.username || "?")[0].toUpperCase()}
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>@{fromUser?.username || "unknown"}</span>
                            </div>
                            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>{workout?.name || "Workout"}</div>
                            {sw.message && <div style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.5 }}>"{sw.message}"</div>}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.35 }}>
                                {exCount > 0 ? `${exCount} exercises` : ""}{exCount > 0 && workout?.category ? " · " : ""}{workout?.category || ""}
                              </span>
                              {isPending ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button className="btn-press" onClick={() => dispatchModal({ type: "OPEN_WORKOUT_PREVIEW", payload: { sharedWorkout: sw } })} style={{ ...styles.primaryBtn, padding: "8px 18px", fontSize: 12, borderRadius: 999 }}>Import</button>
                                  <button className="btn-press" onClick={async () => { await dismissSharedWorkout(sw.id); refreshSocial(); }} style={{ padding: "8px 14px", fontSize: 12, borderRadius: 999, border: `1px solid ${colors.border}`, background: "transparent", color: colors.text, cursor: "pointer", opacity: 0.5 }}>Dismiss</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5 }}>{sw.status === "accepted" ? "Imported" : "Dismissed"}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Friend Requests */}
                {socialPending.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>Requests</div>
                      <div style={{ width: 20, height: 20, borderRadius: 999, background: colors.accent, color: colors.primaryText, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{socialPending.length}</div>
                    </div>
                    {socialPending.map((r) => (
                      <div key={r.friendshipId} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: colors.subtleBg }}>
                        <div style={{ width: 44, height: 44, borderRadius: 999, background: colors.accent + "22", color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                          {r.avatar_url ? <img src={r.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: 999, objectFit: "cover" }} /> : (r.username || "?")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>@{r.username}</div>
                          {r.display_name && <div style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{r.display_name}</div>}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button className="btn-press" onClick={async () => { await acceptFriendRequest(r.friendshipId); refreshSocial(); showToast(`You and @${r.username} are now friends!`); }} style={{ ...styles.primaryBtn, padding: "7px 14px", fontSize: 12, borderRadius: 999 }}>Accept</button>
                          <button className="btn-press" onClick={async () => { await declineFriendRequest(r.friendshipId); refreshSocial(); }} style={{ padding: "7px 10px", fontSize: 12, borderRadius: 999, border: `1px solid ${colors.border}`, background: "transparent", color: colors.text, cursor: "pointer", opacity: 0.6 }}>Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Friends list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Current Friends</div>
                  {socialFriends.length === 0 && !socialLoading ? (
                    <div style={{ textAlign: "center", padding: "20px 0", opacity: 0.4, fontSize: 13 }}>No friends yet. Tap Add to search for users.</div>
                  ) : (
                    socialFriends.map((f) => (
                      <div key={f.friendshipId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{ width: 40, height: 40, borderRadius: 999, background: colors.accent + "22", color: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                          {f.avatar_url ? <img src={f.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover" }} /> : (f.username || "?")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>@{f.username}</div>
                          {f.display_name && <div style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{f.display_name}</div>}
                        </div>
                        <button className="btn-press" onClick={() => dispatchModal({ type: "OPEN_SHARE_WORKOUT", payload: { selectedFriendId: f.id } })} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, borderRadius: 999, border: `1px solid ${colors.border}`, background: "transparent", color: colors.text, cursor: "pointer" }}>Share</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* FAB + Panel for Sessions tab */}
        {tab === "train" && (
          <>
            {fabOpen && (
              <>
                <div style={{
                  position: "fixed", inset: 0, zIndex: 39,
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  background: "rgba(0,0,0,0.15)",
                }} onClick={() => setFabOpen(false)} />
                <div style={{
                  ...styles.fabPanel,
                  animation: "fabPanelIn 0.2s ease-out",
                }}>
                  <div style={{
                    padding: "14px 16px", fontWeight: 700, fontSize: 15,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    flexShrink: 0,
                  }}>
                    Add Session
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
                    {workouts.length === 0 && (
                      <div style={{ padding: "16px 4px", fontSize: 13, opacity: 0.5, textAlign: "center" }}>
                        No workouts yet. Create one in the Plans tab or generate one below.
                      </div>
                    )}
                    {workouts.map((w) => {
                      const alreadyOn = (state.todaySessions?.[dateKey] || []).includes(w.id);
                      return (
                        <button key={w.id} style={{
                          width: "100%", textAlign: "left", padding: "12px 14px",
                          borderRadius: 14, border: `1px solid ${alreadyOn ? colors.accentBorder : colors.border}`,
                          background: alreadyOn ? colors.accentBg : "transparent",
                          color: colors.text, fontWeight: 600, fontSize: 14,
                          marginBottom: 8, cursor: "pointer", fontFamily: "inherit",
                        }} onClick={() => addSessionToToday(w.id)}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{w.name}</span>
                            {alreadyOn && <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400 }}>Added</span>}
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.45, marginTop: 2, fontWeight: 400 }}>
                            {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""} · {w.category || "Workout"}
                          </div>
                        </button>
                      );
                    })}
                    <button style={{
                      width: "100%", textAlign: "left", padding: "12px 14px",
                      borderRadius: 14, border: `1px solid ${colors.border}`,
                      background: "transparent", color: colors.text, fontWeight: 600, fontSize: 14,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 8,
                    }} onClick={() => { setFabOpen(false); openGenerateToday(); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
                        <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z"/>
                      </svg>
                      Generate workout for today
                    </button>
                  </div>
                </div>
              </>
            )}
            <button style={{
              ...styles.fab,
              opacity: fabOpen ? 0 : fabVisible ? 1 : 0.3,
              transform: fabOpen ? "scale(0)" : "scale(1)",
              pointerEvents: fabOpen ? "none" : "auto",
            }} onClick={() => setFabOpen(true)} aria-label="Add session">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </>
        )}

        {/* Bottom navigation */}
        <div style={styles.nav}>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "train" ? styles.navBtnActive : {}) }} onClick={() => setTab("train")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="8.5" ry="8" />
            </svg>
            Sessions
          </button>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "progress" ? styles.navBtnActive : {}) }} onClick={() => setTab("progress")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Progress
          </button>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "program" ? styles.navBtnActive : {}) }} onClick={() => setTab("program")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 12h8" /><path d="M8 17h4" />
            </svg>
            Plans
          </button>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "social" ? styles.navBtnActive : {}), position: "relative" }} onClick={() => setTab("social")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            Community
            {socialBadge > 0 && (
              <div style={{
                position: "absolute", top: 2, right: "50%", transform: "translateX(12px)",
                width: 8, height: 8, borderRadius: 999,
                background: colors.accent,
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Acknowledgment toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "45%", left: "50%", transform: "translate(-50%, -50%)",
          background: colors.cardBg, color: colors.text, border: `1px solid ${colors.border}`,
          borderRadius: 18, padding: "16px 28px", boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          zIndex: 9999, textAlign: "center", animation: "toastPop 0.3s cubic-bezier(.2,.8,.3,1)",
          maxWidth: "80vw",
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{toast.emoji || ""}</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{toast.message}</div>
          {toast.coachLine && (
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{toast.coachLine}</div>
          )}
        </div>
      )}

      {/* MODALS */}

      {/* Log Modal */}
      <Modal open={modals.log.isOpen} noChrome
        onClose={() => { setShowTargetConfig(false); setPacePopoverIdx(null); setRpePopoverIdx(null); setLogFlipped(false); setLogFlipAngle(0); dispatchModal({ type: "CLOSE_LOG" }); }}
        styles={styles}
      >
        {modals.log.isOpen && (() => {
          const logCtx = modals.log.context;
          const closeLog = () => { setShowTargetConfig(false); setPacePopoverIdx(null); setRpePopoverIdx(null); setLogFlipped(false); setLogFlipAngle(0); dispatchModal({ type: "CLOSE_LOG" }); };
          const logExercise = findExerciseById(state, logCtx?.exerciseId);
          const logUnit = logExercise ? getUnit(logExercise.unit, logExercise) : getUnit("reps");
          const logScheme = logCtx?.scheme;
          const showWeight = logUnit.key === "reps" && !logExercise?.bodyweight;
          const exerciseTargets = logExercise?.targets || [];
          const tCount = exerciseTargets.length;
          const hasPace = exerciseTargets.includes("pace");
          const hasCustom = exerciseTargets.includes("custom");
          let topRowTarget = null, secondRowTargets = [], thirdRowTargets = [];
          if (tCount === 1) {
            topRowTarget = exerciseTargets[0];
          } else if (tCount === 2) {
            if (hasCustom) {
              topRowTarget = exerciseTargets.find((t) => t !== "custom");
              secondRowTargets = ["custom"];
            } else {
              secondRowTargets = ["pace", "rpe", "intensity"].filter((t) => exerciseTargets.includes(t));
            }
          } else if (tCount === 3) {
            if (hasPace) {
              topRowTarget = "pace";
              secondRowTargets = ["rpe", "intensity", "custom"].filter((t) => exerciseTargets.includes(t));
            } else {
              topRowTarget = "rpe";
              secondRowTargets = ["intensity", "custom"].filter((t) => exerciseTargets.includes(t));
            }
          } else if (tCount === 4) {
            topRowTarget = "pace";
            secondRowTargets = ["rpe", "intensity"];
            thirdRowTargets = ["custom"];
          }
          const hasTopRow = !!topRowTarget;
          const baseGridCols = showWeight
            ? (hasTopRow ? "28px 1fr 1fr 1fr 32px" : "28px 1fr 1fr 32px")
            : (hasTopRow ? "28px 1fr 1fr 32px" : "28px 1fr 32px");

          // Find last session data for context
          const existingLog = state.logsByDate[dateKey]?.[logCtx?.exerciseId];
          const priorLog = !existingLog ? findMostRecentLogBefore(logCtx?.exerciseId, dateKey) : null;
          const lastSessionSets = priorLog?.sets;
          const lastSessionText = lastSessionSets
            ? lastSessionSets
                .filter((s) => Number(s.reps) > 0)
                .map((s) => {
                  const isBW = String(s.weight).toUpperCase() === "BW";
                  const w = isBW ? "BW" : s.weight;
                  if (logUnit.key === "reps") return `${s.reps}x${w || 0}`;
                  const hasW = w && w !== "BW" && w !== "" && w !== "0";
                  return hasW ? `${s.reps}${logUnit.abbr} @ ${w}` : `${s.reps}${logUnit.abbr}`;
                })
                .join(", ")
            : null;

          // Rest timer toggle state for front header
          const hEx = logCtx?.exerciseId;
          const hExObj = hEx ? findExerciseById(state, hEx) : null;
          const hRestOn = hExObj?.restTimer !== undefined ? hExObj.restTimer : state.preferences?.restTimerEnabled !== false;

          // Close button SVG (shared)
          const closeBtn = (onClick) => (
            <button onClick={onClick} style={styles.iconBtn} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          );

          const handleFocusCapture = (e) => {
            const el = e.target;
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
              setTimeout(() => {
                el.scrollIntoView({ block: "nearest", behavior: "smooth" });
              }, 300);
            }
          };

          return (
        <div
          ref={logCardRef}
          style={{ perspective: 1200, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
        >
          <div style={{
            flex: 1, minHeight: 0,
            transition: "transform 0.45s cubic-bezier(.4,.0,.2,1)",
            transformStyle: "preserve-3d",
            transform: `rotateY(${logFlipAngle}deg)`,
            position: "relative",
          }}>
            {/* ===== FRONT FACE: Log ===== */}
            <div style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "flex", flexDirection: "column",
              background: colors.cardBg, borderRadius: 18,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              overflow: "clip",
            }}>
              {/* Front header */}
              <div style={styles.modalHeader}>
                <div style={{ ...styles.modalTitle, cursor: logCtx?.catalogId ? "pointer" : "default", display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}
                  onClick={() => flipLogToDetail("left")}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{logCtx?.exerciseName || "Log"}</span>
                  {logCtx?.catalogId && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => toggleExerciseRestTimer(hEx)}
                    style={{
                      ...styles.iconBtn,
                      color: hRestOn ? (colors.accent || "#4fc3f7") : colors.text,
                      opacity: hRestOn ? 0.9 : 0.35,
                    }}
                    aria-label={`Rest timer: ${hRestOn ? "on" : "off"}`}
                    title={hRestOn ? "Rest timer on" : "Rest timer off"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="13" r="8" />
                      <path d="M12 9v4l2 2" />
                      <path d="M5 3l2 2" />
                      <path d="M19 3l-2 2" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                    </svg>
                  </button>
                  {closeBtn(closeLog)}
                </div>
              </div>

              {/* Front body */}
              <div ref={logBodyRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, WebkitOverflowScrolling: "touch", transform: "translateZ(0)" }} onFocusCapture={handleFocusCapture}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {logScheme && (
            <div style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 8,
              background: colors.primaryBg + "18", border: `1px solid ${colors.primaryBg}44`,
              color: colors.text,
            }}>
              Target: <b>{logScheme}</b>
            </div>
          )}

          {lastSessionText && (
            <div style={{
              fontSize: 12, padding: "8px 12px", borderRadius: 8,
              background: colors.cardAltBg, border: `1px solid ${colors.border}`,
              color: colors.text, opacity: 0.7,
            }}>
              Last session: <span style={{ fontWeight: 700 }}>{lastSessionText}</span>
            </div>
          )}

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: baseGridCols,
            gap: 8,
            padding: "0 10px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45, textAlign: "center" }}>Set</div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45 }}>{logUnit.label}</div>
            {showWeight && <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45 }}>Weight ({getWeightLabel(state.preferences?.measurementSystem)})</div>}
            {hasTopRow && <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.45 }}>{topRowTarget === "pace" ? "Pace" : topRowTarget === "rpe" ? "RPE" : topRowTarget === "intensity" ? "Intensity" : "Target"}</div>}
            <div ref={targetConfigRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowTargetConfig((v) => !v)}
                style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: 0,
                  color: colors.text, opacity: exerciseTargets.length > 0 ? 0.6 : 0.35,
                  display: "flex", alignItems: "center", justifyContent: "center", width: "100%",
                }}
                aria-label="Configure target columns"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
                </svg>
              </button>
              {showTargetConfig && (
                <div style={{
                  position: "absolute", right: 0, top: "100%", zIndex: 20,
                  background: colors.cardBg, border: `1px solid ${colors.border}`,
                  borderRadius: 8, padding: "8px 12px", minWidth: 150,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  display: "flex", flexDirection: "column", gap: 6,
                }}>
                  {logUnit.key === "reps" && (
                    <label style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, color: colors.text, cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}>
                      <input
                        type="checkbox"
                        checked={!!logExercise?.bodyweight}
                        onChange={() => toggleExerciseBodyweight(logCtx?.exerciseId)}
                        style={{ accentColor: colors.primaryBg }}
                      />
                      Bodyweight
                    </label>
                  )}
                  <div style={{ borderBottom: `1px solid ${colors.border}`, margin: "2px 0" }} />
                  {[
                    { key: "pace", label: "Pace (MM:SS)" },
                    { key: "rpe", label: "RPE (1–10)" },
                    { key: "intensity", label: "Intensity (1–10)" },
                    { key: "custom", label: "Custom (text)" },
                  ].map((opt) => (
                    <label key={opt.key} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, color: colors.text, cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}>
                      <input
                        type="checkbox"
                        checked={exerciseTargets.includes(opt.key)}
                        onChange={() => toggleExerciseTarget(logCtx?.exerciseId, opt.key)}
                        style={{ accentColor: colors.primaryBg }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(() => {
              const firstUncompleted = modals.log.sets.findIndex((ms) => !ms.completed);
              return modals.log.sets.map((s, i) => {
              const isBW = String(s.weight).toUpperCase() === "BW";
              const isSetSaved = !!s.completed;
              const isNextSet = i === firstUncompleted;
              const showRestAfter = restTimer.active && restTimer.exerciseId === logCtx?.exerciseId && restTimer.completedSetIndex === i;
              return (
                <React.Fragment key={i}>
                <div style={{
                  borderRadius: 12,
                  border: isSetSaved ? "1px solid rgba(46,204,113,0.4)" : `1px solid ${colors.border}`,
                  background: isSetSaved ? "rgba(46,204,113,0.08)" : colors.cardAltBg,
                  transition: "border 0.2s, background 0.2s",
                  ...(isSetSaved ? { animation: "rowPulse 0.5s ease-out" } : {}),
                  padding: "8px 10px",
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: baseGridCols,
                    gap: 8,
                    alignItems: "center",
                  }}>
                  <button
                    style={{
                      width: 26, height: 26, borderRadius: 999, padding: 0,
                      border: isSetSaved ? "2px solid #2ecc71" : isNextSet ? "2px solid rgba(46,204,113,0.5)" : `2px solid ${colors.border}`,
                      background: isSetSaved ? "#2ecc71" : "transparent",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSetSaved ? "#fff" : isNextSet ? "rgba(46,204,113,0.6)" : colors.text,
                      fontWeight: 700, fontSize: 12,
                      transition: "all 0.2s",
                      ...(isSetSaved ? { animation: "chipPop 0.3s ease-out" } : {}),
                      ...(isNextSet ? { animation: "setBreathe 2s ease-in-out infinite" } : {}),
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onClick={() => {
                      if (isSetSaved) {
                        uncompleteSet(logCtx.exerciseId, i);
                      } else {
                        const reps = Number(s.reps ?? 0);
                        const weight = String(s.weight ?? "").trim();
                        if (reps > 0) {
                          const setPayload = { reps, weight: weight || "" };
                          if (s.targetRpe) setPayload.targetRpe = s.targetRpe;
                          if (s.targetPace) setPayload.targetPace = s.targetPace;
                          if (s.targetCustom) setPayload.targetCustom = s.targetCustom;
                          if (s.targetIntensity) setPayload.targetIntensity = s.targetIntensity;
                          completeSet(logCtx.exerciseId, i, setPayload, logCtx.workoutId, modals.log.sets.length);
                        }
                      }
                    }}
                    aria-label={isSetSaved ? `Uncomplete set ${i + 1}` : `Complete set ${i + 1}`}
                  >
                    {isSetSaved ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 24, animation: "checkDraw 0.3s ease-out forwards" }} />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isNextSet ? 0.7 : 0.3 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  <input
                    type="number"
                    value={String(s.reps ?? "")}
                    onChange={(e) => {
                      const newSets = [...modals.log.sets];
                      let v = logUnit.allowDecimal ? e.target.value.replace(/[^\d.]/g, "") : e.target.value.replace(/[^\d]/g, "");
                      if (logUnit.allowDecimal) { const parts = v.split("."); v = parts.shift() + (parts.length ? "." + parts.join("") : ""); }
                      newSets[i] = { ...newSets[i], reps: v };
                      dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                    }}
                    onFocus={(e) => requestAnimationFrame(() => e.target.select())}
                    onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                    enterKeyHint="done"
                    step={logUnit.allowDecimal ? "0.01" : "1"}
                    min="0"
                    style={styles.numInput}
                    placeholder="0"
                  />

                  {showWeight && (
                    <input
                      type="number"
                      value={isBW ? "" : String(s.weight ?? "")}
                      onChange={(e) => {
                        const newSets = [...modals.log.sets];
                        let w = e.target.value.replace(/[^\d.]/g, "");
                        const parts = w.split("."); w = parts.shift() + (parts.length ? "." + parts.join("") : "");
                        newSets[i] = { ...newSets[i], weight: w };
                        dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                      }}
                      onFocus={(e) => requestAnimationFrame(() => e.target.select())}
                      onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                      enterKeyHint="done"
                      step="0.01"
                      min="0"
                      style={{ ...styles.numInput, ...(isBW ? styles.disabledInput : {}) }}
                      placeholder={getWeightLabel(state.preferences?.measurementSystem)}
                      disabled={isBW}
                    />
                  )}

                  {/* Top-row target (in grid) */}
                  {topRowTarget === "rpe" && (
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => { setRpePopoverIdx(rpePopoverIdx === i ? null : i); setPacePopoverIdx(null); setIntensityPopoverIdx(null); }}
                        style={{
                          ...styles.numInput, fontSize: 13, textAlign: "center",
                          width: "100%", cursor: "pointer",
                          opacity: s.targetRpe ? 1 : 0.4,
                        }}
                      >
                        {s.targetRpe || "—"}
                      </button>
                      {rpePopoverIdx === i && (
                        <div ref={rpePopoverRef} style={{
                          position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, zIndex: 20,
                          background: colors.cardBg, border: `1px solid ${colors.border}`,
                          borderRadius: 8, padding: 4,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                          maxHeight: 200, overflowY: "auto",
                        }}>
                          {["1","2","3","4","5","6","7","8","9","10"].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                const newSets = [...modals.log.sets];
                                newSets[i] = { ...newSets[i], targetRpe: v };
                                dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                                setRpePopoverIdx(null);
                              }}
                              style={{
                                width: "100%", padding: "7px 0", borderRadius: 8, border: "none",
                                background: s.targetRpe === v ? colors.primaryBg : "transparent",
                                color: s.targetRpe === v ? colors.primaryText : colors.text,
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {topRowTarget === "pace" && (
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => { setPacePopoverIdx(pacePopoverIdx === i ? null : i); setRpePopoverIdx(null); setIntensityPopoverIdx(null); }}
                        style={{
                          ...styles.numInput, fontSize: 12, textAlign: "center",
                          width: "100%", cursor: "pointer",
                          opacity: s.targetPace ? 1 : 0.4,
                        }}
                      >
                        {s.targetPace || "—"}
                      </button>
                      {pacePopoverIdx === i && (
                        <div ref={pacePopoverRef} style={{
                          position: "absolute", left: 0, top: "100%", marginTop: 4, zIndex: 20,
                          background: colors.cardBg, border: `1px solid ${colors.border}`,
                          borderRadius: 8, padding: "10px 12px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                          display: "flex", alignItems: "center", gap: 6,
                        }}>
                          {(() => {
                            const p = parsePace(s.targetPace);
                            const update = (h, m, sec) => {
                              const newSets = [...modals.log.sets];
                              newSets[i] = { ...newSets[i], targetPace: formatPace(h, m, sec) };
                              dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                            };
                            return (<>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Hrs</span>
                                <input type="number" inputMode="numeric" min="0" max="23"
                                  value={p.h || ""}
                                  onChange={(e) => update(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)), p.m, p.s)}
                                  onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                  style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                  placeholder="0"
                                />
                              </div>
                              <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.4, paddingTop: 14 }}>:</span>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Min</span>
                                <input type="number" inputMode="numeric" min="0" max="59"
                                  value={p.m || ""}
                                  onChange={(e) => update(p.h, Math.min(59, Math.max(0, parseInt(e.target.value) || 0)), p.s)}
                                  onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                  style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                  placeholder="0"
                                />
                              </div>
                              <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.4, paddingTop: 14 }}>:</span>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Sec</span>
                                <input type="number" inputMode="numeric" min="0" max="59"
                                  value={p.s || ""}
                                  onChange={(e) => update(p.h, p.m, Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                  onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                  style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                  placeholder="0"
                                />
                              </div>
                            </>);
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                  {topRowTarget === "intensity" && (
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => { setIntensityPopoverIdx(intensityPopoverIdx === i ? null : i); setRpePopoverIdx(null); setPacePopoverIdx(null); }}
                        style={{
                          ...styles.numInput, fontSize: 13, textAlign: "center",
                          width: "100%", cursor: "pointer",
                          opacity: s.targetIntensity ? 1 : 0.4,
                        }}
                      >
                        {s.targetIntensity || "—"}
                      </button>
                      {intensityPopoverIdx === i && (
                        <div ref={intensityPopoverRef} style={{
                          position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, zIndex: 20,
                          background: colors.cardBg, border: `1px solid ${colors.border}`,
                          borderRadius: 8, padding: 4,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                          maxHeight: 200, overflowY: "auto",
                        }}>
                          {["1","2","3","4","5","6","7","8","9","10"].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                const newSets = [...modals.log.sets];
                                newSets[i] = { ...newSets[i], targetIntensity: v };
                                dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                                setIntensityPopoverIdx(null);
                              }}
                              style={{
                                width: "100%", padding: "7px 0", borderRadius: 8, border: "none",
                                background: s.targetIntensity === v ? colors.primaryBg : "transparent",
                                color: s.targetIntensity === v ? colors.primaryText : colors.text,
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {topRowTarget === "custom" && (
                    <div>
                      <input
                        type="text"
                        value={s.targetCustom || ""}
                        onChange={(e) => {
                          const newSets = [...modals.log.sets];
                          newSets[i] = { ...newSets[i], targetCustom: e.target.value };
                          dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                        enterKeyHint="done"
                        style={{ ...styles.numInput, fontSize: 12, textAlign: "center", width: "100%" }}
                        placeholder=""
                      />
                    </div>
                  )}

                  <button
                    style={{ ...styles.deleteLogBtn, opacity: modals.log.sets.length <= 1 ? 0.15 : 0.4 }}
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

                  {/* Overflow rows (2nd and 3rd) */}
                  {[secondRowTargets, thirdRowTargets].map((rowTargets, rowIdx) =>
                    rowTargets.length > 0 && (
                      <div key={rowIdx} style={{ display: "flex", gap: 8, paddingTop: 6, paddingLeft: 34, alignItems: "center" }}>
                        {rowTargets.includes("rpe") && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, position: "relative" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45, whiteSpace: "nowrap" }}>RPE</span>
                            <button
                              type="button"
                              onClick={() => { setRpePopoverIdx(rpePopoverIdx === i ? null : i); setPacePopoverIdx(null); setIntensityPopoverIdx(null); }}
                              style={{
                                ...styles.numInput, fontSize: 13, textAlign: "center",
                                width: "100%", cursor: "pointer",
                                opacity: s.targetRpe ? 1 : 0.4,
                              }}
                            >
                              {s.targetRpe || "—"}
                            </button>
                            {rpePopoverIdx === i && (
                              <div ref={rpePopoverRef} style={{
                                position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, zIndex: 20,
                                background: colors.cardBg, border: `1px solid ${colors.border}`,
                                borderRadius: 8, padding: 4,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                                maxHeight: 200, overflowY: "auto",
                              }}>
                                {["1","2","3","4","5","6","7","8","9","10"].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() => {
                                      const newSets = [...modals.log.sets];
                                      newSets[i] = { ...newSets[i], targetRpe: v };
                                      dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                                      setRpePopoverIdx(null);
                                    }}
                                    style={{
                                      width: "100%", padding: "7px 0", borderRadius: 8, border: "none",
                                      background: s.targetRpe === v ? colors.primaryBg : "transparent",
                                      color: s.targetRpe === v ? colors.primaryText : colors.text,
                                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                                      textAlign: "center",
                                    }}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {rowTargets.includes("intensity") && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, position: "relative" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45, whiteSpace: "nowrap" }}>Intensity</span>
                            <button
                              type="button"
                              onClick={() => { setIntensityPopoverIdx(intensityPopoverIdx === i ? null : i); setRpePopoverIdx(null); setPacePopoverIdx(null); }}
                              style={{
                                ...styles.numInput, fontSize: 13, textAlign: "center",
                                width: "100%", cursor: "pointer",
                                opacity: s.targetIntensity ? 1 : 0.4,
                              }}
                            >
                              {s.targetIntensity || "—"}
                            </button>
                            {intensityPopoverIdx === i && (
                              <div ref={intensityPopoverRef} style={{
                                position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, zIndex: 20,
                                background: colors.cardBg, border: `1px solid ${colors.border}`,
                                borderRadius: 8, padding: 4,
                                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                                maxHeight: 200, overflowY: "auto",
                              }}>
                                {["1","2","3","4","5","6","7","8","9","10"].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() => {
                                      const newSets = [...modals.log.sets];
                                      newSets[i] = { ...newSets[i], targetIntensity: v };
                                      dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                                      setIntensityPopoverIdx(null);
                                    }}
                                    style={{
                                      width: "100%", padding: "7px 0", borderRadius: 8, border: "none",
                                      background: s.targetIntensity === v ? colors.primaryBg : "transparent",
                                      color: s.targetIntensity === v ? colors.primaryText : colors.text,
                                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                                      textAlign: "center",
                                    }}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {rowTargets.includes("pace") && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, position: "relative" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45, whiteSpace: "nowrap" }}>Pace</span>
                            <button
                              type="button"
                              onClick={() => { setPacePopoverIdx(pacePopoverIdx === i ? null : i); setRpePopoverIdx(null); setIntensityPopoverIdx(null); }}
                              style={{
                                ...styles.numInput, fontSize: 12, textAlign: "center",
                                width: "100%", cursor: "pointer",
                                opacity: s.targetPace ? 1 : 0.4,
                              }}
                            >
                              {s.targetPace || "—"}
                            </button>
                            {pacePopoverIdx === i && (
                              <div ref={pacePopoverRef} style={{
                                position: "absolute", left: 0, top: "100%", marginTop: 4, zIndex: 20,
                                background: colors.cardBg, border: `1px solid ${colors.border}`,
                                borderRadius: 8, padding: "10px 12px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                                display: "flex", alignItems: "center", gap: 6,
                              }}>
                                {(() => {
                                  const p = parsePace(s.targetPace);
                                  const update = (h, m, sec) => {
                                    const newSets = [...modals.log.sets];
                                    newSets[i] = { ...newSets[i], targetPace: formatPace(h, m, sec) };
                                    dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                                  };
                                  return (<>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Hrs</span>
                                      <input type="number" inputMode="numeric" min="0" max="23"
                                        value={p.h || ""}
                                        onChange={(e) => update(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)), p.m, p.s)}
                                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                        style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                        placeholder="0"
                                      />
                                    </div>
                                    <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.4, paddingTop: 14 }}>:</span>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Min</span>
                                      <input type="number" inputMode="numeric" min="0" max="59"
                                        value={p.m || ""}
                                        onChange={(e) => update(p.h, Math.min(59, Math.max(0, parseInt(e.target.value) || 0)), p.s)}
                                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                        style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                        placeholder="0"
                                      />
                                    </div>
                                    <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.4, paddingTop: 14 }}>:</span>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45 }}>Sec</span>
                                      <input type="number" inputMode="numeric" min="0" max="59"
                                        value={p.s || ""}
                                        onChange={(e) => update(p.h, p.m, Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                                        style={{ ...styles.numInput, width: 40, textAlign: "center", fontSize: 14 }}
                                        placeholder="0"
                                      />
                                    </div>
                                  </>);
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                        {rowTargets.includes("custom") && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45, whiteSpace: "nowrap" }}>Target</span>
                            <input
                              type="text"
                              value={s.targetCustom || ""}
                              onChange={(e) => {
                                const newSets = [...modals.log.sets];
                                newSets[i] = { ...newSets[i], targetCustom: e.target.value };
                                dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                              }}
                              onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                              enterKeyHint="done"
                              style={{ ...styles.numInput, fontSize: 12, textAlign: "center", width: "100%" }}
                              placeholder=""
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                {showRestAfter && (
                  <RestTimerBar
                    restSec={restTimer.restSec}
                    exerciseName={restTimer.exerciseName}
                    isVisible={restTimer.active}
                    onDismiss={() => {
                      setRestTimer((prev) => ({ ...prev, active: false }));
                      setAutoStartSignal((s) => s + 1);
                    }}
                    onComplete={() => {
                      setAutoStartSignal((s) => s + 1);
                    }}
                    onRestTimeObserved={handleRestTimeObserved}
                    onRestTimeAdjust={(newSec) => {
                      setRestTimer((prev) => ({ ...prev, restSec: newSec }));
                    }}
                    styles={styles}
                    colors={colors}
                    timerSound={state.preferences?.timerSound !== false}
                    timerSoundType={state.preferences?.timerSoundType || "beep"}
                    restTimerSoundType={state.preferences?.restTimerSoundType || "beep"}
                  />
                )}
                </React.Fragment>
              );
            });
            })()}
          </div>

          <button
            className="btn-press"
            style={{ ...styles.secondaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%" }}
            onClick={() => {
              const last = modals.log.sets[modals.log.sets.length - 1];
              const nextSet = last
                ? { reps: last.reps ?? 0, weight: last.weight ?? "", targetRpe: last.targetRpe ?? "", targetPace: last.targetPace ?? "", targetCustom: last.targetCustom ?? "", targetIntensity: last.targetIntensity ?? "" }
                : { reps: 0, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" };
              dispatchModal({ type: "UPDATE_LOG_SETS", payload: [...modals.log.sets, nextSet] });
            }}
          >
            + Add Set
          </button>

          {/* Exercise Timer for sec-unit exercises — below sets for top-to-bottom flow */}
          {isTimerEligible(logUnit.key) && (
            <ExerciseTimer
              sets={modals.log.sets}
              savedSets={modals.log.sets}
              onTimerComplete={(setIndex, seconds) => {
                const newSets = [...modals.log.sets];
                newSets[setIndex] = { ...newSets[setIndex], reps: seconds };
                dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                completeSet(logCtx.exerciseId, setIndex, { reps: seconds, weight: "" }, logCtx.workoutId, modals.log.sets.length);
              }}
              colors={colors}
              styles={styles}
              timerSound={state.preferences?.timerSound !== false}
              timerSoundType={state.preferences?.timerSoundType || "beep"}
              autoStart={autoStartTimer}
              onAutoStartChange={setAutoStartTimer}
              autoStartSignal={autoStartSignal}
            />
          )}

          <MoodPicker
            value={modals.log.mood}
            onChange={(v) => dispatchModal({ type: "UPDATE_LOG_MOOD", payload: v })}
            colors={colors}
          />

          <div style={styles.fieldCol}>
            <label style={styles.label}>Notes (optional)</label>
            <textarea
              value={modals.log.notes}
              onChange={(e) => {
                dispatchModal({ type: "UPDATE_LOG_NOTES", payload: e.target.value });
                const el = e.target;
                el.style.height = "auto";
                const max = 150;
                if (el.scrollHeight > max) {
                  el.style.height = max + "px";
                  el.style.overflowY = "auto";
                } else {
                  el.style.height = el.scrollHeight + "px";
                  el.style.overflowY = "hidden";
                }
              }}
              style={{ ...styles.textarea, overflowY: "hidden" }}
              rows={2}
              placeholder="Quick notes..."
            />
          </div>
                </div>
              </div>

              {/* Front footer — also the swipe zone for exercise navigation */}
              <div ref={logFooterRef} style={{ padding: "8px 12px 12px", flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="btn-press" style={{ ...styles.primaryBtn, width: "100%", padding: "14px 12px", textAlign: "center" }} onClick={saveLog}>
                    Save
                  </button>
                  <button
                    style={{ background: "transparent", border: "none", color: colors.text, opacity: 0.5, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0" }}
                    onClick={closeLog}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* ===== BACK FACE: Exercise detail ===== */}
            {logDetailEntry && (
              <div style={{
                position: "absolute", inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                display: "flex", flexDirection: "column",
                background: colors.cardBg, borderRadius: 18,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                overflow: "clip",
              }}>
                {/* Back header */}
                <div style={styles.modalHeader}>
                  <div style={{ ...styles.modalTitle, display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{logCtx?.exerciseName || "Detail"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      onClick={() => flipLogToFront()}
                      style={{ ...styles.iconBtn, padding: 4 }}
                      aria-label="Back to log"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    {closeBtn(closeLog)}
                  </div>
                </div>

                {/* Back body */}
                <div ref={logDetailBodyRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16, WebkitOverflowScrolling: "touch", transform: "translateZ(0)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {logDetailEntry.movement && (
                        <span style={{
                          display: "inline-block", padding: "3px 8px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700, background: colors.primaryBg,
                          color: colors.primaryText, textTransform: "capitalize",
                        }}>{logDetailEntry.movement}</span>
                      )}
                      {(logDetailEntry.equipment || []).map((e) => (
                        <span key={e} style={{
                          display: "inline-block", padding: "3px 8px", borderRadius: 999,
                          fontSize: 10, fontWeight: 600, background: colors.subtleBg,
                          border: `1px solid ${colors.border}`, opacity: 0.8,
                        }}>{e}</span>
                      ))}
                    </div>
                    <ExerciseGif gifUrl={logDetailEntry.gifUrl} exerciseName={logDetailEntry.name} colors={colors} />
                    {logDetailEntry.muscles?.primary?.length > 0 && (
                      <>
                        <BodyDiagram
                          highlightedMuscles={logDetailEntry.muscles.primary}
                          secondaryMuscles={logDetailEntry.muscles.secondary || []}
                          colors={colors}
                        />
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {[...(logDetailEntry.muscles.primary || []), ...(logDetailEntry.muscles.secondary || [])].map((m) => (
                            <span key={m} style={{
                              display: "inline-block", padding: "3px 8px", borderRadius: 999,
                              fontSize: 11, fontWeight: 700, background: colors.subtleBg,
                              border: `1px solid ${colors.border}`, textTransform: "capitalize",
                            }}>{m.replace(/_/g, " ")}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
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
          const padLeft = weekdayIndex(firstDayKey, weekStartsOn);
          const dim = daysInMonth(year, monthIndex0);
          const dowHeader = orderedDayValues(weekStartsOn).map((v) => DAY_LABELS_SHORT[v]);

          const cells = [];
          for (let i = 0; i < padLeft; i++) cells.push(null);
          for (let d = 1; d <= dim; d++) cells.push(d);
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <button
                  className="btn-press"
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

                <div style={{ fontWeight: 700, alignSelf: "center" }}>{formatMonthLabel(modals.datePicker.monthCursor)}</div>

                <button
                  className="btn-press"
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
                  {dowHeader.map((w) => (
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
                <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_DATE_PICKER" })} type="button">
                  Close
                </button>
                <button
                  className="btn-press"
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

      {/* New Workout Modal — mirrors the New Split layout (95dvh height,
          staged exercises section with dashed +Add exercise picker). */}
      <Modal
        open={modals.addWorkout.isOpen}
        title="New Workout"
        onClose={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}
        styles={styles}
        footer={
          <div style={styles.modalFooter}>
            <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_ADD_WORKOUT" })}>
              Cancel
            </button>
            <button
              className="btn-press"
              style={styles.primaryBtn}
              onClick={() => {
                const validation = validateWorkoutName(modals.addWorkout.name, workouts);
                if (!validation.valid) {
                  showToast(validation.error);
                  return;
                }
                const name = modals.addWorkout.name.trim();
                const category = (modals.addWorkout.category || "Workout").trim() || "Workout";
                const cadence = normalizeCadence(modals.addWorkout.cadence);
                const stagedExercises = modals.addWorkout.exercises || [];
                const newId = uid("w");
                updateState((st) => {
                  st.program.workouts.push({
                    id: newId,
                    name,
                    category,
                    cadence,
                    exercises: stagedExercises.map((ex) => ({ ...ex })),
                  });
                  return st;
                });
                dispatchModal({ type: "CLOSE_ADD_WORKOUT" });
              }}
            >
              Save
            </button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, minHeight: 0 }}>
          {/* Workout name */}
          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout name</label>
            <input
              value={modals.addWorkout.name}
              onChange={(e) =>
                dispatchModal({ type: "UPDATE_ADD_WORKOUT", payload: { name: e.target.value } })
              }
              style={styles.textInput}
              placeholder="e.g. Push Day"
              autoFocus
            />
          </div>

          {/* Workout category */}
          <div style={styles.fieldCol}>
            <label style={styles.label}>Workout category</label>
            <CategoryAutocomplete
              value={modals.addWorkout.category}
              onChange={(val) =>
                dispatchModal({ type: "UPDATE_ADD_WORKOUT", payload: { category: val } })
              }
              suggestions={categoryOptions}
              placeholder="e.g. Push / Pull / Legs / Stretch"
              styles={styles}
            />
          </div>

          {/* Schedule (cadence) */}
          <CadenceEditor
            cadence={modals.addWorkout.cadence}
            onChange={(c) => dispatchModal({ type: "UPDATE_ADD_WORKOUT", payload: { cadence: c } })}
            colors={colors}
            styles={styles}
            weekStartsOn={weekStartsOn}
          />

          {/* Exercises */}
          <div style={styles.fieldCol}>
            <label style={styles.label}>Exercises</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(modals.addWorkout.exercises || []).map((ex) => {
                const unitInfo = getUnit(ex.unit, ex);
                return (
                  <div
                    key={ex.id}
                    style={{
                      background: colors.cardAltBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 700, color: colors.text,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{ex.name}</div>
                      <div style={{
                        fontSize: 11.5, color: colors.textSecondary, marginTop: 2,
                      }}>{unitInfo.label} ({unitInfo.abbr})</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatchModal({
                        type: "UPDATE_ADD_WORKOUT",
                        payload: {
                          exercises: (modals.addWorkout.exercises || []).filter((e) => e.id !== ex.id),
                        },
                      })}
                      title="Remove"
                      style={{
                        background: "transparent", border: "none",
                        padding: 4, cursor: "pointer", opacity: 0.45, color: colors.text,
                        display: "flex", alignItems: "center",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => dispatchModal({
                  type: "OPEN_CATALOG_BROWSE",
                  payload: { workoutId: null, stageInAddWorkout: true },
                })}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: 14,
                  background: "transparent",
                  color: colors.accent,
                  border: `1.5px dashed ${colors.accentBorder}`,
                  cursor: "pointer", fontFamily: "inherit",
                  fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  minHeight: 48,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add exercise
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Exercise Catalog Modal (browse + add to workout) */}
      <ExerciseCatalogModal
        open={modals.catalogBrowse.isOpen}
        onClose={() => dispatchModal({ type: "CLOSE_CATALOG_BROWSE" })}
        styles={styles}
        colors={colors}
        workouts={workouts}
        logsByDate={state.logsByDate}
        targetWorkoutId={modals.catalogBrowse.workoutId}
        swapSource={modals.catalogBrowse.swapMode ? modals.catalogBrowse.swapSource : null}
        equipment={state.preferences?.equipment}
        backOverrideRef={backOverrideRef}
        onUpdateCustomExercise={(updatedEntry) => {
          updateState((st) => {
            if (!st.customExercises) return st;
            const idx = st.customExercises.findIndex((e) => e.id === updatedEntry.id);
            if (idx === -1) return st;
            st.customExercises[idx] = {
              ...st.customExercises[idx],
              name: updatedEntry.name,
              muscles: updatedEntry.muscles,
              equipment: updatedEntry.equipment,
              movement: updatedEntry.movement,
              gifUrl: updatedEntry.gifUrl,
              sportIcon: updatedEntry.sportIcon || undefined,
            };
            return st;
          });
          showToast("Exercise updated");
        }}
        onSaveAsNew={(newEntry) => {
          const newId = "custom_" + uid("ex");
          updateState((st) => {
            if (!st.customExercises) st.customExercises = [];
            st.customExercises.push({
              id: newId,
              name: newEntry.name,
              defaultUnit: newEntry.defaultUnit || "reps",
              muscles: newEntry.muscles || { primary: [] },
              equipment: newEntry.equipment || [],
              tags: newEntry.tags || [],
              movement: newEntry.movement || "",
              gifUrl: newEntry.gifUrl || null,
              sportIcon: newEntry.sportIcon || undefined,
              aliases: [],
              custom: true,
            });
            return st;
          });
          showToast(`"${newEntry.name}" saved`);
          return newId;
        }}
        catalog={fullCatalog}
        session={session}
        onDeleteCustomExercise={(entry) => {
          // Count usages across program workouts and daily workouts
          let usages = 0;
          for (const w of state.program?.workouts || []) {
            for (const ex of w.exercises || []) {
              if (ex.catalogId === entry.id) usages++;
            }
          }
          for (const dayWorkouts of Object.values(state.dailyWorkouts || {})) {
            for (const w of dayWorkouts || []) {
              for (const ex of w.exercises || []) {
                if (ex.catalogId === entry.id) usages++;
              }
            }
          }
          const msg = usages > 0
            ? `"${entry.name}" is used in ${usages} exercise(s). Deleting it removes its catalog data (muscles, equipment, gif). The exercise name stays in your workouts.`
            : `Delete "${entry.name}"?`;
          dispatchModal({
            type: "OPEN_CONFIRM",
            payload: {
              title: "Delete custom exercise?",
              message: msg,
              confirmText: "Delete",
              onConfirm: () => {
                updateState((st) => {
                  st.customExercises = (st.customExercises || []).filter((e) => e.id !== entry.id);
                  return st;
                });
                showToast(`"${entry.name}" deleted`);
                dispatchModal({ type: "CLOSE_CONFIRM" });
              },
            },
          });
        }}
        onAddExercise={(entry, workoutIdOrIds, userEx) => {
          // --- Stage-in-AddWorkout mode: push into addWorkout modal state ---
          if (modals.catalogBrowse.stageInAddWorkout) {
            let newEx;
            if (userEx) {
              newEx = { id: uid("ex"), name: userEx.name, unit: userEx.unit || "reps" };
              if (userEx.catalogId) newEx.catalogId = userEx.catalogId;
              if (userEx.customUnitAbbr) newEx.customUnitAbbr = userEx.customUnitAbbr;
              if (userEx.customUnitAllowDecimal) newEx.customUnitAllowDecimal = userEx.customUnitAllowDecimal;
            } else {
              newEx = { id: uid("ex"), name: entry.name, unit: entry.defaultUnit, catalogId: entry.id };
              if (isBodyweightOnly(entry)) newEx.bodyweight = true;
            }
            dispatchModal({
              type: "UPDATE_ADD_WORKOUT",
              payload: {
                exercises: [...(modals.addWorkout.exercises || []), newEx],
              },
            });
            dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
            return;
          }

          // --- Swap mode: replace exercise for today ---
          if (modals.catalogBrowse.swapMode) {
            const { swapExerciseId, swapExerciseName, swapIsDaily } = modals.catalogBrowse;
            const wId = modals.catalogBrowse.workoutId;
            let newEx;
            if (userEx) {
              newEx = { id: uid("ex"), name: userEx.name, unit: userEx.unit || "reps" };
              if (userEx.catalogId) newEx.catalogId = userEx.catalogId;
              if (userEx.customUnitAbbr) newEx.customUnitAbbr = userEx.customUnitAbbr;
              if (userEx.customUnitAllowDecimal) newEx.customUnitAllowDecimal = userEx.customUnitAllowDecimal;
            } else {
              newEx = { id: uid("ex"), name: entry.name, unit: entry.defaultUnit, catalogId: entry.id };
              if (isBodyweightOnly(entry)) newEx.bodyweight = true;
            }

            if (swapIsDaily) {
              // Daily workout: replace exercise in-place
              updateState((st) => {
                const dayWs = st.dailyWorkouts?.[dateKey];
                if (!dayWs) return st;
                const wk = dayWs.find(dw => dw.id === wId);
                if (!wk) return st;
                const idx = wk.exercises.findIndex(e => e.id === swapExerciseId);
                if (idx !== -1) wk.exercises[idx] = newEx;
                return st;
              });
            } else {
              // Program workout: write swap override
              updateState((st) => {
                if (!st.sessionOverrides) st.sessionOverrides = {};
                if (!st.sessionOverrides[dateKey]) st.sessionOverrides[dateKey] = {};
                if (!st.sessionOverrides[dateKey][wId]) st.sessionOverrides[dateKey][wId] = {};
                st.sessionOverrides[dateKey][wId][swapExerciseId] = {
                  type: "swap",
                  replacement: newEx,
                  originalName: swapExerciseName || "",
                };
                return st;
              });
            }
            dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
            showToast(`Swapped to ${newEx.name}`);
            return;
          }

          // --- Session add mode: add exercise for today only ---
          if (modals.catalogBrowse.sessionAddMode) {
            const wId = modals.catalogBrowse.workoutId;
            const isDaily = modals.catalogBrowse.sessionAddIsDaily;
            let newEx;
            if (userEx) {
              newEx = { id: uid("ex"), name: userEx.name, unit: userEx.unit || "reps", _addedForToday: true };
              if (userEx.catalogId) newEx.catalogId = userEx.catalogId;
              if (userEx.customUnitAbbr) newEx.customUnitAbbr = userEx.customUnitAbbr;
              if (userEx.customUnitAllowDecimal) newEx.customUnitAllowDecimal = userEx.customUnitAllowDecimal;
            } else {
              newEx = { id: uid("ex"), name: entry.name, unit: entry.defaultUnit, catalogId: entry.id, _addedForToday: true };
              if (isBodyweightOnly(entry)) newEx.bodyweight = true;
            }

            if (isDaily) {
              // Daily workout: push directly into the daily workout exercises
              updateState((st) => {
                const dayWs = st.dailyWorkouts?.[dateKey];
                if (!dayWs) return st;
                const wk = dayWs.find(dw => dw.id === wId);
                if (!wk) return st;
                wk.exercises.push(newEx);
                return st;
              });
            } else {
              // Program workout: add to sessionAdditions
              updateState((st) => {
                if (!st.sessionAdditions) st.sessionAdditions = {};
                if (!st.sessionAdditions[dateKey]) st.sessionAdditions[dateKey] = {};
                if (!st.sessionAdditions[dateKey][wId]) st.sessionAdditions[dateKey][wId] = [];
                st.sessionAdditions[dateKey][wId].push(newEx);
                return st;
              });
            }
            dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
            showToast(`${newEx.name} added for today`);
            return;
          }

          // --- Normal add mode ---
          if (!workoutIdOrIds) return;
          const ids = Array.isArray(workoutIdOrIds) ? workoutIdOrIds : [workoutIdOrIds];
          updateState((st) => {
            for (const wId of ids) {
              const w = st.program.workouts.find((x) => x.id === wId);
              if (!w) continue;
              let newEx;
              if (userEx) {
                newEx = { id: uid("ex"), name: userEx.name, unit: userEx.unit || "reps" };
                if (userEx.catalogId) newEx.catalogId = userEx.catalogId;
                if (userEx.customUnitAbbr) newEx.customUnitAbbr = userEx.customUnitAbbr;
                if (userEx.customUnitAllowDecimal) newEx.customUnitAllowDecimal = userEx.customUnitAllowDecimal;
              } else {
                newEx = { id: uid("ex"), name: entry.name, unit: entry.defaultUnit, catalogId: entry.id };
                if (isBodyweightOnly(entry)) newEx.bodyweight = true;
              }
              w.exercises.push(newEx);
            }
            return st;
          });
          if (modals.catalogBrowse.workoutId) {
            dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
          } else {
            showToast(`Exercise added to workout${ids.length > 1 ? "s" : ""}`);
          }
        }}
        onCustomExercise={() => {
          const wId = modals.catalogBrowse.workoutId;
          dispatchModal({ type: "CLOSE_CATALOG_BROWSE" });
          dispatchModal({ type: "OPEN_CUSTOM_EXERCISE", payload: { workoutId: wId } });
        }}
      />

      {/* Custom Exercise Modal (AI-enriched) */}
      <CustomExerciseModal
        open={modals.customExercise.isOpen}
        catalog={fullCatalog}
        modalState={modals.customExercise}
        onUpdate={(payload) => dispatchModal({ type: "UPDATE_CUSTOM_EXERCISE", payload })}
        onClose={() => dispatchModal({ type: "CLOSE_CUSTOM_EXERCISE" })}
        enrichExercise={enrichExercise}
        workouts={workouts}
        styles={styles}
        colors={colors}
        onSave={(exercise, workoutIds) => {
          const editExerciseId = modals.customExercise.editExerciseId;
          const editWorkoutId = modals.customExercise.editWorkoutId;
          updateState((st) => {
            // Determine catalogId: use existing if user selected a catalog suggestion, else create custom entry
            let catalogId = exercise.catalogId || null;

            if (!catalogId) {
              // Create a custom catalog entry
              if (!st.customExercises) st.customExercises = [];
              const nameLower = exercise.name.trim().toLowerCase();
              const existing = st.customExercises.find((e) => e.name.toLowerCase() === nameLower);
              if (existing) {
                catalogId = existing.id;
              } else {
                catalogId = "custom_" + uid("ex");
                st.customExercises.push({
                  id: catalogId,
                  name: exercise.name.trim(),
                  defaultUnit: exercise.unit,
                  muscles: exercise.muscles || { primary: [] },
                  equipment: exercise.equipment || [],
                  tags: exercise.tags || [],
                  movement: exercise.movement || "",
                  gifUrl: exercise.gifUrl || null,
                  aliases: [],
                  custom: true,
                });
              }
            }

            // Edit mode: update existing exercise in-place
            if (editExerciseId && editWorkoutId) {
              const ww = st.program.workouts.find((x) => x.id === editWorkoutId);
              const ex = ww?.exercises?.find((e) => e.id === editExerciseId);
              if (ex) {
                ex.name = exercise.name.trim();
                ex.unit = exercise.unit;
                ex.catalogId = catalogId;
                if (exercise.customUnitAbbr) ex.customUnitAbbr = exercise.customUnitAbbr;
                else delete ex.customUnitAbbr;
                if (exercise.customUnitAllowDecimal) ex.customUnitAllowDecimal = exercise.customUnitAllowDecimal;
                else delete ex.customUnitAllowDecimal;
              }
            } else {
              // Add exercise to selected workout(s)
              for (const wId of workoutIds) {
                const w = st.program.workouts.find((x) => x.id === wId);
                if (!w) continue;
                const newEx = { id: uid("ex"), name: exercise.name, unit: exercise.unit, catalogId };
                if (exercise.customUnitAbbr) newEx.customUnitAbbr = exercise.customUnitAbbr;
                if (exercise.customUnitAllowDecimal) newEx.customUnitAllowDecimal = exercise.customUnitAllowDecimal;
                w.exercises.push(newEx);
              }
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CUSTOM_EXERCISE" });
          if (editExerciseId) {
            showToast("Exercise updated");
          } else {
            showToast(workoutIds.length > 0 ? `Exercise added to workout${workoutIds.length > 1 ? "s" : ""}` : "Exercise saved");
          }
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={modals.profile.isOpen}
        modalState={modals.profile}
        dispatch={dispatchModal}
        profile={profile}
        profileStale={profileStale}
        session={session}
        onLogout={onLogout}
        onSave={saveProfile}
        styles={styles}
        summaryStats={profileStats}
        colors={colors}
        preferences={state.preferences}
        onUpdatePreference={updatePreference}
        onExportJson={exportJson}
        onExportCSV={exportCSV}
        onImportFile={importFile}
        onResetAll={() => {
          dispatchModal({
            type: "OPEN_CONFIRM",
            payload: {
              title: "Reset All Data",
              message: "This will delete all workouts and logs. A backup will be exported first.",
              confirmText: "Reset",
              onConfirm: () => {
                try {
                  exportJson();
                } catch (e) {
                  showToast("Backup export failed — reset aborted");
                  return;
                }
                setState(makeDefaultState());
                setManageWorkoutId(null);
                dispatchModal({ type: "CLOSE_CONFIRM" });
              },
            },
          });
        }}
        onDeleteAccount={() => {
          dispatchModal({
            type: "OPEN_CONFIRM",
            payload: {
              title: "Delete Account",
              message: "This permanently deletes your account and all data — workouts, logs, profile, friends, and backups. This cannot be undone. A local backup will be exported first.",
              confirmText: "Delete forever",
              onConfirm: async () => {
                try { exportJson(); } catch { /* best-effort backup */ }
                const { data, error } = await supabase.functions.invoke("delete-account", { method: "POST" });
                if (error || !data?.success) {
                  showToast("Couldn't delete account — please try again");
                  return;
                }
                dispatchModal({ type: "CLOSE_CONFIRM" });
                // Tear down the local session; AuthGate returns to the sign-in screen.
                if (onLogout) await onLogout();
              },
            },
          });
        }}
      />

      {/* Change Username Modal */}
      <ChangeUsernameModal
        open={modals.changeUsername.isOpen}
        modalState={modals.changeUsername}
        dispatch={dispatchModal}
        profile={profile}
        session={session}
        onProfileUpdate={mergeProfile}
        styles={styles}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={modals.changePassword.isOpen}
        modalState={modals.changePassword}
        dispatch={dispatchModal}
        session={session}
        styles={styles}
        colors={colors}
      />

      {/* Restore From History Modal */}
      <RestoreFromHistoryModal
        open={modals.restoreHistory?.isOpen}
        modalState={modals.restoreHistory}
        dispatch={dispatchModal}
        session={session}
        styles={styles}
        colors={colors}
        onRestore={async (snapshotState) => {
          const restored = normalizeState({
            ...snapshotState,
            meta: { ...(snapshotState.meta || {}), updatedAt: Date.now() },
          });
          setState(restored);
          persistState(restored);
          await saveCloudState(session.user.id, restored);
        }}
      />

      {/* Billing Modal */}
      <Modal
        open={modals.billing?.isOpen}
        title="Billing"
        onClose={() => dispatchModal({ type: "CLOSE_BILLING" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", borderRadius: 12,
            background: colors.accentBg, border: `1px solid ${colors.accentBorder}`,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{isPro ? "Pro Plan" : "Free Plan"}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>Your current plan</div>
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: colors.accent, color: "#fff",
            }}>Active</div>
          </div>

          <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>
            {isPro
              ? "Pro unlocks advanced analytics, unlimited AI coaching, and more."
              : "Pro plans coming soon with unlimited AI coaching, advanced analytics, and more."}
          </div>
        </div>
      </Modal>

      {/* Add Suggested Exercise Modal */}
      <AddSuggestedExerciseModal
        open={modals.addSuggestion.isOpen}
        exerciseName={modals.addSuggestion.exerciseName}
        workouts={workouts}
        onCancel={() => dispatchModal({ type: "CLOSE_ADD_SUGGESTION" })}
        onConfirm={confirmAddSuggestion}
        styles={styles}
        colors={colors}
      />

      {/* Workout Detail Sheet — Plans tab tap-to-open editor */}
      {modals.workoutDetail.isOpen && (() => {
        const w = workoutById.get(modals.workoutDetail.workoutId);
        const splitForWorkout = workoutToSplit.get(modals.workoutDetail.workoutId) || null;
        if (!w) {
          // Workout was deleted while sheet was open — auto-close.
          setTimeout(() => dispatchModal({ type: "CLOSE_WORKOUT_DETAIL" }), 0);
          return null;
        }
        // Swipe nav: cycle through the global `workouts` array. No wrap at ends.
        const currentIdx = workouts.findIndex((x) => x.id === w.id);
        const prevWorkout = currentIdx > 0 ? workouts[currentIdx - 1] : null;
        const nextWorkout = currentIdx >= 0 && currentIdx < workouts.length - 1 ? workouts[currentIdx + 1] : null;
        return (
          <WorkoutDetailSheet
            open
            workout={w}
            splitForWorkout={splitForWorkout}
            reorderExercises={modals.workoutDetail.reorderExercises}
            onToggleReorderExercises={() => toggleReorderExercises(w.id)}
            onClose={() => dispatchModal({ type: "CLOSE_WORKOUT_DETAIL" })}
            onRenameWorkout={renameWorkout}
            onOpenEditWorkout={openEditWorkout}
            onOpenEditExercise={openEditExercise}
            onAddExercise={addExercise}
            onMoveExercise={moveExercise}
            onReorderExercisesByIndex={reorderExercisesByIndex}
            onShareWorkout={(wid, wname) => dispatchModal({ type: "OPEN_SHARE_WORKOUT", payload: { workoutId: wid, workoutName: wname } })}
            onDeleteWorkout={deleteWorkout}
            hasPrev={!!prevWorkout}
            hasNext={!!nextWorkout}
            onPrevWorkout={prevWorkout ? () => dispatchModal({ type: "OPEN_WORKOUT_DETAIL", payload: { workoutId: prevWorkout.id } }) : undefined}
            onNextWorkout={nextWorkout ? () => dispatchModal({ type: "OPEN_WORKOUT_DETAIL", payload: { workoutId: nextWorkout.id } }) : undefined}
            styles={styles}
            colors={colors}
            weekStartsOn={weekStartsOn}
          />
        );
      })()}

      {/* Edit Workout Modal — same chrome as EditExerciseModal: title, full
          height (footer prop), Cancel/Save footer. */}
      {modals.editWorkout && (
        <Modal
          open={modals.editWorkout.isOpen}
          title="Edit Workout"
          onClose={() => dispatchModal({ type: "CLOSE_EDIT_WORKOUT" })}
          styles={styles}
          footer={
            <div style={styles.modalFooter}>
              <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_EDIT_WORKOUT" })}>
                Cancel
              </button>
              <button className="btn-press" style={styles.primaryBtn} onClick={saveEditWorkout}>
                Save
              </button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
            <div style={styles.fieldCol}>
              <label style={styles.label}>Workout name</label>
              <input
                value={modals.editWorkout.name}
                onChange={(e) =>
                  dispatchModal({ type: "UPDATE_EDIT_WORKOUT", payload: { name: e.target.value } })
                }
                style={styles.textInput}
                placeholder="e.g. Push Day"
                autoFocus
              />
            </div>
            <div style={styles.fieldCol}>
              <label style={styles.label}>Workout category</label>
              <CategoryAutocomplete
                value={modals.editWorkout.category}
                onChange={(val) =>
                  dispatchModal({ type: "UPDATE_EDIT_WORKOUT", payload: { category: val } })
                }
                suggestions={categoryOptions}
                placeholder="e.g. Push / Pull / Legs / Stretch"
                styles={styles}
              />
            </div>
            <CadenceEditor
              cadence={modals.editWorkout.cadence}
              onChange={(c) => dispatchModal({ type: "UPDATE_EDIT_WORKOUT", payload: { cadence: c } })}
              colors={colors}
              styles={styles}
              weekStartsOn={weekStartsOn}
            />
          </div>
        </Modal>
      )}

      {/* Edit Exercise Modal */}
      {modals.editExercise && (
        <EditExerciseModal
          open={modals.editExercise.isOpen}
          modalState={modals.editExercise}
          onUpdate={(payload) => dispatchModal({ type: "UPDATE_EDIT_EXERCISE", payload })}
          onClose={() => dispatchModal({ type: "CLOSE_EDIT_EXERCISE" })}
          onSave={saveEditExercise}
          onDelete={modals.editExercise.exerciseId
            ? () => {
                const { workoutId, exerciseId } = modals.editExercise;
                dispatchModal({ type: "CLOSE_EDIT_EXERCISE" });
                deleteExercise(workoutId, exerciseId);
              }
            : null}
          styles={styles}
          colors={colors}
          catalog={fullCatalog}
        />
      )}

      {/* Edit Split modal — name/mode/rest + staged member adds/removes/reorder.
          Delete lives in the SplitDetailSheet footer, not here. */}
      {modals.editSplit && (
        <SplitEditorModal
          open={modals.editSplit.isOpen}
          modalState={modals.editSplit}
          onUpdate={(payload) => dispatchModal({ type: "UPDATE_EDIT_SPLIT", payload })}
          onClose={() => dispatchModal({ type: "CLOSE_EDIT_SPLIT" })}
          onSave={saveEditSplit}
          workouts={workouts}
          splits={splits}
          styles={styles}
          colors={colors}
          weekStartsOn={weekStartsOn}
        />
      )}

      {/* Split Detail Sheet — Plans tab tap-to-open viewer (members + add/edit) */}
      {modals.splitDetail?.isOpen && (() => {
        const s = splits.find((x) => x.id === modals.splitDetail.splitId);
        if (!s) {
          setTimeout(() => dispatchModal({ type: "CLOSE_SPLIT_DETAIL" }), 0);
          return null;
        }
        return (
          <SplitDetailSheet
            open
            split={s}
            workouts={workouts}
            splits={splits}
            onClose={() => dispatchModal({ type: "CLOSE_SPLIT_DETAIL" })}
            onOpenEditMeta={() => openEditSplit(s.id)}
            onAddMember={(workoutId) => addSplitMember(s.id, workoutId)}
            onRemoveMember={(workoutId) => removeSplitMember(s.id, workoutId)}
            onReorderMembers={(fromIdx, toIdx) => reorderSplitMembers(s.id, fromIdx, toIdx)}
            onSetMemberDays={(workoutId, days) => setSplitMemberDays(s.id, workoutId, days)}
            onOpenWorkoutDetail={(wid) => dispatchModal({ type: "OPEN_WORKOUT_DETAIL", payload: { workoutId: wid } })}
            onDelete={() => deleteSplit(s.id)}
            onShare={() => showToast("Split sharing coming soon")}
            styles={styles}
            colors={colors}
            weekStartsOn={weekStartsOn}
          />
        );
      })()}

      {/* Continuous-split conflict modal */}
      {modals.continuousConflict?.isOpen && (
        <Modal
          open={true}
          title={`${modals.continuousConflict.pickedWorkoutName} is part of ${modals.continuousConflict.splitName}`}
          onClose={() => dispatchModal({ type: "CLOSE_CONTINUOUS_CONFLICT" })}
          styles={styles}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75 }}>
              Today's planned: <strong style={{ opacity: 1 }}>{modals.continuousConflict.nextUpWorkoutName}</strong>.
              Doing {modals.continuousConflict.pickedWorkoutName} won't advance your sequence — the queue stays where it is.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="btn-press"
                style={{ ...styles.primaryBtn, padding: "12px 14px", textAlign: "center" }}
                onClick={continuousConflictDoInstead}
              >
                Do {modals.continuousConflict.pickedWorkoutName} instead
              </button>
              <button
                className="btn-press"
                style={{ ...styles.secondaryBtn, padding: "12px 14px", textAlign: "center" }}
                onClick={continuousConflictAddAlongside}
              >
                Add alongside {modals.continuousConflict.nextUpWorkoutName}
              </button>
              <button
                className="btn-press"
                style={{
                  background: "transparent", border: "none",
                  color: colors.text, opacity: 0.5,
                  fontSize: 13, padding: "8px 14px", cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onClick={() => dispatchModal({ type: "CLOSE_CONTINUOUS_CONFLICT" })}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Welcome Choice Modal (post-onboarding) */}
      <Modal
        open={modals.welcomeChoice.isOpen}
        title={`Welcome, ${profile?.display_name || profile?.username || ""}!`}
        onClose={() => dispatchModal({ type: "CLOSE_WELCOME_CHOICE" })}
        styles={styles}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "8px 0" }}>
          <div style={{ fontSize: 20 }}>{"\uD83C\uDFCB\uFE0F"}</div>
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, textAlign: "center" }}>
            Your profile is all set. How would you like to get started?
          </div>
          <button
            className="btn-press"
            style={{ ...styles.primaryBtn, width: "100%", padding: "14px 12px", textAlign: "center", fontSize: 14 }}
            onClick={() => {
              dispatchModal({ type: "CLOSE_WELCOME_CHOICE" });
              setTab("program");
              dispatchModal({ type: "OPEN_GENERATE_WIZARD", payload: { equipment, welcome: true } });
            }}
          >
            Generate My Program
          </button>
          <button
            className="btn-press"
            style={{ ...styles.secondaryBtn, width: "100%", padding: "14px 12px", textAlign: "center", fontSize: 14 }}
            onClick={() => {
              dispatchModal({ type: "CLOSE_WELCOME_CHOICE" });
              setTab("program");
              showToast("Tap the + button in Programs to add your first workout");
            }}
          >
            I'll Build My Own
          </button>
          <div style={{ fontSize: 12, opacity: 0.4, textAlign: "center" }}>
            You can always generate or add workouts later from the Program tab.
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
        onBackToChoice={() => {
          dispatchModal({ type: "CLOSE_GENERATE_WIZARD" });
          dispatchModal({ type: "OPEN_WELCOME_CHOICE" });
        }}
        catalog={fullCatalog}
        profile={profile}
        state={state}
        styles={styles}
        colors={colors}
        measurementSystem={state.preferences?.measurementSystem}
        weekStartsOn={weekStartsOn}
      />

      {/* Generate Today Modal */}
      <GenerateTodayModal
        open={modals.generateToday.isOpen}
        todayState={modals.generateToday}
        dispatch={dispatchModal}
        onGenerate={handleGenerateToday}
        todayCheckin={todayCheckin}
        onCheckinSubmit={handleGenerateTodayCheckin}
        onAccept={handleAcceptTodayWorkout}
        onClose={() => dispatchModal({ type: "CLOSE_GENERATE_TODAY" })}
        styles={styles}
        colors={colors}
      />

      {/* Friend Search Modal */}
      <FriendSearchModal
        open={modals.friendSearch.isOpen}
        state={modals.friendSearch}
        dispatch={dispatchModal}
        styles={styles}
        colors={colors}
        onRequestSent={refreshSocial}
        friends={socialFriends}
      />

      {/* Share Workout Modal */}
      <ShareWorkoutModal
        open={modals.shareWorkout.isOpen}
        state={modals.shareWorkout}
        dispatch={dispatchModal}
        workouts={workouts}
        styles={styles}
        colors={colors}
        onSent={(username) => {
          showToast(`Workout sent to @${username}`);
          refreshSocial();
        }}
      />

      {/* Import Preview Modal */}
      <ImportPreviewModal
        open={modals.importPreview.isOpen}
        state={modals.importPreview}
        dispatch={dispatchModal}
        styles={styles}
        colors={colors}
        onConfirm={handleImportConfirm}
      />

      {/* Workout Preview Modal */}
      <WorkoutPreviewModal
        open={modals.workoutPreview.isOpen}
        state={modals.workoutPreview}
        dispatch={dispatchModal}
        styles={styles}
        colors={colors}
        onImport={async (sw) => {
          const { error } = await acceptSharedWorkout(sw.id);
          if (error) {
            dispatchModal({ type: "UPDATE_WORKOUT_PREVIEW", payload: { importing: false } });
            showToast("Failed to import workout");
            return;
          }
          const snapshot = sw.workout_snapshot;
          updateState((st) => {
            const newW = {
              id: uid("w"),
              name: snapshot.name || "Shared Workout",
              category: snapshot.category || "Workout",
              exercises: (snapshot.exercises || []).map((ex) => ({
                ...ex,
                id: uid("ex"),
              })),
              source: "shared",
              sharedBy: sw.from_profile?.username || "unknown",
            };
            st.program.workouts.push(newW);
            return st;
          });
          dispatchModal({ type: "CLOSE_WORKOUT_PREVIEW" });
          showToast("Workout added to your plan!");
          refreshSocial();
        }}
      />
      {circuitWorkout && (
        <CircuitTimer
          workout={circuitWorkout}
          dateKey={dateKey}
          existingLogs={state.logsByDate[dateKey] || {}}
          onCompleteSet={completeSet}
          onUncompleteSet={uncompleteSet}
          onClose={() => setCircuitWorkout(null)}
          colors={colors}
          styles={styles}
          timerSoundEnabled={state.preferences?.timerSound !== false}
          timerSoundType={state.preferences?.timerSoundType || "beep"}
          findPrior={findPriorForExercise}
          measurementSystem={state.preferences?.measurementSystem}
        />
      )}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>How did this feel?</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 260 }}>
        {MOOD_FACES.map((face) => (
          <FaceIcon
            key={face.value}
            face={face}
            selected={value === face.value}
            color={colors.textSecondary}
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

function ExerciseMenu({ isOverridden, isSessionAdded, onSwapExercise, onSkipExercise, onUndoOverride, onPromoteOverride, onRemoveSessionAddition, onPromoteSessionAddition, exerciseId, originalExerciseId, colors }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  const menuBtnStyle = {
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", padding: "10px 12px", border: "none",
    background: "transparent", color: colors?.text || "#fff",
    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
    textAlign: "left", borderRadius: 6,
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "flex" }}>
      <button
        style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: "inherit", opacity: 0.35, display: "flex" }}
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        aria-label="Exercise options"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "100%", zIndex: 50,
            background: colors?.cardBg || "#1a1a2e", border: `1px solid ${colors?.border || "#333"}`,
            borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            minWidth: 170, overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isSessionAdded ? (
            <>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onRemoveSessionAddition?.(exerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                Remove
              </button>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onPromoteSessionAddition?.(exerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12l7-7 7 7"/></svg>
                Keep in Plan
              </button>
            </>
          ) : isOverridden ? (
            <>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onUndoOverride?.(originalExerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9"/><path d="M3 3v6h6"/></svg>
                Undo Swap
              </button>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onPromoteOverride?.(originalExerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12l7-7 7 7"/></svg>
                Make Permanent
              </button>
            </>
          ) : (
            <>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onSwapExercise?.(exerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>
                Swap Exercise
              </button>
              <button style={menuBtnStyle} onClick={() => { setOpen(false); onSkipExercise?.(exerciseId); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                Skip Today
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ExerciseRow({ workoutId, exercise, logsForDate, openLog, deleteLogForExercise, styles, findPrior, onDeleteExercise, workoutScheme, weightLabel, colors, onSwapExercise, onSkipExercise, isOverridden, onUndoOverride, onPromoteOverride, originalExerciseId, sportIcon, isSessionAdded, onRemoveSessionAddition, onPromoteSessionAddition }) {
  const exLog = logsForDate[exercise.id] ?? null;
  const hasAnySets = !!exLog && Array.isArray(exLog.sets) && exLog.sets.length > 0;
  const exUnit = getUnit(exercise.unit, exercise);

  const completedSets = hasAnySets ? exLog.sets.filter((s) => isSetCompleted(s)) : [];
  const hasLog = completedSets.length > 0;
  const templateSets = findPrior ? (findPrior(exercise.id)?.sets || []) : [];
  const schemeStr = exercise.scheme || workoutScheme || null;
  const schemeSets = schemeStr ? (parseScheme(schemeStr)?.sets || 0) : 0;
  const totalSets = hasAnySets ? exLog.sets.length : Math.max(templateSets.length, schemeSets);
  const completedCount = completedSets.length;
  const allDone = totalSets > 0 && completedCount >= totalSets;

  const wLabel = weightLabel || "lb";

  const setsText = hasLog
    ? (() => {
        const done = exLog.sets.filter((s) => isSetCompleted(s));
        // Build display strings per set
        const perSet = done.map((s) => {
          const isBW = String(s.weight).toUpperCase() === "BW";
          const w = isBW ? "BW" : s.weight;
          const noWeight = !w || w === "BW" || w === "" || w === "0";
          if (exUnit.key === "reps") {
            if (exercise.bodyweight && noWeight) return { key: `${s.reps}`, display: `${s.reps} reps` };
            if (noWeight) return { key: `${s.reps}`, display: `${s.reps} reps` };
            return { key: `${s.reps}x${w}`, display: `${s.reps} reps x ${w} ${isBW ? "" : wLabel}`.trim() };
          }
          return { key: `${s.reps}${exUnit.abbr}@${w}`, display: noWeight ? `${s.reps} ${exUnit.label}` : `${s.reps} ${exUnit.label} @ ${w} ${wLabel}` };
        });
        // Group consecutive identical sets
        const groups = [];
        for (const s of perSet) {
          const last = groups[groups.length - 1];
          if (last && last.key === s.key) last.count++;
          else groups.push({ key: s.key, display: s.display, count: 1 });
        }
        return groups.map((g) => `${g.count} x ${g.display}`).join(", ");
      })()
    : "";

  return (
    <div
      style={{ ...styles.exerciseBtn, ...(allDone ? styles.exerciseBtnLogged : {}), position: "relative", cursor: "pointer" }}
      onClick={() => openLog(workoutId, exercise)}
      role="button"
      aria-label={`Log ${exercise.name}`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
          {getSportIconUrl(exercise.name, sportIcon) && (
            <img
              src={getSportIconUrl(exercise.name, sportIcon)}
              alt=""
              style={{
                width: 18, height: 18, objectFit: "contain", flexShrink: 0,
                filter: colors?.appBg?.startsWith("#0") || colors?.appBg?.startsWith("#1") ? "invert(1)" : "none",
                opacity: 0.7,
              }}
            />
          )}
          <div style={{ ...styles.exerciseName, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exercise.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {totalSets > 0 ? (
            allDone
              ? <span style={styles.badge}>Done</span>
              : completedCount > 0
                ? <span style={{ ...styles.badge, background: "rgba(46,204,113,0.10)", opacity: 0.7 }}>{completedCount}/{totalSets}</span>
                : <span style={styles.badgeMuted}>Tap to log</span>
          ) : (
            hasLog ? <span style={styles.badge}>Done</span> : <span style={styles.badgeMuted}>Tap to log</span>
          )}
          {hasLog && (
            <button
              style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: "inherit", opacity: 0.35, display: "flex" }}
              onClick={(e) => { e.stopPropagation(); deleteLogForExercise(exercise.id); }}
              aria-label={`Delete log for ${exercise.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>
            </button>
          )}
          {onDeleteExercise && (
            <button
              style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: "inherit", opacity: 0.35, display: "flex" }}
              onClick={(e) => { e.stopPropagation(); onDeleteExercise(exercise.id); }}
              aria-label={`Remove ${exercise.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {(onSwapExercise || isOverridden || isSessionAdded) && (
            <ExerciseMenu
              isOverridden={isOverridden}
              isSessionAdded={isSessionAdded}
              onSwapExercise={onSwapExercise}
              onSkipExercise={onSkipExercise}
              onUndoOverride={onUndoOverride}
              onPromoteOverride={onPromoteOverride}
              onRemoveSessionAddition={onRemoveSessionAddition}
              onPromoteSessionAddition={onPromoteSessionAddition}
              exerciseId={exercise.id}
              originalExerciseId={originalExerciseId}
              colors={colors}
            />
          )}
        </div>
      </div>
      {isOverridden && (
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, fontStyle: "italic" }}>Swapped for today</div>
      )}
      {isSessionAdded && (
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2, fontStyle: "italic" }}>Added for today</div>
      )}
      {hasLog && setsText ? <div style={styles.exerciseSub}>{setsText}</div> : null}
    </div>
  );
}

function WorkoutCard({ workout, collapsed, onToggle, logsForDate, openLog, deleteLogForExercise, styles, daily, onDelete, findPrior, onDeleteExercise, colors, onToggleRestTimer, globalRestEnabled, weightLabel, onStartCircuit, onSwapExercise, onSkipExercise, overrides, onUndoOverride, onPromoteOverride, cardId, onRemoveFromToday, highlightBorder, catalogMap, onAddExercise, onRemoveSessionAddition, onPromoteSessionAddition, scheduledBadge, continuousMeta }) {
  const cat = (workout.category || "Workout").trim();

  // Compute rest timer state from exercises: all on, all off, or mixed
  const exStates = workout.exercises.map((ex) =>
    ex.restTimer !== undefined ? ex.restTimer : globalRestEnabled
  );
  const allOn = exStates.length > 0 && exStates.every(Boolean);
  const allOff = exStates.length === 0 || exStates.every((v) => !v);
  const mixed = !allOn && !allOff;

  // Timer icon color
  const timerColor = allOn
    ? (colors?.accent || "#4fc3f7")
    : mixed
      ? (colors?.accent || "#4fc3f7")
      : undefined;
  const timerOpacity = allOn ? 0.8 : mixed ? 0.45 : 0.25;

  return (
    <div id={cardId} className="card-hover" style={{
      ...styles.card,
      borderRadius: 18,
      ...(highlightBorder ? {
        boxShadow: `inset 0 0 0 2px ${colors.accent}`,
        transition: "box-shadow 0.5s ease",
      } : {}),
    }}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <div style={styles.cardTitle}>{workout.name}</div>
          <span style={styles.tagMuted}>{cat}</span>
          {scheduledBadge && <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: (colors?.accent || "#4fc3f7") + "22", color: colors?.accent || "#4fc3f7" }}>Scheduled</span>}
          {continuousMeta && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: (colors?.accent || "#4fc3f7") + "22", color: colors?.accent || "#4fc3f7" }}>
              {continuousMeta.splitName} · Day {continuousMeta.memberIndex + 1}/{continuousMeta.totalMembers}
            </span>
          )}
          {overrides && <span style={{ fontSize: 11, opacity: 0.5, fontStyle: "italic" }}>(modified)</span>}
        </div>
        {onRemoveFromToday && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemoveFromToday(); }}
            style={{ background: "transparent", border: "none", cursor: "pointer",
              padding: 4, color: "inherit", opacity: 0.45, display: "flex", alignItems: "center" }}
            aria-label="Remove from today"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        {daily && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "inherit",
              opacity: 0.45,
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Remove daily workout"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {onAddExercise && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddExercise(); }}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 4, color: "inherit", opacity: 0.45, display: "flex", alignItems: "center",
            }}
            aria-label="Add exercise for today"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleRestTimer?.(workout.id); }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: timerColor || "inherit",
            opacity: timerOpacity,
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
          aria-label={`Rest timer: ${allOn ? "on" : allOff ? "off" : "mixed"}`}
          title={allOn ? "Rest timer on (all exercises)" : allOff ? "Rest timer off" : "Rest timer on (some exercises)"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3l2 2" />
            <path d="M19 3l-2 2" />
            <line x1="12" y1="1" x2="12" y2="3" />
          </svg>
          {mixed && (
            <span style={{
              position: "absolute",
              top: 1,
              right: 1,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: colors?.accent || "#4fc3f7",
            }} />
          )}
        </button>
        <span style={styles.collapseToggle}>
            {collapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            )}
          </span>
      </div>

      {!collapsed && workout.note && (
        <div style={{
          fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 10,
          background: colors ? colors.accentBg : "transparent",
          border: colors ? `1px solid ${colors.accentBorder}` : "none",
          opacity: 0.85, lineHeight: 1.4,
        }}>
          {workout.note}
        </div>
      )}

      {!collapsed && (
        workout.exercises.length === 0 ? (
          <div style={styles.emptyText}>No exercises yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {workout.exercises.map((ex) => {
              // Detect if this exercise is a swap replacement
              let isSwapReplacement = false;
              let origExId = null;
              if (overrides) {
                for (const [origId, o] of Object.entries(overrides)) {
                  if (o.type === "swap" && o.replacement?.id === ex.id) {
                    isSwapReplacement = true;
                    origExId = origId;
                    break;
                  }
                }
              }
              const isSessionAdded = !!ex._addedForToday;
              return (
                <ExerciseRow
                  key={ex.id}
                  workoutId={workout.id}
                  exercise={ex}
                  logsForDate={logsForDate}
                  openLog={openLog}
                  deleteLogForExercise={deleteLogForExercise}
                  styles={styles}
                  findPrior={findPrior}
                  onDeleteExercise={onDeleteExercise ? (exId) => onDeleteExercise(exId) : undefined}
                  workoutScheme={workout.scheme}
                  weightLabel={weightLabel}
                  colors={colors}
                  onSwapExercise={!isSwapReplacement && !isSessionAdded ? onSwapExercise : undefined}
                  onSkipExercise={!isSwapReplacement && !isSessionAdded ? onSkipExercise : undefined}
                  isOverridden={isSwapReplacement}
                  onUndoOverride={isSwapReplacement ? onUndoOverride : undefined}
                  onPromoteOverride={isSwapReplacement ? onPromoteOverride : undefined}
                  originalExerciseId={origExId}
                  sportIcon={ex.catalogId ? catalogMap.get(ex.catalogId)?.sportIcon : undefined}
                  isSessionAdded={isSessionAdded}
                  onRemoveSessionAddition={isSessionAdded ? onRemoveSessionAddition : undefined}
                  onPromoteSessionAddition={isSessionAdded ? onPromoteSessionAddition : undefined}
                />
              );
            })}
            {onStartCircuit && workout.exercises.length >= 2 && (
              <button
                className="btn-press"
                onClick={() => onStartCircuit(workout)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: `1px solid ${colors?.border || "#333"}`,
                  background: "transparent",
                  color: colors?.text || "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: 0.7,
                  marginTop: 4,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Circuit
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}

