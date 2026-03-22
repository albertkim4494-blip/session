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
      stream: streamRequested, // if true, return SSE stream instead of JSON blob
    } = await req.json();

    // Validate and resolve model + max_tokens
    const ALLOWED_MODELS = new Set(["gpt-4o", "gpt-4o-mini"]);
    const model = ALLOWED_MODELS.has(modelHint) ? modelHint : "gpt-4o-mini";
    const maxTokens = model === "gpt-4o" ? 1000 : 800;

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

    // Build muscle sets section (effective sets: primary + secondary at 0.5×)
    let muscleVolumeSection = "";
    // Prefer the detailed breakdown (includes exercise names & dates) over the summary
    if (muscleVolumeDetail && typeof muscleVolumeDetail === "string" && muscleVolumeDetail.trim()) {
      muscleVolumeSection = `\nMUSCLE GROUP VOLUME (effective sets, secondary muscles counted at 0.5× — with exercise breakdown):\n${muscleVolumeDetail}\n`;
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
          muscleVolumeSection = `\nMUSCLE GROUP VOLUME (effective ${setsLabel}, secondary muscles counted at 0.5× — ${totalSets} total):\n${lines.join("\n")}\n`;
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

    const systemPrompt = `You are a direct, data-driven performance coach who tracks this athlete over time.

Analyze their training data. Find the single highest-leverage variable. Give actionable advice for TODAY.

Be direct, warm, specific. Reference their actual numbers and exercises. No filler, no generic praise. Say something only if the data supports it.

Before responding, reason: What's the #1 leverage point? Trending up, flat, or down? Programming issue or compliance issue?

USER PROFILE:
${profileContext}
${sportBioSection}
RULES:
- Focus on TODAY. Date range label: "${dateRange?.label || "today"}". Use natural time refs ("this week", "recently"), not raw dates.
- Cite specific exercises and numbers: "7 chest sets — 4 from bench, 3 from cable fly" not just "7 sets of chest"
- Be concrete: "Add 3 sets of barbell rows on your next pull day" not "consider more back work"
- Use the MUSCLE GROUP VOLUME data's exact numbers/percentages. Never round non-zero to 0%.
- Volume = effective SETS (secondary muscles at 0.5×). Duration/sport minutes ≠ strength volume.
- Do NOT suggest exercises already in their program. Only suggest from EXERCISE CATALOG with exact catalogId.
- Frame suggestions as additions, not criticisms. Lead with what they've earned, then build on it.
- Sparse data (<4 sessions): encourage + one actionable tip. No overtraining warnings unless mood/notes show pain or exhaustion.
- Recovery advice needs evidence: mood trends, pain notes, regressions, or 5+ sessions/week. Not just low session count.
- Read their About field for health conditions, experience, limitations. Adjust accordingly.
- Sport activities: frame gym work as complementing their sport. Explain WHY specific exercises help.
- Bodyweight exercise difficulty varies hugely: 10 pull-ups > 30 push-ups in relative effort. Don't equate raw reps.
- Isolation exercises use less weight than compounds — flat isolation weight is normal, suggest more reps/sets first.
- RPE/Intensity: reference when present ("RPE 8 on squats — solid effort"), ignore if not logged.
- Coaching history: build on past advice, don't repeat verbatim. Escalate specificity if issues persist (shownCount 1→suggestion, 2→directive, 3+→exact prescription).
- If user acted on advice, acknowledge it. If they didn't, try a new angle.

LOG FORMATS:
- Strength: "8@185 RPE8" = 8 reps at 185 ${wUnit}
- Duration: "45 min total" — time-based, NOT strength reps
- Distance: "3.5 miles"
- Pace: "pace:7:30" — lower = faster = better
- Never mix unit types in comparisons.

HISTORY TIERS:
- Current range logs = primary data (HIGH weight)
- Recent history (prior 4 weeks) = context for trends (MEDIUM weight). Muscle trained recently but not this week = normal rotation, not neglect.
- Older history = long-term progression only (LOW weight). Don't cite as actionable.

CHECK-IN (when present — HIGHEST PRIORITY):
Your first insight MUST acknowledge their mood, sleep, and pain. Then filter all advice through it:
- Good/great mood → push them. Okay → standard advice. Tough/brutal → "showing up matters", suggest lighter alternatives.
- Poor sleep → drop intensity 10-15%. Pain → avoid loading that area, suggest specific alternatives.
- If today's logs also exist, compare check-in state vs actual performance. Celebrate positive shifts ("came in rough, put in real work").
- If mood pattern shows they feel better after training, mention it.

COACH NOTES:
Return "coachNotes" array with any new patterns worth remembering. { "topic": "key", "detail": "observation", "date": "YYYY-MM-DD" }. Empty array if nothing new.

RESPONSE — return ONLY valid JSON:
{
  "trend_status": "improving|plateauing|regressing|mixed",
  "primary_focus": "highest leverage focus for today",
  "today_action": "specific instruction for next session",
  "insights": [1-3 objects: { "type": "IMBALANCE|NEGLECTED|OVERTRAINING|POSITIVE|TIP|RECOVERY|PROGRESSION", "severity": "HIGH|MEDIUM|LOW|INFO", "title": "emoji + short title", "message": "2-3 sentences, specific numbers, concrete action", "suggestions": [{"catalogId":"id","exercise":"name","muscleGroup":"GROUP"}], "confidence": 0.0-1.0, "evidence": "data points", "expected_outcome": "what improves" }],
  "coachNotes": []
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
      temperature: 0.5,
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

    // Call OpenAI with retry on 429 (rate limit)
    const openaiHeaders = {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Build OpenAI request body — add stream flag if SSE requested
    const openaiParsed = JSON.parse(openaiBody);
    if (streamRequested) openaiParsed.stream = true;
    const finalOpenaiBody = JSON.stringify(openaiParsed);

    let openaiRes: Response | null = null;
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: openaiHeaders,
        body: finalOpenaiBody,
      });

      if (openaiRes.status !== 429) break;

      // 429 rate limit — wait and retry
      const retryAfter = openaiRes.headers.get("retry-after");
      const waitMs = retryAfter ? Math.min(Number(retryAfter) * 1000, 10000) : (attempt + 1) * 2000;
      console.log(JSON.stringify({ event: "ai_rate_limit", feature: "coach", attempt, waitMs }));
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (!openaiRes || !openaiRes.ok) {
      const status = openaiRes?.status ?? 0;
      const errText = openaiRes ? await openaiRes.text() : "No response";
      console.error("OpenAI API error:", status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error", detail: status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // -----------------------------------------------------------------------
    // STREAMING PATH: parse OpenAI SSE stream, extract complete insight objects,
    // and forward them to the client as SSE events.
    // -----------------------------------------------------------------------
    if (streamRequested && openaiRes.body) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const reader = openaiRes.body.getReader();

      const sseStream = new ReadableStream({
        async start(controller) {
          let fullText = "";

          try {
            let sseBuffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              sseBuffer += decoder.decode(value, { stream: true });

              // Process SSE lines from OpenAI
              const lines = sseBuffer.split("\n");
              sseBuffer = lines.pop() || ""; // keep incomplete line

              for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const payload = line.slice(6).trim();
                if (payload === "[DONE]") continue;

                try {
                  const chunk = JSON.parse(payload);
                  const delta = chunk.choices?.[0]?.delta?.content;
                  if (delta) fullText += delta;
                } catch {
                  // skip malformed chunks
                }
              }

              // Try to extract complete insight objects from accumulated text
              // Look for the "insights" array and extract complete objects
              const insightsMatch = fullText.match(/"insights"\s*:\s*\[/);
              if (insightsMatch) {
                const arrayStart = fullText.indexOf("[", insightsMatch.index);
                let depth = 0;
                let objStart = -1;
                let insightsSent = 0;
                // Count how many insights we've already sent
                const sentMarker = "\u0000"; // Track sent objects
                let searchFrom = arrayStart + 1;

                // Count already-sent insights by counting complete objects
                let tempDepth = 0;
                let tempObjStart = -1;
                let completeObjects = 0;
                for (let i = arrayStart + 1; i < fullText.length; i++) {
                  const ch = fullText[i];
                  if (ch === '"') {
                    // Skip string contents
                    i++;
                    while (i < fullText.length && fullText[i] !== '"') {
                      if (fullText[i] === '\\') i++;
                      i++;
                    }
                    continue;
                  }
                  if (ch === '{') {
                    if (tempDepth === 0) tempObjStart = i;
                    tempDepth++;
                  } else if (ch === '}') {
                    tempDepth--;
                    if (tempDepth === 0 && tempObjStart >= 0) {
                      completeObjects++;
                      tempObjStart = -1;
                    }
                  }
                }

                // Send any newly completed insight objects
                if (completeObjects > insightsSent) {
                  // Re-parse to extract individual objects
                  let d = 0;
                  let oStart = -1;
                  let objectIndex = 0;
                  for (let i = arrayStart + 1; i < fullText.length; i++) {
                    const ch = fullText[i];
                    if (ch === '"') {
                      i++;
                      while (i < fullText.length && fullText[i] !== '"') {
                        if (fullText[i] === '\\') i++;
                        i++;
                      }
                      continue;
                    }
                    if (ch === '{') {
                      if (d === 0) oStart = i;
                      d++;
                    } else if (ch === '}') {
                      d--;
                      if (d === 0 && oStart >= 0) {
                        if (objectIndex >= insightsSent) {
                          const objStr = fullText.slice(oStart, i + 1);
                          try {
                            const insight = JSON.parse(objStr);
                            controller.enqueue(
                              encoder.encode(`data: ${JSON.stringify({ type: "insight", data: insight })}\n\n`)
                            );
                          } catch {
                            // Incomplete or malformed — skip
                          }
                        }
                        objectIndex++;
                        oStart = -1;
                      }
                    }
                  }
                  insightsSent = completeObjects;
                }
              }
            }

            // Stream finished — parse the complete response
            const cleaned = fullText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
            let parsed;
            try {
              parsed = JSON.parse(cleaned);
            } catch {
              console.log(JSON.stringify({ event: "ai_parse_fail", feature: "coach", contentPreview: fullText.slice(0, 200) }));
              parsed = { insights: [] };
            }

            const returnedCoachNotes = Array.isArray(parsed.coachNotes) ? parsed.coachNotes : [];

            // Send final done event with metadata
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: "done",
                coachNotes: returnedCoachNotes,
                trendStatus: parsed.trend_status || null,
              })}\n\n`)
            );

            console.log(JSON.stringify({
              event: "ai_success",
              feature: "coach",
              model,
              maxTokens,
              streamed: true,
              insightCount: Array.isArray(parsed.insights) ? parsed.insights.length : 0,
              coachNotesCount: returnedCoachNotes.length,
            }));
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "error", message: msg })}\n\n`)
            );
            console.error("Stream error:", msg);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(sseStream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // -----------------------------------------------------------------------
    // NON-STREAMING PATH (original behavior)
    // -----------------------------------------------------------------------
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
