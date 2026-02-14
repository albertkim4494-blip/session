export const SOUND_LIST = [
  { key: "beep", label: "Beep" },
  { key: "chime", label: "Chime" },
  { key: "bell", label: "Bell" },
  { key: "pulse", label: "Pulse" },
  { key: "birdsong", label: "Birdsong" },
];

export function playTimerSound(soundKey) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    switch (soundKey) {
      case "chime": {
        // Two-tone ascending — 660Hz then 880Hz, gentle fade
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.25, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        const o1 = ctx.createOscillator();
        o1.frequency.value = 660;
        o1.connect(g);
        o1.start(now);
        o1.stop(now + 0.18);

        const o2 = ctx.createOscillator();
        o2.frequency.value = 880;
        o2.connect(g);
        o2.start(now + 0.2);
        o2.stop(now + 0.4);
        o2.onended = () => ctx.close();
        break;
      }
      case "bell": {
        // Soft sine bell — 523Hz with longer decay
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = 523;
        o.connect(g);
        o.start(now);
        o.stop(now + 0.5);
        o.onended = () => ctx.close();
        break;
      }
      case "pulse": {
        // Triple short pulse — three quick 740Hz blips
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.value = 0;
        // Pulse 1
        g.gain.setValueAtTime(0.3, now);
        g.gain.setValueAtTime(0, now + 0.06);
        // Pulse 2
        g.gain.setValueAtTime(0.3, now + 0.12);
        g.gain.setValueAtTime(0, now + 0.18);
        // Pulse 3
        g.gain.setValueAtTime(0.3, now + 0.24);
        g.gain.setValueAtTime(0, now + 0.30);

        const o = ctx.createOscillator();
        o.frequency.value = 740;
        o.connect(g);
        o.start(now);
        o.stop(now + 0.32);
        o.onended = () => ctx.close();
        break;
      }
      case "birdsong": {
        // Gentle warbler — two soft chirps with moderate frequency sweep
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0, now);
        // Chirp 1 — gentle fade in/out
        g.gain.linearRampToValueAtTime(0.15, now + 0.04);
        g.gain.linearRampToValueAtTime(0, now + 0.22);
        // Chirp 2 — slightly louder, longer tail
        g.gain.linearRampToValueAtTime(0.18, now + 0.32);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        const o = ctx.createOscillator();
        o.type = "sine";
        // First chirp: gentle rise
        o.frequency.setValueAtTime(1200, now);
        o.frequency.exponentialRampToValueAtTime(1800, now + 0.18);
        // Second chirp: slightly higher, gentle wobble
        o.frequency.setValueAtTime(1400, now + 0.30);
        o.frequency.exponentialRampToValueAtTime(2100, now + 0.50);
        o.frequency.exponentialRampToValueAtTime(1900, now + 0.58);
        o.connect(g);
        o.start(now);
        o.stop(now + 0.62);
        o.onended = () => ctx.close();
        break;
      }
      default: {
        // "beep" — single 880Hz tone, 0.15s
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.3;
        o.start();
        o.stop(now + 0.15);
        o.onended = () => ctx.close();
        break;
      }
    }
  } catch {}
}
