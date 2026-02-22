import React, { useEffect, useMemo, useState, useRef, useReducer, useCallback } from "react";
import { fetchCloudState, saveCloudState, createDebouncedSaver } from "./lib/supabaseSync";
import { supabase } from "./lib/supabase";
import { fetchCoachInsights } from "./lib/coachApi";
import { buildNormalizedAnalysis, detectImbalancesNormalized } from "./lib/coachNormalize";
import { avatarInitial } from "./lib/userIdentity";

// Extracted lib modules
import { REP_UNITS, getUnit, getWeightLabel } from "./lib/constants";
import {
  yyyyMmDd, addDays, formatDateLabel, monthKeyFromDate, daysInMonth,
  weekdaySunday0, shiftMonth, formatMonthLabel,
  startOfWeekSunday, startOfMonth, startOfYear,
  endOfWeekSunday, endOfMonth, endOfYear,
  inRangeInclusive, isValidDateKey,
} from "./lib/dateUtils";
import { uid, loadState, normalizeState, persistState, makeDefaultState, safeParse, migrateCompletedFlag } from "./lib/stateUtils";
import {
  validateExerciseName, validateWorkoutName,
  toNumberOrNull, formatMaxWeight,
} from "./lib/validation";
import { computeCoachSignature, COACH_CACHE_TTL_MS } from "./lib/coachSignature";
import { getDailyRefreshCount, incrementDailyRefresh } from "./lib/aiMetrics";
import { initialModalState, modalReducer } from "./lib/modalReducer";

// Extracted hooks
import { useSwipe } from "./hooks/useSwipe";

// Extracted components
import { Modal, ConfirmModal, InputModal } from "./components/Modal";
import { PillTabs } from "./components/PillTabs";
import { CategoryAutocomplete } from "./components/CategoryAutocomplete";
import { ProfileModal } from "./components/ProfileModal";
import { ChangeUsernameModal } from "./components/profile/ChangeUsernameModal";
import { ChangePasswordModal } from "./components/profile/ChangePasswordModal";
import { CoachInsightsCard, CoachNudge, AddSuggestedExerciseModal } from "./components/CoachInsights";
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
import { CircuitTimer } from "./components/CircuitTimer";
import {
  getFriends, getPendingRequests, getInbox, getUnreadCount,
  acceptFriendRequest, declineFriendRequest, removeFriend,
  acceptSharedWorkout, dismissSharedWorkout,
} from "./lib/socialApi";

// Exercise catalog
import { EXERCISE_CATALOG, exerciseFitsEquipment } from "./lib/exerciseCatalog";
import { buildCatalogMap, isBodyweightOnly } from "./lib/exerciseCatalogUtils";
import { generateTodayWorkout, parseScheme } from "./lib/workoutGenerator";
import { generateTodayAI } from "./lib/workoutGeneratorApi";
import { selectAcknowledgment, selectSetCompletionToast, getTimeGreeting } from "./lib/greetings";
import { isSetCompleted, dayHasCompletedSets, calculateWeekStreak } from "./lib/setHelpers";
import { isTimerEligible, updateRestAverage } from "./lib/timerUtils";

