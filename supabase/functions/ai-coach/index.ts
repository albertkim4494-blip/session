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
    const { profile, workouts, recentLogs, dateRange } = await req.json();

    // Build exercise ID → name map from workouts
    const exerciseMap: Record<string, string> = {};
    for (const w of workouts || []) {
      for (const ex of w.exercises || []) {
        exerciseMap[ex.id] = ex.name;
      }
    }

    // Build a text summary of the program structure
    const programLines: string[] = [];
    for (const w of workouts || []) {
      const exNames = (w.exercises || []).map((e: { name: string }) => e.name).join(", ");
      programLines.push(`- ${w.name}: ${exNames || "(no exercises)"}`);
    }
    const programSummary = programLines.length > 0
      ? programLines.join("\n")
      : "No workouts configured.";

    // Build a text summary of recent logs
    const logLines: string[] = [];
    for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
      if (!dayLogs || typeof dayLogs !== "object") continue;
      for (const [exId, log] of Object.entries(dayLogs as Record<string, unknown>)) {
        const exName = exerciseMap[exId] || exId;
        const logData = log as { sets?: Array<{ reps?: number; weight?: number }> };
        if (!logData?.sets || !Array.isArray(logData.sets)) continue;
        const totalReps = logData.sets.reduce(
          (sum: number, s: { reps?: number }) => sum + (Number(s.reps) || 0),
          0
        );
        const maxWeight = Math.max(
          ...logData.sets.map((s: { weight?: number }) => Number(s.weight) || 0),
          0
        );
        const weightStr = maxWeight > 0 ? ` @ up to ${maxWeight} lbs` : "";
        logLines.push(`  ${dateKey}: ${exName} — ${totalReps} total reps${weightStr} (${logData.sets.length} sets)`);
      }
    }
    const logSummary = logLines.length > 0
      ? logLines.join("\n")
      : "No logged sets in this date range.";

    // Build profile context
    const profileParts: string[] = [];
    if (profile?.age) profileParts.push(`Age: ${profile.age}`);
    if (profile?.weight_lbs) profileParts.push(`Weight: ${profile.weight_lbs} lbs`);
    if (profile?.goal) profileParts.push(`Goal: ${profile.goal}`);
    if (profile?.sports) profileParts.push(`Sports/Activities: ${profile.sports}`);
    if (profile?.about) profileParts.push(`About: ${profile.about}`);
    const profileContext = profileParts.length > 0
      ? profileParts.join("\n")
      : "No profile info provided.";

    const systemPrompt = `You are an expert fitness coach analyzing a user's workout data. You give concise, actionable insights.

USER PROFILE:
${profileContext}

RULES:
- Return ONLY valid JSON, no markdown, no explanation outside the JSON.
- Return 1-3 insights based on the data.
- Each insight must have: type, severity, title, message, suggestions.
- type: one of "IMBALANCE", "NEGLECTED", "OVERTRAINING", "POSITIVE", "TIP"
- severity: one of "HIGH", "MEDIUM", "LOW", "INFO"
- title: short title with a leading emoji (⚠️, 💡, 📊, ✅, 🔥)
- message: 1-2 sentences explaining the insight, referencing specific exercises/numbers from their logs.
- suggestions: array of { "exercise": "<name>", "muscleGroup": "<GROUP>" } — only include if actionable. muscleGroup must be one of: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS, BACK, BICEPS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS.
- Consider the user's goal and sports when making suggestions. For example, a rower doesn't need extra pulling work; a runner benefits from hip/glute work.
- Look at actual logged volume (total reps, weights, frequency), not just exercise names.
- If the training looks well-balanced, say so (type: "POSITIVE").
- If there's very little data, give a general tip instead of making assumptions.

OUTPUT FORMAT:
{ "insights": [ { "type": "...", "severity": "...", "title": "...", "message": "...", "suggestions": [...] } ] }`;

    const userMessage = `Date range: ${dateRange?.label || "unknown"} (${dateRange?.start || "?"} to ${dateRange?.end || "?"})

WORKOUT PROGRAM:
${programSummary}

RECENT TRAINING LOGS:
${logSummary}

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
        max_tokens: 800,
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
