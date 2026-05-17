// Plans-tab shared bits: spring theme, plans-specific TopBar, sample data.

// Spring theme removed — real codebase only ships dark / light / japandi (Night / Day / Nature).

// ─── Plans-specific icons (extend ICONS at runtime) ─────────────────────
const PLANS_ICONS = {
  layers:    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  calendar:  'M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z',
  search:    'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  more:      'M5 12h.01M12 12h.01M19 12h.01',
  pencil:    'M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z',
  trash:     'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6',
  share:     'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  reorder:   'M3 6h18M3 12h18M3 18h18',
  copy:      'M9 9h13v13H9zM5 15H3a2 2 0 01-2-2V3a2 2 0 012-2h10a2 2 0 012 2v2',
  wand:      'M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M3 21l9-9M12 12l4 4',
  repeat:    'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  list:      'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  grid:      'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  drag:      'M9 4h.01M15 4h.01M9 12h.01M15 12h.01M9 20h.01M15 20h.01',
};
Object.assign(window.ICONS || {}, PLANS_ICONS);

// ─── Plans Top Bar — title + subtitle + search affordance ───────────────
function PlansTopBar({ theme, title = 'Plans', subtitle, onSearch }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '8px 18px 4px',
    }}>
      <div>
        <div style={{ fontSize: 11, color: theme.textTertiary, fontWeight: 700,
                      letterSpacing: 1.4, textTransform: 'uppercase' }}>
          {subtitle || 'Build your training'}
        </div>
        <div style={{ fontSize: 26, color: theme.text, fontWeight: 700,
                      letterSpacing: -0.6, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <IconChip theme={theme} icon={ICONS.search} aria="Search"/>
        <IconChip theme={theme} icon={ICONS.more} aria="More"/>
      </div>
    </div>
  );
}

function IconChip({ theme, icon, accent, aria, onClick }) {
  return (
    <button onClick={onClick} aria-label={aria} style={{
      width: 34, height: 34, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: accent ? theme.accent : theme.subtleBg,
      color: accent ? theme.appBg : theme.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon d={icon} size={16} color={accent ? theme.appBg : theme.textSecondary}/>
    </button>
  );
}

// ─── Sample plans data (one realistic split + standalones) ──────────────
const PLANS_SAMPLE = {
  split: {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    mode: 'weekly',
    cadence: '6× per week',
    members: [
      { id: 'w1', name: 'Push · Upper', category: 'Strength',  days: [1, 4],
        exercises: ['Bench press','Incline DB','Overhead press','Lateral raise','Triceps pushdown','Cable fly'] },
      { id: 'w2', name: 'Pull · Upper', category: 'Strength',  days: [2, 5],
        exercises: ['Deadlift','Barbell row','Lat pulldown','Face pull','EZ curl','Hammer curl'] },
      { id: 'w3', name: 'Legs',         category: 'Strength',  days: [3, 6],
        exercises: ['Back squat','RDL','Bulgarian split','Leg curl','Calf raise'] },
    ],
  },
  standalones: [
    { id: 'w4', name: 'Easy run',  category: 'Conditioning', exercises: ['Zone 2 · 35 min'] },
    { id: 'w5', name: 'Mobility',  category: 'Recovery',     exercises: ['Hips','T-spine','Ankles','Shoulders'] },
  ],
};

// Day labels Mon–Sun (matches PLANS_SAMPLE.days indices 1–7 → Mon–Sun)
const DAY_LABELS = ['M','T','W','T','F','S','S'];

// Build a 7-slot week assignment from a split's weekly members.
function buildWeekAssignments(split) {
  const week = [null, null, null, null, null, null, null];
  if (!split || split.mode !== 'weekly') return week;
  split.members.forEach(m => {
    (m.days || []).forEach(d => {
      // d is 1-indexed Mon..Sun
      if (d >= 1 && d <= 7) week[d - 1] = m;
    });
  });
  return week;
}

// ─── Generic primitives reused across plans variants ────────────────────
function Chip({ theme, children, accent, dim, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 999,
      background: accent ? theme.accentSoft : theme.subtleBg,
      color: accent ? theme.accent : (dim ? theme.textTertiary : theme.textSecondary),
      border: `1px solid ${accent ? theme.accentBorder : theme.border}`,
      ...style,
    }}>{children}</span>
  );
}

function Divider({ theme, style }) {
  return <div style={{ height: 1, background: theme.border, ...style }}/>;
}

// Horizontal day strip showing Mon–Sun with assigned workouts.
function WeekStrip({ theme, week, todayIdx = 3, compact = false }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {DAY_LABELS.map((d, i) => {
        const w = week[i];
        const isToday = i === todayIdx;
        const has = !!w;
        return (
          <div key={i} style={{
            flex: 1, padding: compact ? '6px 4px' : '10px 4px 8px',
            borderRadius: 12,
            background: isToday ? theme.accentSoft : (has ? theme.subtleBg : 'transparent'),
            border: `1px solid ${isToday ? theme.accentBorder : (has ? theme.border : 'transparent')}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
                          color: isToday ? theme.accent : theme.textTertiary }}>{d}</div>
            <div style={{
              width: compact ? 6 : 8, height: compact ? 6 : 8, borderRadius: 999,
              background: has ? (isToday ? theme.accent : theme.borderStrong) : 'transparent',
              border: has ? 'none' : `1.5px dashed ${theme.border}`,
            }}/>
            {!compact && (
              <div style={{ fontSize: 9, fontWeight: 600, color: theme.textTertiary,
                            maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' }}>
                {has ? w.name.split(/[ ·]/)[0] : 'rest'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { PlansTopBar, IconChip, PLANS_SAMPLE, DAY_LABELS,
                        buildWeekAssignments, Chip, Divider, WeekStrip });
