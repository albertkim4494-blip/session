/**
 * Generate exerciseCatalog.js from ExerciseDB data + custom exercises.
 *
 * Reads exercisedb_all.json, transforms each exercise into our catalog format,
 * appends custom exercises (sports, stretches, mobility, etc.), and writes
 * src/lib/exerciseCatalog.js.
 *
 * Usage: node scripts/generate-catalog.js
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = resolve(__dirname, "..", "exercisedb_all.json");
const OUTPUT = resolve(__dirname, "..", "src", "lib", "exerciseCatalog.js");

// ── Muscle mapping ──────────────────────────────────────────────────────────

const MUSCLE_MAP = {
  pectorals: "CHEST",
  chest: "CHEST",
  triceps: "TRICEPS",
  biceps: "BICEPS",
  deltoids: "ANTERIOR_DELT",
  delts: "ANTERIOR_DELT",
  forearms: "FOREARMS",
  "wrist flexors": "FOREARMS",
  "wrist extensors": "FOREARMS",
  "upper back": "BACK",
  lats: "BACK",
  "latissimus dorsi": "BACK",
  trapezius: "BACK",
  traps: "BACK",
  rhomboids: "BACK",
  "lower back": "BACK",
  "levator scapulae": "BACK",
  "serratus anterior": "ABS",
  quadriceps: "QUADS",
  quads: "QUADS",
  hamstrings: "HAMSTRINGS",
  glutes: "GLUTES",
  gluteal: "GLUTES",
  calves: "CALVES",
  soleus: "CALVES",
  abs: "ABS",
  abdominals: "ABS",
  core: "ABS",
  obliques: "OBLIQUES",
  adductors: "QUADS",
  abductors: "GLUTES",
  "hip flexors": "QUADS",
  spine: "BACK",
  shoulders: "ANTERIOR_DELT",
  cardiovascular: "ABS", // cardio exercises, map to something reasonable
};

/**
 * Refine deltoid mapping based on exercise name keywords.
 */
function refineDeltMapping(name, muscle) {
  if (muscle !== "ANTERIOR_DELT") return muscle;
  const lower = name.toLowerCase();
  if (/lateral\s*raise|side\s*raise|side\s*delt/.test(lower)) return "LATERAL_DELT";
  if (/rear|reverse|posterior|face\s*pull/.test(lower)) return "POSTERIOR_DELT";
  return "ANTERIOR_DELT";
}

function mapMuscleList(rawMuscles, exerciseName, excludeSet) {
  const result = [];
  for (const raw of rawMuscles || []) {
    const mapped = MUSCLE_MAP[raw.toLowerCase()] || null;
    if (!mapped) continue;
    const refined = refineDeltMapping(exerciseName, mapped);
    if (!excludeSet.has(refined)) {
      excludeSet.add(refined);
      result.push(refined);
    }
  }
  return result;
}

function mapMuscles(targetMuscles, secondaryMuscles, exerciseName) {
  const seen = new Set();
  const primary = mapMuscleList(targetMuscles, exerciseName, seen);
  const secondary = mapMuscleList(secondaryMuscles, exerciseName, seen);

  // Keep raw ExerciseDB names for detailed display
  const targetRaw = (targetMuscles || []).map((m) => m.toLowerCase());
  const secondaryRaw = (secondaryMuscles || []).map((m) => m.toLowerCase());

  return {
    primary: primary.length > 0 ? primary : ["ABS"],
    secondary,
    targetRaw,
    secondaryRaw,
  };
}

// ── Equipment mapping ───────────────────────────────────────────────────────

const EQUIPMENT_MAP = {
  "body weight": "bodyweight",
  barbell: "barbell",
  dumbbell: "dumbbell",
  cable: "cable",
  kettlebell: "kettlebell",
  "leverage machine": "machine",
  "smith machine": "machine",
  "sled machine": "machine",
  "hammer": "machine",
  "ez barbell": "barbell",
  "trap bar": "barbell",
  "olympic barbell": "barbell",
  band: "bodyweight",
  "resistance band": "bodyweight",
  "stability ball": "bodyweight",
  "bosu ball": "bodyweight",
  "wheel roller": "ab wheel",
  roller: "ab wheel",
  rope: "cable",
  "medicine ball": "dumbbell",
  weighted: "dumbbell",
  "skierg machine": "machine",
  "stationary bike": "machine",
  "elliptical machine": "machine",
  "stepmill machine": "machine",
  "upper body ergometer": "machine",
  assisted: "machine",
  "tire": "bodyweight",
};

