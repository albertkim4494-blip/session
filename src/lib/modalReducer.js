export const initialModalState = {
  log: {
    isOpen: false,
    context: null, // { workoutId, exerciseId, exerciseName }
    sets: [],
    notes: "",
    mood: null, // -2 | -1 | 0 | 1 | 2
  },
  confirm: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete",
    onConfirm: null,
  },
  input: {
    isOpen: false,
    title: "",
    label: "",
    placeholder: "",
    value: "",
    confirmText: "Save",
    onConfirm: null,
  },
  datePicker: {
    isOpen: false,
    monthCursor: "",
  },
  addWorkout: {
    isOpen: false,
    name: "",
    category: "Workout",
    cadence: { mode: "whenever" },
    exercises: [],  // staged before Save; each: { id, name, unit, catalogId?, customUnitAbbr?, customUnitAllowDecimal?, bodyweight? }
  },
  addSuggestion: {
    isOpen: false,
    exerciseName: "",
  },
  profile: {
    isOpen: false,
    username: "",
    displayName: "",
    birthdate: "",
    gender: "",
    weightLbs: "",
    heightInches: "",
    goal: "",
    sports: "",
    about: "",
    avatarUrl: null,
    avatarPreview: null,
    saving: false,
    error: "",
  },
  changeUsername: {
    isOpen: false,
    value: "",
    checking: false,
    error: "",
    cooldownMs: 0,
  },
  changePassword: {
    isOpen: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    saving: false,
    error: "",
    success: false,
  },
  editWorkout: {
    isOpen: false,
    workoutId: null,
    name: "",
    category: "Workout",
    cadence: { mode: "whenever" },
  },
  workoutDetail: {
    isOpen: false,
    workoutId: null,
    reorderExercises: false,
  },
  editSplit: {
    isOpen: false,
    splitId: null,           // null for new split
    name: "",
    mode: "weekly",          // "weekly" | "continuous"
    members: [],             // [{ workoutId, days[] }] — staged here, persisted on Save
    restPattern: null,       // { type: "afterCycle", days: 1 } | null
  },
  splitDetail: {
    isOpen: false,
    splitId: null,
  },
  continuousConflict: {
    isOpen: false,
    pickedWorkoutId: null,
    pickedWorkoutName: "",
    splitId: null,
    splitName: "",
    nextUpWorkoutId: null,
    nextUpWorkoutName: "",
  },
  editExercise: {
    isOpen: false,
    workoutId: null,
    exerciseId: null,
    name: "",
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
    catalogId: null,
    originalName: "",
    originalUnit: "",
  },
  catalogBrowse: {
    isOpen: false,
    workoutId: null,
    query: "",
    swapMode: false,
    swapExerciseId: null,
    swapExerciseName: null,
    swapSource: null,         // { catalogId, name, unit } of the exercise being swapped — powers smart-swap suggestions
    swapIsDaily: false,
    sessionAddMode: false,
    sessionAddIsDaily: false,
    stageInAddWorkout: false,  // when true, selections stage into addWorkout.exercises instead of mutating state
  },
  billing: {
    isOpen: false,
  },
  welcomeChoice: {
    isOpen: false,
  },
  generateWizard: {
    isOpen: false,
    step: 1,
    daysPerWeek: 3,
    equipment: ["full_gym"],
    duration: 60,
    preview: null,
    loading: false,
    error: null,
    sportDays: [],
    welcome: false,
  },
  generateToday: {
    isOpen: false,
    step: 1,
    duration: 60,
    equipment: ["full_gym"],
    preview: null,
    loading: false,
    error: null,
  },
  customExercise: {
    isOpen: false,
    workoutId: null,
    name: "",
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
    enriching: false,
    enriched: false,
    enrichError: null,
    muscles: { primary: [] },
    equipment: [],
    tags: [],
    movement: "",
    catalogId: null,
    gifUrl: null,
  },
  exerciseDetail: { isOpen: false, entry: null, entries: [], flipDir: "left" },
  friendSearch: { isOpen: false, query: "", results: [], searching: false },
  shareWorkout: {
    isOpen: false, workoutId: null, workoutName: "",
    friends: [], selectedFriendId: null, message: "", sending: false,
  },
  workoutPreview: { isOpen: false, sharedWorkout: null, importing: false },
  importPreview: { isOpen: false, format: null, sessions: [], stats: null, importData: null, mode: "merge" },
  restoreHistory: {
    isOpen: false,
    snapshots: [],
    loading: false,
    expandedId: null,
    confirmId: null,
    restoring: false,
    error: "",
  },
};

