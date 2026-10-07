export const CASE = {
  id: "001",
  title: "The Crimson Eye",
  mansion: "Blackwood Mansion",
  timeLimit: 900,
  victim: "Dr. Adrian Blake",
  victimRole: "Archaeologist",
  missing: "The Crimson Eye",
  crimeWindow: "8:15 PM – 8:25 PM",
  twist: "The study door was locked from the inside. If the thief left, it was not through that door.",
} as const;

export type SuspectId = "eleanor" | "marcus" | "victor" | "clara";

export const SUSPECTS: Record<
  SuspectId,
  {
    name: string;
    role: string;
    initials: string;
    photo: string;
    alibi: string;
    motive: string;
  }
> = {
  eleanor: {
    name: "Eleanor Blake",
    role: "Daughter",
    initials: "E.B.",
    photo: "/textures/suspects/eleanor.jpg",
    alibi: "I was in the dining room preparing dinner.",
    motive: "Heard her father planned to change his will.",
  },
  marcus: {
    name: "Marcus Reed",
    role: "Museum curator",
    initials: "M.R.",
    photo: "/textures/suspects/marcus.jpg",
    alibi: "I was in the garden making a phone call.",
    motive: "Knew the gemstone's market value better than anyone.",
  },
  victor: {
    name: "Victor Stone",
    role: "Security guard",
    initials: "V.S.",
    photo: "/textures/suspects/victor.jpg",
    alibi: "I was at the camera panel after the feed died.",
    motive: "Had keys to every room, including the study.",
  },
  clara: {
    name: "Clara Wilson",
    role: "Research assistant",
    initials: "C.W.",
    photo: "/textures/suspects/clara.jpg",
    alibi: "I was organizing documents in the library.",
    motive: "Catalogued the study shelves and handled the artifact daily.",
  },
};

export const CORRECT_SUSPECT: SuspectId = "clara";

export type ClueId =
  | "fingerprint"
  | "torn-note"
  | "footprints"
  | "camera"
  | "watch"
  | "passage"
  | "key";

export const PROOF_CLUES: ClueId[] = ["fingerprint", "watch", "passage"];

export const CLUES: {
  id: ClueId;
  name: string;
  points: number;
  teaser: string;
  detail: string;
  proves: string;
  photo?: string;
  requires?: ClueId;
}[] = [
  {
    id: "fingerprint",
    name: "Print on the blotter",
    points: 100,
    teaser: "Silver powder caught a print on the desk.",
    detail:
      "A left-hand print in forensic dust, still tacky. It is not Dr. Blake's. Match the ridges to a staff card.",
    proves: "Someone besides the victim stood at this desk tonight.",
    photo: "/textures/clues/fingerprint.jpg",
  },
  {
    id: "torn-note",
    name: "Torn scrap",
    points: 150,
    teaser: "A scrap of paper under the desk.",
    detail:
      "Ink: “8:20 — behind the old books. Do not use the door.” Signed C.W. A sequence is scrawled under it: 2 · 4 · 8 · 16 · ?",
    proves: "The exit is the bookshelf. The writer used the initials C.W.",
    photo: "/textures/clues/note.jpg",
  },
  {
    id: "footprints",
    name: "Mud on the rug",
    points: 100,
    teaser: "Damp soil on the Persian rug.",
    detail: "A trail of wet oxford prints from the desk toward the far bookshelf. Garden mud, not study dust.",
    proves: "The thief crossed the room to the shelves, not the door.",
    photo: "/textures/clues/boot.jpg",
  },
  {
    id: "camera",
    name: "Study camera log",
    points: 100,
    teaser: "The wall camera is still showing a log.",
    detail:
      "20:17 FEED DISABLED. 20:18–20:19 RESTART FAIL. Operator: V.STONE. He was at the panel the whole window.",
    proves: "Victor was not in the study. The blackout was a failed restart, not a cover for the theft.",
  },
  {
    id: "watch",
    name: "Broken pocket watch",
    points: 300,
    teaser: "Something metal under the shelf.",
    detail:
      "Glass cracked. Hands frozen at 8:22 — inside the crime window. The case is engraved C.W.",
    proves: "Places the owner of C.W. in this room at 8:22.",
    photo: "/textures/clues/watch.jpg",
  },
  {
    id: "passage",
    name: "Secret passage",
    points: 300,
    teaser: "One volume on the lower shelf sits proud of the rest.",
    detail:
      "The fifth book on the lower shelf is the catch. The wall swings. Only someone who catalogued these stacks would know.",
    proves: "The locked-door problem is solved. The thief had inside knowledge of the shelves.",
    requires: "torn-note",
  },
  {
    id: "key",
    name: "Stash in the wall",
    points: 200,
    teaser: "A glint in the dark behind the shelf.",
    detail: "A brass key, a pawn ticket dated today, and a photo of the Crimson Eye. The gem already had a buyer.",
    proves: "This was planned. The thief needed a way back through the wall.",
    photo: "/textures/clues/key.jpg",
    requires: "passage",
  },
];

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
