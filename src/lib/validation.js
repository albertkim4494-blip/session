export function computeAge(birthdateStr) {
  const bd = new Date(birthdateStr + "T00:00:00");
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const m = now.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
  return age;
}

export function isValidBirthdateString(s) {
  if (!s || typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00");
  if (isNaN(d.getTime())) return false;
  if (d > new Date()) return false;
  const age = computeAge(s);
  return age >= 13 && age <= 120;
}

export function validateExerciseName(name, existingExercises = []) {
  const trimmed = (name || "").trim();

  if (!trimmed) {
    return { valid: false, error: "Exercise name cannot be empty" };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Exercise name is too long (max 50 characters)" };
  }

  const isDuplicate = existingExercises.some(
    (ex) => ex.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { valid: false, error: "This exercise already exists in this workout" };
  }

  return { valid: true, error: null };
}

export function validateWorkoutName(name, existingWorkouts = []) {
  const trimmed = (name || "").trim();

  if (!trimmed) {
    return { valid: false, error: "Workout name cannot be empty" };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Workout name is too long (max 50 characters)" };
  }

  const isDuplicate = existingWorkouts.some(
    (w) => w.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { valid: false, error: "A workout with this name already exists" };
  }

  return { valid: true, error: null };
}

export function toNumberOrNull(weightStr) {
  if (typeof weightStr !== "string") return null;
  const t = weightStr.trim();
  if (!t) return null;
  if (t.toUpperCase() === "BW") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatMaxWeight(maxNum, hasBW) {
  if (maxNum != null) return String(maxNum);
  if (hasBW) return "BW";
  return "-";
}
