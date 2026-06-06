// Synthesized "cha-ching" confirmation sound via the Web Audio API.
// No audio asset needed; respects the user's sound preference (checked by caller).

let ctx;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

// A short, pleasant two-note rising chime that reads as "added / success".
export function playAddSound() {
  const ac = getCtx();
  if (!ac) return;
  // Browsers start the context suspended until a user gesture; a save click qualifies.
  if (ac.state === 'suspended') ac.resume();

  const now = ac.currentTime;
  const notes = [
    { freq: 880.0, at: 0 },     // A5
    { freq: 1318.51, at: 0.085 }, // E6
  ];

  notes.forEach(({ freq, at }) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + at);
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(0.16, now + at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.28);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + at);
    osc.stop(now + at + 0.3);
  });
}