// Extracted components (timer)
import { ExerciseTimer } from "./components/ExerciseTimer";
import { RestTimerBar } from "./components/RestTimerBar";

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
@keyframes cardInsert { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes highlightPulse { 0%,100% { box-shadow: none; } 50% { box-shadow: inset 0 0 0 2px var(--hl-color, #D97706); } }
@keyframes fabGlow { 0%,100% { box-shadow: 0 4px 16px rgba(0,0,0,0.15); } 50% { box-shadow: 0 0 28px 8px var(--fab-glow, rgba(217,119,6,0.6)), 0 4px 16px rgba(0,0,0,0.15); } }
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
  const tabRef = useRef("train");
  tabRef.current = tab;
  const [summaryMode, setSummaryMode] = useState("week");
  const [summaryOffset, setSummaryOffset] = useState(0);
  const [dateKey, setDateKey] = useState(() => yyyyMmDd(new Date()));
  const [manageWorkoutId, setManageWorkoutId] = useState(null);
  const [collapsedManage, setCollapsedManage] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wt_collapsed_manage"));
      return saved ? new Set(saved) : new Set(["programs", "data"]);
    } catch { return new Set(["programs", "data"]); }
  });
  const theme = state.preferences?.theme || "dark";
  const equipment = state.preferences?.equipment || ["full_gym"];
  const [reorderWorkouts, setReorderWorkouts] = useState(false);
  const [reorderExercises, setReorderExercises] = useState(false);
  const [trainSearch, setTrainSearch] = useState("");
  const [trainSearchOpen, setTrainSearchOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [highlightCardId, setHighlightCardId] = useState(null);
  const [fabVisible, setFabVisible] = useState(true);

  const [collapsedToday, setCollapsedToday] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_today"))); } catch { return new Set(); }
  });
  const [collapsedSummary, setCollapsedSummary] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wt_collapsed_summary"))); } catch { return new Set(); }
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
  const [profile, setProfile] = useState(null);
  const [coachInsights, setCoachInsights] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(null);
  const coachReqIdRef = useRef(0);
  const coachCacheRef = useRef(new Map());
  const coachLastSignatureRef = useRef(null);
  const coachLastFetchRef = useRef(0);
  const MAX_DAILY_REFRESHES = 10;

  // Swipe navigation between tabs
  const touchRef = useRef({ startX: 0, startY: 0, swiping: false, locked: false });
  const bodyRef = useRef(null);
  const TAB_ORDER = ["train", "progress", "program", "social"];

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

  // Click-outside to dismiss target config popover
  useEffect(() => {
    function handleDown(e) {
      if (targetConfigRef.current && !targetConfigRef.current.contains(e.target)) {
        setShowTargetConfig(false);
      }
    }
    if (showTargetConfig) {
      document.addEventListener("mousedown", handleDown);
      document.addEventListener("touchstart", handleDown);
      return () => { document.removeEventListener("mousedown", handleDown); document.removeEventListener("touchstart", handleDown); };
    }
  }, [showTargetConfig]);

  // Click-outside to dismiss stats config popover
  useEffect(() => {
    function handleDown(e) {
      if (statsConfigRef.current && !statsConfigRef.current.contains(e.target)) {
        setShowStatsConfig(false);
      }
    }
    if (showStatsConfig) {
      document.addEventListener("mousedown", handleDown);
      document.addEventListener("touchstart", handleDown);
      return () => { document.removeEventListener("mousedown", handleDown); document.removeEventListener("touchstart", handleDown); };
    }
  }, [showStatsConfig]);

  // Click-outside to dismiss pace popover
  useEffect(() => {
    function handleDown(e) {
      if (pacePopoverRef.current && !pacePopoverRef.current.contains(e.target)) {
        setPacePopoverIdx(null);
      }
    }
    if (pacePopoverIdx !== null) {
      document.addEventListener("mousedown", handleDown);
      document.addEventListener("touchstart", handleDown);
      return () => { document.removeEventListener("mousedown", handleDown); document.removeEventListener("touchstart", handleDown); };
    }
  }, [pacePopoverIdx]);

  // Click-outside to dismiss RPE popover
  useEffect(() => {
    function handleDown(e) {
      if (rpePopoverRef.current && !rpePopoverRef.current.contains(e.target)) {
        setRpePopoverIdx(null);
      }
    }
    if (rpePopoverIdx !== null) {
      document.addEventListener("mousedown", handleDown);
      document.addEventListener("touchstart", handleDown);
      return () => { document.removeEventListener("mousedown", handleDown); document.removeEventListener("touchstart", handleDown); };
    }
  }, [rpePopoverIdx]);

  // Click-outside to dismiss Intensity popover
  useEffect(() => {
    function handleDown(e) {
      if (intensityPopoverRef.current && !intensityPopoverRef.current.contains(e.target)) {
        setIntensityPopoverIdx(null);
      }
    }
    if (intensityPopoverIdx !== null) {
      document.addEventListener("mousedown", handleDown);
      document.addEventListener("touchstart", handleDown);
      return () => { document.removeEventListener("mousedown", handleDown); document.removeEventListener("touchstart", handleDown); };
    }
  }, [intensityPopoverIdx]);

  // After onboarding, show welcome choice modal
  useEffect(() => {
    if (showGenerateWizard) {
      dispatchModal({ type: "OPEN_WELCOME_CHOICE" });
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
          // Normalize cloud data the same way as localStorage (merge defaults, migrate flags)
          const normalized = normalizeState(cloudState);
          const localState = loadState();

          // Compare timestamps — use whichever is newer to avoid overwriting
          // unsaved local changes (e.g. preference change where cloud save was still debouncing)
          const cloudTs = normalized.meta?.updatedAt || 0;
          const localTs = localState.meta?.updatedAt || 0;

          if (localTs > cloudTs) {
            // Local is newer — keep it and push to cloud
            setState(localState);
            await saveCloudState(session.user.id, localState);
          } else {
            setState(normalized);
            persistState(normalized);
          }
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
          .select("username, display_name, username_last_changed_at, username_change_count, birthdate, gender, age, weight_lbs, height_inches, goal, about, sports, avatar_url")
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
    setSocialLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "social") refreshSocial();
  }, [tab]);

  const todayKey = yyyyMmDd(new Date());

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const colors = useMemo(() => getColors(theme), [theme]);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const workouts = state.program.workouts;
  const EMPTY_ARRAY = useMemo(() => [], []);
  const EMPTY_OBJ = useMemo(() => ({}), []);
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

  const effectiveWorkouts = useMemo(() => {
    if (!Object.keys(todayOverrides).length) return workouts;
    return workouts.map((w) => {
      const ov = todayOverrides[w.id];
      if (!ov) return w;
      const exercises = [];
      for (const ex of w.exercises) {
        const o = ov[ex.id];
        if (!o) { exercises.push(ex); continue; }
        if (o.type === "skip") continue;
        if (o.type === "swap") exercises.push(o.replacement);
      }
      return { ...w, exercises };
    });
  }, [workouts, todayOverrides]);

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
    return effectiveWorkouts.filter(w => !already.has(w.id) && w.exercises.some(ex => loggedExIds.has(ex.id)));
  }, [isToday, logsForDate, todaySessionIds, effectiveWorkouts]);

  // Combine explicitly-added sessions + auto-detected from logs
  const displayedProgramWorkouts = useMemo(() => {
    if (logDetectedWorkouts.length === 0) return todayProgramWorkouts;
    if (todayProgramWorkouts.length === 0) return logDetectedWorkouts;
    return [...todayProgramWorkouts, ...logDetectedWorkouts];
  }, [todayProgramWorkouts, logDetectedWorkouts]);

  const hasSessions = displayedProgramWorkouts.length > 0 || dailyWorkoutsToday.length > 0;

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
      const start = startOfWeekSunday(anchor);
      const end = summaryOffset === 0 ? dateKey : endOfWeekSunday(anchor);
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
  }, [dateKey, summaryMode, summaryOffset, state.logsByDate]);

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
    if (swapExercises.length > 0) {
      result.push({ id: "__swaps__", name: "Swapped Exercises", category: "Swap", exercises: swapExercises });
    }
    if (dailyExercises.length > 0) {
      result.push({ id: "__daily__", name: "Daily Workouts", category: "Daily", exercises: dailyExercises });
    }
    if (coachExercises.length > 0) {
      result.push({ id: "__coach__", name: "Coach Suggestions", category: "Coach", exercises: coachExercises });
    }
    return result;
  }, [workouts, state.dailyWorkouts, state.sessionOverrides, summaryRange]);

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
      const weekStart = startOfWeekSunday(d);
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
      bestReps: bestOf(exReps),
      bestVolume: bestOf(exVol),
      bestLift: bestOf(exLift),
    };
  }, [state.logsByDate, summaryRange, progressWorkouts]);

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
      const weekStart = startOfWeekSunday(d);
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
  }, [state.logsByDate, progressWorkouts]);

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

  // AI Coach signature
  const { signature: coachSignature } = useMemo(
    () => computeCoachSignature(state, summaryRange),
    [state.logsByDate, state.program.workouts, summaryRange]
  );

  // AI Coach — once-per-day auto-fetch, cached insights otherwise
  useEffect(() => {
    if (!dataReady || !profile) return;

    const userId = session.user.id;
    const cacheKey = `wt_coach_v2:${userId}:${summaryMode}:${dateKey}`;
    const autoDateKey = "wt_coach_last_auto_date";

    // 1. Try localStorage persisted cache — always show cached insights immediately
    try {
      const stored = JSON.parse(localStorage.getItem(cacheKey));
      if (stored && stored.insights?.length > 0 && Date.now() - stored.createdAt < COACH_CACHE_TTL_MS) {
        setCoachInsights(stored.insights);
        coachLastSignatureRef.current = stored.signature;
        coachLastFetchRef.current = stored.createdAt;
      }
    } catch {}

    // 2. Check in-memory cache
    const memCached = coachCacheRef.current.get(coachSignature);
    if (memCached && Date.now() - memCached.createdAt < COACH_CACHE_TTL_MS) {
      setCoachInsights(memCached.insights);
      setCoachError(null);
    }

    // 3. Once-per-day auto-fetch: only hit the API if we haven't fetched today
    const today = new Date().toISOString().slice(0, 10);
    const lastAutoDate = localStorage.getItem(autoDateKey);
    if (lastAutoDate === today) return; // Already fetched today — use cached insights

    // 4. Fetch from AI
    let cancelled = false;
    const reqId = ++coachReqIdRef.current;

    setCoachLoading(true);

    const userExNames = workouts.flatMap((w) => (w.exercises || []).map((e) => e.name));
    const filteredCatalog = fullCatalog.filter((e) => exerciseFitsEquipment(e, equipment));
    const coachOpts = { catalog: filteredCatalog, userExerciseNames: userExNames };

    fetchCoachInsights({ profile, state, dateRange: summaryRange, catalog: filteredCatalog, equipment, measurementSystem: state.preferences?.measurementSystem })
      .then(({ insights, fromCache }) => {
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
        // Mark today as auto-fetched (even if coachApi returned from its own cache)
        try { localStorage.setItem(autoDateKey, today); } catch {}
      })
      .catch((err) => {
        if (cancelled || coachReqIdRef.current !== reqId) return;
        console.error("AI Coach error:", err);
        if (coachInsights.length === 0) {
          const analysis = buildNormalizedAnalysis(state.program.workouts, state.logsByDate, summaryRange, catalogMap);
          setCoachInsights(detectImbalancesNormalized(analysis, coachOpts));
        }
        const detail = err?.message || String(err);
        setCoachError(`AI coach unavailable \u2014 showing basic analysis (${detail})`);
      })
      .finally(() => {
        if (!cancelled && coachReqIdRef.current === reqId) {
          setCoachLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [dataReady, profile]);

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

  // Close FAB when switching tabs
  useEffect(() => { setFabOpen(false); }, [tab]);

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
    localStorage.setItem("wt_collapsed_summary", JSON.stringify([...collapsedSummary]));
  }, [collapsedSummary]);

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

  // Flush pending cloud sync on tab close / navigation
  useEffect(() => {
    const handleUnload = () => {
      if (cloudSaver.current && latestStateRef.current && dataReady) {
        cloudSaver.current.flush(session.user.id, latestStateRef.current);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
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
    modals.editExercise?.isOpen || modals.catalogBrowse.isOpen || modals.generateWizard.isOpen ||
    modals.generateToday.isOpen || modals.customExercise?.isOpen || modals.billing?.isOpen ||
    modals.social?.isOpen || modals.friendSearch?.isOpen ||
    modals.shareWorkout?.isOpen || modals.workoutPreview?.isOpen;

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

    const prepareExit = () => {
      exiting = true;
      cwWorking = false;
      // Drain history buffer so next back goes straight to OS
      if (buffer > 0) { history.go(-buffer); buffer = 0; }
      // Re-enable after 2.5s if user doesn't exit
      setTimeout(() => {
        if (!exiting) return;
        exiting = false;
        setupWatcher();
        while (buffer < 5) push();
      }, 2500);
    };

    const setupWatcher = () => {
      if (!hasCW) return;
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
        // Only cancel exit on deliberate taps (click), not pointerdown.
        // Back gestures fire pointerdown on the screen edge before the back
        // action is processed — cancelling exit there would swallow the press.
        if (e.type !== "click") return;
        exiting = false;
        setupWatcher();
        while (buffer < 5) push();
        return;
      }
      if (!initialized) {
        initialized = true;
        history.replaceState(null, "", location.pathname + location.search);
        while (buffer < 5) push();
        return;
      }
      if (buffer < 5) push();
    };

    document.addEventListener("pointerdown", ensureEntries, { passive: true });
    document.addEventListener("click", ensureEntries, { passive: true });

    let lastBackTime = 0;
    const onBack = () => {
      if (exiting) return;
      if (location.hash === lastHash) return;
      const now = Date.now();
      if (now - lastBackTime < 300) return;
      lastBackTime = now;
      buffer = Math.max(0, buffer - 1);
      // Only handle via history if CloseWatcher is NOT active
      if (!cwWorking) {
        const result = handleBackRef.current?.();
        if (result === "prepare_exit") { prepareExit(); return; }
      }
    };

    window.addEventListener("popstate", onBack);
    window.addEventListener("hashchange", onBack);

    return () => {
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
    let sessions = 0;
    let totalSets = 0;

    for (const dk of Object.keys(state.logsByDate)) {
      if (!isValidDateKey(dk)) continue;
      if (!inRangeInclusive(dk, startKey, endKey)) continue;

      const exLog = state.logsByDate[dk]?.[exerciseId];
      if (!exLog || !Array.isArray(exLog.sets)) continue;

      const completedInDay = exLog.sets.filter((s) => isSetCompleted(s));
      if (completedInDay.length === 0) continue;

      sessions++;
      totalSets += completedInDay.length;

      for (const set of completedInDay) {
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

    return { totalReps: displayTotal, maxWeight: formatMaxWeight(maxNum, hasBW), sessions, totalSets };
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const openLog = useCallback(
    (workoutId, exercise) => {
      const exerciseId = exercise.id;
      const existing = state.logsByDate[dateKey]?.[exerciseId] ?? null;
      const template = findMostRecentLogBefore(exerciseId, dateKey);
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
          sets = [{ reps: 0, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" }];
        }
      }

      // Pad partial logs with remaining template sets
      if (existing && template?.sets?.length && sets.length < template.sets.length) {
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

      // Pad from scheme if still fewer sets than scheme specifies
      const parsedScheme = schemeStr ? parseScheme(schemeStr) : null;
      if (existing && parsedScheme && sets.length < parsedScheme.sets) {
        for (let i = sets.length; i < parsedScheme.sets; i++) {
          sets.push({ reps: parsedScheme.reps, weight: "", targetRpe: "", targetPace: "", targetCustom: "", targetIntensity: "" });
        }
      }

      const normalizedSets = sets.map((s) => {
        const isBW = String(s.weight).toUpperCase() === "BW";
        return {
          reps: s.reps,
          weight: isBW ? "BW" : String(s.weight ?? "").trim(),
          targetRpe: s.targetRpe || "",
          targetPace: s.targetPace || "",
          targetCustom: s.targetCustom || "",
          targetIntensity: s.targetIntensity || "",
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
      let logExercise = null;
      for (const wk of st.program.workouts) {
        const found = wk.exercises.find((e) => e.id === logCtx.exerciseId);
        if (found) { logExercise = found; break; }
      }
      if (!logExercise) {
        const dailyWs = Object.values(st.dailyWorkouts || {}).flat();
        for (const wk of dailyWs) {
          const found = (wk.exercises || []).find((e) => e.id === logCtx.exerciseId);
          if (found) { logExercise = found; break; }
        }
      }
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

      const existingEntry = st.logsByDate[dateKey]?.[logCtx.exerciseId];

      // Save all modal sets, preserving completion flags from checkmarks
      const allSets = (Array.isArray(modals.log.sets) ? modals.log.sets : []).map((modalSet, i) => {
        const cleaned = cleanSet(modalSet);
        const wasCompleted = existingEntry?.sets?.[i] && isSetCompleted(existingEntry.sets[i]);
        return { ...cleaned, completed: !!wasCompleted };
      });

      st.logsByDate[dateKey] = st.logsByDate[dateKey] ?? {};
      const logEntry = {
        sets: allSets,
        notes: modals.log.notes ?? "",
      };
      if (modals.log.mood != null) logEntry.mood = modals.log.mood;
      st.logsByDate[dateKey][logCtx.exerciseId] = logEntry;

      return st;
    });

  }, [modals.log, dateKey]);

  const saveLog = useCallback(() => {
    if (!modals.log.context) return;

    const existing = state.logsByDate[dateKey]?.[modals.log.context.exerciseId];
    saveLogData();

    // Toast only for meaningful changes (not template-only saves)
    const notesChanged = (modals.log.notes ?? "") !== (existing?.notes ?? "");
    const moodChanged = modals.log.mood !== (existing?.mood ?? null);

    if (notesChanged || moodChanged) {
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
  }, [modals.log, dateKey, state.logsByDate, state.preferences, saveLogData]);

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
    (exerciseId, setIndex, setData, workoutId) => {
      // Haptic feedback
      navigator.vibrate?.(10);

      updateState((st) => {
        st.logsByDate[dateKey] = st.logsByDate[dateKey] ?? {};
        const entry = st.logsByDate[dateKey][exerciseId] ?? { sets: [] };
        if (!Array.isArray(entry.sets)) entry.sets = [];
        while (entry.sets.length <= setIndex) entry.sets.push({ reps: 0, weight: "", completed: false });
        const savedSet = { reps: setData.reps, weight: setData.weight, completed: true };
        if (setData.targetRpe) savedSet.targetRpe = setData.targetRpe;
        if (setData.targetPace) savedSet.targetPace = setData.targetPace;
        if (setData.targetCustom) savedSet.targetCustom = setData.targetCustom;
        if (setData.targetIntensity) savedSet.targetIntensity = setData.targetIntensity;
        entry.sets[setIndex] = savedSet;
        st.logsByDate[dateKey][exerciseId] = entry;
        return st;
      });
  

      // Smart toast — compute context after state update
      const workout = workoutById.get(workoutId);
      const exercises = workout?.exercises || [];

      // Check if the whole workout is complete after this set
      const updatedDayLogs = { ...state.logsByDate[dateKey] };
      // Include the set we just saved
      const updatedEntry = { ...(updatedDayLogs[exerciseId] || { sets: [] }) };
      const updatedSets = [...(updatedEntry.sets || [])];
      while (updatedSets.length <= setIndex) updatedSets.push({ reps: 0, weight: "", completed: false });
      updatedSets[setIndex] = { reps: setData.reps, weight: setData.weight, completed: true };
      updatedDayLogs[exerciseId] = { ...updatedEntry, sets: updatedSets };

      const isWorkoutComplete = exercises.length > 0 && exercises.every((ex) => {
        const exLog = updatedDayLogs[ex.id];
        if (!exLog?.sets?.length) return false;
        const completedCount = exLog.sets.filter((s) => isSetCompleted(s)).length;
        const exPrior = findMostRecentLogBefore(ex.id, dateKey);
        const exScheme = ex.scheme || workout?.scheme || null;
        const exSchemeParsed = exScheme ? parseScheme(exScheme) : null;
        const exTotal = exPrior?.sets?.length || exSchemeParsed?.sets || 0;
        return exTotal > 0 ? completedCount >= exTotal : completedCount > 0;
      });

      // Count exercises logged today
      const exercisesDoneToday = Object.keys(updatedDayLogs).filter(
        (eid) => updatedDayLogs[eid]?.sets?.some((s) => isSetCompleted(s))
      ).length;

      // Compute totalSets from today's template (updatedSets includes template slots)
      const prior = findMostRecentLogBefore(exerciseId, dateKey);
      const schemeStr = exercises.find((e) => e.id === exerciseId)?.scheme || workout?.scheme || null;
      const schemeParsed = schemeStr ? parseScheme(schemeStr) : null;
      const totalSets = Math.max(updatedSets.length, prior?.sets?.length || 0, schemeParsed?.sets || 0);

      const toast = selectSetCompletionToast({
        exerciseId,
        setData,
        setIndex,
        totalSets,
        logsByDate: state.logsByDate,
        dateKey,
        isWorkoutComplete,
        exercisesDoneToday,
      });

      setToast(toast);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), isWorkoutComplete ? 3500 : 2000);

      // Start rest timer if enabled for this workout, workout isn't complete, and there are more sets to do
      const completedSetsCount = updatedSets.filter((s) => isSetCompleted(s)).length;
      const hasMoreSets = completedSetsCount < totalSets;
      const exerciseObj = exercises.find((e) => e.id === exerciseId);
      const exRestEnabled = exerciseObj?.restTimer !== undefined
        ? exerciseObj.restTimer
        : state.preferences?.restTimerEnabled !== false;
      if (exRestEnabled && !isWorkoutComplete && hasMoreSets) {
        const exName = exerciseObj?.name || "";
        const learnedKey = exName.toLowerCase().trim();
        const learnedRest = state.preferences?.exerciseRestTimes?.[learnedKey];
        const restSec = learnedRest || exerciseObj?.restSec || state.preferences?.defaultRestSec || 90;
        setRestTimer({ active: true, exerciseId, exerciseName: exName, restSec, completedSetIndex: setIndex });
      } else {
        setRestTimer((prev) => prev.active ? { ...prev, active: false } : prev);
        // No rest timer — fire auto-start signal directly for the next set
        if (autoStartTimer) {
          setTimeout(() => setAutoStartSignal((s) => s + 1), 100);
        }
      }
    },
    [dateKey, state.logsByDate, state.preferences, workoutById, autoStartTimer]
  );

  const uncompleteSet = useCallback(
    (exerciseId, setIndex) => {
      updateState((st) => {
        const dayLogs = st.logsByDate[dateKey];
        if (!dayLogs?.[exerciseId]) return st;
        const entry = dayLogs[exerciseId];
        if (!Array.isArray(entry.sets) || setIndex >= entry.sets.length) return st;
        entry.sets[setIndex] = { ...entry.sets[setIndex], completed: false };
        return st;
      });
  
      setRestTimer((prev) =>
        prev.active && prev.exerciseId === exerciseId && prev.completedSetIndex === setIndex
          ? { ...prev, active: false }
          : prev
      );
    },
    [dateKey]
  );

  const toggleExerciseTarget = useCallback(
    (exerciseId, targetKey) => {
      updateState((st) => {
        const toggle = (ex) => {
          if (ex.id !== exerciseId) return;
          const cur = ex.targets || [];
          ex.targets = cur.includes(targetKey) ? cur.filter((t) => t !== targetKey) : [...cur, targetKey];
        };
        for (const wk of st.program.workouts) {
          for (const ex of wk.exercises) toggle(ex);
        }
        for (const key of Object.keys(st.dailyWorkouts || {})) {
          for (const wk of st.dailyWorkouts[key]) {
            for (const ex of wk.exercises || []) toggle(ex);
          }
        }
        return st;
      });
    },
    []
  );

  const toggleExerciseBodyweight = useCallback(
    (exerciseId) => {
      updateState((st) => {
        const toggle = (ex) => {
          if (ex.id !== exerciseId) return;
          ex.bodyweight = !ex.bodyweight;
        };
        for (const wk of st.program.workouts) {
          for (const ex of wk.exercises) toggle(ex);
        }
        for (const key of Object.keys(st.dailyWorkouts || {})) {
          for (const wk of st.dailyWorkouts[key]) {
            for (const ex of wk.exercises || []) toggle(ex);
          }
        }
        return st;
      });
    },
    []
  );

  const toggleExerciseRestTimer = useCallback(
    (exerciseId) => {
      updateState((st) => {
        const globalEnabled = st.preferences?.restTimerEnabled !== false;
        const toggle = (ex) => {
          if (ex.id !== exerciseId) return;
          const current = ex.restTimer !== undefined ? ex.restTimer : globalEnabled;
          ex.restTimer = !current;
        };
        for (const wk of st.program.workouts) {
          for (const ex of wk.exercises) toggle(ex);
        }
        for (const key of Object.keys(st.dailyWorkouts || {})) {
          for (const wk of st.dailyWorkouts[key]) {
            for (const ex of wk.exercises || []) toggle(ex);
          }
        }
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
        if (!wk) return st;
        // Compute current state: are any exercises enabled?
        const anyOn = wk.exercises.some((ex) =>
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
        },
      });
    },
    [workoutById]
  );

  const saveEditWorkout = useCallback(() => {
    if (!modals.editWorkout) return;
    const { workoutId, name, category } = modals.editWorkout;
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
      }
      return st;
    });
    dispatchModal({ type: "CLOSE_EDIT_WORKOUT" });
  }, [modals.editWorkout, workouts]);

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

  async function importJsonFromFile(file) {
    try {
      const text = await file.text();
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

  function handleAddSuggestion(exerciseName) {
    dispatchModal({
      type: "OPEN_ADD_SUGGESTION",
      payload: { exerciseName },
    });
  }

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
      updateState((st) => {
        if (!st.dailyWorkouts) st.dailyWorkouts = {};
        if (!st.dailyWorkouts[dateKey]) st.dailyWorkouts[dateKey] = [];
        let coachWorkout = st.dailyWorkouts[dateKey].find(w => w.source === "coach");
        if (!coachWorkout) {
          coachWorkout = { id: uid("w"), name: "Coach Suggestions", category: "Coach", source: "coach", exercises: [] };
          st.dailyWorkouts[dateKey].push(coachWorkout);
        }
        const newEx = { id: uid("ex"), name: exerciseName, unit: "reps" };
        if (matchedCatalogId) newEx.catalogId = matchedCatalogId;
        coachWorkout.exercises.push(newEx);
        return st;
      });
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

    dispatchModal({ type: "UPDATE_GENERATE_TODAY", payload: { loading: true, error: null, preview: null } });

    const result = await generateTodayAI({
      equipment: eq,
      duration: dur,
      profile,
      state,
      catalog: fullCatalog,
      todayKey: dateKey,
      measurementSystem: state.preferences?.measurementSystem,
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
    dispatchModal({ type: "CLOSE_GENERATE_TODAY" });
  }

  const deleteDailyWorkout = useCallback((workoutId) => {
    const w = workoutById.get(workoutId);
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: "Remove workout?",
        message: `Remove "${w?.name || "this workout"}"?`,
        confirmText: "Remove",
        onConfirm: () => {
          updateState((st) => {
            if (!st.dailyWorkouts?.[dateKey]) return st;
            st.dailyWorkouts[dateKey] = st.dailyWorkouts[dateKey].filter(dw => dw.id !== workoutId);
            if (st.dailyWorkouts[dateKey].length === 0) delete st.dailyWorkouts[dateKey];
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
    dispatchModal({
      type: "OPEN_CONFIRM",
      payload: {
        title: isLast ? "Remove workout?" : "Remove exercise?",
        message: isLast
          ? `"${ex?.name || "This exercise"}" is the last exercise. This will remove the entire workout.`
          : `Remove "${ex?.name || "this exercise"}" from ${w?.name || "this workout"}?`,
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
            } else {
              wk.exercises = wk.exercises.filter(e => e.id !== exerciseId);
            }
            return st;
          });
          dispatchModal({ type: "CLOSE_CONFIRM" });
        },
      },
    });
  }, [dateKey, workoutById]);

  // ===== TODAY SESSION HANDLERS =====

  function addSessionToToday(workoutId) {
    const existing = state.todaySessions?.[dateKey] || [];
    if (existing.includes(workoutId)) {
      setFabOpen(false);
      highlightAndScrollToCard(workoutId);
      return;
    }
    updateState((st) => {
      if (!st.todaySessions) st.todaySessions = {};
      if (!st.todaySessions[dateKey]) st.todaySessions[dateKey] = [];
      st.todaySessions[dateKey].push(workoutId);
      return st;
    });
    setFabOpen(false);
  }

  function removeSessionFromToday(workoutId) {
    updateState((st) => {
      if (!st.todaySessions?.[dateKey]) return st;
      st.todaySessions[dateKey] = st.todaySessions[dateKey].filter(id => id !== workoutId);
      if (st.todaySessions[dateKey].length === 0) delete st.todaySessions[dateKey];
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

  return (
    <div style={styles.app}>
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
                {(tab === "train" || tab === "progress" || tab === "program") && workouts.length > 0 && (() => {
                  if (tab === "program") {
                    const sections = ["programs", "data"];
                    const allCollapsed = sections.every((s) => collapsedManage.has(s));
                    return (
                      <button
                        style={{ ...styles.navArrow, opacity: 0.45 }}
                        onClick={() => allCollapsed ? setCollapsedManage(new Set()) : setCollapsedManage(new Set(sections))}
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
                  }
                  const setter = tab === "train" ? setCollapsedToday : setCollapsedSummary;
                  const collapsed = tab === "train" ? collapsedToday : collapsedSummary;
                  const allCards = tab === "train" ? [...displayedProgramWorkouts, ...dailyWorkoutsToday] : progressWorkouts;
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
                      weightLbs: profile?.weight_lbs || "",
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

          {/* TODAY TAB */}
          {tab === "train" ? (
            <div key="train" style={{
              ...styles.section,
              animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)",
              ...(isToday && !hasSessions ? { flex: 1, justifyContent: "center" } : {}),
            }}>
              {isToday && !hasSessions ? (
                /* HERO STATE: centered greeting, today only, no sessions */
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", textAlign: "center", minHeight: "50vh", gap: 8,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.3 }}>
                    {getTimeGreeting()}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.5 }}>
                    Ready to start a session?
                  </div>
                </div>
              ) : !isToday && !hasSessions ? (
                /* NON-TODAY EMPTY: no logs or sessions */
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "48px 20px", gap: 8,
                }}>
                  <div style={{ fontSize: 14, opacity: 0.45 }}>
                    No sessions logged.
                  </div>
                </div>
              ) : (
                /* HAS SESSIONS: header + cards */
                <>
                  <div style={{ fontSize: 20, fontWeight: 700, padding: "4px 0 8px" }}>
                    {isToday ? "Today\u2019s sessions" : "Sessions logged"}
                  </div>
                  {isToday && <CoachNudge insights={coachInsights} colors={colors} />}
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
                    />
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
                    />
                  ))}
                </>
              )}
            </div>
          ) : null}

          {/* SUMMARY TAB */}
          {tab === "progress" ? (
            <div key="progress" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              <div style={{ position: "sticky", top: -14, zIndex: 10, background: colors.appBg, marginTop: -14, paddingTop: 14, paddingBottom: 6, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
                <PillTabs
                  styles={styles}
                  value={summaryMode}
                  onChange={(v) => { setSummaryMode(v); setSummaryOffset(0); }}
                  tabs={[
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "year", label: "Year" },
                    { value: "all", label: "All" },
                  ]}
                />
              </div>
              {(() => {
                const pctLogged = summaryStats.total > 0 ? Math.round((summaryStats.logged / summaryStats.total) * 100) : 0;
                const navBtnStyle = { background: "transparent", border: "none", color: colors.text, cursor: "pointer", padding: "4px 8px", fontSize: 18, fontWeight: 700, lineHeight: 1 };
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
                      {summaryMode !== "all" && (
                        <button style={{ ...navBtnStyle, opacity: 0.5 }} onClick={() => setSummaryOffset((o) => o - 1)} aria-label="Previous period">‹</button>
                      )}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {formatDateLabel(summaryRange.start)} {"\u2013"} {formatDateLabel(summaryRange.end)}
                        </div>
                      </div>
                      {summaryMode !== "all" && (
                        <button style={{ ...navBtnStyle, opacity: summaryOffset >= 0 ? 0.15 : 0.5 }} onClick={() => { if (summaryOffset < 0) setSummaryOffset((o) => o + 1); }} disabled={summaryOffset >= 0} aria-label="Next period">›</button>
                      )}
                      {summaryOffset !== 0 && summaryMode !== "all" && (
                        <button style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.text, opacity: 0.6, cursor: "pointer", padding: "2px 8px", fontSize: 11, fontWeight: 700, marginLeft: 4 }} onClick={() => setSummaryOffset(0)}>Today</button>
                      )}
                      {/* Gear icon — absolutely positioned so it doesn't shift the centered date */}
                      <div ref={statsConfigRef} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
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
                            <div style={{ ...valStyle, color: summaryStats.weekStreak > 0 ? "#2ecc71" : "inherit" }}>{summaryStats.weekStreak}</div>
                            <div style={subStyle}>Week Streak</div>
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
                    {/* Progress bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 4, background: colors.cardAltBg, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 4, width: `${pctLogged}%`, background: pctLogged >= 80 ? "#2ecc71" : pctLogged >= 40 ? "#f59e0b" : colors.primaryBg, transition: "width 0.3s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, whiteSpace: "nowrap" }}>{summaryStats.logged}/{summaryStats.total} days</span>
                    </div>
                  </div>
                );
              })()}
              <CoachInsightsCard
                insights={coachInsights}
                onAddExercise={handleAddSuggestion}
                styles={styles}
                colors={colors}
                loading={coachLoading}
                error={coachError}
                userExerciseNames={progressWorkouts.flatMap((w) => (w.exercises || []).map((e) => e.name))}
                onRefresh={() => {
                  // Rate limit manual refreshes
                  if (getDailyRefreshCount() >= MAX_DAILY_REFRESHES) {
                    showToast("Daily refresh limit reached \u2014 insights update automatically each day");
                    return;
                  }
                  incrementDailyRefresh();

                  const reqId = ++coachReqIdRef.current;
                  setCoachLoading(true);
                  setCoachError(null);
                  const refreshExNames = progressWorkouts.flatMap((w) => (w.exercises || []).map((e) => e.name));
                  const refreshCatalog = fullCatalog.filter((e) => exerciseFitsEquipment(e, equipment));
                  fetchCoachInsights({ profile, state, dateRange: summaryRange, options: { forceRefresh: true }, catalog: refreshCatalog, equipment, measurementSystem: state.preferences?.measurementSystem })
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
                      const detail = err?.message || String(err);
                      setCoachError(`AI coach unavailable \u2014 showing basic analysis (${detail})`);
                    })
                    .finally(() => {
                      if (coachReqIdRef.current === reqId) setCoachLoading(false);
                    });
                }}
              />

              {summaryStats.logged === 0 && !coachLoading && coachInsights.length === 0 ? (
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
                    Log a session on the <b>Today</b> tab and your history will show up here.
                  </div>
                </div>
              ) : (
                progressWorkouts.map((w) => (
                  <SummaryBlock
                    key={w.id}
                    workout={w}
                    collapsed={collapsedSummary.has(w.id)}
                    onToggle={() => toggleCollapse(setCollapsedSummary, w.id)}
                    summaryRange={summaryRange}
                    computeExerciseSummary={computeExerciseSummary}
                    styles={styles}
                    colors={colors}
                  />
                ))
              )}
            </div>
          ) : null}

          {/* MANAGE TAB */}
          {tab === "program" ? (
            <div key="program" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              <ExerciseCatalogSection styles={styles} colors={colors} catalogCount={fullCatalog.length} onOpen={() => dispatchModal({ type: "OPEN_CATALOG_BROWSE", payload: { workoutId: null } })} />

              <div className="card-hover" style={styles.card}>
                <div style={collapsedManage.has("programs") ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader}>
                  <div style={styles.cardTitle}>Programs</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!collapsedManage.has("programs") && <>
                      <button
                        className="btn-press"
                        style={{ ...(reorderWorkouts ? styles.primaryBtn : styles.secondaryBtn), display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px" }}
                        onClick={() => setReorderWorkouts((v) => !v)}
                        title={reorderWorkouts ? "Done reordering" : "Reorder workouts"}
                      >
                        {reorderWorkouts ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" /></svg>
                        )}
                      </button>
                      <button className="btn-press" style={{ ...styles.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px" }} onClick={addWorkout} title="Add workout">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </>}
                    <button
                      style={{ ...styles.navArrow, opacity: 0.35, padding: 4 }}
                      onClick={() => toggleCollapse(setCollapsedManage, "programs")}
                      type="button"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsedManage.has("programs") ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!collapsedManage.has("programs") && (<>
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

                      const iconBtn = (onClick, title, children, extraStyle) => (
                        <button
                          style={{ background: "transparent", border: "none", color: "inherit", padding: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.45, ...extraStyle }}
                          onClick={onClick} title={title}
                        >
                          {children}
                        </button>
                      );

                      const shareIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
                      const pencilIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>;
                      const trashIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>;
                      const plusIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
                      const reorderIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" /></svg>;
                      const checkIcon = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;

                      return (
                        <div key={w.id}>
                          {/* Workout row */}
                          <div
                            style={{
                              ...styles.manageItem,
                              ...(active ? styles.manageItemActive : {}),
                              display: "flex", alignItems: "center", gap: 6,
                            }}
                          >
                            <div
                              style={{ flex: 1, minWidth: 0, cursor: reorderWorkouts ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
                              onClick={() => { if (!reorderWorkouts) setManageWorkoutId(active ? null : w.id); }}
                            >
                              <div style={{ ...styles.manageExerciseName, fontWeight: 700 }}>{w.name}</div>
                              <span style={styles.tagMuted}>{(w.category || "Workout").trim()}</span>
                            </div>
                            {reorderWorkouts ? (
                              <div style={styles.reorderBtnGroup}>
                                <button style={{ ...styles.reorderBtn, opacity: isFirst ? 0.15 : 0.5, padding: "0 4px" }} disabled={isFirst} onClick={() => moveWorkout(w.id, -1)} title="Move up">
                                  <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                                </button>
                                <button style={{ ...styles.reorderBtn, opacity: isLast ? 0.15 : 0.5, padding: "0 4px" }} disabled={isLast} onClick={() => moveWorkout(w.id, 1)} title="Move down">
                                  <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                                {iconBtn(() => dispatchModal({ type: "OPEN_SHARE_WORKOUT", payload: { workoutId: w.id, workoutName: w.name } }), "Share workout", shareIcon)}
                                {iconBtn(() => openEditWorkout(w.id), "Edit workout", pencilIcon)}
                                {iconBtn(() => deleteWorkout(w.id), "Delete workout", trashIcon, { opacity: 0.3 })}
                                {active && w.exercises.length > 1 && (
                                  reorderExercises
                                    ? iconBtn(() => setReorderExercises(false), "Done reordering", checkIcon, { opacity: 0.7 })
                                    : iconBtn(() => setReorderExercises(true), "Reorder exercises", reorderIcon)
                                )}
                                {active && iconBtn(() => addExercise(w.id), "Add exercise", plusIcon)}
                              </div>
                            )}
                          </div>

                          {/* Inline workout detail — exercise list */}
                          {active && !reorderWorkouts && (
                            <div style={{
                              marginTop: 6,
                              marginLeft: 4,
                              padding: "8px 12px 8px",
                              borderLeft: `2px solid ${colors.border}`,
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              animation: "tabFadeIn 0.2s cubic-bezier(.2,.8,.3,1)",
                            }}>
                              {w.exercises.length === 0 ? (
                                <div style={styles.emptyText}>No exercises yet.</div>
                              ) : (
                                w.exercises.map((ex, ei) => {
                                  const isFirstEx = ei === 0;
                                  const isLastEx = ei === w.exercises.length - 1;
                                  return (
                                    <div key={ex.id} style={styles.manageExerciseRow}>
                                      <div style={styles.manageExerciseLeft}>
                                        <div style={styles.manageExerciseName}>{ex.name}</div>
                                        <span style={styles.tagMuted}>{getUnit(ex.unit, ex).abbr}</span>
                                      </div>
                                      {reorderExercises ? (
                                        <div style={styles.reorderBtnGroup}>
                                          <button style={{ ...styles.reorderBtn, opacity: isFirstEx ? 0.15 : 0.5, padding: "0 4px" }} disabled={isFirstEx} onClick={() => moveExercise(w.id, ex.id, -1)} title="Move up">
                                            <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 13 12 5 6 13" /></svg>
                                          </button>
                                          <button style={{ ...styles.reorderBtn, opacity: isLastEx ? 0.15 : 0.5, padding: "0 4px" }} disabled={isLastEx} onClick={() => moveExercise(w.id, ex.id, 1)} title="Move down">
                                            <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 3 12 11 18 3" /></svg>
                                          </button>
                                        </div>
                                      ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                                          {iconBtn(() => openEditExercise(w.id, ex.id), "Edit exercise", pencilIcon)}
                                          {iconBtn(() => deleteExercise(w.id, ex.id), "Delete exercise", trashIcon, { opacity: 0.3 })}
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0b429" stroke="none">
                    <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
                    <path d="M20 3l1 3.5L24.5 8 21 9l-1 3.5L19 9l-3.5-1L19 6.5z" opacity="0.6" />
                  </svg>
                  Generate Program
                </button>
                </>)}
              </div>

              {/* Backup section */}
              <div className="card-hover" style={styles.card}>
                <div style={collapsedManage.has("data") ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader}>
                  <div style={styles.cardTitle}>Data</div>
                  <button
                    style={{ ...styles.navArrow, opacity: 0.35, padding: 4 }}
                    onClick={() => toggleCollapse(setCollapsedManage, "data")}
                    type="button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsedManage.has("data") ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {!collapsedManage.has("data") && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Reset All</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>Delete all workouts and logs</div>
                    </div>
                  </button>
                </div>}
              </div>
            </div>
          ) : null}

          {/* SOCIAL TAB */}
          {tab === "social" ? (
            <div key="social" style={{ ...styles.section, animation: "tabFadeIn 0.25s cubic-bezier(.2,.8,.3,1)" }}>
              {(() => {
                const socialTab = modals.social.tab || "friends";
                const pendingInboxCount = socialInbox.filter((i) => i.status === "pending").length;
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <PillTabs
                      tabs={[
                        { value: "friends", label: `Friends${socialFriends.length ? ` (${socialFriends.length})` : ""}` },
                        { value: "inbox", label: `Inbox${pendingInboxCount ? ` (${pendingInboxCount})` : ""}` },
                      ]}
                      value={socialTab}
                      onChange={(v) => dispatchModal({ type: "UPDATE_SOCIAL", payload: { tab: v } })}
                      styles={styles}
                    />

                    {socialTab === "friends" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <button
                          className="btn-press"
                          onClick={() => dispatchModal({ type: "OPEN_FRIEND_SEARCH" })}
                          style={{ ...styles.primaryBtn, width: "100%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 14px" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                          Add Friend
                        </button>

                        {socialLoading && socialFriends.length === 0 && (
                          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>Loading...</div>
                        )}

                        {/* Friends list */}
                        {socialFriends.length === 0 && !socialLoading ? (
                          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
                            No friends yet. Search for users to connect!
                          </div>
                        ) : (
                          socialFriends.map((f) => (
                            <div
                              key={f.friendshipId}
                              style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "12px 14px", borderRadius: 12,
                                background: colors.cardBg,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              <div style={{
                                width: 36, height: 36, borderRadius: 999,
                                background: colors.accent + "22", color: colors.accent,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, fontWeight: 700, flexShrink: 0,
                                overflow: "hidden",
                              }}>
                                {f.avatar_url ? (
                                  <img src={f.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: 999, objectFit: "cover" }} />
                                ) : (
                                  (f.username || "?")[0].toUpperCase()
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>@{f.username}</div>
                                {f.display_name && <div style={{ fontSize: 12, opacity: 0.6 }}>{f.display_name}</div>}
                              </div>
                              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button
                                  className="btn-press"
                                  onClick={() => dispatchModal({ type: "OPEN_SHARE_WORKOUT", payload: { selectedFriendId: f.id } })}
                                  style={{ ...styles.secondaryBtn, padding: "6px 10px", fontSize: 12 }}
                                >
                                  Share
                                </button>
                                <button
                                  className="btn-press"
                                  onClick={() => {
                                    dispatchModal({
                                      type: "OPEN_CONFIRM",
                                      payload: {
                                        title: "Remove Friend",
                                        message: `Remove @${f.username} from your friends?`,
                                        confirmText: "Remove",
                                        onConfirm: async () => {
                                          await removeFriend(f.friendshipId);
                                          dispatchModal({ type: "CLOSE_CONFIRM" });
                                          refreshSocial();
                                        },
                                      },
                                    });
                                  }}
                                  style={{ ...styles.secondaryBtn, padding: "6px 10px", fontSize: 12, opacity: 0.5 }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Pending Requests */}
                        {socialPending.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>
                              Pending Requests ({socialPending.length})
                            </div>
                            {socialPending.map((r) => (
                              <div
                                key={r.friendshipId}
                                style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  padding: "12px 14px", borderRadius: 12,
                                  background: colors.accentBg,
                                  border: `1px solid ${colors.accentBorder}`,
                                }}
                              >
                                <div style={{
                                  width: 32, height: 32, borderRadius: 999,
                                  background: colors.accent + "22", color: colors.accent,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                                  overflow: "hidden",
                                }}>
                                  {r.avatar_url ? (
                                    <img src={r.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: 999, objectFit: "cover" }} />
                                  ) : (
                                    (r.username || "?")[0].toUpperCase()
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                                    @{r.username} wants to be friends
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                  <button
                                    className="btn-press"
                                    onClick={async () => {
                                      await acceptFriendRequest(r.friendshipId);
                                      refreshSocial();
                                      showToast(`You and @${r.username} are now friends!`);
                                    }}
                                    style={{ ...styles.primaryBtn, padding: "6px 12px", fontSize: 12 }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn-press"
                                    onClick={async () => {
                                      await declineFriendRequest(r.friendshipId);
                                      refreshSocial();
                                    }}
                                    style={{ ...styles.secondaryBtn, padding: "6px 10px", fontSize: 12 }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Inbox sub-tab */
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {socialLoading && socialInbox.length === 0 && (
                          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>Loading...</div>
                        )}
                        {socialInbox.length === 0 && !socialLoading ? (
                          <div style={{ textAlign: "center", padding: 20, opacity: 0.5, fontSize: 13 }}>
                            No shared workouts yet
                          </div>
                        ) : (
                          socialInbox.map((sw) => {
                            const workout = sw.workout_snapshot;
                            const fromUser = sw.from_profile;
                            const isPending = sw.status === "pending";
                            return (
                              <div
                                key={sw.id}
                                style={{
                                  padding: "12px 14px", borderRadius: 12,
                                  background: isPending ? colors.cardBg : colors.subtleBg,
                                  border: `1px solid ${isPending ? colors.accentBorder : colors.border}`,
                                  opacity: isPending ? 1 : 0.6,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                  <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>
                                    {workout?.name || "Workout"}
                                  </span>
                                  {!isPending && (
                                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.5 }}>
                                      {sw.status === "accepted" ? "Added" : "Dismissed"}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: sw.message ? 4 : 0 }}>
                                  from @{fromUser?.username || "unknown"} · {formatSocialTime(sw.created_at)}
                                </div>
                                {sw.message && (
                                  <div style={{ fontSize: 13, fontStyle: "italic", opacity: 0.7, marginBottom: 8 }}>
                                    "{sw.message}"
                                  </div>
                                )}
                                {isPending && (
                                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <button
                                      className="btn-press"
                                      onClick={() => dispatchModal({ type: "OPEN_WORKOUT_PREVIEW", payload: { sharedWorkout: sw } })}
                                      style={{ ...styles.primaryBtn, padding: "8px 14px", fontSize: 12 }}
                                    >
                                      Preview
                                    </button>
                                    <button
                                      className="btn-press"
                                      onClick={async () => {
                                        await dismissSharedWorkout(sw.id);
                                        refreshSocial();
                                      }}
                                      style={{ ...styles.secondaryBtn, padding: "8px 14px", fontSize: 12 }}
                                    >
                                      Dismiss
                                    </button>
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
              })()}
            </div>
          ) : null}
        </div>

        {/* FAB + Panel for Today tab */}
        {tab === "train" && (
          <>
            {fabOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 39 }}
                  onClick={() => setFabOpen(false)} />
                <div style={{
                  ...styles.fabPanel,
                  animation: "fabPanelIn 0.2s ease-out",
                }}>
                  <div style={{
                    padding: "14px 16px", fontWeight: 700, fontSize: 15,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}>
                    Add to today
                  </div>
                  <div style={{ maxHeight: "calc(60vh - 50px)", overflowY: "auto", padding: "8px 12px" }}>
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
            {!fabOpen && (
              <div style={{
                position: "fixed",
                bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
                right: "max(88px, calc(50vw - 302px))",
                background: colors.cardBg,
                color: colors.accent,
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                opacity: fabVisible ? 1 : 0.3,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
                zIndex: 40,
                fontFamily: "inherit",
              }}>
                Add session
              </div>
            )}
            <button style={{
              ...styles.fab,
              opacity: fabOpen ? 0 : fabVisible ? 1 : 0.3,
              transform: fabOpen ? "scale(0)" : "scale(1)",
              pointerEvents: fabOpen ? "none" : "auto",
              "--fab-glow": colors.accent + "AA",
              ...((!fabOpen && !hasSessions) ? { animation: "fabGlow 2.5s ease-in-out infinite" } : {}),
            }} onClick={() => setFabOpen(true)} aria-label="Add workout to today">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </>
        )}

        {/* Bottom navigation */}
        <div style={styles.nav}>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "train" ? styles.navBtnActive : {}) }} onClick={() => setTab("train")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16" /><rect x="2" y="8" width="4" height="8" rx="1" /><rect x="18" y="8" width="4" height="8" rx="1" /><rect x="6" y="6" width="3" height="12" rx="1" /><rect x="15" y="6" width="3" height="12" rx="1" />
            </svg>
            Today
          </button>
          <button className="nav-press btn-press" style={{ ...styles.navBtn, ...(tab === "progress" ? styles.navBtnActive : {}) }} onClick={() => setTab("progress")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="8.5" ry="8" />
            </svg>
            Sessions
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
          let logExercise = null;
          for (const wk of state.program.workouts) {
            const found = wk.exercises.find((e) => e.id === logCtx?.exerciseId);
            if (found) { logExercise = found; break; }
          }
          if (!logExercise) {
            const dailyWs = Object.values(state.dailyWorkouts || {}).flat();
            for (const wk of dailyWs) {
              const found = (wk.exercises || []).find((e) => e.id === logCtx?.exerciseId);
              if (found) { logExercise = found; break; }
            }
          }
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
          let hExObj = null;
          if (hEx) {
            for (const wk of state.program.workouts) {
              hExObj = wk.exercises.find((e) => e.id === hEx);
              if (hExObj) break;
            }
            if (!hExObj) {
              for (const wk of Object.values(state.dailyWorkouts || {}).flat()) {
                hExObj = (wk.exercises || []).find((e) => e.id === hEx);
                if (hExObj) break;
              }
            }
          }
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
                el.scrollIntoView({ block: "center", behavior: "smooth" });
              }, 120);
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
              const ss = state.logsByDate[dateKey]?.[logCtx?.exerciseId]?.sets;
              const firstUncompleted = modals.log.sets.findIndex((_, idx) => !(ss && idx < ss.length && isSetCompleted(ss[idx])));
              return modals.log.sets.map((s, i) => {
              const isBW = String(s.weight).toUpperCase() === "BW";
              const savedSets = ss;
              const isSetSaved = savedSets && i < savedSets.length && isSetCompleted(savedSets[i]);
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
                          completeSet(logCtx.exerciseId, i, setPayload, logCtx.workoutId);
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
              savedSets={state.logsByDate[dateKey]?.[logCtx?.exerciseId]?.sets || []}
              onTimerComplete={(setIndex, seconds) => {
                const newSets = [...modals.log.sets];
                newSets[setIndex] = { ...newSets[setIndex], reps: seconds };
                dispatchModal({ type: "UPDATE_LOG_SETS", payload: newSets });
                completeSet(logCtx.exerciseId, setIndex, { reps: seconds, weight: "" }, logCtx.workoutId);
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
                setTab("program");
              }}
            >
              Save
            </button>
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
        backOverrideRef={backOverrideRef}
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
        catalog={fullCatalog}
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
        session={session}
        onLogout={onLogout}
        onSave={saveProfile}
        styles={styles}
        summaryStats={profileStats}
        colors={colors}
        preferences={state.preferences}
        onUpdatePreference={updatePreference}
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={modals.changePassword.isOpen}
        modalState={modals.changePassword}
        dispatch={dispatchModal}
        session={session}
        styles={styles}
        colors={colors}
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
              <div style={{ fontSize: 16, fontWeight: 700 }}>Free Plan</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>Your current plan</div>
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: colors.accent, color: "#fff",
            }}>Active</div>
          </div>

          <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.5 }}>
            Pro plans coming soon with unlimited AI coaching, advanced analytics, and more.
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

      {/* Edit Workout Modal */}
      {modals.editWorkout && (
        <Modal
          open={modals.editWorkout.isOpen}
          title="Edit Workout"
          onClose={() => dispatchModal({ type: "CLOSE_EDIT_WORKOUT" })}
          styles={styles}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
              <label style={styles.label}>Category</label>
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
            <div style={styles.modalFooter}>
              <button className="btn-press" style={styles.secondaryBtn} onClick={() => dispatchModal({ type: "CLOSE_EDIT_WORKOUT" })}>
                Cancel
              </button>
              <button className="btn-press" style={styles.primaryBtn} onClick={saveEditWorkout}>
                Save
              </button>
            </div>
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
          styles={styles}
          colors={colors}
          catalog={fullCatalog}
        />
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
      />

      {/* Generate Today Modal */}
      <GenerateTodayModal
        open={modals.generateToday.isOpen}
        todayState={modals.generateToday}
        dispatch={dispatchModal}
        onGenerate={handleGenerateToday}
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
// SOCIAL HELPERS
// ============================================================================

function formatSocialTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
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

function ExerciseMenu({ isOverridden, onSwapExercise, onSkipExercise, onUndoOverride, onPromoteOverride, exerciseId, originalExerciseId, colors }) {
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
          {isOverridden ? (
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

function ExerciseRow({ workoutId, exercise, logsForDate, openLog, deleteLogForExercise, styles, findPrior, onDeleteExercise, workoutScheme, weightLabel, colors, onSwapExercise, onSkipExercise, isOverridden, onUndoOverride, onPromoteOverride, originalExerciseId }) {
  const exLog = logsForDate[exercise.id] ?? null;
  const hasAnySets = !!exLog && Array.isArray(exLog.sets) && exLog.sets.length > 0;
  const exUnit = getUnit(exercise.unit, exercise);

  const completedSets = hasAnySets ? exLog.sets.filter((s) => isSetCompleted(s)) : [];
  const hasLog = completedSets.length > 0;
  const templateSets = findPrior ? (findPrior(exercise.id)?.sets || []) : [];
  const schemeStr = exercise.scheme || workoutScheme || null;
  const schemeSets = schemeStr ? (parseScheme(schemeStr)?.sets || 0) : 0;
  const totalSets = Math.max(templateSets.length, hasAnySets ? exLog.sets.length : 0, schemeSets);
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
          {getSportIconUrl(exercise.name) && (
            <img
              src={getSportIconUrl(exercise.name)}
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
          {(onSwapExercise || isOverridden) && (
            <ExerciseMenu
              isOverridden={isOverridden}
              onSwapExercise={onSwapExercise}
              onSkipExercise={onSkipExercise}
              onUndoOverride={onUndoOverride}
              onPromoteOverride={onPromoteOverride}
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
      {hasLog && setsText ? <div style={styles.exerciseSub}>{setsText}</div> : null}
    </div>
  );
}

function WorkoutCard({ workout, collapsed, onToggle, logsForDate, openLog, deleteLogForExercise, styles, daily, onDelete, findPrior, onDeleteExercise, colors, onToggleRestTimer, globalRestEnabled, weightLabel, onStartCircuit, onSwapExercise, onSkipExercise, overrides, onUndoOverride, onPromoteOverride, cardId, onRemoveFromToday, highlightBorder }) {
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
                  onSwapExercise={!isSwapReplacement ? onSwapExercise : undefined}
                  onSkipExercise={!isSwapReplacement ? onSkipExercise : undefined}
                  isOverridden={isSwapReplacement}
                  onUndoOverride={isSwapReplacement ? onUndoOverride : undefined}
                  onPromoteOverride={isSwapReplacement ? onPromoteOverride : undefined}
                  originalExerciseId={origExId}
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

function SummaryBlock({ workout, collapsed, onToggle, summaryRange, computeExerciseSummary, styles, colors }) {
  const cat = (workout.category || "Workout").trim();

  // Pre-compute summaries to split active vs inactive
  const exSummaries = workout.exercises.map((ex) => {
    const exUnit = getUnit(ex.unit, ex);
    const s = computeExerciseSummary(ex.id, summaryRange.start, summaryRange.end, exUnit);
    return { ex, exUnit, s };
  });
  const active = exSummaries.filter((e) => e.s.sessions > 0);
  const inactiveCount = exSummaries.length - active.length;

  return (
    <div className="card-hover" style={styles.card}>
      <div style={collapsed ? { ...styles.cardHeader, marginBottom: 0 } : styles.cardHeader} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <div style={styles.cardTitle}>{workout.name}</div>
          <span style={styles.tagMuted}>{cat}</span>
        </div>
        {active.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.45, whiteSpace: "nowrap" }}>
            {active.length}/{exSummaries.length}
          </span>
        )}
        <span style={styles.collapseToggle}>
            {collapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            )}
          </span>
      </div>

      {!collapsed && (
        workout.exercises.length === 0 ? (
          <div style={styles.emptyText}>No exercises yet.</div>
        ) : active.length === 0 ? (
          <div style={{ fontSize: 13, opacity: 0.5, padding: "4px 0" }}>No activity this period</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {active.map(({ ex, exUnit, s }) => {
              const strength = exUnit.key === "reps";
              return (
                <div key={ex.id} style={{
                  ...styles.summaryRow,
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ ...styles.exerciseName, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>{ex.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, whiteSpace: "nowrap", marginLeft: 8 }}>
                      {s.sessions}x
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={styles.summaryChip}>{s.totalReps} {exUnit.abbr}</span>
                    <span style={{ ...styles.summaryChip, background: "transparent", border: `1px solid ${colors.border}`, color: colors.text }}>{s.totalSets} sets</span>
                    {strength && s.maxWeight !== "\u2014" && (
                      <span style={{ ...styles.summaryChip, background: "transparent", border: `1px solid ${colors.border}`, color: colors.text }}>Best: {s.maxWeight}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {inactiveCount > 0 && (
              <div style={{ fontSize: 12, opacity: 0.4, padding: "4px 2px" }}>
                {inactiveCount} exercise{inactiveCount !== 1 ? "s" : ""} with no activity
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
