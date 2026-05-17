// PLANS REDESIGN — final direction.
//
// Hierarchy: Splits → Workouts → Exercises
// (rename "Programs" → "Workouts" in the actual codebase too.)
//
// Two big changes from the current Plans tab:
//   1. Splits and Workouts unified into ONE library list. A split is a
//      container card that visibly holds its workouts; standalone workouts
//      are simple rows in the same feed. Visual hierarchy without separate
//      sections.
//   2. NO inline icon clusters. Tap a workout → opens a detail sheet that IS
//      the editor (name, category, cadence, exercises, share, delete, reorder).
//      Tap an exercise → opens exercise edit sheet. All tap targets ≥44pt.
//
// Frames in this file:
//   PlansLibraryFrame   — main view, all states via prop
//   WorkoutDetailFrame  — tap-a-workout sheet
//   ExerciseEditFrame   — tap-an-exercise sheet

// ── data ──────────────────────────────────────────────────────────────

const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function cadenceLabel(c) {
  if (!c) return null;
  if (c.mode === 'anchor')     return c.days?.length ? c.days.map(d => DOW[d]).join(' · ') : 'Anchor';
  if (c.mode === 'weekly')     return `${c.perWeek}×/wk`;
  if (c.mode === 'continuous') return 'In split order';
  return null; // whenever
}

const SAMPLE = {
  splits: [{
    id: 'ppl', name: 'Push / Pull / Legs', mode: 'continuous',
    members: [
      { id: 'w1', name: 'Push',      category: 'Strength', cadence: { mode: 'continuous' },
        exercises: [
          { id: 'e1', name: 'Bench press',     unit: 'Weight × Reps' },
          { id: 'e2', name: 'Incline DB',      unit: 'Weight × Reps' },
          { id: 'e3', name: 'Overhead press',  unit: 'Weight × Reps' },
          { id: 'e4', name: 'Lateral raise',   unit: 'Weight × Reps' },
          { id: 'e5', name: 'Triceps pushdown',unit: 'Weight × Reps' },
        ],
      },
      { id: 'w2', name: 'Pull',      category: 'Strength', cadence: { mode: 'continuous' },
        exercises: [
          { id: 'e6', name: 'Deadlift',     unit: 'Weight × Reps' },
          { id: 'e7', name: 'Barbell row',  unit: 'Weight × Reps' },
          { id: 'e8', name: 'Lat pulldown', unit: 'Weight × Reps' },
          { id: 'e9', name: 'Face pull',    unit: 'Weight × Reps' },
          { id: 'e10', name: 'EZ curl',     unit: 'Weight × Reps' },
        ],
      },
      { id: 'w3', name: 'Legs',      category: 'Strength', cadence: { mode: 'continuous' },
        exercises: [
          { id: 'e11', name: 'Back squat',   unit: 'Weight × Reps' },
          { id: 'e12', name: 'RDL',          unit: 'Weight × Reps' },
          { id: 'e13', name: 'Bulgarian split', unit: 'Weight × Reps' },
          { id: 'e14', name: 'Leg curl',     unit: 'Weight × Reps' },
          { id: 'e15', name: 'Calf raise',   unit: 'Weight × Reps' },
        ],
      },
    ],
  }],
  workouts: [
    { id: 'w-run',  name: 'Easy run',   category: 'Run',      cadence: { mode: 'weekly', perWeek: 2 },
      exercises: [{ id: 'e16', name: 'Zone 2 · 35 min', unit: 'Duration' }] },
    { id: 'w-mob',  name: 'Mobility',   category: 'Recovery', cadence: { mode: 'whenever' },
      exercises: [
        { id: 'e17', name: 'Hips',      unit: 'Duration' },
        { id: 'e18', name: 'T-spine',   unit: 'Duration' },
        { id: 'e19', name: 'Ankles',    unit: 'Duration' },
        { id: 'e20', name: 'Shoulders', unit: 'Duration' },
      ] },
    { id: 'w-polo', name: 'Water polo', category: 'Sport',    cadence: { mode: 'anchor', days: [2, 4] },
      exercises: [{ id: 'e21', name: 'Practice', unit: 'Duration' }] },
  ],
};

