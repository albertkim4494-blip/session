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
  },
  addExercise: {
    isOpen: false,
    workoutId: null,
    name: "",
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
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
  },
  editExercise: {
    isOpen: false,
    workoutId: null,
    exerciseId: null,
    name: "",
    unit: "reps",
    customUnitAbbr: "",
    customUnitAllowDecimal: false,
  },
  catalogBrowse: {
    isOpen: false,
    workoutId: null,
    query: "",
  },
  welcomeChoice: {
    isOpen: false,
  },
  generateWizard: {
    isOpen: false,
    step: 1,
    daysPerWeek: 3,
    equipment: "gym",
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
    equipment: "gym",
    preview: null,
    loading: false,
    error: null,
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

    // ===== ADD EXERCISE MODAL =====
    case "OPEN_ADD_EXERCISE":
      return {
        ...state,
        addExercise: {
          isOpen: true,
          workoutId: action.payload.workoutId,
          name: "",
          unit: "reps",
          customUnitAbbr: "",
          customUnitAllowDecimal: false,
        },
      };

    case "UPDATE_ADD_EXERCISE":
      return {
        ...state,
        addExercise: { ...state.addExercise, ...action.payload },
      };

    case "CLOSE_ADD_EXERCISE":
      return {
        ...state,
        addExercise: initialModalState.addExercise,
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
    case "OPEN_PROFILE_MODAL":
      return {
        ...state,
        profile: {
          isOpen: true,
          username: action.payload.username || "",
          displayName: action.payload.displayName || "",
          birthdate: action.payload.birthdate || "",
          gender: action.payload.gender || "",
          weightLbs: String(action.payload.weightLbs || ""),
          goal: action.payload.goal || "",
          sports: action.payload.sports || "",
          about: action.payload.about || "",
          avatarUrl: action.payload.avatarUrl || null,
          avatarPreview: null,
          saving: false,
          error: "",
        },
      };

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
          equipment: action.payload?.equipment || "gym",
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
          equipment: action.payload?.equipment || "gym",
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

    // ===== CLOSE ALL (for back-button navigation) =====
    case "CLOSE_ALL":
      return initialModalState;

    default:
      return state;
  }
}
