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
      volumeLoadTrends,
      estimated1RMTrends,
      fatigueTrend,
      adherence,
      previousInsights,
      muscleSetsSummary,
      muscleVolumeSummary, // legacy, ignored if muscleSetsSummary present
      muscleVolumeDetail, // detailed breakdown: "chest: 7 sets — Bench Press ×4 (02-12), Cable Fly ×3 (02-14)"
      recentHistory, // tier 1: summarized 4-week history before current range
      olderHistory,  // tier 2: high-level all-time history before recent
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

    // Build anti-repetition section (enhanced with shown counts and date ranges)
    let antiRepetitionSection = "";
    if (previousInsights && Array.isArray(previousInsights.titles) && previousInsights.titles.length > 0) {
      const lines = previousInsights.titles.map((t: string, i: number) => {
        const count = previousInsights.shownCounts?.[i];
        const range = previousInsights.dateRanges?.[i];
        let line = `  - ${t}`;
        if (count > 1) line += ` (shown ${count}x)`;
        if (range) line += ` [${range}]`;
        return line;
      });
      antiRepetitionSection = `\nPREVIOUS RECOMMENDATIONS (do NOT repeat these topics — especially those shown 2+ times, unless the underlying data has materially changed since they were last shown):\n${lines.join("\n")}\n`;
    }

    // Build muscle sets section (primary-only working set counts — the standard volume metric)
    let muscleVolumeSection = "";
    // Prefer the detailed breakdown (includes exercise names & dates) over the summary
    if (muscleVolumeDetail && typeof muscleVolumeDetail === "string" && muscleVolumeDetail.trim()) {
      muscleVolumeSection = `\nMUSCLE GROUP VOLUME (working sets, primary muscles only — with exercise breakdown):\n${muscleVolumeDetail}\n`;
    } else {
      const setsData = muscleSetsSummary || muscleVolumeSummary;
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
- IMPORTANT: Use the date range label provided (e.g. "this week", "this month"). The date range start/end dates are the source of truth — only discuss data that falls within those dates.

SPECIFICITY REQUIREMENTS — every insight MUST follow these:
- Reference the date range naturally using the label: "${dateRange?.label || "This week"}" — do NOT include the actual start/end dates in parentheses. The user already sees the date range in the app UI. Just say "This week" or "This month", not "This week (2026-02-15 to 2026-02-20)".
- When citing muscle volume, name the SPECIFIC EXERCISES that contributed: "7 chest sets — 4 from bench press, 3 from cable fly" NOT just "7 sets of chest"
- When citing numbers, give context: "3 sets of back across 1 session" not just "3 sets of back"
- When recommending changes, be concrete: "Add 3 sets of barbell rows to your next pull day" not "consider more back work"
- VOLUME MATH: When comparing muscle groups, use ACCURATE percentages. If someone did 4 sets of push-ups and 1 set of pull-ups, chest is 80% and back is 20% — NOT 100% and 0%. Every completed set counts. Never round a non-zero number to 0% or claim 100% when other muscle groups were trained.
- BAD example: "You're doing 7 sets of chest but just 3 sets of back. Consider adding more back exercises."
- GOOD example: "This week, your chest got 7 working sets (bench press ×4, cable fly ×3) but your back got 3 sets from lat pulldowns on one session. Try adding 3-4 sets of barbell rows on your next training day to even this out."

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
- The MUSCLE GROUP VOLUME section below contains pre-computed set counts and percentages per muscle group. USE THESE EXACT NUMBERS — do not invent your own percentages. If it says "chest: 4 sets (80%)" and "back: 1 set (20%)", say 80/20, not 100/0. NEVER claim a muscle group has 0% or was "neglected" if it appears in the volume data with any sets > 0.
- A muscle group with 0 sets means it was NOT directly trained — do not claim it was trained with indirect/secondary work.
- Duration/sport activities measured in minutes are NOT strength volume.
- Repeated sport activities (e.g. Water Polo 3x/week) are normal — don't flag as low variety.
- Only compare strength exercises for muscle-group balance.
- Consider the user's goal and sports when making suggestions.
- Do NOT suggest exercises already in their WORKOUT PROGRAM.
- When suggesting exercises, ONLY use exercises from the EXERCISE CATALOG provided. Use exact catalogId and name from the catalog.
- The catalog is already filtered to the user's equipment. Do NOT invent exercises outside it.

TIERED HISTORICAL CONTEXT — data arrives in layers with decreasing weight:
1. CURRENT RANGE (RECENT TRAINING LOGS above): HIGHEST weight. This is the primary data for your analysis — specific sets, reps, weights, RPE, mood, notes. All detailed insights should be grounded here.
2. RECENT HISTORY (4 weeks before current range): MEDIUM weight. Summarized per-exercise stats (best/avg weight, session count, RPE averages), muscle group balance, mood distribution, and injury/pain notes. Use this to:
   - Contextualize the current range: "Your bench best was 185 last month, and you hit 190 this week — you're progressing."
   - Avoid false neglect alarms: if a muscle was trained 3x in the past 4 weeks but not yet this week, that's NORMAL rotation — LOW/INFO at most, not HIGH.
   - Spot emerging trends: if RPE has been climbing across recent history + current range, note potential fatigue accumulation.
3. OLDER HISTORY (all-time before recent): LOW weight. High-level only — training tenure, long-term progression (first → best weight), overall mood trend, chronic injury notes. Use ONLY for:
   - Long-term progression narrative: "You started benching 135 in October, now hitting 190 — impressive trajectory."
   - Chronic patterns: if older history mentions recurring shoulder pain, factor that into current recommendations.
   - Do NOT cite specific older data as actionable — it's too stale for direct advice.

TIME-DECAY RULES:
- Mood and casual notes ("felt tired", "off day") from recent history have LOW relevance — everyone has off days. Only flag mood if there's a clear negative TREND (3+ rough sessions in recent history).
- Injury/pain notes retain relevance longer — if someone noted "shoulder pain" 3 weeks ago, still consider it.
- Weight progression retains relevance indefinitely — use it for long-term narrative.
- Frequency/consistency from recent history is relevant for current advice. From older history, only as backdrop.

SEVERITY CALIBRATION WITH HISTORY:
- Muscle untrained in current range BUT trained regularly in recent history = LOW/INFO, casual mention.
- Muscle untrained in current range AND in recent history (5+ weeks gap) = MEDIUM.
- Muscle rarely or never trained across all history = HIGH.
- Training frequency dips are normal. One lighter week after consistent recent history is NOT a crisis.

INTENSITY & RPE TRACKING:
- Logs may include RPE (Rate of Perceived Exertion, 1-10) and/or Intensity (1-10, user's subjective effort rating). Both appear as per-set annotations like "RPE8" or "INT7".
- Use intensity/RPE data to assess training load and recovery needs — high intensity (8-10) across multiple exercises suggests heavy demand; consistently low (1-4) might mean the user could push harder.
- When intensity data is present, reference it specifically: "Your squats at INT9 suggest you were pushing hard" or "RPE 6-7 across the board — you had room to spare."
- If both RPE and intensity are logged, treat them as complementary signals. RPE is effort relative to max; intensity is the user's overall perceived difficulty.
- Do NOT mention intensity/RPE if the user hasn't logged any — don't tell them they should be tracking it.

EXERCISE UNIT TYPES — logs use different units depending on exercise type. Analyze each type appropriately:
- **Strength (reps)**: Format is "8@185 RPE8" meaning 8 reps at 185 ${wUnit}. Evaluate volume (sets × reps), progressive overload (weight increases over time), and effort (RPE/intensity). Higher weight at same reps = progress. More reps at same weight = progress.
- **Duration (sec, min, hrs)**: Format is "45 min total (2 sessions)". These are time-based activities (e.g. planks, yoga, sports, cardio). Analyze total duration and frequency. More time or higher frequency = endurance progress. Do NOT count duration reps as strength reps — "45 min" of swimming is NOT "45 reps."
- **Distance (miles, yards, laps, steps)**: Format is "3.5 miles (1 set)". Analyze total distance and progression over time. More distance at same or lower time = improvement.
- **Pace (mm:ss or h:mm:ss)**: Appears as per-set annotation like "pace:7:30". This is time per unit distance (usually per mile or per km). LOWER pace = FASTER = better performance. A change from pace:8:00 to pace:7:30 is an improvement. Analyze pace trends the same way you'd analyze strength progression — consistent improvement means the user is getting fitter.
- **Custom fields**: Appear as per-set annotation like "[tempo: 3-1-2]" or "[band: red]". These are user-defined tracking fields. Acknowledge them if relevant to your analysis — they show the user is tracking specific training variables. Don't assume what they mean; use context clues.
- CRITICAL: Do NOT mix unit types in comparisons. You cannot compare 30 min of cardio to 30 reps of bench press. Treat each unit type as its own domain of analysis.
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
- BODYWEIGHT EXERCISE DIFFICULTY TIERS — these are NOT interchangeable. Comparing raw rep counts across different bodyweight exercises is misleading:
  * EASY tier (high reps expected): push-ups, bodyweight squats, lunges, crunches, planks. 30+ reps is common.
  * MEDIUM tier: dips, inverted rows, pike push-ups, step-ups. 10-20 reps is solid.
  * HARD tier (low reps expected): pull-ups, chin-ups, muscle-ups, pistol squats, handstand push-ups. 5-15 reps is strong. Most people can do 3x more push-ups than pull-ups.
  * When comparing muscle balance, 10 pull-ups represents MORE relative effort and training stimulus than 30 push-ups. Do NOT treat low pull-up reps as "neglecting back" when those reps are genuinely hard. 1 set of 10 pull-ups is meaningful back training.
  * If someone does both push-ups and pull-ups, acknowledge the difficulty difference. "You hit 100 push-ups and 10 pull-ups — that pull-up set carries more weight per rep than it looks."
- Evaluate bodyweight exercises by volume AND difficulty tier, not raw rep count alone. High-rep bodyweight work is legitimate training.
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
- Each insight: { type, severity, title, message, suggestions, confidence, evidence, expected_outcome }
- type: one of "IMBALANCE", "NEGLECTED", "OVERTRAINING", "POSITIVE", "TIP", "RECOVERY", "PROGRESSION"
- severity: one of "HIGH", "MEDIUM", "LOW", "INFO"
- title: short title with a leading emoji (⚠️, 💡, 📊, ✅, 🔥, 😴, 📈)
- message: 2-4 sentences. Sound human. First sentence states the finding with date range and specific numbers. Following sentences explain significance and give a concrete action step.
- suggestions: array of { "catalogId": "<id>", "exercise": "<name>", "muscleGroup": "<GROUP>" } — only if actionable. Use exact catalogId and name from the EXERCISE CATALOG. muscleGroup: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS, BACK, BICEPS, FOREARMS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS, OBLIQUES.
- confidence: number 0.0-1.0 — how confident you are based on available data (1.0 = strong data support, 0.5 = reasonable inference, <0.3 = speculative)
- evidence: string — which specific data points triggered this insight (cite dates, numbers, exercise names)
- expected_outcome: string — what should improve and in what timeframe if user follows advice

OUTPUT FORMAT:
{ "insights": [ { "type": "...", "severity": "...", "title": "...", "message": "...", "suggestions": [...], "confidence": 0.8, "evidence": "...", "expected_outcome": "..." } ] }`;

    // Build volume-load trends section
    let volumeLoadSection = "";
    if (Array.isArray(volumeLoadTrends) && volumeLoadTrends.length > 0) {
      volumeLoadSection = `\nVOLUME-LOAD TRENDS (total reps × weight per session):\n${volumeLoadTrends.map((t: string) => `  ${t}`).join("\n")}\n`;
    }

    // Build estimated 1RM trends section
    let e1rmSection = "";
    if (Array.isArray(estimated1RMTrends) && estimated1RMTrends.length > 0) {
      e1rmSection = `\nESTIMATED 1RM TRENDS (Epley formula):\n${estimated1RMTrends.map((t: string) => `  ${t}`).join("\n")}\n`;
    }

    // Build fatigue trend section
    let fatigueSection = "";
    if (fatigueTrend && typeof fatigueTrend === "string" && fatigueTrend.trim()) {
      fatigueSection = `\nFATIGUE TREND (last 7 days):\n${fatigueTrend.split("\n").map((l: string) => `  ${l}`).join("\n")}\n`;
    }

    // Build tiered historical context sections
    let recentHistorySection = "";
    if (recentHistory && typeof recentHistory === "string" && recentHistory.trim()) {
      recentHistorySection = `\nRECENT HISTORY (4 weeks before current range — MEDIUM weight, use for trends and context):\n${recentHistory.split("\n").map((l: string) => `  ${l}`).join("\n")}\n`;
    }
    let olderHistorySection = "";
    if (olderHistory && typeof olderHistory === "string" && olderHistory.trim()) {
      olderHistorySection = `\nOLDER HISTORY (all-time before recent — LOW weight, use for long-term progression and chronic patterns only):\n${olderHistory.split("\n").map((l: string) => `  ${l}`).join("\n")}\n`;
    }

    const userMessage = `Date range: ${dateRange?.label || "unknown"} (${dateRange?.start || "?"} to ${dateRange?.end || "?"})

WORKOUT PROGRAM:
${programSummary}

RECENT TRAINING LOGS:
${logSummary}
${catalogSection}${muscleVolumeSection}${progressionSection}${volumeLoadSection}${e1rmSection}${fatigueSection}${recentHistorySection}${olderHistorySection}${adherenceSection}${antiRepetitionSection}
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
    const usage = openaiData.usage;
    const content = openaiData.choices?.[0]?.message?.content || "{}";

    // Parse the JSON from the model response (strip markdown fences if present)
    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.log(JSON.stringify({ event: "ai_parse_fail", feature: "coach", contentPreview: content.slice(0, 200) }));
      console.error("Failed to parse AI response:", content);
      parsed = { insights: [] };
    }

    // Validate structure
    const insights = Array.isArray(parsed.insights) ? parsed.insights.slice(0, 3) : [];

    console.log(JSON.stringify({
      event: "ai_success",
      feature: "coach",
      insightCount: insights.length,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
      totalTokens: usage?.total_tokens,
    }));

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