// ── Library frame ─────────────────────────────────────────────────────

function PlansLibraryFrame({ themeName = 'dark', state = 'full' }) {
  const theme = THEMES[themeName];
  const empty = state === 'empty';

  const splits    = empty ? [] : SAMPLE.splits;
  const workouts  = empty ? [] : (state === 'sparse' ? SAMPLE.workouts.slice(0, 1) : SAMPLE.workouts);
  const totalItems = splits.reduce((n, s) => n + s.members.length, 0) + workouts.length;

  return (
    <Frame theme={theme}>
      <PlansTopBar theme={theme} title="Plans" subtitle={empty ? 'Build your training' : `${totalItems} workouts`}/>

      {/* Create row — the loudest thing on the page */}
      <div style={{ padding: '8px 16px 4px', display: 'flex', gap: 8 }}>
        <CreateBtn theme={theme} primary icon={ICONS.plus} label="New workout"/>
        <CreateBtn theme={theme} icon={ICONS.layers}  label="New split"/>
        <CreateBtn theme={theme} icon={ICONS.sparkle} aria="AI generate" iconOnly accent/>
      </div>

      {/* Library */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 16px' }}>
        {empty ? (
          <EmptyHero theme={theme}/>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {splits.map(s => <SplitCard key={s.id} theme={theme} split={s}/>)}
            {workouts.length > 0 && (
              <>
                {splits.length > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                                textTransform: 'uppercase', color: theme.textTertiary,
                                marginTop: 6, marginBottom: -4, paddingLeft: 4 }}>
                    Standalone workouts
                  </div>
                )}
                {workouts.map(w => <WorkoutCard key={w.id} theme={theme} w={w}/>)}
              </>
            )}
          </div>
        )}
      </div>

      <BottomTabs theme={theme} active="Plan"/>
    </Frame>
  );
}

// ── Workout detail sheet frame ────────────────────────────────────────

function WorkoutDetailFrame({ themeName = 'dark' }) {
  const theme = THEMES[themeName];
  const w = SAMPLE.splits[0].members[0]; // Push

  return (
    <Frame theme={theme}>
      {/* Dimmed library backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: theme.appBg, opacity: 1 }}/>
      <BlurredBackdrop theme={theme}/>

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        top: 70,
        background: theme.cardBg, color: theme.text,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Sheet handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2,
                        background: theme.borderStrong, opacity: 0.5 }}/>
        </div>

        {/* Sheet header */}
        <div style={{ display: 'flex', alignItems: 'center',
                      padding: '8px 14px 4px', gap: 10 }}>
          <button style={{
            padding: '6px 10px', background: 'transparent', border: 'none',
            color: theme.textSecondary, cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
          }}>Close</button>
          <div style={{ flex: 1 }}/>
          <button style={{
            padding: '6px 14px', borderRadius: 999, border: 'none',
            background: theme.accent, color: theme.appBg, cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
          }}>Done</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '6px 18px 18px' }}>
          {/* Workout name — editable inline */}
          <div style={{ fontSize: 26, fontWeight: 700, color: theme.text,
                        letterSpacing: -0.5, marginTop: 4 }}>
            {w.name}
          </div>

          {/* Meta chips — tap to edit */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <MetaChip theme={theme} label="Category"  value={w.category}/>
            <MetaChip theme={theme} label="Schedule"  value="In split: PPL"/>
            <MetaChip theme={theme} label="Cadence"   value="Continuous"/>
          </div>

          {/* Exercises section */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                          textTransform: 'uppercase', color: theme.textTertiary }}>
              Exercises · {w.exercises.length}
            </div>
            <button style={{
              padding: '4px 10px', background: 'transparent',
              border: `1px solid ${theme.border}`, borderRadius: 999,
              color: theme.textSecondary, cursor: 'pointer',
              fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
            }}>Reorder</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {w.exercises.map((ex, i) => (
              <ExerciseRow key={ex.id} theme={theme} ex={ex} idx={i+1}/>
            ))}
            <button style={{
              width: '100%', padding: '13px 14px', borderRadius: 14,
              background: 'transparent', color: theme.accent,
              border: `1.5px dashed ${theme.accentBorder}`, cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginTop: 2,
            }}>
              <Icon d={ICONS.plus} size={13} color={theme.accent} stroke={2.4}/>
              Add exercise
            </button>
          </div>

          {/* Bottom actions */}
          <div style={{ marginTop: 22, paddingTop: 16,
                        borderTop: `1px solid ${theme.border}`,
                        display: 'flex', gap: 8 }}>
            <ActionRow theme={theme} icon={ICONS.share}  label="Share"/>
            <ActionRow theme={theme} icon={ICONS.copy}   label="Duplicate"/>
            <ActionRow theme={theme} icon={ICONS.trash}  label="Delete" danger/>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ── Exercise edit sheet frame ─────────────────────────────────────────