function mapEquipment(equipments) {
  const result = [];
  const seen = new Set();
  for (const raw of equipments || []) {
    const mapped = EQUIPMENT_MAP[raw.toLowerCase()] || raw.toLowerCase();
    if (!seen.has(mapped)) {
      seen.add(mapped);
      result.push(mapped);
    }
  }
  return result;
}

// ── Movement mapping (from bodyParts) ───────────────────────────────────────

const BODY_PART_TO_MOVEMENT = {
  chest: "push",
  back: "pull",
  "upper legs": "legs",
  "lower legs": "legs",
  shoulders: "shoulders",
  "upper arms": "arms",
  "lower arms": "arms",
  waist: "core",
  cardio: "cardio",
  neck: "core",
};

function mapMovement(bodyParts) {
  for (const bp of bodyParts || []) {
    const m = BODY_PART_TO_MOVEMENT[bp.toLowerCase()];
    if (m) return m;
  }
  return "core"; // fallback
}

// ── Tags ────────────────────────────────────────────────────────────────────

function buildTags(entry, muscles, equipment, movement) {
  const tags = [];

  // compound vs isolation
  if (muscles.length >= 2) tags.push("compound");
  else tags.push("isolation");

  // movement-based tags
  if (movement === "push") tags.push("push");
  if (movement === "pull") tags.push("pull");
  if (movement === "legs") tags.push("legs");
  if (movement === "core") tags.push("core");

  // equipment-based
  if (equipment.includes("bodyweight") && equipment.length === 1) tags.push("bodyweight");

  // cardio detection
  const lower = entry.name.toLowerCase();
  if ((entry.bodyParts || []).some((b) => b.toLowerCase() === "cardio") || /cardio|run|jog|cycle|spin|elliptical|stair/.test(lower)) {
    tags.push("cardio");
  }

  return tags;
}

// ── Default unit ────────────────────────────────────────────────────────────

function getDefaultUnit(entry) {
  const lower = entry.name.toLowerCase();
  const bodyParts = (entry.bodyParts || []).map((b) => b.toLowerCase());

  // Cardio exercises
  if (bodyParts.includes("cardio") || /running|cycling|walking|swimming|rowing|elliptical|stair|ski erg|bike/.test(lower)) {
    return "min";
  }

  // Isometric holds
  if (/hold|plank|hang|sit\b.*wall|isometric|l-sit|hollow/.test(lower)) {
    return "sec";
  }

  return "reps";
}

// ── Title case ──────────────────────────────────────────────────────────────

