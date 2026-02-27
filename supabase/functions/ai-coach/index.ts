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
      coachingHistory,
      sportTraits,      // aggregated sport demand traits { upperPush, upperPull, legLoad, ... }
      muscleSetsSummary,
      muscleVolumeSummary, // legacy, ignored if muscleSetsSummary present
      muscleVolumeDetail, // detailed breakdown: "chest: 7 sets — Bench Press ×4 (02-12), Cable Fly ×3 (02-14)"
      recentHistory, // tier 1: summarized 4-week history before current range
      olderHistory,  // tier 2: high-level all-time history before recent
      modelHint,     // client-computed model routing: "gpt-4o" or "gpt-4o-mini"
      checkin,           // today's check-in: { mood, moodLabel, sleep, pain }
      checkinHistory,    // last 14 days of check-ins
      moodPattern,       // pre vs post workout mood pattern string
      coachNotes,        // AI's persisted notes about this user
    } = await req.json();

    // Validate and resolve model + max_tokens
    const ALLOWED_MODELS = new Set(["gpt-4o", "gpt-4o-mini"]);
    const model = ALLOWED_MODELS.has(modelHint) ? modelHint : "gpt-4o-mini";
    const maxTokens = model === "gpt-4o" ? 1200 : 1000;

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

    // Build coaching history section for continuity and anti-repetition
    let coachingHistorySection = "";
    if (coachingHistory && Array.isArray(coachingHistory.entries) && coachingHistory.entries.length > 0) {
      const entryLines: string[] = [];
      for (const entry of coachingHistory.entries) {
        let line = `- ${entry.lastShown} [${entry.type}, shown ${entry.shownCount}x]: "${entry.title}"`;
        if (entry.message) line += `\n  Message: "${entry.message.slice(0, 200)}"`;
        if (Array.isArray(entry.suggestions) && entry.suggestions.length > 0) {
          line += `\n  Suggestions: ${entry.suggestions.map((s: { exercise?: string }) => s.exercise || "unknown").join(", ")}`;
        }
        // Attach follow-up if available
        const followUp = (coachingHistory.followUps || []).find(
          (f: { title: string }) => f.title === entry.title
        );
        if (followUp && Array.isArray(followUp.followUp) && followUp.followUp.length > 0) {
          line += `\n  Follow-up: ${followUp.followUp.join(" ")}`;
        }
        entryLines.push(line);
      }
      coachingHistorySection = `\nYOUR PREVIOUS COACHING NOTES (you said these — build on them, don't repeat verbatim):\n${entryLines.join("\n\n")}\n`;
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

    // Sport biomechanics section — built from inferred traits, not hardcoded mappings
    let sportBioSection = "";
    if (sportTraits && typeof sportTraits === "object") {
      const traitLabels: Record<string, string> = {
        upperPush: "Upper push — chest, front delts, triceps",
        upperPull: "Upper pull — back, rear delts, biceps",
        legLoad: "Leg load — quads, hamstrings, glutes",
        coreRotation: "Core / rotation — abs, obliques",
        gripLoad: "Grip / forearm",
        impactStress: "Impact / joint stress",
        explosiveness: "Explosiveness / fast-twitch",
        cardioLoad: "Cardio / endurance",
      };
      const level = (v: number) => v >= 0.7 ? "HIGH" : v >= 0.4 ? "MOD" : "LOW";
      const traitLines = Object.entries(sportTraits)
        .filter(([, v]) => typeof v === "number" && (v as number) > 0.1)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([k, v]) => `  ${traitLabels[k] || k}: ${level(v as number)} (${(v as number).toFixed(1)})`);
      if (traitLines.length > 0) {
        sportBioSection = `
SPORT DEMAND PROFILE (inferred from logged activities${profile?.sports ? " + profile" : ""}):
${profile?.sports ? `Declared sports: ${profile.sports}\n` : ""}Trait profile (0.0 = no demand, 1.0 = maximum):
${traitLines.join("\n")}

Use these traits to:
- Prioritize COMPLEMENTARY muscle work — muscles NOT heavily used by their sport need gym attention.
- Avoid overloading muscles already taxed at HIGH level — the sport provides stimulus.
- Factor total training load (sport + gym) into recovery recommendations.
- HIGH impactStress → prioritize joint-friendly exercises, mobility, and recovery.
- HIGH cardioLoad from sport → reduce dedicated gym cardio, account for aerobic fatigue.
- HIGH explosiveness → consider periodizing heavy lifting around competition/practice days.
`;
      }
    } else if (profile?.sports) {
      sportBioSection = `
SPORT CONTEXT:
The user's profile mentions: ${profile.sports}. Factor sport demands into recommendations. Prioritize complementary work and injury prevention.
`;
    }

    const systemPrompt = `You are a performance coach with long-term memory of this athlete's training history.

Your job: analyze structured training data, identify the highest leverage variable affecting progress, and provide actionable coaching for TODAY.

You are not a cheerleader. You are not a generic fitness assistant. You are a performance strategist tracking trends over time.

Write like a person, not a template. Be direct. Be warm. Use "you" and "your." Reference their actual numbers, their actual exercises, what they actually did. No filler, no corporate-speak, no "Great job maintaining consistency!" generic nonsense. Say something only if you actually mean it based on their data.

INTERNAL REASONING (do this before generating output):
- What is the single highest leverage variable right now?
- Is the athlete trending upward, flat, or unstable?
- Is this a programming issue or a compliance issue?
- What should they focus on TODAY?

ANALYSIS WINDOWS:
- PRIMARY WINDOW = most recent 2–3 weeks. This drives your analysis.
- CONTEXT WINDOW = full date range provided. Use for trends and long-term narrative.
- If trends conflict between windows, prioritize the primary window.
- Focus on advice for TODAY. The date range label is "${dateRange?.label || "today"}".

SPECIFICITY REQUIREMENTS — every insight MUST follow these:
- Frame advice for TODAY. Do not include raw date ranges in your output — the user sees them in the app UI. Use natural time references like "this week", "recently", or "over the last few weeks".
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

TONE CALIBRATION (adjust based on trend):
- If improving: Confident, momentum-driven. Reinforce execution. "This is working. Keep pushing."
- If plateauing: Direct, strategic, focused. "Time to change variables. Here's what to try."
- If regressing: Simplify, reduce overwhelm. Prioritize recovery or reset. "Let's strip back and rebuild."
- Avoid hype unless supported by data.

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

COACHING CONTINUITY:
- You have history with this person. Reference previous observations when relevant.
- If the user acted on your advice and improved, acknowledge execution: "You added rows like I suggested — your back volume doubled."
- If they didn't act on advice, gently revisit with a new angle — don't just repeat the same thing.
- If a metric you flagged has changed (better or worse), call it out.
- Build on threads: "Previously I noticed X. Now I'm seeing Y."
- Do NOT repeat prior phrasing verbatim. Do NOT restate resolved issues. Focus on evolution.
- If coaching history is provided below, use it to inform your response — but only reference insights that are relevant to current data.

ESCALATION LOGIC (when an issue persists across multiple coaching cycles):
- shownCount 1 = Suggestion: "You might want to try..."
- shownCount 2 = Clear directive: "Add 3 sets of rows to your next pull day."
- shownCount 3+ = Direct instruction with exact implementation: "On your next Pull day, do Barbell Rows 4×8 at 135 before lat pulldowns."
- Escalate clarity and specificity, not volume. Do not repeat the same wording across stages.

BEHAVIORAL PATTERNS:
- If follow-up data shows the user consistently acts on advice → increase progression complexity, suggest more nuanced programming changes.
- If follow-up data shows the user ignores suggestions → simplify, make the next action extremely specific and low-friction.
- Do NOT mention these patterns to the user. Use them silently to calibrate your coaching style.

PRIORITIZATION:
- Return insights ranked by impact on progress.
- If one bottleneck blocks multiple goals, prioritize that.
- Avoid minor optimizations if a major plateau or regression exists.
- Distinguish between programming issues (wrong exercises, wrong volume) and compliance issues (not following through).

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

PRE-WORKOUT CHECK-IN:
- The user may have told you how they feel right now, their sleep quality, and any pain. This data appears in TODAY'S CHECK-IN above.
- Use this to adjust your recommendations: rough mood + poor sleep → suggest lighter session or modified exercises.
- Pain areas should influence exercise suggestions: shoulder pain → avoid overhead pressing, suggest alternatives. Lower back pain → avoid heavy deadlifts, suggest hip hinge alternatives.
- Compare their pre-workout mood to their post-workout mood patterns (PRE VS POST WORKOUT MOOD PATTERN above). If they typically feel better after training, acknowledge that: "You've felt rough before but great after 5 of your last 7 sessions — you'll probably feel better once you get moving."
- If they report severe pain anywhere, flag it seriously and suggest modifications or rest for that area.
- If no check-in data is present, proceed with training data analysis as normal.

COACH NOTES:
- You can remember things about this person across sessions.
- If the user's check-in reveals a pattern (recurring pain, consistent sleep issues, mood trends), add it to your notes.
- Return a "coachNotes" array in your response with any new observations worth remembering.
- Each note: { "topic": "short_key", "detail": "what you observed", "date": "YYYY-MM-DD" }
- Only add notes for genuine insights, not every check-in. Empty array if nothing new.

OUTPUT FORMAT:
{
  "trend_status": "improving | plateauing | regressing | mixed",
  "primary_focus": "Single highest leverage focus for today",
  "today_action": "Specific, implementable instruction for the next session",
  "insights": [ { "type": "...", "severity": "...", "title": "...", "message": "...", "suggestions": [...], "confidence": 0.8, "evidence": "...", "expected_outcome": "..." } ],
  "coachNotes": [ { "topic": "short_key", "detail": "what you observed", "date": "YYYY-MM-DD" } ]
}`;

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

    // Build check-in sections for user message
    let checkinSection = "";
    if (checkin && typeof checkin === "object") {
      const painStr = Array.isArray(checkin.pain) && checkin.pain.length > 0
        ? checkin.pain.map((p: { area: string; severity: string }) => `${p.area} (${p.severity})`).join(", ")
        : "None";
      checkinSection = `\nTODAY'S CHECK-IN:\n- Feeling: ${checkin.moodLabel || "unknown"} (${checkin.mood}/2)\n- Sleep: ${checkin.sleep || "unknown"}\n- Pain: ${painStr}\n`;
    }

    let checkinHistorySection = "";
    if (Array.isArray(checkinHistory) && checkinHistory.length > 0) {
      const histLines = checkinHistory.map((c: { date: string; moodLabel: string; sleep: string; pain: Array<{ area: string; severity: string }> }) => {
        const painStr = Array.isArray(c.pain) && c.pain.length > 0
          ? c.pain.map((p: { area: string; severity: string }) => `${p.area} (${p.severity})`).join(", ")
          : "No pain";
        return `  ${c.date}: Feeling ${c.moodLabel || "?"}, Slept ${c.sleep || "?"}, Pain: ${painStr}`;
      });
      checkinHistorySection = `\nCHECK-IN HISTORY (last 14 days):\n${histLines.join("\n")}\n`;
    }

    let moodPatternSection = "";
    if (moodPattern && typeof moodPattern === "string") {
      moodPatternSection = `\nPRE VS POST WORKOUT MOOD PATTERN:\n${moodPattern}\n`;
    }

    let coachNotesSection = "";
    if (coachNotes && Array.isArray(coachNotes.notes) && coachNotes.notes.length > 0) {
      const noteLines = coachNotes.notes.map((n: { topic: string; detail: string }) => `- ${n.topic}: ${n.detail}`);
      coachNotesSection = `\nYOUR NOTES ABOUT THIS PERSON (things you've learned):\n${noteLines.join("\n")}\n`;
    }

    const userMessage = `Date range: ${dateRange?.label || "unknown"} (${dateRange?.start || "?"} to ${dateRange?.end || "?"})
${checkinSection}${checkinHistorySection}${moodPatternSection}${coachNotesSection}${muscleVolumeSection}${progressionSection}${volumeLoadSection}${e1rmSection}
WORKOUT PROGRAM:
${programSummary}

RECENT TRAINING LOGS:
${logSummary}
${catalogSection}${fatigueSection}${recentHistorySection}${olderHistorySection}${adherenceSection}${coachingHistorySection}
Analyze this data and return JSON insights.`;

    const openaiBody = JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    console.log(JSON.stringify({
      event: "ai_request",
      feature: "coach",
      model,
      systemPromptLen: systemPrompt.length,
      userMessageLen: userMessage.length,
      bodyLen: openaiBody.length,
    }));

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: openaiBody,
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
    const returnedCoachNotes = Array.isArray(parsed.coachNotes) ? parsed.coachNotes : [];

    console.log(JSON.stringify({
      event: "ai_success",
      feature: "coach",
      model,
      maxTokens,
      insightCount: insights.length,
      coachNotesCount: returnedCoachNotes.length,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
      totalTokens: usage?.total_tokens,
    }));

    return new Response(
      JSON.stringify({ insights, coachNotes: returnedCoachNotes }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : undefined;
    console.error("Edge function error:", errMsg, errStack);
    return new Response(
      JSON.stringify({ error: "Internal error", detail: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
