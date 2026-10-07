let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let amb: GainNode | null = null;
let muted = false;
let drone: OscillatorNode | null = null;

export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    amb = ctx.createGain();
    sfx.connect(master);
    amb.connect(master);
    master.connect(ctx.destination);
    master.gain.value = 0.7;
    sfx.gain.value = 0.9;
    amb.gain.value = 0.035;
    startDrone();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function startDrone() {
  if (!ctx || !amb || drone) return;
  const osc = ctx.createOscillator();
  const f = ctx.createBiquadFilter();
  osc.type = "triangle";
  osc.frequency.value = 46;
  f.type = "lowpass";
  f.frequency.value = 180;
  osc.connect(f);
  f.connect(amb);
  osc.start();
  drone = osc;
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
  beep(220, 0.08, "sine", 0.05);
  beep(440, 0.16, "triangle", 0.04);
};
export const sfxOpen = () => {
  beep(90, 0.4, "sawtooth", 0.035);
};
export const sfxWrong = () => beep(110, 0.28, "square", 0.045);
export const sfxWin = () => {
  beep(262, 0.18, "triangle", 0.045);
  setTimeout(() => beep(330, 0.2, "triangle", 0.045), 110);
  setTimeout(() => beep(392, 0.32, "sine", 0.05), 220);
};
export const sfxTick = () => beep(880, 0.04, "square", 0.02);
