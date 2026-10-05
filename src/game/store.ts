import { create } from "zustand";
import {
  CASE,
  CLUES,
  CORRECT_SUSPECT,
  PROOF_CLUES,
  type ClueId,
  type SuspectId,
} from "./case";
import { sfxCollect, sfxOpen, sfxWrong, sfxWin } from "./audio";

export type Screen =
  | "menu"
  | "briefing"
  | "play"
  | "result";

type Store = {
  screen: Screen;
  timeLeft: number;
  score: number;
  clues: ClueId[];
  nearClue: ClueId | null;
  passageOpen: boolean;
  patternSolved: boolean;
  matchingSolved: boolean;
  accused: SuspectId | null;
  solved: boolean;
  failReason: string | null;
  hintUsed: boolean;
  notice: string | null;
  startedAt: number;
  setNearClue: (id: ClueId | null) => void;
  collect: (id: ClueId) => boolean;
  tryOpenPassage: () => void;
  tick: (dt: number) => void;
  useHint: () => void;
  solvePattern: (answer: string) => boolean;
  solveMatching: (ok: boolean) => void;
  accuse: (id: SuspectId) => void;
  start: () => void;
  briefing: () => void;
  toMenu: () => void;
  setNotice: (msg: string | null) => void;
};

const HINT_COST = 100;

function has(list: ClueId[], id: ClueId) {
  return list.includes(id);
}

export const useGame = create<Store>((set, get) => ({
  screen: "menu",
  timeLeft: CASE.timeLimit,
  score: 0,
  clues: [],
  nearClue: null,
  passageOpen: false,
  patternSolved: false,
  matchingSolved: false,
  accused: null,
  solved: false,
  failReason: null,
  hintUsed: false,
  notice: null,
  startedAt: 0,

  setNearClue: (id) => set({ nearClue: id }),

  setNotice: (msg) => set({ notice: msg }),

  collect: (id) => {
    const s = get();
    if (s.clues.includes(id) || s.screen !== "play") return false;
    const def = CLUES.find((c) => c.id === id);
    if (!def) return false;
    if (def.requires && !has(s.clues, def.requires)) {
      set({ notice: "You need another piece of evidence first." });
      return false;
    }
    const next = [...s.clues, id];
    const proofReady = PROOF_CLUES.every((p) => next.includes(p));
    sfxCollect();
    set({
      clues: next,
      score: s.score + def.points,
      matchingSolved: id === "watch" ? true : s.matchingSolved,
      notice: proofReady
        ? `Evidence logged: ${def.name}. You can prove Clara Wilson.`
        : `Evidence logged: ${def.name}`,
    });
    return true;
  },

  tryOpenPassage: () => {
    const s = get();
    if (s.passageOpen) return;
    if (!has(s.clues, "torn-note")) {
      set({ notice: "The bookshelf will not yield. You are missing a clue." });
      return;
    }
    sfxOpen();
    const already = has(s.clues, "passage");
    set({
      passageOpen: true,
      clues: already ? s.clues : [...s.clues, "passage"],
      score: already ? s.score : s.score + 300,
      notice: "Secret passage opened.",
    });
  },

  tick: (dt) => {
    const s = get();
    if (s.screen !== "play") return;
    const next = s.timeLeft - dt;
    if (next <= 0) {
      set({
        timeLeft: 0,
        screen: "result",
        solved: false,
        failReason: "The window closed. Case timed out.",
      });
      return;
    }
    set({ timeLeft: next });
  },

  useHint: () => {
    const s = get();
    if (s.screen !== "play") return;
    const missing = CLUES.filter((c) => !s.clues.includes(c.id));
    const hint =
      missing[0]?.id === "passage"
        ? "Scan the bookshelf after you have the torn note."
        : missing[0]
          ? `Look closer near: ${missing[0].name}.`
          : "You have the evidence. Accuse when ready.";
    set({
      hintUsed: true,
      score: Math.max(0, s.score - HINT_COST),
      notice: hint,
    });
  },

  solvePattern: (answer) => {
    const s = get();
    if (answer.trim() === "32") {
      set({
        patternSolved: true,
        score: s.score + 200,
        notice: "Pattern confirmed. The note's cipher checks out.",
      });
      sfxCollect();
      return true;
    }
    sfxWrong();
    set({ notice: "That sequence is wrong." });
    return false;
  },

  solveMatching: (ok) => {
    const s = get();
    if (ok) {
      set({
        matchingSolved: true,
        score: s.score + 250,
        notice: "Evidence board aligned.",
      });
      sfxCollect();
    } else {
      sfxWrong();
      set({
        score: Math.max(0, s.score - 50),
        notice: "Incorrect pairing. Re-read the watch and prints.",
      });
    }
  },

  accuse: (id) => {
    const s = get();
    const ready = PROOF_CLUES.every((p) => has(s.clues, p));
    if (!ready) {
      const missing = PROOF_CLUES.filter((p) => !has(s.clues, p))
        .map((p) => CLUES.find((c) => c.id === p)?.name)
        .filter(Boolean)
        .join("; ");
      set({ notice: `Not enough to charge anyone. Still need: ${missing}.` });
      return;
    }
    const correct = id === CORRECT_SUSPECT;
    let score = s.score;
    if (correct) {
      score += 500;
      if (has(s.clues, "key")) score += 300;
      const timeBonus = Math.round(s.timeLeft / 60) * 50;
      score += timeBonus;
      sfxWin();
      set({
        accused: id,
        solved: true,
        score,
        screen: "result",
        failReason: null,
      });
    } else {
      sfxWrong();
      set({
        accused: id,
        solved: false,
        score: Math.max(0, score - 300),
        screen: "result",
        failReason: "Wrong accusation. The true thief walks free.",
      });
    }
  },

  briefing: () => set({ screen: "briefing" }),

  start: () =>
    set({
      screen: "play",
      timeLeft: CASE.timeLimit,
      score: 0,
      clues: [],
      nearClue: null,
      passageOpen: false,
      patternSolved: false,
      matchingSolved: false,
      accused: null,
      solved: false,
      failReason: null,
      hintUsed: false,
      notice: "Walk the study. Clues sit on the desk, rug, and shelves — press E when close.",
      startedAt: performance.now(),
    }),

  toMenu: () =>
    set({
      screen: "menu",
      timeLeft: CASE.timeLimit,
      score: 0,
      clues: [],
      nearClue: null,
      passageOpen: false,
      patternSolved: false,
      matchingSolved: false,
      accused: null,
      solved: false,
      failReason: null,
      notice: null,
    }),
}));