export function modalReducer(state, action) {
  switch (action.type) {
    // ===== LOG MODAL =====
    case "OPEN_LOG":
      return {
        ...state,
        log: {
          isOpen: true,
          context: action.payload.context,
          sets: action.payload.sets,
          notes: action.payload.notes,
          mood: action.payload.mood ?? null,
        },
      };

    case "UPDATE_LOG_SETS":
      return {
        ...state,
        log: { ...state.log, sets: action.payload },
      };

    case "UPDATE_LOG_NOTES":
      return {
        ...state,
        log: { ...state.log, notes: action.payload },
      };

    case "UPDATE_LOG_MOOD":
      return {
        ...state,
        log: { ...state.log, mood: action.payload },
      };

    case "COMPLETE_LOG_SET": {
      const { setIndex } = action.payload;
      const newSets = [...state.log.sets];
      while (newSets.length <= setIndex) newSets.push({ reps: 0, weight: "", completed: false });
      newSets[setIndex] = { ...newSets[setIndex], completed: true };
      return { ...state, log: { ...state.log, sets: newSets } };
    }

    case "UNCOMPLETE_LOG_SET": {
      const { setIndex } = action.payload;
      const newSets = [...state.log.sets];
      if (setIndex < newSets.length) {
        newSets[setIndex] = { ...newSets[setIndex], completed: false };
      }
      return { ...state, log: { ...state.log, sets: newSets } };
    }

    case "CLOSE_LOG":
      return {
        ...state,
        log: initialModalState.log,
      };

    // ===== CONFIRM MODAL =====
    case "OPEN_CONFIRM":
      return {
        ...state,
        confirm: {
          isOpen: true,
          title: action.payload.title,
          message: action.payload.message,
          confirmText: action.payload.confirmText || "Delete",
          onConfirm: action.payload.onConfirm,
        },
      };

    case "CLOSE_CONFIRM":
      return {
        ...state,
        confirm: initialModalState.confirm,
      };

    // ===== INPUT MODAL =====
    case "OPEN_INPUT":
      return {
        ...state,
        input: {
          isOpen: true,
          title: action.payload.title,
          label: action.payload.label,
          placeholder: action.payload.placeholder,
          value: action.payload.initialValue || "",
          confirmText: action.payload.confirmText || "Save",
          onConfirm: action.payload.onConfirm,
        },
      };

    case "UPDATE_INPUT_VALUE":
      return {
        ...state,
        input: { ...state.input, value: action.payload },
      };

    case "CLOSE_INPUT":
      return {
        ...state,
        input: initialModalState.input,
      };

    // ===== DATE PICKER =====
    case "OPEN_DATE_PICKER":
      return {
        ...state,
        datePicker: {
          isOpen: true,
          monthCursor: action.payload.monthCursor,
        },
      };

    case "UPDATE_MONTH_CURSOR":
      return {
        ...state,
        datePicker: { ...state.datePicker, monthCursor: action.payload },
      };

    case "CLOSE_DATE_PICKER":
      return {
        ...state,
        datePicker: { ...state.datePicker, isOpen: false },
      };

    // ===== ADD WORKOUT MODAL =====
    case "OPEN_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: {
          isOpen: true,
          name: "",
          category: "Workout",
        },
      };

    case "UPDATE_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: { ...state.addWorkout, ...action.payload },
      };

    case "CLOSE_ADD_WORKOUT":
      return {
        ...state,
        addWorkout: initialModalState.addWorkout,
      };

    // ===== ADD SUGGESTION =====
    case "OPEN_ADD_SUGGESTION":
      return {
        ...state,
        addSuggestion: {
          isOpen: true,
          exerciseName: action.payload.exerciseName,
        },
      };

    case "CLOSE_ADD_SUGGESTION":
      return {
        ...state,
        addSuggestion: initialModalState.addSuggestion,
      };

    // ===== CATALOG BROWSE MODAL =====
    case "OPEN_CATALOG_BROWSE":
      return {
        ...state,
        catalogBrowse: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          query: "",
          swapMode: action.payload.swapMode || false,
          swapExerciseId: action.payload.swapExerciseId || null,
          swapExerciseName: action.payload.swapExerciseName || null,
          swapSource: action.payload.swapSource || null,
          swapIsDaily: action.payload.swapIsDaily || false,
          sessionAddMode: action.payload.sessionAddMode || false,
          sessionAddIsDaily: action.payload.sessionAddIsDaily || false,
          stageInAddWorkout: action.payload.stageInAddWorkout || false,
        },
      };

    case "UPDATE_CATALOG_BROWSE":
      return {
        ...state,
        catalogBrowse: { ...state.catalogBrowse, ...action.payload },
      };

    case "CLOSE_CATALOG_BROWSE":
      return {
        ...state,
        catalogBrowse: initialModalState.catalogBrowse,
      };

    // ===== EDIT WORKOUT MODAL =====
    case "OPEN_EDIT_WORKOUT":
      return {
        ...state,
        editWorkout: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          name: action.payload.name,
          category: action.payload.category || "Workout",
          cadence: action.payload.cadence || { mode: "whenever" },
        },
      };

    case "UPDATE_EDIT_WORKOUT":
      return {
        ...state,
        editWorkout: { ...state.editWorkout, ...action.payload },
      };

    case "CLOSE_EDIT_WORKOUT":
      return {
        ...state,
        editWorkout: initialModalState.editWorkout,
      };

    // ===== WORKOUT DETAIL SHEET =====
    case "OPEN_WORKOUT_DETAIL":
      return {
        ...state,
        workoutDetail: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          reorderExercises: false,
        },
      };

    case "UPDATE_WORKOUT_DETAIL":
      return {
        ...state,
        workoutDetail: { ...state.workoutDetail, ...action.payload },
      };

    case "CLOSE_WORKOUT_DETAIL":
      return {
        ...state,
        workoutDetail: initialModalState.workoutDetail,
      };

    // ===== EDIT SPLIT MODAL — name, mode, rest pattern, members (staged) =====
    case "OPEN_EDIT_SPLIT":
      return {
        ...state,
        editSplit: {
          isOpen: true,
          splitId: action.payload?.splitId ?? null,
          name: action.payload?.name ?? "",
          mode: action.payload?.mode ?? "weekly",
          members: Array.isArray(action.payload?.members) ? action.payload.members : [],
          restPattern: action.payload?.restPattern ?? null,
        },
      };

    case "UPDATE_EDIT_SPLIT":
      return {
        ...state,
        editSplit: { ...state.editSplit, ...action.payload },
      };

    case "CLOSE_EDIT_SPLIT":
      return {
        ...state,
        editSplit: initialModalState.editSplit,
      };

    // ===== SPLIT DETAIL SHEET =====
    case "OPEN_SPLIT_DETAIL":
      return {
        ...state,
        splitDetail: { isOpen: true, splitId: action.payload.splitId },
      };

    case "CLOSE_SPLIT_DETAIL":
      return {
        ...state,
        splitDetail: initialModalState.splitDetail,
      };

    // ===== CONTINUOUS CONFLICT MODAL =====
    case "OPEN_CONTINUOUS_CONFLICT":
      return {
        ...state,
        continuousConflict: {
          isOpen: true,
          pickedWorkoutId: action.payload.pickedWorkoutId,
          pickedWorkoutName: action.payload.pickedWorkoutName || "",
          splitId: action.payload.splitId,
          splitName: action.payload.splitName || "",
          nextUpWorkoutId: action.payload.nextUpWorkoutId,
          nextUpWorkoutName: action.payload.nextUpWorkoutName || "",
        },
      };

    case "CLOSE_CONTINUOUS_CONFLICT":
      return {
        ...state,
        continuousConflict: initialModalState.continuousConflict,
      };

    // ===== EDIT EXERCISE MODAL =====
    case "OPEN_EDIT_EXERCISE":
      return {
        ...state,
        editExercise: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          exerciseId: action.payload.exerciseId,
          name: action.payload.name,
          unit: action.payload.unit,
          customUnitAbbr: action.payload.customUnitAbbr || "",
          customUnitAllowDecimal: action.payload.customUnitAllowDecimal ?? false,
          catalogId: action.payload.catalogId || null,
          originalName: action.payload.name,
          originalUnit: action.payload.unit,
        },
      };

    case "UPDATE_EDIT_EXERCISE":
      return {
        ...state,
        editExercise: { ...state.editExercise, ...action.payload },
      };

    case "CLOSE_EDIT_EXERCISE":
      return {
        ...state,
        editExercise: initialModalState.editExercise,
      };

    // ===== PROFILE MODAL =====
    case "OPEN_PROFILE_MODAL": {
      const _initial = {
        displayName: action.payload.displayName || "",
        birthdate: action.payload.birthdate || "",
        gender: action.payload.gender || "",
        weightLbs: String(action.payload.weightLbs || ""),
        heightInches: String(action.payload.heightInches || ""),
        goal: action.payload.goal || "",
        sports: action.payload.sports || "",
        about: action.payload.about || "",
        avatarUrl: action.payload.avatarUrl || null,
      };
      return {
        ...state,
        profile: {
          isOpen: true,
          username: action.payload.username || "",
          ..._initial,
          avatarPreview: null,
          saving: false,
          error: "",
          _initial,
        },
      };
    }

    case "UPDATE_PROFILE_MODAL":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };

    case "CLOSE_PROFILE_MODAL":
      return {
        ...state,
        profile: initialModalState.profile,
      };

    // ===== CHANGE USERNAME MODAL =====
    case "OPEN_CHANGE_USERNAME":
      return {
        ...state,
        changeUsername: {
          isOpen: true,
          value: action.payload.value || "",
          checking: false,
          error: "",
          cooldownMs: action.payload.cooldownMs || 0,
        },
      };

    case "UPDATE_CHANGE_USERNAME":
      return {
        ...state,
        changeUsername: { ...state.changeUsername, ...action.payload },
      };

    case "CLOSE_CHANGE_USERNAME":
      return {
        ...state,
        changeUsername: initialModalState.changeUsername,
      };

    // ===== CHANGE PASSWORD MODAL =====
    case "OPEN_CHANGE_PASSWORD":
      return {
        ...state,
        changePassword: {
          isOpen: true,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          saving: false,
          error: "",
          success: false,
        },
      };

    case "UPDATE_CHANGE_PASSWORD":
      return {
        ...state,
        changePassword: { ...state.changePassword, ...action.payload },
      };

    case "CLOSE_CHANGE_PASSWORD":
      return {
        ...state,
        changePassword: initialModalState.changePassword,
      };

    // ===== BILLING MODAL =====
    case "OPEN_BILLING":
      return {
        ...state,
        billing: { isOpen: true },
      };

    case "CLOSE_BILLING":
      return {
        ...state,
        billing: initialModalState.billing,
      };

    // ===== WELCOME CHOICE MODAL =====
    case "OPEN_WELCOME_CHOICE":
      return {
        ...state,
        welcomeChoice: { isOpen: true },
      };

    case "CLOSE_WELCOME_CHOICE":
      return {
        ...state,
        welcomeChoice: initialModalState.welcomeChoice,
      };

    // ===== GENERATE WIZARD MODAL =====
    case "OPEN_GENERATE_WIZARD":
      return {
        ...state,
        generateWizard: {
          ...initialModalState.generateWizard,
          isOpen: true,
          equipment: action.payload?.equipment || ["full_gym"],
          welcome: action.payload?.welcome || false,
        },
      };

    case "UPDATE_GENERATE_WIZARD":
      return {
        ...state,
        generateWizard: { ...state.generateWizard, ...action.payload },
      };

    case "CLOSE_GENERATE_WIZARD":
      return {
        ...state,
        generateWizard: initialModalState.generateWizard,
      };

    // ===== GENERATE TODAY MODAL =====
    case "OPEN_GENERATE_TODAY":
      return {
        ...state,
        generateToday: {
          ...initialModalState.generateToday,
          isOpen: true,
          step: 1,
          equipment: action.payload?.equipment || ["full_gym"],
          duration: action.payload?.duration || 60,
          preview: action.payload?.preview || null,
        },
      };

    case "UPDATE_GENERATE_TODAY":
      return {
        ...state,
        generateToday: { ...state.generateToday, ...action.payload },
      };

    case "CLOSE_GENERATE_TODAY":
      return {
        ...state,
        generateToday: initialModalState.generateToday,
      };

    // ===== CUSTOM EXERCISE MODAL =====
    case "OPEN_CUSTOM_EXERCISE":
      return {
        ...state,
        customExercise: {
          ...initialModalState.customExercise,
          isOpen: true,
          workoutId: action.payload?.workoutId || null,
          name: action.payload?.name || "",
          unit: action.payload?.unit || "reps",
          customUnitAbbr: action.payload?.customUnitAbbr || "",
          customUnitAllowDecimal: action.payload?.customUnitAllowDecimal || false,
          editExerciseId: action.payload?.editExerciseId || null,
          editWorkoutId: action.payload?.editWorkoutId || null,
        },
      };

    case "UPDATE_CUSTOM_EXERCISE":
      return {
        ...state,
        customExercise: { ...state.customExercise, ...action.payload },
      };

    case "CLOSE_CUSTOM_EXERCISE":
      return {
        ...state,
        customExercise: initialModalState.customExercise,
      };

    // ===== EXERCISE DETAIL MODAL =====
    case "OPEN_EXERCISE_DETAIL":
      return {
        ...state,
        exerciseDetail: {
          isOpen: true,
          entry: action.payload.entry,
          entries: action.payload.entries || [],
          flipDir: action.payload.flipDir || "left",
        },
      };

    case "CLOSE_EXERCISE_DETAIL":
      return {
        ...state,
        exerciseDetail: initialModalState.exerciseDetail,
      };

    // ===== FRIEND SEARCH MODAL =====
    case "OPEN_FRIEND_SEARCH":
      return {
        ...state,
        friendSearch: {
          ...initialModalState.friendSearch,
          isOpen: true,
        },
      };

    case "UPDATE_FRIEND_SEARCH":
      return {
        ...state,
        friendSearch: { ...state.friendSearch, ...action.payload },
      };

    case "CLOSE_FRIEND_SEARCH":
      return {
        ...state,
        friendSearch: initialModalState.friendSearch,
      };

    // ===== SHARE WORKOUT MODAL =====
    case "OPEN_SHARE_WORKOUT":
      return {
        ...state,
        shareWorkout: {
          ...initialModalState.shareWorkout,
          isOpen: true,
          workoutId: action.payload?.workoutId || null,
          workoutName: action.payload?.workoutName || "",
          selectedFriendId: action.payload?.selectedFriendId || null,
        },
      };

    case "UPDATE_SHARE_WORKOUT":
      return {
        ...state,
        shareWorkout: { ...state.shareWorkout, ...action.payload },
      };

    case "CLOSE_SHARE_WORKOUT":
      return {
        ...state,
        shareWorkout: initialModalState.shareWorkout,
      };

    // ===== WORKOUT PREVIEW MODAL =====
    case "OPEN_WORKOUT_PREVIEW":
      return {
        ...state,
        workoutPreview: {
          ...initialModalState.workoutPreview,
          isOpen: true,
          sharedWorkout: action.payload?.sharedWorkout || null,
        },
      };

    case "UPDATE_WORKOUT_PREVIEW":
      return {
        ...state,
        workoutPreview: { ...state.workoutPreview, ...action.payload },
      };

    case "CLOSE_WORKOUT_PREVIEW":
      return {
        ...state,
        workoutPreview: initialModalState.workoutPreview,
      };

    // ===== IMPORT PREVIEW MODAL =====
    case "OPEN_IMPORT_PREVIEW":
      return {
        ...state,
        importPreview: {
          ...initialModalState.importPreview,
          isOpen: true,
          format: action.payload.format,
          sessions: action.payload.sessions,
          stats: action.payload.stats,
          importData: action.payload.importData,
        },
      };

    case "UPDATE_IMPORT_PREVIEW":
      return {
        ...state,
        importPreview: { ...state.importPreview, ...action.payload },
      };

    case "CLOSE_IMPORT_PREVIEW":
      return {
        ...state,
        importPreview: initialModalState.importPreview,
      };

    // ===== RESTORE HISTORY MODAL =====
    case "OPEN_RESTORE_HISTORY":
      return {
        ...state,
        restoreHistory: { ...initialModalState.restoreHistory, isOpen: true, loading: true },
      };

    case "UPDATE_RESTORE_HISTORY":
      return {
        ...state,
        restoreHistory: { ...state.restoreHistory, ...action.payload },
      };

    case "CLOSE_RESTORE_HISTORY":
      return {
        ...state,
        restoreHistory: initialModalState.restoreHistory,
      };

    // ===== CLOSE ALL (for back-button navigation) =====
    case "CLOSE_ALL":
      return initialModalState;

    default:
      return state;
  }
}
