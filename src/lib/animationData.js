/**
 * Animation data format + constants for 3D exercise viewer.
 *
 * SKELETON CONVENTION (updated):
 *   - Y-up, character faces -Z
 *   - Arms hang DOWN from shoulders in rest pose (LeftArm below LeftShoulder)
 *   - Legs hang DOWN from hips
 *   - Rotations: Euler XYZ in radians
 *     X = pitch (positive = forward/curl toward front)
 *     Y = yaw (positive = rotate left/inward)
 *     Z = roll (positive = tilt right; for left arm: toward body, for right arm: away)
 *
 * Keyframe format:
 *   { duration: seconds, loop: boolean, keyframes: [{ time: 0-1, bones: { Name: [x,y,z] } }] }
 *
 * Last keyframe (time=1.0) must match first (time=0) for smooth loops.
 */

export const BONE_NAMES = [
  "Hips",
  "Spine", "Spine1", "Spine2",
  "Neck", "Head",
  "LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand",
  "RightShoulder", "RightArm", "RightForeArm", "RightHand",
  "LeftUpLeg", "LeftLeg", "LeftFoot",
  "RightUpLeg", "RightLeg", "RightFoot",
];

// ── In-memory animation cache ──────────────────────────────────────────────
const _cache = new Map();
export function getCachedAnimation(key) { return _cache.get(key) ?? null; }
export function setCachedAnimation(key, data) { _cache.set(key, data); }

// ── Helpers ────────────────────────────────────────────────────────────────
const D = Math.PI / 180; // degrees to radians

// Standing rest pose (legs slightly apart, arms at sides)
const STAND = {
  LeftUpLeg: [0, 0, 0],
  LeftLeg: [0, 0, 0],
  LeftFoot: [0, 0, 0],
  RightUpLeg: [0, 0, 0],
  RightLeg: [0, 0, 0],
  RightFoot: [0, 0, 0],
};

// Arms at sides rest
const ARMS_REST = {
  LeftArm: [0, 0, 0],
  LeftForeArm: [0, 0, 0],
  RightArm: [0, 0, 0],
  RightForeArm: [0, 0, 0],
};

// Shorthand for bilateral standing exercises
function standing(armBones) {
  return { ...STAND, ...armBones };
}

// Create a simple 3-keyframe looping animation
function loop3(duration, restBones, peakBones, props) {
  return {
    duration,
    loop: true,
    props: props || [],
    keyframes: [
      { time: 0, bones: { ...restBones } },
      { time: 0.5, bones: { ...peakBones } },
      { time: 1.0, bones: { ...restBones } },
    ],
  };
}

// ── Hardcoded animations ───────────────────────────────────────────────────

