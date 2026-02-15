import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("EXERCISEDB_API_KEY");
  if (!apiKey) {
    return jsonResponse({ error: "EXERCISEDB_API_KEY not configured" }, 500);
  }

  try {
    const { exerciseName } = await req.json();

    if (!exerciseName || typeof exerciseName !== "string") {
      return jsonResponse({ error: "exerciseName is required" }, 400);
    }

    const name = exerciseName.toLowerCase().trim();

    // Search ExerciseDB by name
    const encoded = encodeURIComponent(name);
    const res = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encoded}?limit=5&offset=0`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );

    if (!res.ok) {
      console.error("ExerciseDB API error:", res.status, await res.text());
      return jsonResponse(
        { error: "ExerciseDB API error", status: res.status },
        502
      );
    }

    const exercises = await res.json();

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return jsonResponse({ gifUrl: null });
    }

    // Find best match — prefer exact name match, fall back to first result
    const exact = exercises.find(
      (e: any) => e.name?.toLowerCase() === name
    );
    const best = exact || exercises[0];

    return jsonResponse({
      gifUrl: best.gifUrl || null,
      name: best.name || null,
      id: best.id || null,
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }
});
