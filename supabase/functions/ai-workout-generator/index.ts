import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildProgramPrompt(payload: {
  profile: Record<string, unknown>;
  equipment: string;
  catalog: Array<{ id: string; name: string; muscles: string; tags: string; unit?: string }>;
  history: string;
  daysPerWeek: number;
  duration: number;
  goal: string;
  sportName: string;
  sportDays: string[];
}) {
  const {
    profile,
    equipment,
    catalog,
    history,
    daysPerWeek,
    duration,
    goal,
    sportName,
    sportDays,
  } = payload;

  const profileLines: string[] = [];
  if (profile.age) profileLines.push(`Age: ${profile.age}`);
  if (profile.weight_lbs) profileLines.push(`Weight: ${profile.weight_lbs} lbs`);
  if (profile.gender) profileLines.push(`Gender: ${profile.gender}`);
  if (profile.goal) profileLines.push(`Goal: ${profile.goal}`);
  if (profile.sports) profileLines.push(`Sports: ${profile.sports}`);
  if (profile.about) profileLines.push(`About/Injuries: ${profile.about}`);

  function formatEquipmentLabel(eq: unknown): string {
    if (typeof eq === "string") {
      const legacy: Record<string, string> = {
        home: "Home (bodyweight only)",
        basic: "Basic (dumbbells, bench, pull-up bar, kettlebell)",
        gym: "Full gym (all equipment)",
      };
      return legacy[eq] || eq;
    }
    if (!Array.isArray(eq) || eq.length === 0) return "Bodyweight only (no equipment)";
    if (eq.includes("full_gym")) return "Full gym (all equipment)";
    const labels: Record<string, string> = {
      dumbbell: "dumbbells",
      barbell: "barbell & rack",
      kettlebell: "kettlebells",
      bands: "resistance bands",
    };
    return "Bodyweight + " + eq.map((e: string) => labels[e] || e).join(", ");
  }

  const catalogText = catalog
    .map((e) => `${e.id} | ${e.name} | ${e.muscles} | ${e.tags} | ${e.unit || "reps"}`)
    .join("\n");

  const exerciseCount = Math.max(3, Math.min(Math.round(duration / 7), 10));

  const sportDayCount = Array.isArray(sportDays) ? sportDays.length : 0;
  const sportDayList = Array.isArray(sportDays) ? sportDays.join(", ") : "";

  const sportSection =
    sportName && sportDayCount > 0
      ? `\nSPORT INTEGRATION:
The user plays ${sportName} on ${sportDayList} (${sportDayCount} days per week). Include ${sportDayCount} sport day(s) in the weekly program on those specific days.
- For high-intensity sports (basketball, soccer, football, tennis, boxing, MMA, wrestling, volleyball, water polo), schedule the sport as the primary activity. You may add 1-3 light complementary exercises (mobility, foam rolling, stretching, or light accessory work that supports the sport).
- For low-intensity sports (yoga, swimming, cycling, hiking), you can pair the sport with a regular lifting session.
- The total number of workout entries should be daysPerWeek (${daysPerWeek}). So if there are ${sportDayCount} sport days, there are ${daysPerWeek - sportDayCount} lifting days.
- For sport day entries, set "scheme" to "sport" and name them like "${sportName} (${sportDayList})" or "${sportName} + Recovery".`
      : "";

  // Sport biomechanics instruction (when profile.sports exists)
  let sportBioSection = "";
  if (profile.sports) {
    sportBioSection = `
SPORT BIOMECHANICS:
The user participates in: ${profile.sports}. Consider the muscular demands of this sport.
Common sport demands — Water polo: heavy shoulders, chest, legs, cardio. Basketball: legs, shoulders, cardio. Soccer: legs, cardio, core. Swimming: shoulders, back, chest, cardio. Tennis: shoulders, forearm, core, legs. Running: legs, cardio. Cycling: quads, hamstrings, cardio. Rowing: back, legs, shoulders, cardio.
Avoid overloading muscles already heavily taxed by the sport.
Prioritize complementary work, antagonist muscles, and injury prevention.
`;
  }

  const system = `You are an expert strength & conditioning coach designing a personalized ${daysPerWeek}-day weekly training program.

USER PROFILE:
${profileLines.length > 0 ? profileLines.join("\n") : "No profile info."}

Equipment: ${formatEquipmentLabel(equipment)}
Goal: ${goal}
Days per week: ${daysPerWeek}
Session duration: ~${duration} minutes
${sportSection}${sportBioSection}

TRAINING HISTORY (last 14 days):
${history || "No recent training data."}

EXERCISE CATALOG (pick ONLY from these by catalogId):
id | name | muscles | tags | unit
${catalogText}

UNDERSTANDING THE USER:
- Read the "About" field carefully. It tells you who this person is — health conditions, experience level, injuries, limitations.
- A D1 athlete needs high-intensity programming with sport-specific periodization. Someone managing an autoimmune condition or chronic illness needs lower volume, more recovery built in, and careful exercise selection.
- If injuries or conditions are mentioned, avoid aggravating exercises entirely — don't just reduce sets, pick different movements.
- Beginners need simpler programs with fewer exercises and approachable volume. Advanced lifters benefit from more variety and periodization.
- Consider gender and body weight when selecting exercises. Lighter individuals and women may benefit from dumbbell variations over barbell for many movements, and typically start with lower absolute loads.
- For General Fitness or Lose Fat goals, prioritize enjoyable, sustainable exercise selection over maximum intensity. The best program is the one they'll actually do.

RULES:
1. Pick exercises ONLY from the catalog above, using exact catalogId values.
2. Each exercise MUST have its own "scheme" field with sets x reps/duration tailored to that exercise.
   - For isometric/hold exercises (tagged "isometric", unit "sec") like planks: prescribe a SINGLE long hold, e.g. "1x60s", "1x45s", "1x90s". Do NOT prescribe multiple sets for holds.
   - For other exercises with unit "sec" (non-isometric): prescribe time-based schemes like "3x30s".
   - For exercises with unit "reps": prescribe rep-based schemes like "4x8-12", "3x10", "5x5".
   - Tailor schemes to the user's goal:
     * Build Muscle: 3-4 sets of 8-12 reps, emphasize hypertrophy
     * Get Stronger: 4-5 sets of 3-5 reps, heavy compounds
     * Lose Fat: 3 sets of 12-15 reps, keep rest short, include some cardio-style movements
     * General Fitness: 3 sets of 10-12 reps, balanced
     * Sport Performance: 3-4 sets of 6-8 reps, explosive movements
   - If the user has health conditions or is a beginner, lean toward FEWER sets (2-3) with moderate reps (8-12). Don't overwhelm them — they can always add volume later.
3. No duplicate exercises within a single day.
4. Vary exercises across days — don't repeat the same exercise on multiple days unless necessary.
5. Order: compounds first, then isolation, then accessories/core.
6. Each lifting day should have ~${exerciseCount} exercises to fill ~${duration} minutes.
7. Give each day a descriptive name (e.g. "Push", "Upper Hypertrophy", "Legs & Glutes").

Return ONLY valid JSON, no markdown fences, no explanation.

OUTPUT FORMAT:
{
  "workouts": [
    {
      "name": "Day Name",
      "exercises": [
        { "catalogId": "edb-EIeI8Vf", "name": "Barbell Bench Press", "scheme": "4x8-12" },
        { "catalogId": "edb-VBAWRPG", "name": "Weighted Front Plank", "scheme": "1x60s" }
      ]
    }
  ]
}`;

  return { system, user: "Generate the program now." };
}

