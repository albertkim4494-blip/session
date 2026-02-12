import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const {
      profile,
      workouts,
      recentLogs,
      dateRange,
      catalogSummary,
      equipment,
      enrichedLogSummary,
      progressionTrends,
      adherence,
      previousInsights,
    } = await req.json();

    // Build exercise ID → info map from workouts
    const exerciseMap: Record<string, { name: string; unit: string; unitAbbr: string }> = {};
    for (const w of workouts || []) {
      for (const ex of w.exercises || []) {
        exerciseMap[ex.id] = {
          name: ex.name,
          unit: ex.unit || "reps",
          unitAbbr: ex.unitAbbr || "reps",
        };
      }
    }

    // Unit classification constants (inline — can't share modules with client)
    const DURATION_FACTORS: Record<string, number> = { sec: 1 / 60, min: 1, hrs: 60 };
    const DISTANCE_UNITS = new Set(["miles", "yards", "laps", "steps"]);

    // Build a text summary of the program structure
    const programLines: string[] = [];
    for (const w of workouts || []) {
      const exNames = (w.exercises || []).map((e: { name: string }) => e.name).join(", ");
      const schemeStr = w.scheme ? ` [${w.scheme}]` : "";
      programLines.push(`- ${w.name}${schemeStr}: ${exNames || "(no exercises)"}`);
    }
    const programSummary = programLines.length > 0
      ? programLines.join("\n")
      : "No workouts configured.";

    // Build log summary — prefer enriched version from client, fall back to server-side builder
    let logSummary: string;
    if (enrichedLogSummary && typeof enrichedLogSummary === "string") {
      logSummary = enrichedLogSummary;
    } else {
      // Fallback: build from raw recentLogs (backward compat with old clients)
      const logLines: string[] = [];
      for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
        if (!dayLogs || typeof dayLogs !== "object") continue;
        for (const [exId, log] of Object.entries(dayLogs as Record<string, unknown>)) {
          const exInfo = exerciseMap[exId];
          const exName = exInfo?.name || exId;
          const unit = exInfo?.unit || "reps";
          const unitAbbr = exInfo?.unitAbbr || "reps";
          const logData = log as { sets?: Array<{ reps?: number; weight?: number }> };
          if (!logData?.sets || !Array.isArray(logData.sets)) continue;

          const totalValue = logData.sets.reduce(
            (sum: number, s: { reps?: number }) => sum + (Number(s.reps) || 0),
            0
          );
          const setCount = logData.sets.length;

          if (unit in DURATION_FACTORS) {
            const minutes = Math.round(totalValue * DURATION_FACTORS[unit]);
            logLines.push(`  ${dateKey}: ${exName} — ${minutes} min total (${setCount} session${setCount !== 1 ? "s" : ""})`);
          } else if (DISTANCE_UNITS.has(unit)) {
            logLines.push(`  ${dateKey}: ${exName} — ${totalValue} ${unitAbbr} (${setCount} set${setCount !== 1 ? "s" : ""})`);
          } else {
            const maxWeight = Math.max(
              ...logData.sets.map((s: { weight?: number }) => Number(s.weight) || 0),
              0
            );
            const weightStr = maxWeight > 0 ? ` @ up to ${maxWeight} lbs` : "";
            logLines.push(`  ${dateKey}: ${exName} — ${totalValue} reps${weightStr} (${setCount} set${setCount !== 1 ? "s" : ""})`);
          }
        }
      }
      logSummary = logLines.length > 0
        ? logLines.join("\n")
        : "No logged sets in this date range.";
    }

    // Build profile context
    const profileParts: string[] = [];
    if (profile?.age) profileParts.push(`Age: ${profile.age}`);
    if (profile?.weight_lbs) profileParts.push(`Weight: ${profile.weight_lbs} lbs`);
    if (profile?.goal) profileParts.push(`Goal: ${profile.goal}`);
    if (profile?.sports) profileParts.push(`Sports/Activities: ${profile.sports}`);
    if (profile?.about) profileParts.push(`About: ${profile.about}`);
    const equipmentLabels: Record<string, string> = {
      home: "Home (bodyweight only, no equipment)",
      basic: "Basic home setup (dumbbells, bench, pull-up bar, kettlebell)",
      gym: "Full gym access (all equipment available)",
    };
    if (equipment && equipment !== "gym") {
      profileParts.push(`Equipment: ${equipmentLabels[equipment] || equipment}`);
    }

    const profileContext = profileParts.length > 0
      ? profileParts.join("\n")
      : "No profile info provided.";

    // Build catalog reference (exercises not in user's program, grouped by muscle)
    let catalogSection = "";
    if (catalogSummary && typeof catalogSummary === "object") {
      const lines: string[] = [];
      for (const [muscle, exercises] of Object.entries(catalogSummary)) {
        if (Array.isArray(exercises) && exercises.length > 0) {
          const groupName = (muscle as string).replace(/_/g, " ").toLowerCase();
          lines.push(`  ${groupName}: ${(exercises as string[]).join(", ")}`);
        }
      }
      if (lines.length > 0) {
        catalogSection = `\nAVAILABLE EXERCISES (not in user's program, by muscle group):\n${lines.join("\n")}\n`;
      }
    }

    // Build progression trends section
    let progressionSection = "";
    if (Array.isArray(progressionTrends) && progressionTrends.length > 0) {
      progressionSection = `\nPROGRESSION TRENDS:\n${progressionTrends.map((t: string) => `  ${t}`).join("\n")}\n`;
    }

    // Build adherence section
    let adherenceSection = "";
    if (adherence && typeof adherence === "object") {
      adherenceSection = `\nADHERENCE (last 30 days):\n  Sessions: ${adherence.sessionsLast30 ?? "?"}\n  Average: ${adherence.sessionsPerWeek ?? "?"} sessions/week\n`;
    }

    // Build anti-repetition section
    let antiRepetitionSection = "";
    if (previousInsights && Array.isArray(previousInsights.titles) && previousInsights.titles.length > 0) {
      antiRepetitionSection = `\nPREVIOUS RECOMMENDATIONS (do NOT repeat these topics):\n${previousInsights.titles.map((t: string) => `  - ${t}`).join("\n")}\n`;
    }

    // Sport biomechanics section for system prompt
    let sportBioSection = "";
    if (profile?.sports) {
      sportBioSection = `
SPORT BIOMECHANICS AWARENESS:
The user participates in: ${profile.sports}. Analyze the muscular and cardiovascular demands of their sport(s).
Common sport demands — Water polo: heavy shoulders, chest, legs, cardio. Basketball: legs, shoulders, cardio. Soccer: legs, cardio, core. Swimming: shoulders, back, chest, cardio. Tennis: shoulders, forearm, core, legs. Running: legs, cardio. Cycling: quads, hamstrings, cardio. Rowing: back, legs, shoulders, cardio.
Factor sport demands into ALL recommendations. Prioritize complementary work, antagonist muscles, and injury prevention. Avoid overloading muscles already heavily taxed by the sport.
`;
    }

    const systemPrompt = `You are an expert fitness coach analyzing a user's workout data. You give concise, actionable insights.

USER PROFILE:
${profileContext}
${sportBioSection}
RULES:
- Return ONLY valid JSON, no markdown, no explanation outside the JSON.
- Return 1-3 insights based on the data.
- Each insight must have: type, severity, title, message, suggestions.
- type: one of "IMBALANCE", "NEGLECTED", "OVERTRAINING", "POSITIVE", "TIP", "RECOVERY", "PROGRESSION"
- severity: one of "HIGH", "MEDIUM", "LOW", "INFO"
- title: short title with a leading emoji (⚠️, 💡, 📊, ✅, 🔥, 😴, 📈)
- message: 1-2 sentences explaining the insight, referencing specific exercises/numbers from their logs.
- suggestions: array of { "exercise": "<name>", "muscleGroup": "<GROUP>" } — only include if actionable. muscleGroup must be one of: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS, BACK, BICEPS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS.
- Consider the user's goal and sports when making suggestions. For example, a rower doesn't need extra pulling work; a runner benefits from hip/glute work.
- Look at actual logged volume (total reps, weights, frequency), not just exercise names.
- Duration/sport activities measured in minutes are NOT strength volume — do not count them as reps.
- Repeated sport activities (e.g. Water Polo 3x/week) are normal and expected — do not flag as low variety.
- Only compare strength exercises for muscle-group balance analysis.
- For duration/sport insights, focus on consistency, frequency, and recovery rather than volume.
- If the training looks well-balanced, say so (type: "POSITIVE").
- If there's very little data (fewer than 3 days logged), be ENCOURAGING. Do not criticize low volume — the user is just getting started. Give a positive tip or acknowledge their effort instead.
- NEVER use the word "only" when describing a user's volume or effort (e.g., "only 30 reps"). This feels judgmental. Instead, acknowledge what they did and suggest what to build toward.
- Tone must be: calm, confident, supportive, non-judgmental. You are a coach who notices things, not a critic.
- Do NOT suggest exercises the user already has in their WORKOUT PROGRAM. Only suggest new exercises they could add.
- When suggesting exercises, prefer ones from the AVAILABLE EXERCISES list (if provided) since those are real exercises in the app's catalog that the user can easily add. Use the exact exercise names from that list.
- The available exercises are already filtered to the user's equipment setup. Only suggest exercises from this list — do not suggest exercises requiring equipment the user doesn't have.

RECOVERY & REST:
- Recommend REST or a deload when: training frequency is 5+ sessions/week including sport days, mood trends are negative (rough/terrible), notes mention pain or fatigue, weight progression has stalled across multiple exercises. Use type "RECOVERY".
- A deload suggestion is valuable — resting is training too. Frame it positively.

PROGRESSION TRACKING:
- Celebrate weight increases (type: "PROGRESSION"). This is motivating.
- Flag stalls (2+ weeks flat on an exercise) — suggest rep range or variation changes.
- Flag regressions — check for overtraining or recovery issues.

ANTI-REPETITION:
- If previous recommendations are listed below, do NOT repeat those exact topics. Find new angles, different exercises, or fresh observations each time.
- Vary your insight types — don't always return the same mix.

OUTPUT FORMAT:
{ "insights": [ { "type": "...", "severity": "...", "title": "...", "message": "...", "suggestions": [...] } ] }`;

    const userMessage = `Date range: ${dateRange?.label || "unknown"} (${dateRange?.start || "?"} to ${dateRange?.end || "?"})

WORKOUT PROGRAM:
${programSummary}

RECENT TRAINING LOGS:
${logSummary}
${catalogSection}${progressionSection}${adherenceSection}${antiRepetitionSection}
Analyze this data and return JSON insights.`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI API error:", openaiRes.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error", detail: openaiRes.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || "{}";

    // Parse the JSON from the model response (strip markdown fences if present)
    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = { insights: [] };
    }

    // Validate structure
    const insights = Array.isArray(parsed.insights) ? parsed.insights.slice(0, 3) : [];

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
