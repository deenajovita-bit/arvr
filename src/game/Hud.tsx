import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Fingerprint,
  Lightbulb,
  Search,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { CASE, CLUES, PROOF_CLUES, SUSPECTS, formatTime, type SuspectId } from "./case";
import { useGame } from "./store";
import { isMuted, setMuted, unlockAudio } from "./audio";
import { listScores, submitScore } from "@/lib/leaderboard";

export function Menu() {
  const briefing = useGame((s) => s.briefing);
  return (
    <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center bg-[color:color-mix(in_oklab,var(--bg)_42%,transparent)] px-5 py-10">
      <div className="stamp mb-6 text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]">
        CASE FILE — BLACKWOOD
      </div>
      <h1 className="font-display max-w-xl text-center text-5xl leading-[0.95] tracking-[-0.04em] text-[color:var(--fg)] md:text-7xl">
        Augmented Alibi
      </h1>
      <p className="mt-5 max-w-md text-center text-[color:var(--fg-muted)]">
        The crime scene is the room around you. Fifteen minutes. Four suspects. One thief.
      </p>
      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        <button type="button" className="btn-primary" onClick={briefing}>
          Open case
        </button>
        <Link to="/unity" className="btn-ghost text-center">
          Unity build kit
        </Link>
      </div>
    </div>
  );
}

export function Briefing() {
  const start = useGame((s) => s.start);
  const toMenu = useGame((s) => s.toMenu);
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-[color:color-mix(in_oklab,var(--bg)_50%,transparent)] px-5 py-10">
      <p className="text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]">CASE #{CASE.id}</p>
      <h2 className="font-display mt-2 text-4xl tracking-[-0.03em]">{CASE.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-[color:var(--fg-muted)]">
        {CASE.victim}, {CASE.victimRole.toLowerCase()}, is found unconscious in his study.{" "}
        {CASE.missing} is gone. The door was locked. The cameras failed. You have{" "}
        {formatTime(CASE.timeLimit)}.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <Info k="Window" v={CASE.crimeWindow} />
        <Info k="Scene" v={CASE.mansion} />
      </dl>
      <p className="mt-5 border-l border-[color:var(--border-strong)] pl-3 text-sm text-[color:var(--fg)]">
        {CASE.twist}
      </p>
      <ul className="mt-6 space-y-1 text-sm text-[color:var(--fg-muted)]">
        <li>Move with WASD or the stick. Drag or mouse-look to inspect.</li>
        <li>Press E or Collect when a clue glows nearby.</li>
        <li>Accuse only when the evidence board holds.</li>
      </ul>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={() => {
            unlockAudio();
            start();
          }}
        >
          Begin investigation
        </button>
        <button type="button" className="btn-ghost" onClick={toMenu}>
          Back
        </button>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3">
      <dt className="text-[11px] tracking-wide text-[color:var(--fg-subtle)]">{k}</dt>
      <dd className="mt-1">{v}</dd>
    </div>
  );
}