function buildTodayPrompt(payload: {
  profile: Record<string, unknown>;
  equipment: string;
  duration: number;
  catalog: Array<{ id: string; name: string; muscles: string; tags: string; unit?: string }>;
  history: string;
  muscleRecency: Record<string, number | null>;
  fatigue?: {
    recentMoods?: Array<{ date: string; mood: number; label: string }>;
    avgRpe?: string | null;
    consecutiveTrainingDays?: number;
    todayMusclesAlreadyTrained?: string[];
    todayExercisesAlreadyDone?: string[];
  };
}) {
  const { profile, equipment, duration, catalog, history, muscleRecency, fatigue } = payload;

  const profileLines: string[] = [];
  if (profile.age) profileLines.push(`Age: ${profile.age}`);
  if (profile.weight_lbs) profileLines.push(`Weight: ${profile.weight_lbs} lbs`);
  if (profile.gender) profileLines.push(`Gender: ${profile.gender}`);
  if (profile.goal) profileLines.push(`Goal: ${profile.goal}`);
  if (profile.sports) profileLines.push(`Sports: ${profile.sports}`);
  if (profile.about) profileLines.push(`About/Injuries: ${profile.about}`);

  function formatEquipmentLabelToday(eq: unknown): string {
    if (typeof eq === "string") {
      const legacy: Record<string, string> = {
        home: "Home (bodyweight only)",
        basic: "Basic (dumbbells, bench, pull-up bar, kettlebell)",
        gym: "Full gym (all equipment)",
      };
      return legacy[eq] || eq;
    }
    if (!Array.isArray(eq) || eq.length === 0) return "Bodyweight only (no equipment)";
    if (eq.includes("full_gym")) return "Full gym (all equipment)";
    const labels: Record<string, string> = {
      dumbbell: "dumbbells",
      barbell: "barbell & rack",
      kettlebell: "kettlebells",
      bands: "resistance bands",
    };
    return "Bodyweight + " + eq.map((e: string) => labels[e] || e).join(", ");
  }

  const catalogText = catalog
    .map((e) => `${e.id} | ${e.name} | ${e.muscles} | ${e.tags} | ${e.unit || "reps"}`)
    .join("\n");

  const recencyLines = Object.entries(muscleRecency)
    .map(([muscle, days]) =>
      days === null ? `${muscle}: never trained` : `${muscle}: ${days} days ago`
    )
    .join("\n");

  const goal = (profile.goal as string) || "General Fitness";
  const dur = duration || 60;
  const exerciseCount = Math.max(2, Math.min(Math.round(dur / 7), 10));

  // Sport biomechanics instruction (when profile.sports exists)
  let sportBioSection = "";
  if (profile.sports) {
    sportBioSection = `
SPORT BIOMECHANICS:
The user participates in: ${profile.sports}. Consider the muscular demands of this sport.
Common sport demands — Water polo: heavy shoulders, chest, legs, cardio. Basketball: legs, shoulders, cardio. Soccer: legs, cardio, core. Swimming: shoulders, back, chest, cardio. Tennis: shoulders, forearm, core, legs. Running: legs, cardio. Cycling: quads, hamstrings, cardio. Rowing: back, legs, shoulders, cardio.
Avoid overloading muscles already heavily taxed by the sport.
Prioritize complementary work, antagonist muscles, and injury prevention.
`;
  }

  const system = `You are an expert strength & conditioning coach designing a single workout for today.

USER PROFILE:
${profileLines.length > 0 ? profileLines.join("\n") : "No profile info."}

Equipment: ${formatEquipmentLabelToday(equipment)}
Goal: ${goal}
Session duration: ~${dur} minutes
${sportBioSection}
MUSCLE RECENCY (days since last trained):
${recencyLines}

TRAINING HISTORY (last 14 days):
${history || "No recent training data."}

EXERCISE CATALOG (pick ONLY from these by catalogId):
id | name | muscles | tags | unit
${catalogText}

UNDERSTANDING THE USER:
- Read the "About" field carefully. Health conditions, experience level, injuries — all of it matters for today's workout.
- Someone with chronic fatigue or an autoimmune condition needs a lighter session than a collegiate athlete. Fewer exercises, lower volume, more recovery-friendly movements.
- If injuries are mentioned, avoid those areas entirely — pick alternatives, not modifications.
- Consider gender, body weight, and experience level when selecting exercises and prescribing volume. Beginners benefit from approachable volume (2-3 sets) and movements they can do with confidence.
${(() => {
  const sections: string[] = [];
  if (fatigue) {
    sections.push("\nFATIGUE & RECOVERY SIGNALS:");

    if (fatigue.todayExercisesAlreadyDone && fatigue.todayExercisesAlreadyDone.length > 0) {
      sections.push(`Already trained today: ${fatigue.todayExercisesAlreadyDone.join(", ")}`);
    }
    if (fatigue.todayMusclesAlreadyTrained && fatigue.todayMusclesAlreadyTrained.length > 0) {
      sections.push(`Muscles already hit today: ${fatigue.todayMusclesAlreadyTrained.join(", ")}`);
    }
    if (fatigue.consecutiveTrainingDays != null && fatigue.consecutiveTrainingDays > 0) {
      sections.push(`Consecutive training days (before today): ${fatigue.consecutiveTrainingDays}`);
    }
    if (fatigue.avgRpe) {
      sections.push(`Average RPE (last 7 days): ${fatigue.avgRpe}/10`);
    }
    if (fatigue.recentMoods && fatigue.recentMoods.length > 0) {
      const moodLine = fatigue.recentMoods.map((m: { date: string; label: string }) => `${m.date}: ${m.label}`).join(", ");
      sections.push(`Recent session moods: ${moodLine}`);
    }

    const highRpe = fatigue.avgRpe ? parseFloat(fatigue.avgRpe) >= 8 : false;
    const negativeMoods = (fatigue.recentMoods || []).filter((m: { mood: number }) => m.mood < 0).length;
    const longStreak = (fatigue.consecutiveTrainingDays || 0) >= 4;

    if (highRpe || negativeMoods >= 2 || longStreak) {
      sections.push("⚠️ FATIGUE DETECTED — reduce volume/intensity. Use fewer sets, lighter schemes (e.g. 2x8-10 instead of 4x8-12), or suggest a recovery/mobility day. Do NOT prescribe the same volume as a fresh day.");
    }
  }
  return sections.join("\n");
})()}

RULES:
1. Prioritize muscles that haven't been trained recently (high days-ago or "never trained"). NEVER target muscles already trained today.
2. Pick exercises ONLY from the catalog, using exact catalogId values. Do NOT pick exercises the user already did today.
3. Each exercise MUST have its own "scheme" field with sets x reps/duration tailored to that exercise.
   - For isometric/hold exercises (tagged "isometric", unit "sec") like planks: prescribe a SINGLE long hold, e.g. "1x60s", "1x45s", "1x90s". Do NOT prescribe multiple sets for holds.
   - For other exercises with unit "sec" (non-isometric): prescribe time-based schemes like "3x30s".
   - For exercises with unit "reps": prescribe rep-based schemes like "4x8-12", "3x10", "5x5".
   - Tailor schemes to the user's goal:
     * Build Muscle: 3-4 sets of 8-12 reps
     * Get Stronger: 4-5 sets of 3-5 reps
     * Lose Fat: 3 sets of 15-20 reps
     * General Fitness: 3 sets of 10-12 reps
     * Sport Performance: 3-4 sets of 6-8 reps
   - If the user has health conditions or is a beginner, lean toward fewer sets (2-3) with moderate intensity.
4. No duplicate exercises.
5. Order: compounds first, then isolation, then accessories.
6. Pick ~${exerciseCount} exercises to fit within ~${dur} minutes (including warm-up and rest between sets).
7. Give the workout a descriptive name (e.g. "Pull", "Upper Body", "Chest & Shoulders").
8. List the primary target muscle groups (use keys like CHEST, BACK, QUADS, etc.).

Return ONLY valid JSON, no markdown fences, no explanation.

OUTPUT FORMAT:
{
  "name": "Workout Name",
  "targetMuscles": ["BACK", "BICEPS"],
  "note": "Brief explanation of why these muscles/exercises were chosen and any adjustments made for fatigue or recovery.",
  "exercises": [
    { "catalogId": "edb-eZyBC3j", "name": "Barbell Bent Over Row", "scheme": "3x10-12" },
    { "catalogId": "edb-VBAWRPG", "name": "Weighted Front Plank", "scheme": "1x60s" }
  ]
}`;

  return { system, user: "Generate today's workout now." };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return jsonResponse({ error: "OPENAI_API_KEY not configured" }, 500);
  }

  try {
    const body = await req.json();
    const { mode } = body;

    let system: string;
    let user: string;

    if (mode === "program") {
      const prompts = buildProgramPrompt(body);
      system = prompts.system;
      user = prompts.user;
    } else if (mode === "today") {
      const prompts = buildTodayPrompt(body);
      system = prompts.system;
      user = prompts.user;
    } else {
      return jsonResponse({ error: "Invalid mode. Use 'program' or 'today'." }, 400);
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI API error:", openaiRes.status, errText);
      return jsonResponse(
        { error: "AI service error", detail: openaiRes.status },
        502
      );
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const cleaned = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return jsonResponse({ error: "Failed to parse AI response" }, 502);
    }

    return jsonResponse(parsed);
  } catch (err) {
    console.error("Edge function error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }
});
