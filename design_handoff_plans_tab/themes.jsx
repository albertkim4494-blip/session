// Train tab themes — dark, light, japandi
// Plus time-of-day atmosphere ramps.

const THEMES = {
  dark: {
    name: 'Dark',
    appBg: '#0d1117',
    text: '#e8eef7',
    textSecondary: 'rgba(232,238,247,0.55)',
    textTertiary: 'rgba(232,238,247,0.35)',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.14)',
    cardBg: '#161b22',
    cardAltBg: '#0d1117',
    shadow: '0 2px 8px rgba(0,0,0,0.3)',
    accent: '#7dd3fc',
    accentSoft: 'rgba(125,211,252,0.10)',
    accentBorder: 'rgba(125,211,252,0.30)',
    subtleBg: 'rgba(255,255,255,0.06)',
    subtleTrack: 'rgba(255,255,255,0.08)',
    statusDark: true,
    glassTint: 'rgba(255,255,255,0.04)',
  },
  light: {
    name: 'Light',
    appBg: '#f8f9fa',
    text: '#1f2933',
    textSecondary: 'rgba(10,14,20,0.58)',
    textTertiary: 'rgba(10,14,20,0.35)',
    border: 'rgba(10,14,20,0.08)',
    borderStrong: 'rgba(10,14,20,0.16)',
    cardBg: '#ffffff',
    cardAltBg: '#f3f3ee',
    shadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)',
    accent: '#2b5b7a',
    accentSoft: 'rgba(43,91,122,0.10)',
    accentBorder: 'rgba(43,91,122,0.25)',
    subtleBg: 'rgba(10,14,20,0.04)',
    subtleTrack: 'rgba(10,14,20,0.08)',
    statusDark: false,
    glassTint: 'rgba(0,0,0,0.03)',
  },
  japandi: {
    name: 'Japandi',
    appBg: '#F5F1E8',
    text: '#3d3529',
    textSecondary: 'rgba(42,37,32,0.60)',
    textTertiary: 'rgba(42,37,32,0.36)',
    border: 'rgba(42,37,32,0.10)',
    borderStrong: 'rgba(42,37,32,0.20)',
    cardBg: '#FBF8F2',
    cardAltBg: '#F5F1E8',
    shadow: '0 1px 2px rgba(60,40,20,0.06), 0 6px 18px rgba(60,40,20,0.05)',
    accent: '#D97706',
    accentSoft: 'rgba(217,119,6,0.10)',
    accentBorder: 'rgba(217,119,6,0.25)',
    subtleBg: 'rgba(42,37,32,0.05)',
    subtleTrack: 'rgba(42,37,32,0.10)',
    statusDark: false,
    glassTint: 'rgba(0,0,0,0.02)',
  },
};

// Time-of-day atmosphere — a radial wash that sits behind hero content.
// Each maps to: greeting, accent hue shift, gradient stops.
const TIME_OF_DAY = {
  dawn: {
    greeting: 'Good morning',
    sub: 'Ease into the day',
    // soft peach → indigo fade
    gradient: (theme) => theme === 'dark'
      ? 'radial-gradient(120% 80% at 50% -10%, rgba(255,170,140,0.55) 0%, rgba(120,90,180,0.40) 38%, rgba(13,17,23,0) 75%)'
      : theme === 'japandi'
      ? 'radial-gradient(120% 70% at 50% -10%, rgba(220,150,110,0.30) 0%, rgba(200,160,180,0.18) 38%, rgba(236,230,220,0) 72%)'
      : 'radial-gradient(120% 70% at 50% -10%, rgba(255,180,150,0.45) 0%, rgba(180,160,210,0.30) 35%, rgba(250,250,247,0) 70%)',
    sun: '#ffb38a',
  },
  morning: {
    greeting: 'Good morning',
    sub: 'Let’s move',
    gradient: (theme) => theme === 'dark'
      ? 'radial-gradient(120% 80% at 50% -10%, rgba(125,211,252,0.55) 0%, rgba(80,140,200,0.35) 40%, rgba(13,17,23,0) 75%)'
      : theme === 'japandi'
      ? 'radial-gradient(120% 70% at 50% -10%, rgba(180,200,180,0.32) 0%, rgba(220,200,170,0.22) 40%, rgba(236,230,220,0) 72%)'
      : 'radial-gradient(120% 70% at 50% -10%, rgba(160,210,240,0.45) 0%, rgba(200,220,200,0.25) 40%, rgba(250,250,247,0) 72%)',
    sun: '#fde68a',
  },
  afternoon: {
    greeting: 'Good afternoon',
    sub: 'Strong middle',
    gradient: (theme) => theme === 'dark'
      ? 'radial-gradient(120% 80% at 50% -10%, rgba(255,210,140,0.50) 0%, rgba(200,140,90,0.36) 40%, rgba(13,17,23,0) 75%)'
      : theme === 'japandi'
      ? 'radial-gradient(120% 70% at 50% -10%, rgba(230,200,150,0.32) 0%, rgba(210,170,120,0.20) 40%, rgba(236,230,220,0) 72%)'
      : 'radial-gradient(120% 70% at 50% -10%, rgba(255,220,160,0.40) 0%, rgba(240,200,150,0.25) 40%, rgba(250,250,247,0) 72%)',
    sun: '#fbbf24',
  },
  evening: {
    greeting: 'Good evening',
    sub: 'One more push',
    gradient: (theme) => theme === 'dark'
      ? 'radial-gradient(120% 80% at 50% -10%, rgba(255,130,90,0.60) 0%, rgba(150,70,140,0.45) 40%, rgba(13,17,23,0) 75%)'
      : theme === 'japandi'
      ? 'radial-gradient(120% 70% at 50% -10%, rgba(220,130,100,0.32) 0%, rgba(180,110,140,0.20) 40%, rgba(236,230,220,0) 72%)'
      : 'radial-gradient(120% 70% at 50% -10%, rgba(255,160,120,0.42) 0%, rgba(220,140,180,0.26) 40%, rgba(250,250,247,0) 72%)',
    sun: '#f97316',
  },
  night: {
    greeting: 'Good evening',
    sub: 'Quiet finish',
    gradient: (theme) => theme === 'dark'
      ? 'radial-gradient(120% 80% at 50% -10%, rgba(120,135,220,0.55) 0%, rgba(60,50,130,0.45) 40%, rgba(13,17,23,0) 75%)'
      : theme === 'japandi'
      ? 'radial-gradient(120% 70% at 50% -10%, rgba(120,130,170,0.28) 0%, rgba(100,90,130,0.18) 40%, rgba(236,230,220,0) 72%)'
      : 'radial-gradient(120% 70% at 50% -10%, rgba(140,150,210,0.34) 0%, rgba(110,120,180,0.20) 40%, rgba(250,250,247,0) 72%)',
    sun: '#818cf8',
  },
};

window.THEMES = THEMES;
window.TIME_OF_DAY = TIME_OF_DAY;