export const ANIMATIONS = {

  // ═══════════════════════════════════════════════════════════════════════════
  // PUSH — Chest
  // ═══════════════════════════════════════════════════════════════════════════

  // Barbell Bench Press — lying supine, pressing up
  // Hips rotated to lay body flat; legs counter-rotated to hang down
  "c-bench-flat-bb": {
    duration: 2.4, loop: true, props: ["bench", "barbell"],
    keyframes: [
      { time: 0, bones: {
        Hips: [-90 * D, 0, 0],           // whole body horizontal
        Spine: [5 * D, 0, 0],            // slight arch
        LeftArm: [0, 0, 80 * D],         // arms spread to sides
        LeftForeArm: [90 * D, 0, 0],     // elbows bent
        RightArm: [0, 0, -80 * D],
        RightForeArm: [90 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],   // legs hang down, knees bent
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
      { time: 0.5, bones: {
        Hips: [-90 * D, 0, 0],
        Spine: [3 * D, 0, 0],
        LeftArm: [0, 0, 15 * D],         // arms pushed up (narrower)
        LeftForeArm: [5 * D, 0, 0],      // elbows nearly straight
        RightArm: [0, 0, -15 * D],
        RightForeArm: [5 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
      { time: 1.0, bones: {
        Hips: [-90 * D, 0, 0],
        Spine: [5 * D, 0, 0],
        LeftArm: [0, 0, 80 * D],
        LeftForeArm: [90 * D, 0, 0],
        RightArm: [0, 0, -80 * D],
        RightForeArm: [90 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
    ],
  },

  // Dumbbell Bench Press — same motion, reuse
  "c-bench-flat-db": null, // alias resolved below

  // Push Ups — plank position, arms extend/flex
  "c-pushup": {
    duration: 2.0, loop: true, props: [],
    keyframes: [
      { time: 0, bones: { // top of pushup (plank)
        Spine: [-80 * D, 0, 0],
        LeftArm: [0, 0, 20 * D], LeftForeArm: [0, 0, 0],
        RightArm: [0, 0, -20 * D], RightForeArm: [0, 0, 0],
        LeftUpLeg: [80 * D, 0, 0], LeftLeg: [0, 0, 0],
        RightUpLeg: [80 * D, 0, 0], RightLeg: [0, 0, 0],
        LeftFoot: [-50 * D, 0, 0], RightFoot: [-50 * D, 0, 0],
      }},
      { time: 0.5, bones: { // bottom of pushup
        Spine: [-70 * D, 0, 0],
        LeftArm: [0, 0, 60 * D], LeftForeArm: [90 * D, 0, 0],
        RightArm: [0, 0, -60 * D], RightForeArm: [90 * D, 0, 0],
        LeftUpLeg: [72 * D, 0, 0], LeftLeg: [0, 0, 0],
        RightUpLeg: [72 * D, 0, 0], RightLeg: [0, 0, 0],
        LeftFoot: [-50 * D, 0, 0], RightFoot: [-50 * D, 0, 0],
      }},
      { time: 1.0, bones: {
        Spine: [-80 * D, 0, 0],
        LeftArm: [0, 0, 20 * D], LeftForeArm: [0, 0, 0],
        RightArm: [0, 0, -20 * D], RightForeArm: [0, 0, 0],
        LeftUpLeg: [80 * D, 0, 0], LeftLeg: [0, 0, 0],
        RightUpLeg: [80 * D, 0, 0], RightLeg: [0, 0, 0],
        LeftFoot: [-50 * D, 0, 0], RightFoot: [-50 * D, 0, 0],
      }},
    ],
  },

  // Dumbbell Fly — lying supine, arms arc open/closed
  "c-fly-flat-db": {
    duration: 2.4, loop: true, props: ["bench", "dumbbells"],
    keyframes: [
      { time: 0, bones: { // arms spread wide
        Hips: [-90 * D, 0, 0],
        LeftArm: [0, 0, 85 * D], LeftForeArm: [15 * D, 0, 0],
        RightArm: [0, 0, -85 * D], RightForeArm: [15 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
      { time: 0.5, bones: { // arms together above chest
        Hips: [-90 * D, 0, 0],
        LeftArm: [0, 0, 10 * D], LeftForeArm: [10 * D, 0, 0],
        RightArm: [0, 0, -10 * D], RightForeArm: [10 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
      { time: 1.0, bones: {
        Hips: [-90 * D, 0, 0],
        LeftArm: [0, 0, 85 * D], LeftForeArm: [15 * D, 0, 0],
        RightArm: [0, 0, -85 * D], RightForeArm: [15 * D, 0, 0],
        LeftUpLeg: [90 * D, 0, 0], LeftLeg: [45 * D, 0, 0],
        RightUpLeg: [90 * D, 0, 0], RightLeg: [45 * D, 0, 0],
      }},
    ],
  },

  // Overhead Press / Shoulder Press
  "s-ohp-bb": loop3(2.2,
    standing({
      LeftArm: [-90 * D, 0, 30 * D], LeftForeArm: [150 * D, 0, 0],   // bar at shoulder height
      RightArm: [-90 * D, 0, -30 * D], RightForeArm: [150 * D, 0, 0],
    }),
    standing({
      LeftArm: [-170 * D, 0, 10 * D], LeftForeArm: [5 * D, 0, 0],    // arms overhead
      RightArm: [-170 * D, 0, -10 * D], RightForeArm: [5 * D, 0, 0],
    }),
    ["barbell"]
  ),

  // Lateral Raise
  "s-lateral-raise": loop3(2.0,
    standing(ARMS_REST),
    standing({
      LeftArm: [0, 0, 85 * D], LeftForeArm: [0, 0, 0],   // arms out to sides
      RightArm: [0, 0, -85 * D], RightForeArm: [0, 0, 0],
    }),
    ["dumbbells"]
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // PULL — Back
  // ═══════════════════════════════════════════════════════════════════════════

  // Pull Up
  "b-pullup": loop3(2.4,
    { // hanging
      LeftArm: [-170 * D, 0, 15 * D], LeftForeArm: [0, 0, 0],
      RightArm: [-170 * D, 0, -15 * D], RightForeArm: [0, 0, 0],
      ...STAND,
    },
    { // top
      LeftArm: [-90 * D, 0, 40 * D], LeftForeArm: [140 * D, 0, 0],
      RightArm: [-90 * D, 0, -40 * D], RightForeArm: [140 * D, 0, 0],
      ...STAND,
    },
    ["pullup-bar"]
  ),

  // Chin Up — same motion
  "b-chinup": null,

  // Barbell Row
  "b-row-bb": loop3(2.2,
    { // bent over, arms hanging
      Spine: [45 * D, 0, 0],
      LeftArm: [0, 0, 0], LeftForeArm: [0, 0, 0],
      RightArm: [0, 0, 0], RightForeArm: [0, 0, 0],
      LeftUpLeg: [-15 * D, 0, 0], LeftLeg: [25 * D, 0, 0],
      RightUpLeg: [-15 * D, 0, 0], RightLeg: [25 * D, 0, 0],
    },
    { // rowing up
      Spine: [40 * D, 0, 0],
      LeftArm: [50 * D, 0, 15 * D], LeftForeArm: [100 * D, 0, 0],
      RightArm: [50 * D, 0, -15 * D], RightForeArm: [100 * D, 0, 0],
      LeftUpLeg: [-15 * D, 0, 0], LeftLeg: [25 * D, 0, 0],
      RightUpLeg: [-15 * D, 0, 0], RightLeg: [25 * D, 0, 0],
    },
    ["barbell"]
  ),

  // Dumbbell Row
  "b-row-db": null,

  // Lat Pulldown
  "b-lat-pulldown": loop3(2.2,
    standing({
      LeftArm: [-170 * D, 0, 25 * D], LeftForeArm: [0, 0, 0],
      RightArm: [-170 * D, 0, -25 * D], RightForeArm: [0, 0, 0],
    }),
    standing({
      LeftArm: [-60 * D, 0, 50 * D], LeftForeArm: [130 * D, 0, 0],
      RightArm: [-60 * D, 0, -50 * D], RightForeArm: [130 * D, 0, 0],
    }),
    ["cable-high", "seat"]
  ),

  // Deadlift (Conventional)
  "b-deadlift-conv": loop3(2.8,
    { // bottom: bent over, knees bent
      Spine: [50 * D, 0, 0], Spine1: [5 * D, 0, 0],
      LeftArm: [0, 0, 0], RightArm: [0, 0, 0],
      LeftUpLeg: [-60 * D, 0, 0], LeftLeg: [70 * D, 0, 0],
      RightUpLeg: [-60 * D, 0, 0], RightLeg: [70 * D, 0, 0],
    },
    { // top: standing upright
      Spine: [0, 0, 0], Spine1: [0, 0, 0],
      LeftArm: [0, 0, 0], RightArm: [0, 0, 0],
      ...STAND,
    },
    ["barbell"]
  ),

  // Sumo Deadlift
  "b-deadlift-sumo": null,

  // Face Pull
  "b-face-pull": loop3(2.0,
    standing({
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [0, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [0, 0, 0],
    }),
    standing({
      LeftArm: [-90 * D, 0, 60 * D], LeftForeArm: [120 * D, 0, 0],
      RightArm: [-90 * D, 0, -60 * D], RightForeArm: [120 * D, 0, 0],
    }),
    ["cable-high"]
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGS
  // ═══════════════════════════════════════════════════════════════════════════

  // Barbell Squat
  "l-squat-bb": loop3(2.8,
    { // standing, arms holding bar on back
      LeftArm: [0, 0, 70 * D], LeftForeArm: [110 * D, 0, 0],
      RightArm: [0, 0, -70 * D], RightForeArm: [110 * D, 0, 0],
      ...STAND,
    },
    { // squatting
      Spine: [25 * D, 0, 0],
      LeftArm: [0, 0, 70 * D], LeftForeArm: [110 * D, 0, 0],
      RightArm: [0, 0, -70 * D], RightForeArm: [110 * D, 0, 0],
      LeftUpLeg: [-100 * D, 0, -10 * D], LeftLeg: [110 * D, 0, 0], LeftFoot: [15 * D, 0, 0],
      RightUpLeg: [-100 * D, 0, 10 * D], RightLeg: [110 * D, 0, 0], RightFoot: [15 * D, 0, 0],
    },
    ["barbell"]
  ),

  // Front Squat
  "l-squat-front": loop3(2.8,
    { // arms in front rack position
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [145 * D, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [145 * D, 0, 0],
      ...STAND,
    },
    {
      Spine: [15 * D, 0, 0],
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [145 * D, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [145 * D, 0, 0],
      LeftUpLeg: [-100 * D, 0, -10 * D], LeftLeg: [110 * D, 0, 0],
      RightUpLeg: [-100 * D, 0, 10 * D], RightLeg: [110 * D, 0, 0],
    },
    ["barbell"]
  ),

  // Goblet Squat
  "l-squat-goblet": null, // alias to front squat

  // Bodyweight Squat
  "l-squat-bodyweight": loop3(2.4,
    standing({
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [0, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [0, 0, 0],
    }),
    {
      Spine: [20 * D, 0, 0],
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [0, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [0, 0, 0],
      LeftUpLeg: [-100 * D, 0, -10 * D], LeftLeg: [110 * D, 0, 0],
      RightUpLeg: [-100 * D, 0, 10 * D], RightLeg: [110 * D, 0, 0],
    }
  ),

  // Lunges
  "l-lunge-db": loop3(2.6,
    standing(ARMS_REST),
    { // lunge position
      Spine: [5 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [-80 * D, 0, 0], LeftLeg: [90 * D, 0, 0],
      RightUpLeg: [30 * D, 0, 0], RightLeg: [-100 * D, 0, 0],
    },
    ["dumbbells"]
  ),

  // Reverse Lunges
  "l-lunge-reverse": null,

  // Leg Press — reclined seat, pushing platform away
  "l-leg-press": loop3(2.4,
    { // legs bent
      Hips: [-50 * D, 0, 0],
      LeftUpLeg: [50 * D, 0, -8 * D], LeftLeg: [80 * D, 0, 0],
      RightUpLeg: [50 * D, 0, 8 * D], RightLeg: [80 * D, 0, 0],
    },
    { // legs extended
      Hips: [-50 * D, 0, 0],
      LeftUpLeg: [50 * D, 0, -8 * D], LeftLeg: [10 * D, 0, 0],
      RightUpLeg: [50 * D, 0, 8 * D], RightLeg: [10 * D, 0, 0],
    },
    ["seat"]
  ),

  // Leg Extension
  "l-leg-ext": loop3(2.0,
    { // seated, legs down
      Spine: [-10 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [-90 * D, 0, 0], LeftLeg: [90 * D, 0, 0],
      RightUpLeg: [-90 * D, 0, 0], RightLeg: [90 * D, 0, 0],
    },
    { // legs extended
      Spine: [-10 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [-90 * D, 0, 0], LeftLeg: [5 * D, 0, 0],
      RightUpLeg: [-90 * D, 0, 0], RightLeg: [5 * D, 0, 0],
    },
    ["seat"]
  ),

  // Romanian Deadlift
  "p-rdl-bb": loop3(2.6,
    { // standing
      ...ARMS_REST, ...STAND,
    },
    { // hinged forward
      Spine: [60 * D, 0, 0], Spine1: [5 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [-10 * D, 0, 0], LeftLeg: [10 * D, 0, 0],
      RightUpLeg: [-10 * D, 0, 0], RightLeg: [10 * D, 0, 0],
    },
    ["barbell"]
  ),

  // Dumbbell RDL
  "p-rdl-db": null,

  // Hip Thrust — back against bench, hips drive up
  "p-hip-thrust": loop3(2.2,
    { // hips down — back reclined
      Hips: [-40 * D, 0, 0],
      Spine: [10 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [60 * D, 0, 0], LeftLeg: [60 * D, 0, 0],
      RightUpLeg: [60 * D, 0, 0], RightLeg: [60 * D, 0, 0],
    },
    { // hips up — body roughly flat
      Hips: [-15 * D, 0, 0],
      Spine: [5 * D, 0, 0],
      ...ARMS_REST,
      LeftUpLeg: [15 * D, 0, 0], LeftLeg: [70 * D, 0, 0],
      RightUpLeg: [15 * D, 0, 0], RightLeg: [70 * D, 0, 0],
    },
    ["bench"]
  ),

  // Leg Curl — lying prone (face down)
  "p-leg-curl": loop3(1.8,
    { // lying face down, legs straight
      Hips: [90 * D, 0, 0],             // face down (prone)
      LeftUpLeg: [-90 * D, 0, 0], LeftLeg: [0, 0, 0],
      RightUpLeg: [-90 * D, 0, 0], RightLeg: [0, 0, 0],
    },
    { // legs curled up
      Hips: [90 * D, 0, 0],
      LeftUpLeg: [-90 * D, 0, 0], LeftLeg: [110 * D, 0, 0],
      RightUpLeg: [-90 * D, 0, 0], RightLeg: [110 * D, 0, 0],
    },
    ["bench"]
  ),

  // Calf Raise
  "p-calf-raise-stand": loop3(1.6,
    standing(ARMS_REST),
    { ...STAND, ...ARMS_REST, LeftFoot: [-30 * D, 0, 0], RightFoot: [-30 * D, 0, 0] }
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // ARMS
  // ═══════════════════════════════════════════════════════════════════════════

  // Dumbbell Curl
  "a-curl-db": loop3(2.0,
    standing(ARMS_REST),
    standing({
      LeftArm: [15 * D, 0, 0], LeftForeArm: [140 * D, 0, 0],
      RightArm: [15 * D, 0, 0], RightForeArm: [140 * D, 0, 0],
    }),
    ["dumbbells"]
  ),

  // Barbell Curl
  "a-curl-bb": null,

  // Tricep Pushdown
  "a-tri-pushdown": loop3(1.8,
    standing({
      LeftArm: [15 * D, 0, 10 * D], LeftForeArm: [100 * D, 0, 0],
      RightArm: [15 * D, 0, -10 * D], RightForeArm: [100 * D, 0, 0],
    }),
    standing({
      LeftArm: [15 * D, 0, 10 * D], LeftForeArm: [5 * D, 0, 0],
      RightArm: [15 * D, 0, -10 * D], RightForeArm: [5 * D, 0, 0],
    }),
    ["cable-high"]
  ),

  // Overhead Tricep Extension
  "a-tri-overhead": loop3(2.0,
    standing({
      LeftArm: [-170 * D, 0, 10 * D], LeftForeArm: [130 * D, 0, 0],
      RightArm: [-170 * D, 0, -10 * D], RightForeArm: [130 * D, 0, 0],
    }),
    standing({
      LeftArm: [-170 * D, 0, 10 * D], LeftForeArm: [5 * D, 0, 0],
      RightArm: [-170 * D, 0, -10 * D], RightForeArm: [5 * D, 0, 0],
    }),
    ["dumbbells"]
  ),

  // Dips
  "c-dip-chest": loop3(2.0,
    { // top of dip (arms straight)
      LeftArm: [0, 0, 8 * D], LeftForeArm: [0, 0, 0],
      RightArm: [0, 0, -8 * D], RightForeArm: [0, 0, 0],
      ...STAND,
    },
    { // bottom of dip (arms bent)
      LeftArm: [15 * D, 0, 25 * D], LeftForeArm: [90 * D, 0, 0],
      RightArm: [15 * D, 0, -25 * D], RightForeArm: [90 * D, 0, 0],
      LeftUpLeg: [15 * D, 0, 0], LeftLeg: [-30 * D, 0, 0],
      RightUpLeg: [15 * D, 0, 0], RightLeg: [-30 * D, 0, 0],
    },
    ["dip-bars"]
  ),

  // Tricep Dips (same motion)
  "a-dip-tricep": null,

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOULDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Dumbbell Shoulder Press
  "s-ohp-db": null, // alias to ohp-bb

  // Arnold Press (rotation during press)
  "s-arnold-press": {
    duration: 2.4, loop: true, props: ["dumbbells"],
    keyframes: [
      { time: 0, bones: standing({
        LeftArm: [-90 * D, 0, 0], LeftForeArm: [140 * D, 20 * D, 0],
        RightArm: [-90 * D, 0, 0], RightForeArm: [140 * D, -20 * D, 0],
      })},
      { time: 0.5, bones: standing({
        LeftArm: [-170 * D, 0, 15 * D], LeftForeArm: [5 * D, 0, 0],
        RightArm: [-170 * D, 0, -15 * D], RightForeArm: [5 * D, 0, 0],
      })},
      { time: 1.0, bones: standing({
        LeftArm: [-90 * D, 0, 0], LeftForeArm: [140 * D, 20 * D, 0],
        RightArm: [-90 * D, 0, 0], RightForeArm: [140 * D, -20 * D, 0],
      })},
    ],
  },

  // Front Raise
  "s-front-raise": loop3(2.0,
    standing(ARMS_REST),
    standing({
      LeftArm: [-90 * D, 0, 0], LeftForeArm: [0, 0, 0],
      RightArm: [-90 * D, 0, 0], RightForeArm: [0, 0, 0],
    }),
    ["dumbbells"]
  ),

  // Rear Delt Fly (bent over)
  "b-reverse-fly-db": loop3(2.2,
    {
      Spine: [50 * D, 0, 0],
      LeftArm: [0, 0, 5 * D], RightArm: [0, 0, -5 * D],
      LeftForeArm: [10 * D, 0, 0], RightForeArm: [10 * D, 0, 0],
      LeftUpLeg: [-10 * D, 0, 0], LeftLeg: [15 * D, 0, 0],
      RightUpLeg: [-10 * D, 0, 0], RightLeg: [15 * D, 0, 0],
    },
    {
      Spine: [50 * D, 0, 0],
      LeftArm: [0, 0, 80 * D], RightArm: [0, 0, -80 * D],
      LeftForeArm: [10 * D, 0, 0], RightForeArm: [10 * D, 0, 0],
      LeftUpLeg: [-10 * D, 0, 0], LeftLeg: [15 * D, 0, 0],
      RightUpLeg: [-10 * D, 0, 0], RightLeg: [15 * D, 0, 0],
    },
    ["dumbbells"]
  ),

  // Shrug
  "s-shrug-db": loop3(1.6,
    standing(ARMS_REST),
    { ...STAND, ...ARMS_REST, LeftShoulder: [-15 * D, 0, 0], RightShoulder: [-15 * D, 0, 0] },
    ["dumbbells"]
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE
  // ═══════════════════════════════════════════════════════════════════════════

  // Plank (static hold — subtle breathing motion)
  "x-plank": loop3(3.0,
    {
      Spine: [-80 * D, 0, 0],
      LeftArm: [0, 0, 10 * D], LeftForeArm: [90 * D, 0, 0],
      RightArm: [0, 0, -10 * D], RightForeArm: [90 * D, 0, 0],
      LeftUpLeg: [80 * D, 0, 0], RightUpLeg: [80 * D, 0, 0],
      LeftFoot: [-50 * D, 0, 0], RightFoot: [-50 * D, 0, 0],
    },
    {
      Spine: [-78 * D, 0, 0],
      LeftArm: [0, 0, 10 * D], LeftForeArm: [90 * D, 0, 0],
      RightArm: [0, 0, -10 * D], RightForeArm: [90 * D, 0, 0],
      LeftUpLeg: [78 * D, 0, 0], RightUpLeg: [78 * D, 0, 0],
      LeftFoot: [-50 * D, 0, 0], RightFoot: [-50 * D, 0, 0],
    }
  ),

  // Crunch — lying supine, upper body curls up
  "x-crunch": loop3(2.0,
    { // lying flat
      Hips: [-90 * D, 0, 0],
      LeftArm: [0, 20 * D, 0], RightArm: [0, -20 * D, 0],
      LeftForeArm: [40 * D, 0, 0], RightForeArm: [40 * D, 0, 0],
      LeftUpLeg: [50 * D, 0, 0], LeftLeg: [50 * D, 0, 0],
      RightUpLeg: [50 * D, 0, 0], RightLeg: [50 * D, 0, 0],
    },
    { // crunched up
      Hips: [-90 * D, 0, 0],
      Spine: [35 * D, 0, 0], Spine1: [15 * D, 0, 0],
      LeftArm: [0, 20 * D, 0], RightArm: [0, -20 * D, 0],
      LeftForeArm: [40 * D, 0, 0], RightForeArm: [40 * D, 0, 0],
      LeftUpLeg: [50 * D, 0, 0], LeftLeg: [50 * D, 0, 0],
      RightUpLeg: [50 * D, 0, 0], RightLeg: [50 * D, 0, 0],
    }
  ),

};

// ── Resolve aliases — exercises that share the same animation ────────────────
// Keys MUST match catalog exercise IDs from exerciseCatalog.js
const ALIASES = {
  // Chest
  "c-bench-flat-db": "c-bench-flat-bb",
  "c-bench-incline-bb": "c-bench-flat-bb",
  "c-bench-incline-db": "c-bench-flat-bb",
  "c-bench-decline-bb": "c-bench-flat-bb",
  "c-bench-decline-db": "c-bench-flat-bb",
  "c-machine-press": "c-bench-flat-bb",
  "c-pec-deck": "c-fly-flat-db",
  "c-pushup-diamond": "c-pushup",
  "c-pushup-incline": "c-pushup",
  "c-pushup-decline": "c-pushup",
  "c-pushup-pike": "c-pushup",
  "c-fly-incline-db": "c-fly-flat-db",
  "c-fly-cable": "c-fly-flat-db",
  "c-landmine-press": "s-ohp-bb",
  "c-svend-press": "c-bench-flat-bb",
  "c-pullover-db": "c-fly-flat-db",
  // Back
  "b-chinup": "b-pullup",
  "b-pullup-wide": "b-pullup",
  "b-pullup-neutral": "b-pullup",
  "b-muscle-up": "b-pullup",
  "b-row-db": "b-row-bb",
  "b-row-pendlay": "b-row-bb",
  "b-row-cable": "b-row-bb",
  "b-tbar-row": "b-row-bb",
  "b-machine-row": "b-row-bb",
  "b-meadows-row": "b-row-bb",
  "b-inverted-row": "b-row-bb",
  "b-lat-pulldown-close": "b-lat-pulldown",
  "b-single-arm-pulldown": "b-lat-pulldown",
  "b-straight-arm-pulldown": "b-lat-pulldown",
  "b-deadlift-sumo": "b-deadlift-conv",
  "b-deadlift-trap": "b-deadlift-conv",
  "b-rack-pull": "b-deadlift-conv",
  "b-reverse-fly-cable": "b-reverse-fly-db",
  "b-band-pull-apart": "b-reverse-fly-db",
  "b-hyperextension": "p-rdl-bb",
  "b-superman": "p-rdl-bb",
  // Legs — Quads
  "l-squat-goblet": "l-squat-front",
  "l-squat-overhead": "l-squat-front",
  "l-squat-zercher": "l-squat-front",
  "l-squat-pistol": "l-squat-bodyweight",
  "l-squat-sissy": "l-squat-bodyweight",
  "l-lunge-bb": "l-lunge-db",
  "l-lunge-reverse": "l-lunge-db",
  "l-lunge-walking": "l-lunge-db",
  "l-lunge-curtsy": "l-lunge-db",
  "l-bulgarian": "l-lunge-db",
  "l-step-up": "l-lunge-db",
  "l-hack-squat": "l-leg-press",
  "l-belt-squat": "l-squat-bb",
  // Legs — Posterior
  "p-rdl-db": "p-rdl-bb",
  "p-rdl-single": "p-rdl-bb",
  "p-good-morning": "p-rdl-bb",
  "p-glute-bridge": "p-hip-thrust",
  "p-glute-kickback": "p-hip-thrust",
  "p-donkey-kick": "p-hip-thrust",
  "p-nordic-curl": "p-leg-curl",
  "p-calf-raise-seat": "p-calf-raise-stand",
  "p-calf-raise-bw": "p-calf-raise-stand",
  "p-calf-raise-single": "p-calf-raise-stand",
  // Shoulders
  "s-ohp-db": "s-ohp-bb",
  "s-push-press": "s-ohp-bb",
  "s-machine-press": "s-ohp-bb",
  "s-lateral-raise-cable": "s-lateral-raise",
  "s-lu-raise": "s-lateral-raise",
  "s-front-raise-plate": "s-front-raise",
  "s-upright-row": "s-front-raise",
  "s-reverse-pec-deck": "b-reverse-fly-db",
  "s-shrug-bb": "s-shrug-db",
  // Arms — Biceps
  "a-curl-bb": "a-curl-db",
  "a-hammer-curl": "a-curl-db",
  "a-preacher-curl": "a-curl-db",
  "a-incline-curl": "a-curl-db",
  "a-cable-curl": "a-curl-db",
  "a-conc-curl": "a-curl-db",
  "a-spider-curl": "a-curl-db",
  "a-reverse-curl": "a-curl-db",
  "a-zottman-curl": "a-curl-db",
  "a-curl-21s": "a-curl-db",
  // Arms — Triceps
  "a-dip-tricep": "c-dip-chest",
  "a-dip-machine": "c-dip-chest",
  "a-tri-skullcrusher": "a-tri-overhead",
  "a-tri-cable-overhead": "a-tri-overhead",
  "a-tri-kickback": "a-tri-pushdown",
  "a-close-grip-bench": "c-bench-flat-bb",
  // Core (catalog uses x- prefix)
  "x-situp": "x-crunch",
  "x-russian-twist": "x-crunch",
  "x-leg-raise": "x-crunch",
  "x-hanging-leg-raise": "x-crunch",
  "x-cable-crunch": "x-crunch",
  "x-bicycle-crunch": "x-crunch",
  "x-v-up": "x-crunch",
  "x-dead-bug": "x-crunch",
  "x-toe-touch": "x-crunch",
  "x-heel-tap": "x-crunch",
  "x-ab-wheel": "x-plank",
  "x-mountain-climber": "x-plank",
  "x-pallof-press": "x-plank",
  "x-side-plank": "x-plank",
  "x-bird-dog": "x-plank",
  "x-hollow-hold": "x-plank",
  "x-copenhagen-plank": "x-plank",
  "x-woodchop": "x-crunch",
  "x-flutter-kick": "x-crunch",
  "x-dragon-flag": "x-crunch",
  "x-l-sit": "x-plank",
  "x-hanging-windshield": "x-crunch",
};

// Apply aliases — resolve null entries and add aliased IDs
for (const [id, targetId] of Object.entries(ALIASES)) {
  if (!ANIMATIONS[id] && ANIMATIONS[targetId]) {
    ANIMATIONS[id] = ANIMATIONS[targetId];
  }
}

// Also resolve null entries in the main object
for (const [id, val] of Object.entries(ANIMATIONS)) {
  if (val === null) delete ANIMATIONS[id];
}