function ExerciseEditFrame({ themeName = 'dark' }) {
  const theme = THEMES[themeName];
  return (
    <Frame theme={theme}>
      <div style={{ position: 'absolute', inset: 0, background: theme.appBg }}/>
      <BlurredBackdrop theme={theme}/>

      {/* Smaller sheet — feels lighter than workout sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: theme.cardBg, color: theme.text,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
        padding: '10px 18px 22px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2,
                        background: theme.borderStrong, opacity: 0.5 }}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{
            padding: '6px 10px', background: 'transparent', border: 'none',
            color: theme.textSecondary, cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 700, textAlign: 'center',
                        color: theme.text }}>Edit exercise</div>
          <button style={{
            padding: '6px 14px', borderRadius: 999, border: 'none',
            background: theme.accent, color: theme.appBg, cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
          }}>Save</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel theme={theme}>Name</FieldLabel>
          <TextField theme={theme} value="Bench press"/>
        </div>

        <div style={{ marginTop: 16 }}>
          <FieldLabel theme={theme}>How do you track this?</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <UnitOption theme={theme} active label="Weight × Reps" sub="kg or lbs"/>
            <UnitOption theme={theme}        label="Reps only"     sub="bodyweight"/>
            <UnitOption theme={theme}        label="Duration"      sub="min : sec"/>
            <UnitOption theme={theme}        label="Distance"      sub="km or mi"/>
          </div>
        </div>

        <button style={{
          marginTop: 22, width: '100%', padding: '12px',
          borderRadius: 12, border: `1px solid ${theme.border}`,
          background: 'transparent', color: theme.dangerText || '#ef4444',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon d={ICONS.trash} size={13} color={theme.dangerText || '#ef4444'}/>
          Delete exercise
        </button>
      </div>
    </Frame>
  );
}

// ── pieces ────────────────────────────────────────────────────────────

function Frame({ theme, children }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: theme.appBg, color: theme.text, position: 'relative',
      fontFamily: '-apple-system, system-ui, sans-serif', overflow: 'hidden',
    }}>{children}</div>
  );
}

function CreateBtn({ theme, primary, icon, label, iconOnly, accent, aria }) {
  return (
    <button aria-label={aria} style={{
      flex: iconOnly ? '0 0 44px' : 1,
      height: 44,
      padding: iconOnly ? 0 : '0 14px',
      borderRadius: 12,
      background: primary ? theme.accent : (accent ? theme.accentSoft : theme.cardBg),
      color: primary ? theme.appBg : (accent ? theme.accent : theme.text),
      border: `1px solid ${primary ? theme.accent : (accent ? theme.accentBorder : theme.border)}`,
      cursor: 'pointer',
      fontSize: 13.5, fontWeight: 700, letterSpacing: -0.1,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      boxShadow: primary ? `0 1px 2px rgba(0,0,0,0.05)` : 'none',
    }}>
      <Icon d={icon} size={iconOnly ? 17 : 14}
            color={primary ? theme.appBg : (accent ? theme.accent : theme.text)}
            stroke={primary ? 2.6 : 2.2}/>
      {!iconOnly && label}
    </button>
  );
}

function SplitCard({ theme, split }) {
  return (
    <div style={{
      background: theme.cardBg, borderRadius: 16,
      border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
      overflow: 'hidden',
    }}>
      {/* Split header — tappable */}
      <button style={{
        width: '100%', background: 'transparent', border: 'none',
        borderBottom: `1px solid ${theme.border}`,
        textAlign: 'left', cursor: 'pointer',
        padding: '14px 14px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 4, alignSelf: 'stretch', borderRadius: 999,
          background: theme.accent,
        }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2,
                        color: theme.text }}>{split.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Chip theme={theme} accent>
              {split.mode === 'continuous' ? 'Continuous' : 'Weekly'}
            </Chip>
            <span style={{ fontSize: 11.5, color: theme.textSecondary }}>
              {split.members.length} workouts
            </span>
          </div>
        </div>
        <Icon d={ICONS.chevR} size={14} color={theme.textTertiary}/>
      </button>

      {/* Member workouts inside the split — visually nested */}
      <div style={{ background: theme.cardAltBg }}>
        {split.members.map((m, i) => (
          <WorkoutRow key={m.id} theme={theme} w={m}
            isLast={i === split.members.length - 1} nested
            position={split.mode === 'continuous' ? `Day ${i+1}` : null}/>
        ))}
      </div>
    </div>
  );
}

