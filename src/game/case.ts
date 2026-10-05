export const CASE = {
  id: "001",
  title: "The Crimson Eye",
  mansion: "Blackwood Mansion",
  timeLimit: 900,
  victim: "Dr. Adrian Blake",
  victimRole: "Archaeologist",
  missing: "The Crimson Eye",
  crimeWindow: "8:15 PM – 8:25 PM",
  twist: "The thief did not leave through the door. They used a hidden passage behind a bookshelf.",
} as const;

export type SuspectId = "eleanor" | "marcus" | "victor" | "clara";

export const SUSPECTS: Record<
  SuspectId,
  {
    name: string;
    role: string;
    alibi: string;
    motive: string;
    herring: string;
  }
> = {
  eleanor: {
    name: "Eleanor Blake",
    role: "Daughter",
    alibi: "I was in the dining room preparing dinner.",
    motive: "Learned her father planned to change his will.",
    herring: "A half-written letter about the will sits in the dining room, but no physical trail places her in the study.",
  },
  marcus: {
    name: "Marcus Reed",
    role: "Museum curator",
    alibi: "I was outside making a phone call.",
    motive: "Knew the gemstone's market value better than anyone.",
    herring: "Phone records confirm a call at 8:18 PM. Motive without access.",
  },
  victor: {
    name: "Victor Stone",
    role: "Security guard",
    alibi: "I was checking the security cameras.",
    motive: "Cameras failed during the crime window.",
    herring: "The log shows he was trying to restart the system. Incompetent, not the thief.",
  },
  clara: {
    name: "Clara Wilson",
    role: "Research assistant",
    alibi: "I was organizing documents in the library.",
    motive: "Access to the study and knowledge of the artifact.",
    herring: "Her alibi collapses against the watch, prints, and passage.",
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
  detail: string;
  proves?: string;
  requires?: ClueId;
}[] = [
  {
    id: "fingerprint",
    name: "Dust print on the blotter",
    points: 100,
    detail: "Silver powder on the desk. The ridge pattern is later matched to Clara Wilson — she was at the table.",
    proves: "Places Clara in the study.",
  },
  {
    id: "torn-note",
    name: "Torn scrap",
    points: 150,
    detail: "Ink: “8:20 — behind the old books. Do not use the door. C.W.” The bookshelf is the way out.",
    proves: "Clara knew the passage and signed the note.",
  },
  {
    id: "footprints",
    name: "Mud on the rug",
    points: 100,
    detail: "A trail of damp prints from the desk to the far bookshelf. Same path the thief took.",
    proves: "Confirms the route to the hidden door.",
  },
  {
    id: "camera",
    name: "Study camera log",
    points: 100,
    detail: "Feed dies at 8:17. Victor Stone hammers restart until 8:19. He was stuck at the panel, not in the room.",
    proves: "Clears Victor. The blackout was incompetence, not the theft.",
  },
  {
    id: "watch",
    name: "Broken pocket watch",
    points: 300,
    detail: "Glass cracked. Hands frozen at 8:22. Case engraved C.W. — Clara Wilson, in the study during the window.",
    proves: "Time-stamps Clara at the crime.",
  },
  {
    id: "passage",
    name: "Secret passage",
    points: 300,
    detail: "The glowing volume swings the shelf. Only staff who catalogued these stacks would know the catch.",
    proves: "Means of escape. Clara had that knowledge.",
    requires: "torn-note",
  },
  {
    id: "key",
    name: "Stash in the wall",
    points: 200,
    detail: "A brass key, a glove, a pawn receipt, and a photo of the Crimson Eye. The gem was already spoken for.",
    proves: "Motive made concrete — she had a buyer.",
    requires: "passage",
  },
];

export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
