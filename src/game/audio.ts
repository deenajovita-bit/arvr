let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    sfx.connect(master);
    master.connect(ctx.destination);
    master.gain.value = 0.7;
    sfx.gain.value = 0.9;
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function setMuted(v: boolean) {
  muted = v;
  if (master && ctx) {
    master.gain.setTargetAtTime(v ? 0 : 0.7, ctx.currentTime, 0.02);
  }
}

export function isMuted() {
  return muted;
}

function beep(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.08) {
  if (!ctx || !sfx || muted) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(sfx);
  osc.start(now);
  osc.stop(now + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

export const sfxCollect = () => {
  beep(520, 0.12, "triangle", 0.06);
  beep(780, 0.18, "sine", 0.05);
};
export const sfxOpen = () => {
  beep(180, 0.28, "sawtooth", 0.04);
  beep(90, 0.4, "square", 0.03);
};
export const sfxWrong = () => beep(140, 0.25, "square", 0.05);
export const sfxWin = () => {
  beep(392, 0.16, "triangle", 0.05);
  setTimeout(() => beep(523, 0.18, "triangle", 0.05), 90);
  setTimeout(() => beep(659, 0.28, "sine", 0.06), 180);
};
export const sfxTick = () => beep(880, 0.04, "square", 0.02);