export function PlayHud() {
  const timeLeft = useGame((s) => s.timeLeft);
  const score = useGame((s) => s.score);
  const clues = useGame((s) => s.clues);
  const near = useGame((s) => s.nearClue);
  const notice = useGame((s) => s.notice);
  const collect = useGame((s) => s.collect);
  const tryOpen = useGame((s) => s.tryOpenPassage);
  const useHint = useGame((s) => s.useHint);
  const [panel, setPanel] = useState<"none" | "evidence" | "suspects" | "puzzle">("none");
  const [mute, setMute] = useState(isMuted());

  const nearDef = CLUES.find((c) => c.id === near);
  const already = near ? clues.includes(near) : false;

  return (
    <>
      <div data-ui className="pointer-events-none absolute inset-x-0 top-0 z-20 p-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-start justify-between gap-3">
          <div className="hud-chip">
            <Clock className="size-3.5" />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <div className="hud-chip">
            <Fingerprint className="size-3.5" />
            <span className="tabular-nums">
              {clues.length}/{CLUES.length}
            </span>
          </div>
          <div className="hud-chip">
            <span className="text-[color:var(--fg-subtle)]">Score</span>
            <span className="tabular-nums">{score}</span>
          </div>
        </div>
        {notice && (
          <p className="mx-auto mt-3 max-w-md rounded-[var(--radius-sm)] bg-[color:var(--bg-elevated)] px-3 py-2 text-center text-sm text-[color:var(--fg)]">
            {notice}
          </p>
        )}
      </div>

      {nearDef && !already && (
        <div data-ui className="absolute bottom-28 left-1/2 z-20 w-[min(92vw,22rem)] -translate-x-1/2 md:bottom-10">
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <p className="text-[11px] tracking-[0.2em] text-[color:var(--fg-subtle)]">NEARBY</p>
            <p className="font-display mt-1 text-xl">{nearDef.name}</p>
            <p className="mt-1 text-sm text-[color:var(--fg-muted)]">{nearDef.detail}</p>
            <button
              type="button"
              className="btn-primary mt-3 w-full"
              onClick={() => (near === "passage" ? tryOpen() : collect(near!))}
            >
              {near === "passage" ? "Open bookshelf" : "Collect evidence"}
            </button>
          </div>
        </div>
      )}

      <div data-ui className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <IconBtn label="Evidence" onClick={() => setPanel(panel === "evidence" ? "none" : "evidence")}>
          <Search className="size-4" />
        </IconBtn>
        <IconBtn label="Suspects" onClick={() => setPanel(panel === "suspects" ? "none" : "suspects")}>
          <Users className="size-4" />
        </IconBtn>
        <IconBtn label="Puzzles" onClick={() => setPanel(panel === "puzzle" ? "none" : "puzzle")}>
          <Fingerprint className="size-4" />
        </IconBtn>
        <IconBtn label="Hint" onClick={useHint}>
          <Lightbulb className="size-4" />
        </IconBtn>
        <IconBtn
          label={mute ? "Unmute" : "Mute"}
          onClick={() => {
            unlockAudio();
            setMuted(!mute);
            setMute(!mute);
          }}
        >
          {mute ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </IconBtn>
      </div>

      {panel !== "none" && (
        <Sheet onClose={() => setPanel("none")}>
          {panel === "evidence" && <EvidenceList />}
          {panel === "suspects" && <SuspectBoard onDone={() => setPanel("none")} />}
          {panel === "puzzle" && <Puzzles />}
        </Sheet>
      )}
    </>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--fg)]"
    >
      {children}
    </button>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div data-ui className="absolute inset-0 z-30 flex items-end justify-center bg-black/45 p-3 md:items-center">
      <div className="max-h-[80dvh] w-full max-w-lg overflow-auto rounded-[calc(var(--radius-md)+16px)] border border-[color:var(--border)] bg-[color:var(--bg)] p-4">
        <div className="mb-3 flex justify-end">
          <button type="button" aria-label="Close" onClick={onClose} className="btn-ghost size-11 p-0">
            <X className="mx-auto size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EvidenceList() {
  const collected = useGame((s) => s.clues);
  const have = PROOF_CLUES.filter((id) => collected.includes(id)).length;
  return (
    <div>
      <h3 className="font-display text-2xl">Evidence</h3>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        {have >= 3
          ? "Proof is complete. Open Suspects and name Clara Wilson."
          : `Proof ${have}/3 — need the blotter print, the watch, and the passage.`}
      </p>
      <ul className="mt-4 space-y-2">
        {CLUES.map((c) => {
          const got = collected.includes(c.id);
          return (
            <li
              key={c.id}
              className="rounded-[var(--radius-md)] border border-[color:var(--border)] p-3"
            >
              <p className="text-sm font-medium">{got ? c.name : "Unknown fragment"}</p>
              <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
                {got ? c.detail : "Still in the room."}
              </p>
              {got && c.proves && (
                <p className="mt-2 text-xs tracking-wide text-[color:var(--fg)]">{c.proves}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SuspectBoard({ onDone }: { onDone: () => void }) {
  const [pick, setPick] = useState<SuspectId | null>(null);
  const accuse = useGame((s) => s.accuse);
  const clues = useGame((s) => s.clues);
  const ready = PROOF_CLUES.every((id) => clues.includes(id));
  return (
    <div>
      <h3 className="font-display text-2xl">Suspects</h3>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        {ready
          ? "Watch, prints, and passage all name one person."
          : "Collect the watch, the desk print, and open the bookshelf before you charge anyone."}
      </p>
      <div className="mt-4 grid gap-2">
        {(Object.keys(SUSPECTS) as SuspectId[]).map((id) => {
          const s = SUSPECTS[id];
          const on = pick === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => setPick(id)}
              className={`rounded-[var(--radius-md)] border p-3 text-left ${
                on ? "border-[color:var(--fg)] bg-[color:var(--bg-elevated)]" : "border-[color:var(--border)]"
              }`}
            >
              <p className="font-medium">{s.name}</p>
              <p className="text-[11px] tracking-wide text-[color:var(--fg-subtle)]">{s.role}</p>
              <p className="mt-2 text-sm text-[color:var(--fg-muted)]">Alibi: {s.alibi}</p>
              <p className="mt-1 text-sm text-[color:var(--fg-muted)]">Motive: {s.motive}</p>
              {clues.includes("camera") && id === "victor" && (
                <p className="mt-2 text-xs text-[color:var(--fg)]">Camera log clears him — he was restarting the feed.</p>
              )}
              {clues.includes("watch") && id === "clara" && (
                <p className="mt-2 text-xs text-[color:var(--fg)]">C.W. on the watch. Time: 8:22.</p>
              )}
              {clues.includes("fingerprint") && id === "clara" && (
                <p className="mt-2 text-xs text-[color:var(--fg)]">Prints on the blotter match her.</p>
              )}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!pick}
        className="btn-primary mt-4 w-full disabled:opacity-40"
        onClick={() => {
          if (!pick) return;
          accuse(pick);
          if (useGame.getState().screen === "result") onDone();
        }}
      >
        {ready ? "Submit accusation" : "Need more proof"}
      </button>
    </div>
  );
}

function Puzzles() {
  const patternSolved = useGame((s) => s.patternSolved);
  const matchingSolved = useGame((s) => s.matchingSolved);
  const clues = useGame((s) => s.clues);
  const solvePattern = useGame((s) => s.solvePattern);
  const solveMatching = useGame((s) => s.solveMatching);
  const [val, setVal] = useState("");

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl">Field puzzles</h3>
      <section>
        <p className="text-sm font-medium">Sequence</p>
        <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
          Written on the torn scrap: 2 → 4 → 8 → 16 → ?
        </p>
        {patternSolved ? (
          <p className="mt-2 text-sm">Resolved.</p>
        ) : (
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              solvePattern(val);
            }}
          >
            <input
              className="field flex-1"
              inputMode="numeric"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Answer"
            />
            <button type="submit" className="btn-primary">
              Check
            </button>
          </form>
        )}
      </section>
      <section>
        <p className="text-sm font-medium">Match the watch</p>
        <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
          Initials C.W. belong to which suspect?
        </p>
        {matchingSolved ? (
          <p className="mt-2 text-sm">Resolved.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="btn-ghost" onClick={() => solveMatching(false)}>
              Eleanor Blake
            </button>
            <button type="button" className="btn-ghost" onClick={() => solveMatching(false)}>
              Marcus Reed
            </button>
            <button type="button" className="btn-ghost" onClick={() => solveMatching(false)}>
              Victor Stone
            </button>
            <button
              type="button"
              className="btn-ghost"
              disabled={!clues.includes("watch")}
              onClick={() => solveMatching(true)}
            >
              Clara Wilson
            </button>
          </div>
        )}
        {!clues.includes("torn-note") && (
          <p className="mt-2 text-xs text-[color:var(--fg-subtle)]">Find the torn scrap first.</p>
        )}
      </section>
    </div>
  );
}

export function Result() {
  const solved = useGame((s) => s.solved);
  const score = useGame((s) => s.score);
  const clues = useGame((s) => s.clues);
  const timeLeft = useGame((s) => s.timeLeft);
  const failReason = useGame((s) => s.failReason);
  const toMenu = useGame((s) => s.toMenu);
  const [alias, setAlias] = useState("Rookie");
  const [board, setBoard] = useState<
    { alias: string; score: number; time_left: number; clues: number; solved: boolean }[]
  >([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void listScores().then(setBoard).catch(() => setStatus("Board unavailable in this session."));
  }, []);

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10">
      <p className="text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]">
        {solved ? "CASE CLOSED" : "CASE COLD"}
      </p>
      <h2 className="font-display mt-2 text-4xl tracking-[-0.03em]">
        {solved ? "Clara Wilson" : failReason}
      </h2>
      {solved && (
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          She knew the passage. The watch engraved C.W. stopped at 8:22. Prints on the desk. The library
          alibi does not survive the trail.
        </p>
      )}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
        <Stat k="Score" v={String(score)} />
        <Stat k="Time" v={formatTime(timeLeft)} />
        <Stat k="Clues" v={`${clues.length}/${CLUES.length}`} />
      </div>
      <form
        className="mt-6 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const rows = await submitScore({
              data: {
                alias,
                score,
                timeLeft: Math.floor(timeLeft),
                clues: clues.length,
                solved,
              },
            });
            setBoard(rows);
            setStatus("Posted.");
          } catch (err) {
            setStatus(err instanceof Error ? err.message : "Could not post.");
          }
        }}
      >
        <input
          className="field flex-1"
          value={alias}
          maxLength={16}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Detective alias"
        />
        <button type="submit" className="btn-primary">
          Post
        </button>
      </form>
      {status && <p className="mt-2 text-xs text-[color:var(--fg-subtle)]">{status}</p>}
      <h3 className="mt-8 text-sm tracking-[0.2em] text-[color:var(--fg-subtle)]">LEADERBOARD</h3>
      <ol className="mt-3 space-y-1 text-sm">
        {board.map((row, i) => (
          <li key={`${row.alias}-${i}`} className="flex justify-between border-b border-[color:var(--border)] py-2">
            <span>
              {i + 1}. {row.alias}
            </span>
            <span className="tabular-nums">{row.score}</span>
          </li>
        ))}
        {board.length === 0 && <li className="text-[color:var(--fg-muted)]">No ranks yet.</li>}
      </ol>
      <button type="button" className="btn-ghost mt-8" onClick={toMenu}>
        Return to file
      </button>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] py-3">
      <p className="text-[11px] text-[color:var(--fg-subtle)]">{k}</p>
      <p className="mt-1 tabular-nums">{v}</p>
    </div>
  );
}
