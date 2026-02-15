import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BONE_NAMES = [
  "Hips", "Spine", "Spine1", "Spine2", "Neck", "Head",
  "LeftShoulder", "LeftArm", "LeftForeArm", "LeftHand",
  "RightShoulder", "RightArm", "RightForeArm", "RightHand",
  "LeftUpLeg", "LeftLeg", "LeftFoot",
  "RightUpLeg", "RightLeg", "RightFoot",
];

const systemPrompt = `You are a fitness animation engine. Given an exercise name and metadata, you generate keyframe animation data for a humanoid skeleton performing that exercise.

SKELETON RIG (Mixamo convention):
${BONE_NAMES.join(", ")}

BONE HIERARCHY:
- Hips (root, at waist height ~0.95m)
  - Spine → Spine1 → Spine2 (torso chain)
    - Neck → Head
    - LeftShoulder → LeftArm → LeftForeArm → LeftHand
    - RightShoulder → RightArm → RightForeArm → RightHand
  - LeftUpLeg → LeftLeg → LeftFoot
  - RightUpLeg → RightLeg → RightFoot

ROTATION RULES:
- All rotations are Euler angles in RADIANS (XYZ order)
- Positive X = forward tilt, Negative X = backward tilt
- Positive Y = turn left, Negative Y = turn right
- Positive Z = tilt right (for limbs: away from body), Negative Z = tilt left
- Typical range: -3.14 to 3.14 (full rotation), most joints stay within ±1.57 (90°)
- For arms hanging: LeftArm Z≈-0.09 (slightly out), RightArm Z≈0.09
- For legs standing: UpLeg X≈0, Leg X≈0
- Spine bent 90° forward (lying flat): Spine X = -1.57
- Elbow bent 90°: ForeArm X ≈ ±1.57 (sign depends on side)

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure:
{
  "duration": <seconds, 1.5-4.0>,
  "loop": true,
  "keyframes": [
    {
      "time": 0,
      "bones": {
        "BoneName": [x, y, z],
        ...
      }
    },
    {
      "time": 0.5,
      "bones": { ... }
    },
    {
      "time": 1.0,
      "bones": { ... }
    }
  ]
}

RULES:
1. Use 3 keyframes minimum (start, peak, return to start) for smooth looping
2. time values are normalized 0-1
3. The last keyframe (time=1.0) MUST match the first (time=0) for seamless looping
4. Only include bones that move — omit static bones
5. For bilateral exercises (both arms/legs move), include both sides
6. For unilateral exercises, animate one side and keep the other static
7. Movements should look natural and anatomically correct
8. Consider the exercise's primary muscles and equipment when animating
9. Duration should match a realistic rep speed for the exercise

Return ONLY valid JSON, no explanation.`;

function validateAnimation(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== "object") return { valid: false, error: "Not an object" };
  if (typeof data.duration !== "number" || data.duration < 0.5 || data.duration > 10) {
    return { valid: false, error: "Invalid duration" };
  }
  if (!Array.isArray(data.keyframes) || data.keyframes.length < 2) {
    return { valid: false, error: "Need at least 2 keyframes" };
  }

  const validBones = new Set(BONE_NAMES);
  for (const kf of data.keyframes) {
    if (typeof kf.time !== "number" || kf.time < 0 || kf.time > 1) {
      return { valid: false, error: `Invalid keyframe time: ${kf.time}` };
    }
    if (!kf.bones || typeof kf.bones !== "object") {
      return { valid: false, error: "Keyframe missing bones" };
    }
    for (const [name, rot] of Object.entries(kf.bones)) {
      if (!validBones.has(name)) {
        return { valid: false, error: `Unknown bone: ${name}` };
      }
      if (!Array.isArray(rot) || (rot as number[]).length !== 3) {
        return { valid: false, error: `Invalid rotation for ${name}` };
      }
      for (const v of rot as number[]) {
        if (typeof v !== "number" || Math.abs(v) > 6.3) {
          return { valid: false, error: `Rotation out of range for ${name}: ${v}` };
        }
      }
    }
  }

  return { valid: true };
}

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
    const { exerciseId, exerciseName, muscles, equipment, movement } = await req.json();

    if (!exerciseName || typeof exerciseName !== "string") {
      return new Response(
        JSON.stringify({ error: "exerciseName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build user prompt with exercise context
    const parts = [`Exercise: "${exerciseName.trim()}"`];
    if (muscles?.primary?.length) parts.push(`Primary muscles: ${muscles.primary.join(", ")}`);
    if (equipment?.length) parts.push(`Equipment: ${equipment.join(", ")}`);
    if (movement) parts.push(`Movement type: ${movement}`);

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
          { role: "user", content: parts.join("\n") },
        ],
        temperature: 0.4,
        max_tokens: 2000,
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

    // Validate
    const validation = validateAnimation(parsed);
    if (!validation.valid) {
      console.error("Animation validation failed:", validation.error, JSON.stringify(parsed).slice(0, 500));
      return new Response(
        JSON.stringify({ error: "Generated animation is invalid", detail: validation.error }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure loop flag
    parsed.loop = parsed.loop !== false;

    // Store in Supabase Storage if exerciseId provided
    if (exerciseId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const filePath = `${exerciseId}.json`;
        await supabase.storage
          .from("exercise-animations")
          .upload(filePath, JSON.stringify(parsed), {
            contentType: "application/json",
            upsert: true,
          });
      } catch (storageErr) {
        // Non-fatal: animation is still returned to client
        console.error("Storage upload failed:", storageErr);
      }
    }

    return new Response(
      JSON.stringify(parsed),
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