function toTitleCase(str) {
  const small = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "of", "in", "with", "vs"]);
  return str
    .split(/\s+/)
    .map((word, i) => {
      if (word.length === 0) return word;
      // Always capitalize first word
      if (i === 0 || !small.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
}

// ── Custom exercises (sports, stretches, mobility, etc.) ────────────────────

const CUSTOM_EXERCISES = [
  // OLYMPIC LIFTS
  { id: "custom-clean", name: "Clean", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK"] }, equipment: ["barbell"], aliases: ["power clean", "squat clean"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-clean-hang", name: "Hang Clean", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK"] }, equipment: ["barbell"], aliases: ["hang power clean"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-snatch", name: "Snatch", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK", "ANTERIOR_DELT"] }, equipment: ["barbell"], aliases: ["power snatch", "squat snatch"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-clean-jerk", name: "Clean and Jerk", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell"], aliases: ["clean & jerk", "c&j"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-thruster", name: "Thruster", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["thrusters", "squat to press"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-push-jerk", name: "Push Jerk", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS", "QUADS"] }, equipment: ["barbell"], aliases: ["jerk", "split jerk"], tags: ["compound", "olympic"], movement: "shoulders" },

  // FUNCTIONAL
  { id: "custom-kb-swing", name: "Kettlebell Swing", defaultUnit: "reps", muscles: { primary: ["GLUTES", "HAMSTRINGS", "BACK"] }, equipment: ["kettlebell"], aliases: ["kb swing", "russian swing", "american swing"], tags: ["compound", "legs"], movement: "legs" },
  { id: "custom-kb-snatch", name: "Kettlebell Snatch", defaultUnit: "reps", muscles: { primary: ["GLUTES", "BACK", "ANTERIOR_DELT"] }, equipment: ["kettlebell"], aliases: ["kb snatch"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "custom-kb-clean-press", name: "Kettlebell Clean and Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "GLUTES", "BACK"] }, equipment: ["kettlebell"], aliases: ["kb clean press"], tags: ["compound"], movement: "shoulders" },
  { id: "custom-turkish-getup", name: "Turkish Get Up", defaultUnit: "reps", muscles: { primary: ["ABS", "ANTERIOR_DELT", "GLUTES"] }, equipment: ["kettlebell", "dumbbell"], aliases: ["tgu", "turkish getup"], tags: ["compound"], movement: "core" },
  { id: "custom-sled-push", name: "Sled Push", defaultUnit: "sec", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: ["machine"], aliases: ["prowler push", "sled drive"], tags: ["compound", "legs", "cardio"], movement: "legs" },
  { id: "custom-sled-pull", name: "Sled Pull", defaultUnit: "sec", muscles: { primary: ["BACK", "HAMSTRINGS", "GLUTES"] }, equipment: ["machine"], aliases: ["prowler pull", "sled drag"], tags: ["compound", "legs", "cardio"], movement: "legs" },
  { id: "custom-tire-flip", name: "Tire Flip", defaultUnit: "reps", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["tire flips"], tags: ["compound"], movement: "legs" },
  { id: "custom-battle-rope", name: "Battle Ropes", defaultUnit: "sec", muscles: { primary: ["ANTERIOR_DELT", "ABS"] }, equipment: ["bodyweight"], aliases: ["battle rope", "rope slams", "rope waves"], tags: ["cardio", "compound"], movement: "cardio" },
  { id: "custom-cable-face-pull", name: "Cable Face Pull", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT"], secondary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["face pull", "rope face pull", "cable rope face pull"], tags: ["compound", "pull"], movement: "pull", gifUrl: "https://static.exercisedb.dev/media/ZfyAGhK.gif" },

  // CARDIO
  { id: "custom-run", name: "Running", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES"] }, equipment: [], aliases: ["run", "jog", "jogging", "treadmill run"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-run-outdoor", name: "Outdoor Running", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES"] }, equipment: [], aliases: ["outdoor run", "road running", "trail running"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-walk", name: "Walking", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["walk", "treadmill walk", "incline walk"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-walk-incline", name: "Incline Walking", defaultUnit: "min", muscles: { primary: ["GLUTES", "HAMSTRINGS", "CALVES", "QUADS"] }, equipment: ["machine"], aliases: ["incline treadmill", "treadmill incline walk"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-bike-outdoor", name: "Outdoor Cycling", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES"] }, equipment: [], aliases: ["road bike", "bike ride", "cycling outdoor"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-swim", name: "Swimming", defaultUnit: "min", muscles: { primary: ["BACK", "CHEST", "ANTERIOR_DELT", "ABS", "QUADS"] }, equipment: [], aliases: ["swim", "laps swimming"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-swim-laps", name: "Lap Swimming", defaultUnit: "laps", muscles: { primary: ["BACK", "ANTERIOR_DELT", "CHEST", "ABS", "QUADS"] }, equipment: [], aliases: ["swim laps", "pool laps"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-hike", name: "Hiking", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["hike", "trail hike"], tags: ["cardio"], movement: "cardio" },
  { id: "custom-sprints", name: "Sprints", defaultUnit: "sec", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["sprint", "interval sprints"], tags: ["cardio", "hiit"], movement: "cardio" },

  // SPORT / ATHLETIC
  { id: "sp-basketball", name: "Basketball", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "GLUTES", "HAMSTRINGS", "ABS"] }, equipment: [], aliases: ["basketball practice", "hoops"], tags: ["sport"], movement: "sport" },
  { id: "sp-soccer", name: "Soccer", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES", "ABS"] }, equipment: [], aliases: ["soccer practice", "football (soccer)"], tags: ["sport"], movement: "sport" },
  { id: "sp-football", name: "Football", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "CHEST", "ABS"] }, equipment: [], aliases: ["football practice", "american football"], tags: ["sport"], movement: "sport" },
  { id: "sp-tennis", name: "Tennis", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["tennis practice", "tennis match"], tags: ["sport"], movement: "sport" },
  { id: "sp-badminton", name: "Badminton", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS"] }, equipment: [], aliases: ["badminton match", "shuttlecock"], tags: ["sport"], movement: "sport" },
  { id: "sp-table-tennis", name: "Table Tennis", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "ABS", "FOREARMS", "QUADS"] }, equipment: [], aliases: ["ping pong", "table tennis match"], tags: ["sport"], movement: "sport" },
  { id: "sp-pickleball", name: "Pickleball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["pickleball match"], tags: ["sport"], movement: "sport" },
  { id: "sp-racquetball", name: "Racquetball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["racquetball match", "squash"], tags: ["sport"], movement: "sport" },
  { id: "sp-squash", name: "Squash", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["squash match"], tags: ["sport"], movement: "sport" },
  { id: "sp-polo", name: "Water Polo", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "BACK", "QUADS", "ABS", "CHEST", "GLUTES"] }, equipment: [], aliases: ["polo", "water polo practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-volleyball", name: "Volleyball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "GLUTES", "ABS"] }, equipment: [], aliases: ["volleyball practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-baseball", name: "Baseball", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "OBLIQUES", "QUADS", "FOREARMS", "BACK"] }, equipment: [], aliases: ["baseball practice", "batting practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-softball", name: "Softball", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "OBLIQUES", "QUADS", "FOREARMS", "BACK"] }, equipment: [], aliases: ["softball practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-hockey", name: "Hockey", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "ABS", "ANTERIOR_DELT"] }, equipment: [], aliases: ["ice hockey", "hockey practice", "field hockey"], tags: ["sport"], movement: "sport" },
  { id: "sp-lacrosse", name: "Lacrosse", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["lacrosse practice", "lax"], tags: ["sport"], movement: "sport" },
  { id: "sp-rugby", name: "Rugby", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "CHEST", "ABS"] }, equipment: [], aliases: ["rugby practice", "rugby match"], tags: ["sport"], movement: "sport" },
  { id: "sp-cricket", name: "Cricket", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "OBLIQUES", "BACK", "FOREARMS"] }, equipment: [], aliases: ["cricket practice", "cricket match"], tags: ["sport"], movement: "sport" },
  { id: "sp-golf", name: "Golf", defaultUnit: "min", muscles: { primary: ["OBLIQUES", "ABS", "BACK", "GLUTES", "FOREARMS"] }, equipment: [], aliases: ["golf round", "driving range"], tags: ["sport"], movement: "sport" },
  { id: "sp-boxing", name: "Boxing", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "ABS", "TRICEPS", "BACK", "CALVES"] }, equipment: [], aliases: ["boxing training", "heavy bag"], tags: ["sport"], movement: "sport" },
  { id: "sp-kickboxing", name: "Kickboxing", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "HAMSTRINGS"] }, equipment: [], aliases: ["kickboxing class", "muay thai"], tags: ["sport"], movement: "sport" },
  { id: "sp-mma", name: "MMA Training", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "BACK", "GLUTES", "ANTERIOR_DELT"] }, equipment: [], aliases: ["martial arts", "mma"], tags: ["sport"], movement: "sport" },
  { id: "sp-bjj", name: "Brazilian Jiu-Jitsu", defaultUnit: "min", muscles: { primary: ["BACK", "ABS", "GLUTES", "BICEPS", "FOREARMS"] }, equipment: [], aliases: ["bjj", "jiu jitsu", "grappling"], tags: ["sport"], movement: "sport" },
  { id: "sp-karate", name: "Karate", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "ANTERIOR_DELT", "GLUTES", "CALVES"] }, equipment: [], aliases: ["karate practice", "karate class"], tags: ["sport"], movement: "sport" },
  { id: "sp-judo", name: "Judo", defaultUnit: "min", muscles: { primary: ["BACK", "ABS", "GLUTES", "BICEPS", "FOREARMS"] }, equipment: [], aliases: ["judo practice", "judo class"], tags: ["sport"], movement: "sport" },
  { id: "sp-taekwondo", name: "Taekwondo", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "ABS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["tkd", "tae kwon do"], tags: ["sport"], movement: "sport" },
  { id: "sp-wrestling", name: "Wrestling", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "ABS", "GLUTES", "BICEPS"] }, equipment: [], aliases: ["wrestling practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-fencing", name: "Fencing", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "HAMSTRINGS", "ANTERIOR_DELT", "ABS"] }, equipment: [], aliases: ["fencing practice", "epee", "foil", "sabre"], tags: ["sport"], movement: "sport" },
  { id: "sp-climbing", name: "Rock Climbing", defaultUnit: "min", muscles: { primary: ["BACK", "BICEPS", "FOREARMS", "ABS", "ANTERIOR_DELT"] }, equipment: [], aliases: ["climbing", "bouldering", "sport climbing", "indoor climbing"], tags: ["sport"], movement: "sport" },
  { id: "sp-surfing", name: "Surfing", defaultUnit: "min", muscles: { primary: ["BACK", "ANTERIOR_DELT", "ABS", "CHEST", "QUADS"] }, equipment: [], aliases: ["surf", "surf session"], tags: ["sport"], movement: "sport" },
  { id: "sp-skiing", name: "Skiing", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "ABS", "CALVES"] }, equipment: [], aliases: ["ski", "downhill skiing", "alpine skiing"], tags: ["sport"], movement: "sport" },
  { id: "sp-snowboarding", name: "Snowboarding", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "ABS", "CALVES"] }, equipment: [], aliases: ["snowboard"], tags: ["sport"], movement: "sport" },
  { id: "sp-xc-ski", name: "Cross-Country Skiing", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "BACK", "TRICEPS", "ABS"] }, equipment: [], aliases: ["xc skiing", "nordic skiing"], tags: ["sport", "cardio"], movement: "sport" },
  { id: "sp-skateboarding", name: "Skateboarding", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "ABS", "GLUTES"] }, equipment: [], aliases: ["skate", "skating"], tags: ["sport"], movement: "sport" },
  { id: "sp-rowing-sport", name: "Rowing (Sport)", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "BICEPS", "GLUTES", "ABS"] }, equipment: [], aliases: ["crew", "sculling", "rowing team"], tags: ["sport", "cardio"], movement: "sport" },
  { id: "sp-gymnastics", name: "Gymnastics", defaultUnit: "min", muscles: { primary: ["ABS", "QUADS", "ANTERIOR_DELT", "BACK", "CHEST"] }, equipment: [], aliases: ["gymnastics practice", "gymnastics class"], tags: ["sport"], movement: "sport" },
  { id: "sp-dance", name: "Dance", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "GLUTES", "ABS", "HAMSTRINGS"] }, equipment: [], aliases: ["dance class", "dance practice", "dancing", "ballet", "salsa", "hip hop dance"], tags: ["sport"], movement: "sport" },
  { id: "sp-handball", name: "Handball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["handball match"], tags: ["sport"], movement: "sport" },
  { id: "sp-ultimate", name: "Ultimate Frisbee", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "ANTERIOR_DELT", "GLUTES", "ABS"] }, equipment: [], aliases: ["ultimate", "frisbee"], tags: ["sport"], movement: "sport" },
  { id: "sp-crossfit", name: "CrossFit", defaultUnit: "min", muscles: { primary: ["QUADS", "BACK", "ABS", "GLUTES", "ANTERIOR_DELT"] }, equipment: [], aliases: ["crossfit wod", "wod", "metcon"], tags: ["sport"], movement: "sport" },
  { id: "sp-track", name: "Track & Field", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES", "ABS"] }, equipment: [], aliases: ["track practice", "sprinting", "hurdles", "javelin", "shot put"], tags: ["sport"], movement: "sport" },

  // MOBILITY / FLEXIBILITY
  { id: "m-yoga", name: "Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "BACK", "GLUTES"] }, equipment: [], aliases: ["yoga flow", "yoga session"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-yoga-power", name: "Power Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "QUADS", "BACK"] }, equipment: [], aliases: ["power yoga", "vinyasa"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-yoga-hot", name: "Hot Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "BACK", "GLUTES"] }, equipment: [], aliases: ["bikram", "hot yoga class"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-pilates", name: "Pilates", defaultUnit: "min", muscles: { primary: ["ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["pilates class", "mat pilates", "reformer pilates"], tags: ["mobility", "core"], movement: "mobility" },
  { id: "m-foam-roll", name: "Foam Rolling", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["foam roller"], aliases: ["foam roll", "myofascial release"], tags: ["mobility", "recovery"], movement: "mobility" },
  { id: "m-dynamic-warmup", name: "Dynamic Warm-Up", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["warm up", "warmup", "dynamic stretch"], tags: ["mobility"], movement: "mobility" },
  { id: "m-tai-chi", name: "Tai Chi", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "CALVES"] }, equipment: [], aliases: ["tai chi class", "taichi"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-hip-90-90", name: "90/90 Hip Switch", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["hip 90 90", "90 90 stretch", "hip switch"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-worlds-greatest", name: "World's Greatest Stretch", defaultUnit: "reps", muscles: { primary: ["QUADS", "BACK", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["greatest stretch", "wgs"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-shoulder-dislocate", name: "Shoulder Dislocates", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["band pass through", "dowel dislocate", "shoulder pass-through"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-ankle-mobility", name: "Ankle Mobility Drill", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["ankle circles", "ankle dorsiflexion", "wall ankle stretch"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-hip-circles", name: "Hip Circles", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["hip rotations", "standing hip circles"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-thoracic-rotation", name: "Thoracic Rotation", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["t-spine rotation", "open book stretch"], tags: ["mobility", "bodyweight"], movement: "mobility" },

  // STRETCHES — General
  { id: "s-hamstring", name: "Hamstring Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["standing hamstring stretch", "seated hamstring stretch", "toe touch"], tags: ["stretch", "isometric", "bodyweight", "posture"], movement: "stretch" },
  { id: "s-quad", name: "Quad Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["standing quad stretch", "quad pull"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-calf", name: "Calf Stretch", defaultUnit: "sec", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["wall calf stretch", "standing calf stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-glute", name: "Glute Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["pigeon stretch", "figure four stretch", "seated glute stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-pigeon", name: "Pigeon Pose", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["pigeon stretch", "sleeping pigeon"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-lat", name: "Lat Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["overhead lat stretch", "doorway lat stretch", "side lat stretch"], tags: ["stretch", "isometric", "bodyweight", "posture"], movement: "stretch" },
  { id: "s-shoulder-cross", name: "Cross-Body Shoulder Stretch", defaultUnit: "sec", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["cross body stretch", "rear delt stretch", "shoulder stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-tricep-overhead", name: "Overhead Tricep Stretch", defaultUnit: "sec", muscles: { primary: ["TRICEPS"] }, equipment: ["bodyweight"], aliases: ["tricep stretch", "behind head stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-bicep-wall", name: "Wall Bicep Stretch", defaultUnit: "sec", muscles: { primary: ["BICEPS"] }, equipment: ["bodyweight"], aliases: ["bicep stretch", "doorway bicep stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-neck-tilt", name: "Neck Side Tilt Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["neck stretch", "lateral neck stretch", "neck tilt"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-neck-rotation", name: "Neck Rotation Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["neck rotation", "neck turn"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-wrist-flexor", name: "Wrist Flexor Stretch", defaultUnit: "sec", muscles: { primary: ["FOREARMS"] }, equipment: ["bodyweight"], aliases: ["wrist stretch", "forearm flexor stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-wrist-extensor", name: "Wrist Extensor Stretch", defaultUnit: "sec", muscles: { primary: ["FOREARMS"] }, equipment: ["bodyweight"], aliases: ["reverse wrist stretch", "forearm extensor stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-it-band", name: "IT Band Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["iliotibial band stretch", "it band foam roll"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-butterfly", name: "Butterfly Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["groin stretch", "adductor stretch", "seated butterfly"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-straddle", name: "Straddle Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["wide leg stretch", "seated straddle", "middle split"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-frog", name: "Frog Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["frog pose", "groin stretch frog"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-cobra", name: "Cobra Stretch", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["cobra pose", "bhujangasana", "upward facing dog"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-puppy-pose", name: "Puppy Pose", defaultUnit: "sec", muscles: { primary: ["BACK", "CHEST"] }, equipment: ["bodyweight"], aliases: ["extended puppy pose", "melting heart pose"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-thread-needle", name: "Thread the Needle", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["thread needle stretch", "thoracic rotation stretch"], tags: ["stretch", "mobility", "bodyweight"], movement: "stretch" },
  { id: "s-seated-twist", name: "Seated Spinal Twist", defaultUnit: "sec", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["spinal twist", "seated twist", "supine twist"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-scorpion", name: "Scorpion Stretch", defaultUnit: "reps", muscles: { primary: ["ABS", "QUADS"] }, equipment: ["bodyweight"], aliases: ["prone scorpion", "scorpion twist"], tags: ["stretch", "mobility", "bodyweight"], movement: "stretch" },
  { id: "s-sleeper", name: "Sleeper Stretch", defaultUnit: "sec", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["sleeper stretch shoulder", "internal rotation stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-banded-shoulder", name: "Banded Shoulder Stretch", defaultUnit: "sec", muscles: { primary: ["ANTERIOR_DELT", "CHEST"] }, equipment: ["bodyweight"], aliases: ["band shoulder stretch", "resistance band stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-downward-dog", name: "Downward Dog", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "CALVES", "BACK"] }, equipment: ["bodyweight"], aliases: ["down dog", "adho mukha svanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-upward-dog", name: "Upward Dog", defaultUnit: "sec", muscles: { primary: ["ABS", "CHEST"] }, equipment: ["bodyweight"], aliases: ["up dog", "urdhva mukha svanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-standing-pike", name: "Standing Pike Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["forward fold", "standing forward bend", "uttanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-pancake", name: "Pancake Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["pancake fold", "wide straddle forward fold"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },

  // STRETCHES — Kyphosis / Rounded Upper Back
  { id: "s-chest-doorway", name: "Doorway Chest Stretch", defaultUnit: "sec", muscles: { primary: ["CHEST", "ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["pec stretch", "doorway stretch", "chest opener"], tags: ["stretch", "isometric", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-thoracic-ext", name: "Thoracic Extension", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["foam roller"], aliases: ["thoracic spine extension", "upper back extension", "foam roller thoracic"], tags: ["stretch", "isometric", "posture", "kyphosis", "mobility"], movement: "stretch" },
  { id: "s-cat-cow", name: "Cat-Cow Stretch", defaultUnit: "reps", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["cat cow", "cat camel", "spinal flexion extension"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-chin-tuck", name: "Chin Tucks", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["chin tuck", "neck retraction", "cervical retraction"], tags: ["stretch", "posture", "bodyweight", "kyphosis"], movement: "stretch" },
  { id: "s-wall-angel", name: "Wall Angels", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT", "BACK"] }, equipment: ["bodyweight"], aliases: ["wall slide", "wall angel", "scapular wall slide"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-prone-y-raise", name: "Prone Y Raise", defaultUnit: "reps", muscles: { primary: ["BACK", "POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["y raise", "floor y raise", "prone y"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },

  // STRETCHES — Anterior Pelvic Tilt
  { id: "s-hip-flexor", name: "Hip Flexor Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["kneeling hip flexor stretch", "psoas stretch", "lunge stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-couch", name: "Couch Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["wall quad stretch", "elevated hip flexor stretch", "rear foot elevated stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-childs-pose", name: "Child's Pose", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["child's pose", "resting pose", "balasana"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-knee-to-chest", name: "Knee to Chest Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES", "BACK"] }, equipment: ["bodyweight"], aliases: ["single knee to chest", "double knee to chest", "low back stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-pelvic-tilt", name: "Posterior Pelvic Tilts", defaultUnit: "reps", muscles: { primary: ["ABS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["pelvic tilt", "supine pelvic tilt", "lying pelvic tilt"], tags: ["stretch", "mobility", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-glute-bridge", name: "Glute Bridge Hold", defaultUnit: "sec", muscles: { primary: ["GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["bridge hold", "hip bridge hold", "glute bridge"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-dead-hang", name: "Dead Hang", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["pull-up bar"], aliases: ["bar hang", "passive hang", "spinal decompression"], tags: ["stretch", "isometric", "posture", "apt", "kyphosis"], movement: "stretch" },
  { id: "s-happy-baby", name: "Happy Baby", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["happy baby pose", "ananda balasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-supine-twist", name: "Supine Twist", defaultUnit: "sec", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["lying twist", "supine spinal twist"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
];

// ── Main ────────────────────────────────────────────────────────────────────

function transformExercise(ex) {
  const name = toTitleCase(ex.name);
  const muscleData = mapMuscles(ex.targetMuscles, ex.secondaryMuscles, name);
  const equipment = mapEquipment(ex.equipments);
  const movement = mapMovement(ex.bodyParts);
  const tags = buildTags(ex, muscleData.primary, equipment, movement);
  const defaultUnit = getDefaultUnit(ex);

  const muscles = {
    primary: muscleData.primary,
    secondary: muscleData.secondary,
  };
  // Only include raw names if they exist
  if (muscleData.targetRaw.length > 0) muscles.targetRaw = muscleData.targetRaw;
  if (muscleData.secondaryRaw.length > 0) muscles.secondaryRaw = muscleData.secondaryRaw;

  return {
    id: `edb-${ex.exerciseId}`,
    name,
    defaultUnit,
    muscles,
    equipment,
    aliases: [],
    tags,
    movement,
    gifUrl: ex.gifUrl || null,
  };
}

function main() {
  console.log("Reading exercisedb_all.json...");
  const raw = JSON.parse(readFileSync(INPUT, "utf-8"));
  console.log(`Loaded ${raw.length} exercises from ExerciseDB.`);

  // Transform ExerciseDB exercises
  const edbEntries = raw.map(transformExercise);

  // Ensure custom exercises have secondary: [] if not present
  const customWithSecondary = CUSTOM_EXERCISES.map((e) => ({
    ...e,
    muscles: { primary: e.muscles.primary, secondary: e.muscles.secondary || [] },
  }));

  // Combine: ExerciseDB first, then custom
  const all = [...edbEntries, ...customWithSecondary];
  console.log(`Total catalog: ${all.length} entries (${edbEntries.length} ExerciseDB + ${CUSTOM_EXERCISES.length} custom)`);

  // Generate the JS file
  const header = `/**
 * Exercise catalog — auto-generated from ExerciseDB + custom exercises.
 *
 * DO NOT EDIT MANUALLY — regenerate with: node scripts/generate-catalog.js
 *
 * Each entry has: id, name, defaultUnit, muscles{primary[], secondary[], targetRaw?[], secondaryRaw?[]},
 *   equipment[], aliases[], tags[], movement, gifUrl?
 *
 * \`defaultUnit\` values: reps, min, sec, laps
 * \`muscles.primary/secondary\` values: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS,
 *   BACK, BICEPS, FOREARMS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS, OBLIQUES
 *
 * Generated: ${new Date().toISOString().split("T")[0]}
 * ExerciseDB exercises: ${edbEntries.length}
 * Custom exercises: ${CUSTOM_EXERCISES.length}
 */

export const EQUIPMENT_TIERS = {
  home: new Set(["bodyweight"]),
  basic: new Set(["bodyweight", "dumbbell", "kettlebell", "pull-up bar", "dip bar", "bench", "ab wheel", "jump rope", "foam roller"]),
  gym: null, // no filter — all equipment available
};

export const EQUIPMENT_LABELS = {
  home: "Home (no equipment)",
  basic: "Basic (dumbbells, bench, etc.)",
  gym: "Full Gym",
};

/**
 * Check if an exercise is available for a given equipment tier.
 * An exercise matches if ANY of its equipment is in the tier's set,
 * OR if the exercise has no equipment listed (e.g. cardio/sport).
 */
export function exerciseFitsEquipment(entry, tier) {
  const allowed = EQUIPMENT_TIERS[tier];
  if (!allowed) return true; // gym = no filter
  if (!entry.equipment || entry.equipment.length === 0) return true;
  return entry.equipment.some((e) => allowed.has(e));
}

export const EXERCISE_CATALOG = `;

  const catalogJson = JSON.stringify(all, null, 2);
  const content = header + catalogJson + ";\n";

  writeFileSync(OUTPUT, content);
  console.log(`Written to ${OUTPUT} (${(content.length / 1024).toFixed(0)} KB)`);

  // Stats
  const movements = {};
  for (const e of all) {
    movements[e.movement] = (movements[e.movement] || 0) + 1;
  }
  console.log("\nMovement breakdown:");
  for (const [m, c] of Object.entries(movements).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${m}: ${c}`);
  }

  const withGif = all.filter((e) => e.gifUrl).length;
  console.log(`\nWith GIF URL: ${withGif}/${all.length}`);
}

main();
