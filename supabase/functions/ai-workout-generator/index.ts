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
  catalog: Array<{ id: string; name: string; muscles: string; tags: string }>;
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

  const equipmentLabels: Record<string, string> = {
    home: "Home (bodyweight only)",
    basic: "Basic (dumbbells, bench, pull-up bar, kettlebell)",
    gym: "Full gym (all equipment)",
  };

  const catalogText = catalog
    .map((e) => `${e.id} | ${e.name} | ${e.muscles} | ${e.tags}`)
    .join("\n");

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

  const system = `You are an expert strength & conditioning coach designing a personalized ${daysPerWeek}-day weekly training program.

USER PROFILE:
${profileLines.length > 0 ? profileLines.join("\n") : "No profile info."}

Equipment: ${equipmentLabels[equipment] || "Full gym"}
Goal: ${goal}
Days per week: ${daysPerWeek}
Session duration: ~${duration} minutes
${sportSection}

TRAINING HISTORY (last 14 days):
${history || "No recent training data."}

EXERCISE CATALOG (pick ONLY from these by catalogId):
id | name | muscles | tags
${catalogText}

RULES:
1. Pick exercises ONLY from the catalog above, using exact catalogId values.
2. Consider injuries/limitations mentioned in the "About" field — avoid exercises that could aggravate them.
3. Tailor exercise selection and rep schemes to the user's goal:
   - Build Muscle: 4x8-12, emphasize hypertrophy with isolation + compound mix
   - Get Stronger: 4x3-5, emphasize heavy compounds
   - Lose Fat: 3x15-20, include supersets, keep rest short
   - General Fitness: 3x10-12, balanced approach
   - Sport Performance: 3x6-8, explosive + sport-specific movements
4. No duplicate exercises within a single day.
5. Vary exercises across days — don't repeat the same exercise on multiple days unless necessary (e.g. squat variants).
6. Order: compounds first, then isolation, then accessories/core.
7. Each lifting day should have ${Math.max(3, Math.min(Math.round(duration / 7), 10))} exercises.
8. Give each day a descriptive name (e.g. "Push", "Upper Hypertrophy", "Legs & Glutes").

Return ONLY valid JSON, no markdown fences, no explanation.

OUTPUT FORMAT:
{
  "workouts": [
    {
      "name": "Day Name",
      "scheme": "4x8-12",
      "exercises": [
        { "catalogId": "c-bench-flat-bb", "name": "Barbell Bench Press" }
      ]
    }
  ]
}`;

  return { system, user: "Generate the program now." };
}

function buildTodayPrompt(payload: {
  profile: Record<string, unknown>;
  equipment: string;
  catalog: Array<{ id: string; name: string; muscles: string; tags: string }>;
  history: string;
  muscleRecency: Record<string, number | null>;
}) {
  const { profile, equipment, catalog, history, muscleRecency } = payload;

  const profileLines: string[] = [];
  if (profile.age) profileLines.push(`Age: ${profile.age}`);
  if (profile.weight_lbs) profileLines.push(`Weight: ${profile.weight_lbs} lbs`);
  if (profile.gender) profileLines.push(`Gender: ${profile.gender}`);
  if (profile.goal) profileLines.push(`Goal: ${profile.goal}`);
  if (profile.sports) profileLines.push(`Sports: ${profile.sports}`);
  if (profile.about) profileLines.push(`About/Injuries: ${profile.about}`);

  const equipmentLabels: Record<string, string> = {
    home: "Home (bodyweight only)",
    basic: "Basic (dumbbells, bench, pull-up bar, kettlebell)",
    gym: "Full gym (all equipment)",
  };

  const catalogText = catalog
    .map((e) => `${e.id} | ${e.name} | ${e.muscles} | ${e.tags}`)
    .join("\n");

  const recencyLines = Object.entries(muscleRecency)
    .map(([muscle, days]) =>
      days === null ? `${muscle}: never trained` : `${muscle}: ${days} days ago`
    )
    .join("\n");

  const goal = (profile.goal as string) || "General Fitness";

  const system = `You are an expert strength & conditioning coach designing a single workout for today.

USER PROFILE:
${profileLines.length > 0 ? profileLines.join("\n") : "No profile info."}

Equipment: ${equipmentLabels[equipment] || "Full gym"}
Goal: ${goal}

MUSCLE RECENCY (days since last trained):
${recencyLines}

TRAINING HISTORY (last 14 days):
${history || "No recent training data."}

EXERCISE CATALOG (pick ONLY from these by catalogId):
id | name | muscles | tags
${catalogText}

RULES:
1. Prioritize muscles that haven't been trained recently (high days-ago or "never trained").
2. Pick exercises ONLY from the catalog, using exact catalogId values.
3. Consider injuries/limitations from the "About" field.
4. Tailor to the user's goal.
5. No duplicate exercises.
6. Order: compounds first, then isolation, then accessories.
7. Pick 6-8 exercises for ~60 minutes.
8. Give the workout a descriptive name (e.g. "Pull", "Upper Body", "Chest & Shoulders").
9. List the primary target muscle groups (use keys like CHEST, BACK, QUADS, etc.).

Return ONLY valid JSON, no markdown fences, no explanation.

OUTPUT FORMAT:
{
  "name": "Workout Name",
  "scheme": "3x10-12",
  "targetMuscles": ["BACK", "BICEPS"],
  "exercises": [
    { "catalogId": "b-row-bb", "name": "Barbell Row" }
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
