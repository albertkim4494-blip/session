import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You classify exercises for a fitness tracking app. Given an exercise name, return JSON with these fields:

{
  "muscles": { "primary": [...] },
  "equipment": [...],
  "tags": [...],
  "movement": "...",
  "defaultUnit": "..."
}

CONSTRAINTS — use ONLY these values:

muscles.primary (1-4 values): ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS, BACK, BICEPS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS, OBLIQUES, FOREARMS

equipment (1-3 values): bodyweight, dumbbell, barbell, kettlebell, cable, machine, pull-up bar, dip bar, bench, ab wheel, jump rope, foam roller, band, medicine ball, trap bar, smith machine, leg press, sled

tags (1-3 values): compound, isolation, push, pull, unilateral, bilateral, plyometric, isometric, explosive

movement (exactly 1): push, pull, legs, shoulders, arms, core, cardio, sport, mobility, stretch

defaultUnit (exactly 1): reps, sec, min, miles, yards, laps, steps

Return ONLY valid JSON, no explanation.`;

Deno.serve(async (req) => {
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
    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Exercise name is required (min 2 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          { role: "user", content: `Exercise: "${name.trim()}"` },
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
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

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and normalize
    const VALID_MUSCLES = new Set([
      "ANTERIOR_DELT", "LATERAL_DELT", "POSTERIOR_DELT", "CHEST", "TRICEPS",
      "BACK", "BICEPS", "QUADS", "HAMSTRINGS", "GLUTES", "CALVES", "ABS",
      "OBLIQUES", "FOREARMS",
    ]);
    const VALID_MOVEMENTS = new Set([
      "push", "pull", "legs", "shoulders", "arms", "core", "cardio", "sport", "mobility", "stretch",
    ]);
    const VALID_UNITS = new Set(["reps", "sec", "min", "miles", "yards", "laps", "steps"]);
    const VALID_EQUIPMENT = new Set([
      "bodyweight", "dumbbell", "barbell", "kettlebell", "cable", "machine",
      "pull-up bar", "dip bar", "bench", "ab wheel", "jump rope", "foam roller",
      "band", "medicine ball", "trap bar", "smith machine", "leg press", "sled",
    ]);
    const VALID_TAGS = new Set([
      "compound", "isolation", "push", "pull", "unilateral", "bilateral",
      "plyometric", "isometric", "explosive",
    ]);

    const muscles = {
      primary: Array.isArray(parsed.muscles?.primary)
        ? parsed.muscles.primary.filter((m: string) => VALID_MUSCLES.has(m))
        : [],
    };
    const equipment = Array.isArray(parsed.equipment)
      ? parsed.equipment.filter((e: string) => VALID_EQUIPMENT.has(e)).slice(0, 3)
      : [];
    const tags = Array.isArray(parsed.tags)
      ? parsed.tags.filter((t: string) => VALID_TAGS.has(t)).slice(0, 3)
      : [];
    const movement = VALID_MOVEMENTS.has(parsed.movement) ? parsed.movement : "push";
    const defaultUnit = VALID_UNITS.has(parsed.defaultUnit) ? parsed.defaultUnit : "reps";

    return new Response(
      JSON.stringify({ muscles, equipment, tags, movement, defaultUnit }),
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
