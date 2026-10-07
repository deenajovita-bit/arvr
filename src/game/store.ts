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
  inspecting: ClueId | null;
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
  closeInspect: () => void;
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

function canCharge(s: { clues: ClueId[]; matchingSolved: boolean }) {
  return PROOF_CLUES.every((p) => has(s.clues, p)) && s.matchingSolved;
}

export const useGame = create<Store>((set, get) => ({
  screen: "menu",
  timeLeft: CASE.timeLimit,
  score: 0,
  clues: [],
  nearClue: null,
  inspecting: null,
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

  closeInspect: () => set({ inspecting: null }),

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
    sfxCollect();
    const follow =
      id === "torn-note"
        ? "Read the scrap, then finish the sequence in Puzzles."
        : id === "watch"
          ? "The initials are on the case. Open Puzzles and match them."
          : def.teaser;
    set({
      clues: next,
      score: s.score + def.points,
      inspecting: id,
      notice: follow,
    });
    return true;
  },

  tryOpenPassage: () => {
    const s = get();
    if (s.passageOpen) return;
    if (!has(s.clues, "torn-note")) {
      set({ notice: "The shelf will not move. Something on paper is missing." });
      return;
    }
    if (!s.patternSolved) {
      set({
        notice: "The note has a sequence. Solve it in Puzzles — that number is the catch.",
        inspecting: "torn-note",
      });
      return;
    }
    sfxOpen();
    const already = has(s.clues, "passage");
    set({
      passageOpen: true,
      clues: already ? s.clues : [...s.clues, "passage"],
      score: already ? s.score : s.score + 300,
      inspecting: "passage",
      notice: "The fifth book was the latch. The wall is open.",
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
    let hint = "You have the evidence. Match C.W., then accuse.";
    if (!has(s.clues, "torn-note")) {
      hint = "Look under the desk for paper.";
    } else if (!s.patternSolved) {
      hint = "The scrap doubles each time: 2, 4, 8, 16, …";
    } else if (!s.passageOpen) {
      hint = "Count five books from the left on the lower shelf.";
    } else if (!has(s.clues, "watch")) {
      hint = "Metal glints on the floor by the shelves.";
    } else if (!s.matchingSolved) {
      hint = "C.W. — check each suspect's initials.";
    } else if (!has(s.clues, "fingerprint")) {
      hint = "Dust the blotter on the desk.";
    }
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
        notice: "32. Fifth number — the fifth book on the lower shelf is the latch.",
      });
      sfxCollect();
      return true;
    }
    sfxWrong();
    set({ notice: "That number is wrong. Look at the scrap again." });
    return false;
  },

  solveMatching: (ok) => {
    const s = get();
    if (!has(s.clues, "watch")) {
      set({ notice: "Find the pocket watch first. The initials are on the case." });
      return;
    }
    if (ok) {
      set({
        matchingSolved: true,
        score: s.score + 250,
        notice: "C.W. is Clara Wilson. The watch puts her in the study at 8:22.",
      });
      sfxCollect();
    } else {
      sfxWrong();
      set({
        score: Math.max(0, s.score - 50),
        notice: "Those initials do not match. Read the staff cards.",
      });
    }
  },

  accuse: (id) => {
    const s = get();
    if (!canCharge(s)) {
      const missing: string[] = [];
      if (!has(s.clues, "fingerprint")) missing.push("the blotter print");
      if (!has(s.clues, "watch")) missing.push("the watch");
      if (!has(s.clues, "passage")) missing.push("the passage");
      if (!s.matchingSolved) missing.push("a match for the initials C.W.");
      set({ notice: `Not enough to charge. Still need: ${missing.join("; ")}.` });
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
        inspecting: null,
      });
    } else {
      sfxWrong();
      set({
        accused: id,
        solved: false,
        score: Math.max(0, score - 300),
        screen: "result",
        failReason: "Wrong accusation. The true thief walks free.",
        inspecting: null,
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
      inspecting: null,
      passageOpen: false,
      patternSolved: false,
      matchingSolved: false,
      accused: null,
      solved: false,
      failReason: null,
      hintUsed: false,
      notice: "Walk the study. When something looks out of place, step close and collect it.",
      startedAt: performance.now(),
    }),

  toMenu: () =>
    set({
      screen: "menu",
      timeLeft: CASE.timeLimit,
      score: 0,
      clues: [],
      nearClue: null,
      inspecting: null,
      passageOpen: false,
      patternSolved: false,
      matchingSolved: false,
      accused: null,
      solved: false,
      failReason: null,
      notice: null,
    }),
}));
