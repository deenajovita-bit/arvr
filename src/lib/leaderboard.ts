import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type ScoreRow = {
  id: number;
  alias: string;
  score: number;
  time_left: number;
  clues: number;
  solved: boolean;
  created_at: string;
};

function parseEntry(data: unknown) {
  if (typeof data !== "object" || data === null) throw new Error("Invalid score");
  const d = data as Record<string, unknown>;
  const alias = typeof d.alias === "string" ? d.alias.trim() : "";
  if (!/^[A-Za-z0-9_]{3,16}$/.test(alias)) {
    throw new Error("Use 3–16 letters, numbers, or underscores");
  }
  const score = Number(d.score);
  const timeLeft = Number(d.timeLeft);
  const clues = Number(d.clues);
  const solved = Boolean(d.solved);
  if (!Number.isFinite(score) || score < 0 || score > 20000) throw new Error("Bad score");
  if (!Number.isFinite(timeLeft) || timeLeft < 0 || timeLeft > 900) throw new Error("Bad time");
  if (!Number.isFinite(clues) || clues < 0 || clues > 12) throw new Error("Bad clues");
  return {
    alias,
    score: Math.floor(score),
    timeLeft: Math.floor(timeLeft),
    clues: Math.floor(clues),
    solved,
  };
}

export const listScores = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<ScoreRow>`
    select id, alias, score, time_left, clues, solved, created_at
    from detective_scores
    order by score desc, created_at asc
    limit 20
  `;
});

export const submitScore = createServerFn({ method: "POST" })
  .validator(parseEntry)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into detective_scores (alias, score, time_left, clues, solved)
      values (${data.alias}, ${data.score}, ${data.timeLeft}, ${data.clues}, ${data.solved})
    `;
    return sql<ScoreRow>`
      select id, alias, score, time_left, clues, solved, created_at
      from detective_scores
      order by score desc, created_at asc
      limit 20
    `;
  });
