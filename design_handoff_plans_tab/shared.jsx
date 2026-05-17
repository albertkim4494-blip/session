// Shared workout-domain components & icons used across all 4 variations.
// Each accepts a `theme` token object (one of THEMES.dark/light/japandi values).

// ─── Icons ─────────────────────────────────────────────────────────────
function Icon({ d, size = 18, stroke = 2, fill = 'none', color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  flame: 'M12 2c1 3 4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-5 2 1 3 0 3-4zM7 14a5 5 0 0010 0',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
  arrow: 'M5 12h14M13 5l7 7-7 7',
  check: 'M20 6L9 17l-5-5',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  sparkle: 'M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 3v2m0 14v2M5 12H3m18 0h-2m-1.6-6.4l-1.4 1.4M7 17l-1.4 1.4m0-12.8L7 7m10 10l1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z',
  mic: 'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  play: 'M5 3l14 9-14 9V3z',
  dumbbell: 'M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12',
  chevR: 'M9 6l6 6-6 6',
  chevL: 'M15 6l-6 6 6 6',
  chevD: 'M6 9l6 6 6-6',
};

// ─── Mood faces (5 levels: brutal → great) ─────────────────────────────
function MoodFace({ level, size = 28, color }) {
  // level 1=brutal 2=tough 3=okay 4=good 5=great
  const c = color || '#FFD93D';
  const stroke = '#5D4E00';
  const eyeY = 13;
  const mouth = {
    1: 'M9 19 Q12 16 15 19',  // frown
    2: 'M9 18 Q12 17 15 18',  // small frown
    3: 'M9 18 L15 18',        // flat
    4: 'M9 17 Q12 19 15 17',  // small smile
    5: 'M8 16 Q12 21 16 16',  // big smile
  }[level];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <circle cx="12" cy="12" r="10.5" fill={c} stroke={stroke} strokeOpacity="0.3" strokeWidth="0.8"/>
      <circle cx="9" cy={eyeY} r="0.9" fill={stroke}/>
      <circle cx="15" cy={eyeY} r="0.9" fill={stroke}/>
      <path d={mouth} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Sun arc (time-of-day glyph) ───────────────────────────────────────
function SunArc({ time = 'morning', size = 64, color = '#fde68a', muted = 'rgba(255,255,255,0.15)' }) {
  // sun position along an arc based on time of day
  const positions = { dawn: 0.05, morning: 0.28, afternoon: 0.5, evening: 0.78, night: 0.95 };
  const t = positions[time] ?? 0.5;
  // arc from (10,50) to (90,50), peak at (50,8)
  const angle = Math.PI * (1 - t);
  const cx = 50 - Math.cos(angle) * 40;
  const cy = 50 - Math.sin(angle) * 36;
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} style={{ overflow: 'visible' }}>
      <path d="M10,50 Q50,8 90,50" fill="none" stroke={muted} strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round"/>
      <line x1="6" y1="50" x2="94" y2="50" stroke={muted} strokeWidth="0.6"/>
      <circle cx={cx} cy={cy} r="6" fill={color}/>
      <circle cx={cx} cy={cy} r="11" fill={color} opacity="0.25"/>
    </svg>
  );
}

// ─── Base card ─────────────────────────────────────────────────────────
function Card({ theme, children, style, padded = true }) {
  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: 18,
      padding: padded ? 16 : 0,
      boxShadow: theme.shadow,
      ...style,
    }}>{children}</div>
  );
}

// ─── Bottom tab bar (Train / Plan / Progress / You) ────────────────────
function BottomTabs({ theme, active = 'Train', float = false }) {
  const tabs = [
    { label: 'Train', icon: ICONS.dumbbell },
    { label: 'Plan', icon: ICONS.bolt },
    { label: 'Progress', icon: 'M3 17l6-6 4 4 8-8' },
    { label: 'You', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0' },
  ];
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: float ? '10px 8px' : '12px 8px 6px',
      borderTop: float ? 'none' : `1px solid ${theme.border}`,
      background: float ? theme.cardBg : theme.appBg,
      borderRadius: float ? 999 : 0,
      margin: float ? '0 36px 8px' : 0,
      boxShadow: float ? theme.shadow : 'none',
      border: float ? `1px solid ${theme.border}` : undefined,
      borderTopColor: float ? theme.border : undefined,
    }}>
      {tabs.map(t => {
        const isActive = t.label === active;
        return (
          <div key={t.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? theme.accent : theme.textTertiary,
            fontSize: 10, fontWeight: 600, letterSpacing: 0.2,
          }}>
            <Icon d={t.icon} size={20} stroke={2} color={isActive ? theme.accent : theme.textSecondary}/>
            <div>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Top header bar (date/avatar) ──────────────────────────────────────
function TopBar({ theme, title = 'Train', date = 'Wed · May 6' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 18px 4px',
    }}>
      <div>
        <div style={{ fontSize: 11, color: theme.textTertiary, fontWeight: 600,
                      letterSpacing: 1, textTransform: 'uppercase' }}>{date}</div>
        <div style={{ fontSize: 22, color: theme.text, fontWeight: 700, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: 999,
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBorder})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme.appBg, fontSize: 13, fontWeight: 700,
        border: `1px solid ${theme.border}`,
      }}>JM</div>
    </div>
  );
}

// ─── Pain body silhouette (tiny) ───────────────────────────────────────
function BodyMap({ theme, marks = [], size = 100 }) {
  // marks: [{ part, severity }]   severity: 'mild'|'moderate'|'severe'
  const sevColor = { mild: '#eab308', moderate: '#f97316', severe: '#ef4444' };
  const positions = {
    'lower back':   { x: 50, y: 56 },
    'shoulder':     { x: 32, y: 36 },
    'knee':         { x: 50, y: 88 },
    'neck':         { x: 50, y: 22 },
    'wrist':        { x: 22, y: 60 },
  };
  return (
    <svg viewBox="0 0 100 130" width={size * 0.77} height={size} style={{ display: 'block' }}>
      {/* head */}
      <circle cx="50" cy="14" r="9" fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      {/* torso */}
      <path d="M38 26 Q50 24 62 26 L66 56 Q66 70 60 78 L40 78 Q34 70 34 56 Z"
            fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      {/* arms */}
      <path d="M38 30 L24 60 L20 78" fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      <path d="M62 30 L76 60 L80 78" fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      {/* legs */}
      <path d="M44 78 L40 110 L38 124" fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      <path d="M56 78 L60 110 L62 124" fill="none" stroke={theme.borderStrong} strokeWidth="1.2"/>
      {marks.map((m, i) => {
        const pos = positions[m.part];
        if (!pos) return null;
        return (
          <g key={i}>
            <circle cx={pos.x} cy={pos.y} r="9" fill={sevColor[m.severity]} opacity="0.18"/>
            <circle cx={pos.x} cy={pos.y} r="4" fill={sevColor[m.severity]}/>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Time-of-day atmosphere (radial wash) ──────────────────────────────
function Atmosphere({ theme, themeName, time, intensity = 1 }) {
  const tod = TIME_OF_DAY[time];
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '70%',
      pointerEvents: 'none',
      backgroundImage: tod.gradient(themeName),
      opacity: intensity,
      zIndex: 0,
      maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
    }}/>
  );
}

Object.assign(window, {
  Icon, ICONS, MoodFace, SunArc, Card, BottomTabs, TopBar, BodyMap, Atmosphere,
});
