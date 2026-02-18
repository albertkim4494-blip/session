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
      catalogEntries,
      equipment,
      weightUnit,
      enrichedLogSummary,
      progressionTrends,
      adherence,
      previousInsights,
      muscleSetsSummary,
      muscleVolumeSummary, // legacy, ignored if muscleSetsSummary present
    } = await req.json();

    const wUnit = weightUnit || "lb";

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
            const weightStr = maxWeight > 0 ? ` @ up to ${maxWeight} ${wUnit}` : "";
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
    if (profile?.gender) profileParts.push(`Gender: ${profile.gender}`);
    if (profile?.weight_lbs) profileParts.push(`Weight: ${profile.weight_lbs} ${wUnit}`);
    if (profile?.goal) profileParts.push(`Goal: ${profile.goal}`);
    if (profile?.height_inches) {
      const hFt = Math.floor(profile.height_inches / 12);
      const hIn = profile.height_inches % 12;
      const hCm = Math.round(profile.height_inches * 2.54);
      profileParts.push(`Height: ${hFt}'${hIn}" (${hCm} cm)`);
      if (profile?.weight_lbs) {
        const bmi = ((profile.weight_lbs * 0.453592) / (profile.height_inches * 0.0254) ** 2).toFixed(1);
        profileParts.push(`BMI: ${bmi}`);
      }
    }
    if (profile?.sports) profileParts.push(`Sports/Activities: ${profile.sports}`);
    if (profile?.about) profileParts.push(`About: ${profile.about}`);
    function formatEquipmentLabel(eq: unknown): string {
      if (typeof eq === "string") {
        const legacy: Record<string, string> = {
          home: "Bodyweight only (no equipment)",
          basic: "Bodyweight + dumbbells, kettlebells",
          gym: "Full gym access (all equipment)",
        };
        return legacy[eq] || eq;
      }
      if (!Array.isArray(eq) || eq.length === 0) return "Bodyweight only (no equipment)";
      if (eq.includes("full_gym")) return "Full gym access (all equipment)";
      const labels: Record<string, string> = {
        dumbbell: "dumbbells",
        barbell: "barbell & rack",
        kettlebell: "kettlebells",
        bands: "resistance bands",
      };
      return "Bodyweight + " + eq.map((e: string) => labels[e] || e).join(", ");
    }
    profileParts.push(`Equipment: ${formatEquipmentLabel(equipment)}`);

    const profileContext = profileParts.length > 0
      ? profileParts.join("\n")
      : "No profile info provided.";

    // Build catalog reference (exercises not in user's program, with full metadata)
    let catalogSection = "";
    if (Array.isArray(catalogEntries) && catalogEntries.length > 0) {
      const catalogLines = catalogEntries.map(
        (e: { id: string; name: string; muscles: string; tags: string }) =>
          `${e.id} | ${e.name} | ${e.muscles} | ${e.tags}`
      );
      catalogSection = `\nEXERCISE CATALOG (not in user's program — suggest ONLY from these, using exact catalogId):\nid | name | muscles | tags\n${catalogLines.join("\n")}\n`;
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

    // Build muscle sets section (primary-only working set counts — the standard volume metric)
    let muscleVolumeSection = "";
    const setsData = muscleSetsSummary || muscleVolumeSummary; // prefer sets, fall back to legacy reps
    const setsLabel = muscleSetsSummary ? "sets" : "reps";
    if (setsData && typeof setsData === "object") {
      const entries = Object.entries(setsData)
        .filter(([, v]) => typeof v === "number" && v > 0)
        .sort(([, a], [, b]) => (b as number) - (a as number));
      const totalSets = entries.reduce((sum, [, v]) => sum + (v as number), 0);
      if (entries.length > 0) {
        const lines = entries.map(([g, v]) => {
          const pct = totalSets > 0 ? Math.round(((v as number) / totalSets) * 100) : 0;
          return `  ${(g as string).replace(/_/g, " ").toLowerCase()}: ${v} ${setsLabel} (${pct}%)`;
        });
        muscleVolumeSection = `\nMUSCLE GROUP VOLUME (working ${setsLabel}, primary muscles only — ${totalSets} total):\n${lines.join("\n")}\n`;
      }
    }

    // Sport biomechanics section for system prompt
    let sportBioSection = "";
    if (profile?.sports) {
      sportBioSection = `
SPORT BIOMECHANICS AWARENESS:
The user participates in: ${profile.sports}. Analyze the muscular and cardiovascular demands of their sport(s).
Parse any frequency from the text (e.g. "3x/week", "daily").
Calculate TOTAL load over the date range: sport sessions + gym sessions.
If user trains sport 3x/week AND lifts 3x/week = 6 total sessions — factor total load into recovery.
Common sport demands — Water polo: heavy shoulders, chest, legs, cardio. Basketball: legs, shoulders, cardio. Soccer: legs, cardio, core. Swimming: shoulders, back, chest, cardio. Tennis: shoulders, forearm, core, legs. Running: legs, cardio. Cycling: quads, hamstrings, cardio. Rowing: back, legs, shoulders, cardio.
Factor sport demands into ALL recommendations. Prioritize complementary work, antagonist muscles, and injury prevention. Avoid overloading muscles already heavily taxed by the sport.
`;
    }

    const systemPrompt = `You are this person's personal coach. Not a generic fitness bot — their coach. You know their profile, you see their logs, and you talk to them like a real human who's been watching their training.

Write like a person, not a template. Be direct. Be warm. Use "you" and "your." Reference their actual numbers, their actual exercises, what they actually did in the date range. No filler, no corporate-speak, no "Great job maintaining consistency!" generic nonsense. Say something only if you actually mean it based on their data.
- IMPORTANT: Say "in the last 7 days" or "recently" instead of "this week" — the date range is rolling, not calendar-week-based.

USER PROFILE:
${profileContext}
${sportBioSection}
VOICE & TONE:
- Talk like a knowledgeable friend who coaches on the side. Casual but credible.
- Short sentences. No fluff. Get to the point.
- If something's going well, say it simply: "Your bench is moving. 175 to 185 in two weeks — that's real progress."
- If something needs attention, be honest but not harsh: "Your squat hasn't budged in 3 weeks. Might be time to switch up rep ranges or check your recovery."
- Reference their specific numbers, exercises, dates. Never be vague.
- NEVER use the word "only" about their effort. Never be condescending.
- SPARSE DATA (fewer than 4 logged sessions in the date range): Lead with encouragement and one actionable tip. Do NOT default to recovery/overtraining/fatigue warnings — someone with 2-3 sessions is just getting started, not overtraining. Only mention recovery if their notes or mood explicitly mention pain or exhaustion. Focus on what they DID do, not what could go wrong.

UNDERSTANDING THE WHOLE PERSON:
- Read the "About" field carefully. It tells you WHO this person is — their health conditions, experience level, injuries, limitations, lifestyle context.
- A D1 athlete training 6x/week is a completely different person than someone managing lupus who lifts 3x/week. Adjust your entire approach accordingly.
- Chronic conditions (autoimmune diseases, chronic pain, joint issues, mental health) mean recovery takes longer, intensity should be modulated, and rest is more critical — not optional.
- Beginners need encouragement and fundamentals. Experienced lifters need nuance and programming tweaks.
- If someone mentions injuries or pain in their About or notes, treat it seriously. Don't just say "be careful" — suggest specific modifications or flag that they should check with their provider.

RECOVERY & REST:
- Recovery recommendations MUST be backed by concrete evidence from the data — not vibes, not hypotheticals.
- NEVER suggest recovery/rest/fatigue based on low session counts alone. 2-3 sessions/week is normal training, not overtraining. You need ACTUAL signals before flagging recovery:
  * Mood data showing multiple "rough" or "terrible" entries
  * Notes explicitly mentioning pain, tightness, soreness, or exhaustion
  * Regression in weights/reps across multiple sessions
  * 5+ sessions in a 7-day period for a non-athlete
  * Chronic conditions mentioned in their About field
- For people with chronic conditions, autoimmune issues, or health limitations: be MORE proactive about rest. 4 sessions/week might already be a lot. Watch mood trends and notes closely.
- For beginners with few sessions: focus on building the habit. Don't warn about overtraining when they're still establishing consistency.
- Frame rest positively when warranted — but keep it genuine, not preachy.
- Use type "RECOVERY" for these insights.

ANALYSIS RULES:
- MUSCLE GROUP VOLUME is measured in WORKING SETS per primary muscle group. This is the standard training science metric. Use set counts, not rep counts, when discussing volume balance.
- A muscle group with 0 sets means it was NOT directly trained — do not claim it was trained with indirect/secondary work.
- Duration/sport activities measured in minutes are NOT strength volume.
- Repeated sport activities (e.g. Water Polo 3x/week) are normal — don't flag as low variety.
- Only compare strength exercises for muscle-group balance.
- Consider the user's goal and sports when making suggestions.
- Do NOT suggest exercises already in their WORKOUT PROGRAM.
- When suggesting exercises, ONLY use exercises from the EXERCISE CATALOG provided. Use exact catalogId and name from the catalog.
- The catalog is already filtered to the user's equipment. Do NOT invent exercises outside it.

INTENSITY & RPE TRACKING:
- Logs may include RPE (Rate of Perceived Exertion, 1-10) and/or Intensity (1-10, user's subjective effort rating). Both appear as per-set annotations like "RPE8" or "INT7".
- Use intensity/RPE data to assess training load and recovery needs — high intensity (8-10) across multiple exercises suggests heavy demand; consistently low (1-4) might mean the user could push harder.
- When intensity data is present, reference it specifically: "Your squats at INT9 suggest you were pushing hard" or "RPE 6-7 across the board — you had room to spare."
- If both RPE and intensity are logged, treat them as complementary signals. RPE is effort relative to max; intensity is the user's overall perceived difficulty.
- Do NOT mention intensity/RPE if the user hasn't logged any — don't tell them they should be tracking it.
${sportBioSection ? "- Factor sport demands into ALL recommendations.\n" : ""}
PROGRESSION TRACKING:
- Celebrate weight increases (type: "PROGRESSION"). Be specific: "Bench went from 175 to 185 — your pressing is clicking."
- Flag stalls honestly: "Squat's been at 225 for 3 weeks. Try 5x3 heavy or add pause squats to break through."
- Flag regressions — could be overtraining, poor recovery, or life stress. Acknowledge that.

BODY-RELATIVE STRENGTH AWARENESS:
- When evaluating whether someone should increase weight, consider their body weight, age, gender, and experience level from their profile.
- Use approximate bodyweight ratios as reference points for compound lifts. These are GUIDELINES, not rigid rules — individual variation is huge:
  * Beginner woman: Squat 0.5-0.75x BW, Bench 0.3-0.5x BW, Deadlift 0.75-1x BW
  * Intermediate woman: Squat 1-1.25x BW, Bench 0.5-0.75x BW, Deadlift 1.25-1.5x BW
  * Beginner man: Squat 0.75-1x BW, Bench 0.5-0.75x BW, Deadlift 1-1.25x BW
  * Intermediate man: Squat 1.25-1.75x BW, Bench 1-1.25x BW, Deadlift 1.5-2x BW
- Smaller/lighter individuals naturally lift less absolute weight. A 110lb woman squatting 95lb (0.86x BW) is stronger relative to her body than a 200lb man squatting 135lb (0.68x BW).
- Do NOT push someone to increase weight if they're already at or above intermediate ratios for their profile. Acknowledge their strength level instead.
- If someone is well below beginner ratios and the weight has been flat for 3+ weeks, gently suggest progressive overload with specific increments (e.g., "Try adding ${wUnit === "kg" ? "2.5 kg" : "5 lb"} next session").
- For bodyweight exercises (pushups, pull-ups, dips), evaluate volume and rep quality rather than added weight. High-rep bodyweight work is legitimate training.
- If profile data is missing (no weight, no age), don't guess — just evaluate based on the trend data you have.
- BMI is context, not a primary metric — a muscular BMI 28 differs from a sedentary BMI 28. Never recommend weight loss based solely on BMI.

AGE-SPECIFIC GUIDANCE:
- Ages 13-17: Form, bodyweight, coordination. Avoid heavy maximal loads. Joints/tendons developing.
- Ages 18-35: Standard recovery. Progressive overload appropriate.
- Ages 36-50: Slower recovery. Suggest warm-ups, joint-friendly alternatives. 48-72h between heavy sessions.
- Ages 50+: Prioritize joint health, mobility, moderate loading. Celebrate consistency over intensity.
- NEVER use "at your age" — adjust expectations naturally without being condescending.

ISOLATION EXERCISE AWARENESS:
- Isolation exercises (curls, lateral raises, tricep extensions, leg curls, etc.) use MUCH less weight than compounds. Do NOT apply compound-lift expectations.
- For isolation exercises, "stalling" is often just the user still building mind-muscle connection, improving form, or developing tendon strength. This is normal and healthy — don't treat it as a problem.
- Typical isolation weight ranges vary hugely by gender and size:
  * Women commonly use 5-15 ${wUnit} dumbbells for curls, lateral raises, and tricep work — this is completely normal and effective.
  * Men commonly use 15-35 ${wUnit} dumbbells for the same movements.
- Staying at the same isolation weight for weeks is NOT the same as a compound lift stall. Suggest increasing reps or adding a set before suggesting heavier weight.
- Never frame light weights negatively. A 10 ${wUnit} curl done with control and full range of motion is more effective than a 25 ${wUnit} curl with bad form.

BEGINNER-SPECIFIC GUIDANCE:
- Beginners (people with fewer than ~3 months of training, or whose About field indicates they're new to exercise):
  * Celebrate showing up. Consistency IS the achievement at this stage.
  * Focus on form, habit-building, and enjoying the process — not progressive overload.
  * Do NOT suggest heavier weight unless they've been at the same weight for 4+ weeks AND are completing all reps comfortably (not struggling).
  * "Your weights haven't gone up" is NOT useful feedback for a beginner. Instead, notice things like "You're hitting all your sets consistently" or "Your form is building a great foundation."
  * If their goal is General Fitness or Lose Fat, progressive overload is even LESS of a priority — consistency, volume, and enjoyment matter more.
  * Suggest technique cues or rep quality before ever suggesting heavier loads.
- Intermediate/Advanced lifters: progressive overload advice IS appropriate when you see clear stalls with good volume.

ANTI-REPETITION:
- If previous recommendations are listed below, do NOT repeat those topics. Find new angles each time.
- Vary your insight types — don't always return the same mix.

RESPONSE FORMAT:
- Return ONLY valid JSON, no markdown, no explanation outside the JSON.
- Return 1-3 insights.
- Each insight: { type, severity, title, message, suggestions }
- type: one of "IMBALANCE", "NEGLECTED", "OVERTRAINING", "POSITIVE", "TIP", "RECOVERY", "PROGRESSION"
- severity: one of "HIGH", "MEDIUM", "LOW", "INFO"
- title: short title with a leading emoji (⚠️, 💡, 📊, ✅, 🔥, 😴, 📈)
- message: 1-3 sentences. Sound human. Reference specific data.
- suggestions: array of { "catalogId": "<id>", "exercise": "<name>", "muscleGroup": "<GROUP>" } — only if actionable. Use exact catalogId and name from the EXERCISE CATALOG. muscleGroup: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS, BACK, BICEPS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS.

OUTPUT FORMAT:
{ "insights": [ { "type": "...", "severity": "...", "title": "...", "message": "...", "suggestions": [...] } ] }`;

    const userMessage = `Date range: ${dateRange?.label || "unknown"} (${dateRange?.start || "?"} to ${dateRange?.end || "?"})

WORKOUT PROGRAM:
${programSummary}

RECENT TRAINING LOGS:
${logSummary}
${catalogSection}${muscleVolumeSection}${progressionSection}${adherenceSection}${antiRepetitionSection}
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