function WorkoutCard({ theme, w }) {
  return (
    <div style={{
      background: theme.cardBg, borderRadius: 14,
      border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
      overflow: 'hidden',
    }}>
      <WorkoutRow theme={theme} w={w} isLast/>
    </div>
  );
}

function WorkoutRow({ theme, w, isLast, nested, position }) {
  const cad = cadenceLabel(w.cadence);
  return (
    <button style={{
      width: '100%', minHeight: 60,
      padding: '12px 14px',
      background: 'transparent',
      border: 'none',
      borderBottom: !isLast ? `1px solid ${theme.border}` : 'none',
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {position && (
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
                           textTransform: 'uppercase', color: theme.textTertiary,
                           minWidth: 36 }}>{position}</span>
          )}
          <span style={{ fontSize: 14.5, fontWeight: 700, color: theme.text,
                         letterSpacing: -0.1 }}>{w.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3,
                      paddingLeft: position ? 44 : 0 }}>
          <span style={{ fontSize: 11.5, color: theme.textSecondary }}>
            {w.exercises.length} {w.exercises.length === 1 ? 'exercise' : 'exercises'}
          </span>
          {w.category && (
            <span style={{ fontSize: 11.5, color: theme.textTertiary }}>· {w.category}</span>
          )}
          {cad && !nested && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px',
                           borderRadius: 999,
                           background: theme.subtleBg, color: theme.textSecondary,
                           border: `1px solid ${theme.border}`,
                           marginLeft: 4 }}>{cad}</span>
          )}
        </div>
      </div>
      <Icon d={ICONS.chevR} size={14} color={theme.textTertiary}/>
    </button>
  );
}

function ExerciseRow({ theme, ex, idx }) {
  return (
    <button style={{
      width: '100%', minHeight: 56,
      padding: '12px 14px', borderRadius: 14,
      background: theme.cardAltBg, border: `1px solid ${theme.border}`,
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7,
        background: theme.subtleBg, fontSize: 11, fontWeight: 800,
        color: theme.textSecondary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{idx}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{ex.name}</div>
        <div style={{ fontSize: 11.5, color: theme.textSecondary, marginTop: 2 }}>{ex.unit}</div>
      </div>
      <Icon d={ICONS.chevR} size={13} color={theme.textTertiary}/>
    </button>
  );
}

function MetaChip({ theme, label, value }) {
  return (
    <button style={{
      padding: '8px 12px', borderRadius: 12,
      background: theme.subtleBg, border: `1px solid ${theme.border}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5,
                    textTransform: 'uppercase', color: theme.textTertiary }}>{label}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.text, marginTop: 1 }}>{value}</div>
    </button>
  );
}

function ActionRow({ theme, icon, label, danger }) {
  return (
    <button style={{
      flex: 1, padding: '12px 8px', borderRadius: 12,
      background: theme.subtleBg,
      border: `1px solid ${danger ? (theme.dangerBorder || theme.border) : theme.border}`,
      color: danger ? (theme.dangerText || '#ef4444') : theme.text,
      cursor: 'pointer',
      fontSize: 12, fontWeight: 700,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <Icon d={icon} size={15} color={danger ? (theme.dangerText || '#ef4444') : theme.textSecondary}/>
      {label}
    </button>
  );
}

function FieldLabel({ theme, children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  textTransform: 'uppercase', color: theme.textTertiary,
                  marginBottom: 6 }}>{children}</div>
  );
}

function TextField({ theme, value }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 12,
      background: theme.subtleBg, border: `1.5px solid ${theme.accentBorder}`,
      fontSize: 16, fontWeight: 600, color: theme.text,
    }}>{value}</div>
  );
}

function UnitOption({ theme, label, sub, active }) {
  return (
    <button style={{
      padding: '12px 12px', borderRadius: 12,
      background: active ? theme.accentSoft : theme.subtleBg,
      border: `1.5px solid ${active ? theme.accentBorder : theme.border}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? theme.accent : theme.text }}>{label}</div>
      <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function BlurredBackdrop({ theme }) {
  // simple dimmed gradient hinting at library content underneath
  return (
    <>
      <PlansTopBar theme={theme} title="Plans" subtitle="3 workouts"/>
      <div style={{ padding: '8px 16px', display: 'flex', gap: 8, opacity: 0.5 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 12, background: theme.accent }}/>
        <div style={{ flex: 1, height: 44, borderRadius: 12,
                      background: theme.cardBg, border: `1px solid ${theme.border}` }}/>
      </div>
      <div style={{ position: 'absolute', inset: 0, top: 0, background: 'rgba(0,0,0,0.35)' }}/>
    </>
  );
}

function EmptyHero({ theme }) {
  return (
    <div style={{ padding: '40px 16px 16px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 14px',
        borderRadius: 16, background: theme.accentSoft,
        border: `1px solid ${theme.accentBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon d={ICONS.dumbbell} size={24} color={theme.accent}/>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3, marginBottom: 4 }}>
        Build your first workout
      </div>
      <div style={{ fontSize: 13, color: theme.textSecondary,
                    lineHeight: 1.5, maxWidth: 260, margin: '0 auto 18px' }}>
        Start from scratch, or have AI build a full program from your goal and equipment.
      </div>
      <button style={{
        width: '100%', padding: '13px 14px', borderRadius: 12, border: 'none',
        background: theme.accent, color: theme.appBg, cursor: 'pointer',
        fontSize: 14, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <Icon d={ICONS.sparkle} size={14} color={theme.appBg}/>
        Generate with AI
      </button>
      <button style={{
        marginTop: 8, width: '100%', padding: '12px 14px', borderRadius: 12,
        background: 'transparent', color: theme.text,
        border: `1px solid ${theme.border}`, cursor: 'pointer',
        fontSize: 13.5, fontWeight: 600,
      }}>
        Start from scratch
      </button>
    </div>
  );
}

Object.assign(window, {
  PlansLibraryFrame, WorkoutDetailFrame, ExerciseEditFrame,
});
