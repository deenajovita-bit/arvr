import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Fingerprint,
  Lightbulb,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { CASE, CLUES, PROOF_CLUES, SUSPECTS, formatTime, type ClueId, type SuspectId } from "./case";
import { useGame } from "./store";
import { isMuted, setMuted, unlockAudio } from "./audio";
import { listScores, submitScore } from "@/lib/leaderboard";

function objective() {
  const s = useGame.getState();
  if (!s.clues.includes("torn-note")) return "Search the study. Something was dropped near the desk.";
  if (!s.patternSolved) return "Read the scrap. Finish the sequence in Deductions.";
  if (!s.passageOpen) return "Fifth book on the lower shelf. Open the passage.";
  if (!s.clues.includes("watch")) return "Search the floor by the shelves.";
  if (!s.matchingSolved) return "Match the initials on the watch to a name.";
  if (!s.clues.includes("fingerprint")) return "Dust the blotter on the desk.";
  return "Proof holds. Open Persons and name the thief.";
}

export function Menu() {
  const briefing = useGame((s) => s.briefing);
  return (
    <div className="relative z-20 flex min-h-dvh flex-col bg-[color:color-mix(in_oklab,var(--bg)_48%,transparent)]">
      <div className="letterbox top-0" />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-end px-4 pb-14 pt-16 md:justify-center">
        <div className="dossier panel-enter p-5 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker">Metropolitan Bureau · Division of Antiquities</p>
              <p className="mt-2 font-mono text-xs tracking-[0.18em] uppercase text-[color:var(--fg-subtle)]">
                File {CASE.id} · {CASE.mansion} · Night of the 12th
              </p>
            </div>
            <span className="stamp-mark">Confidential</span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_8.5rem]">
            <div>
              <h1 className="font-display text-5xl leading-[0.9] tracking-[-0.04em] md:text-6xl">
                Augmented Alibi
              </h1>
              <p className="font-display mt-2 text-2xl italic text-[color:var(--fg-muted)]">{CASE.title}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--fg-muted)]">
                Locked study. Stolen gem. Four statements that will not sit still. You have fifteen minutes
                inside the room.
              </p>
            </div>
            <figure className="polaroid rotate-2">
              <img src="/textures/gem.jpg" alt="The Crimson Eye" />
              <figcaption className="mt-1 text-center font-mono text-[10px] tracking-[0.16em] uppercase text-[color:var(--fg-subtle)]">
                Missing
              </figcaption>
            </figure>
          </div>
          <p className="kicker mt-8">Persons of interest</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(Object.keys(SUSPECTS) as SuspectId[]).map((id) => (
              <figure key={id} className="booking">
                <img src={SUSPECTS[id].photo} alt={SUSPECTS[id].name} />
                <figcaption className="px-1 py-1.5 text-center font-mono text-[9px] tracking-[0.12em] uppercase text-[color:var(--fg)]">
                  {SUSPECTS[id].initials}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                unlockAudio();
                briefing();
              }}
            >
              Open the file
            </button>
            <p className="text-xs tracking-[0.12em] uppercase text-[color:var(--fg-subtle)]">
              Walk · look · examine · accuse
            </p>
          </div>
        </div>
      </div>
      <div className="letterbox bottom-0 pointer-events-auto flex items-center justify-between px-6 text-[10px] tracking-[0.2em] text-[color:var(--fg-subtle)] uppercase">
        <span>Blackwood Mansion</span>
        <Link to="/unity" className="hover:text-[color:var(--fg)]">
          Field kit
        </Link>
      </div>
    </div>
  );
}

export function Briefing() {
  const start = useGame((s) => s.start);
  const toMenu = useGame((s) => s.toMenu);
  return (
    <div className="relative z-20 flex min-h-dvh items-center justify-center bg-[color:color-mix(in_oklab,var(--bg)_58%,transparent)] px-4 py-10">
      <div className="dossier panel-enter w-full max-w-lg p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">Incident report</p>
            <h2 className="font-display mt-2 text-4xl tracking-[-0.03em]">{CASE.title}</h2>
          </div>
          <span className="stamp-mark">Open</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          {CASE.victim}, {CASE.victimRole.toLowerCase()}, found unconscious. {CASE.missing} gone. Door locked
          from inside. Camera dead {CASE.crimeWindow}.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Info k="Window" v={CASE.crimeWindow} />
          <Info k="Limit" v={formatTime(CASE.timeLimit)} />
        </dl>
        <p className="mt-5 border-l-2 border-[color:var(--color-stamp)] pl-3 text-sm">{CASE.twist}</p>
        <p className="kicker mt-6">Statements on file</p>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {(Object.keys(SUSPECTS) as SuspectId[]).map((id) => (
            <li key={id} className="flex gap-2 border border-[color:var(--border)] p-1.5">
              <img src={SUSPECTS[id].photo} alt="" className="h-14 w-11 object-cover grayscale" />
              <div>
                <p className="text-sm">{SUSPECTS[id].name}</p>
                <p className="text-[10px] tracking-wide text-[color:var(--fg-subtle)] uppercase">
                  {SUSPECTS[id].role}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-[color:var(--fg-subtle)]">
          Recover what does not belong. Deduce. Then write a name.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={() => {
              unlockAudio();
              start();
            }}
          >
            Enter the study
          </button>
          <button type="button" className="btn-ghost" onClick={toMenu}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-[color:var(--border)] bg-[color:color-mix(in_oklab,white_18%,transparent)] p-3">
      <dt className="kicker">{k}</dt>
      <dd className="mt-1 font-mono text-sm">{v}</dd>
    </div>
  );
}

export function PlayHud() {
  const timeLeft = useGame((s) => s.timeLeft);
  const clues = useGame((s) => s.clues);
  const near = useGame((s) => s.nearClue);
  const notice = useGame((s) => s.notice);
  const inspecting = useGame((s) => s.inspecting);
  const collect = useGame((s) => s.collect);
  const tryOpen = useGame((s) => s.tryOpenPassage);
  const useHint = useGame((s) => s.useHint);
  const closeInspect = useGame((s) => s.closeInspect);
  const [panel, setPanel] = useState<"none" | "evidence" | "suspects" | "puzzle">("none");
  const [mute, setMute] = useState(isMuted());
  const obj = objective();

  const nearDef = CLUES.find((c) => c.id === near);
  const already = near ? clues.includes(near) : false;

  return (
    <>
      <div className="letterbox top-0" />
      <div className="vignette" />
      <div className="crosshair" />

      <div data-ui className="pointer-events-none absolute inset-x-0 top-8 z-20 px-4">
        <div className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-between gap-2">
          <div className="hud-chip">
            <span className="text-[color:var(--fg-subtle)]">File</span>
            <span className="font-mono">{CASE.id}</span>
          </div>
          <div className="hud-chip">
            <Clock className="size-3.5" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <div className="hud-chip">
            <Fingerprint className="size-3.5" />
            <span className="font-mono">
              {clues.length}/{CLUES.length}
            </span>
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[11px] tracking-[0.08em] text-[color:var(--fg-muted)]">
          {notice ?? obj}
        </p>
      </div>

      {nearDef && !already && !inspecting && panel === "none" && (
        <div data-ui className="absolute bottom-28 left-1/2 z-20 w-[min(92vw,22rem)] -translate-x-1/2 md:bottom-16">
          <button
            type="button"
            className="dossier w-full p-4 text-left"
            onClick={() => (near === "passage" ? tryOpen() : collect(near!))}
          >
            <p className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[color:var(--fg-subtle)] uppercase">
              <span className="keycap">E</span>
              {near === "passage" ? "Try latch" : "Examine"}
            </p>
            <p className="font-display mt-1 text-2xl">{nearDef.name}</p>
            <p className="mt-1 text-sm text-[color:var(--fg-muted)]">{nearDef.teaser}</p>
          </button>
        </div>
      )}

      {inspecting && <Inspect id={inspecting} onClose={closeInspect} />}

      <nav
        data-ui
        className="absolute bottom-10 right-3 z-20 flex flex-col gap-1 border border-[color:var(--border-strong)] bg-[color:color-mix(in_oklab,var(--bg)_78%,transparent)] p-1 md:bottom-12"
      >
        <IconBtn label="Notebook" onClick={() => setPanel(panel === "evidence" ? "none" : "evidence")}>
          <BookOpen className="size-4" />
        </IconBtn>
        <IconBtn label="Persons" onClick={() => setPanel(panel === "suspects" ? "none" : "suspects")}>
          <Users className="size-4" />
        </IconBtn>
        <IconBtn label="Deductions" onClick={() => setPanel(panel === "puzzle" ? "none" : "puzzle")}>
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
      </nav>

      <div className="letterbox bottom-0 pointer-events-none hidden items-center justify-between px-6 text-[10px] tracking-[0.18em] text-[color:var(--fg-subtle)] uppercase md:flex">
        <span>WASD move · look · E examine</span>
        <span>Notebook · Persons · Deductions</span>
      </div>

      {panel !== "none" && (
        <Sheet
          title={panel === "evidence" ? "Notebook" : panel === "suspects" ? "Persons" : "Deductions"}
          onClose={() => setPanel("none")}
        >
          {panel === "evidence" && <EvidenceList />}
          {panel === "suspects" && <SuspectBoard onDone={() => setPanel("none")} />}
          {panel === "puzzle" && <Puzzles />}
        </Sheet>
      )}
    </>
  );
}

function Inspect({ id, onClose }: { id: ClueId; onClose: () => void }) {
  const def = CLUES.find((c) => c.id === id);
  if (!def) return null;
  return (
    <div data-ui className="absolute inset-0 z-40 flex items-end justify-center bg-[color:color-mix(in_oklab,var(--bg)_72%,transparent)] p-3 md:items-center">
      <div className="dossier panel-enter max-h-[86dvh] w-full max-w-md overflow-auto p-5">
        <p className="kicker">Evidence log</p>
        <h3 className="font-display mt-1 text-3xl">{def.name}</h3>
        {def.photo ? (
          <figure className="polaroid mt-4 -rotate-1">
            <img src={def.photo} alt={def.name} className="aspect-[4/3] object-cover" />
          </figure>
        ) : id === "camera" ? (
          <pre className="mt-4 overflow-auto border border-[color:var(--border)] bg-[color:color-mix(in_oklab,white_20%,transparent)] p-3 font-mono text-xs leading-relaxed">
{`CAM 02  STUDY
20:17  FEED DISABLED
20:18  RESTART FAIL
20:19  RESTART FAIL
operator: V.STONE
STATUS: OFFLINE`}
          </pre>
        ) : (
          <p className="mt-4 border border-[color:var(--border)] p-3 text-sm text-[color:var(--fg-muted)]">
            The wall behind the fifth book is hollow. Dust falls inward.
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed">{def.detail}</p>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{def.proves}</p>
        <button type="button" className="btn-primary mt-5 w-full" onClick={onClose}>
          File in notebook
        </button>
      </div>
    </div>
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
      title={label}
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 px-2.5 text-left text-[color:var(--fg)]"
    >
      {children}
      <span className="hidden text-[10px] tracking-[0.16em] uppercase lg:inline">{label}</span>
    </button>
  );
}

function Sheet({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div data-ui className="absolute inset-0 z-30 flex items-end justify-center bg-[color:color-mix(in_oklab,var(--bg)_58%,transparent)] p-3 md:items-center">
      <div className="dossier panel-enter max-h-[80dvh] w-full max-w-lg overflow-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-3xl">{title}</h3>
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
  const matching = useGame((s) => s.matchingSolved);
  const have = PROOF_CLUES.filter((id) => collected.includes(id)).length;
  return (
    <div>
      <p className="text-sm text-[color:var(--fg-muted)]">
        {have >= 3 && matching
          ? "The notebook holds. Write a name."
          : `Proof ${have}/3 · still need print, watch, passage, and a match for C.W.`}
      </p>
      <ul className="mt-4 grid gap-2">
        {CLUES.map((c) => {
          const got = collected.includes(c.id);
          return (
            <li key={c.id} className="flex gap-3 border border-[color:var(--border)] p-2">
              {got && c.photo ? (
                <img src={c.photo} alt="" className="size-16 shrink-0 object-cover grayscale" />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center border border-[color:var(--border)] font-display text-xl text-[color:var(--fg-subtle)]">
                  {got ? "·" : "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{got ? c.name : "Unfiled"}</p>
                <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
                  {got ? c.detail : "Not yet recovered."}
                </p>
              </div>
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
  const matching = useGame((s) => s.matchingSolved);
  const ready = PROOF_CLUES.every((id) => clues.includes(id)) && matching;
  return (
    <div>
      <p className="text-sm text-[color:var(--fg-muted)]">
        {ready ? "Charge one name. A wrong file ends the case." : "Do not charge until print, watch, passage, and initials agree."}
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
              className={`flex gap-3 p-2 text-left ${
                on ? "border border-[color:var(--color-ink)] bg-[color:color-mix(in_oklab,white_22%,transparent)]" : "border border-[color:var(--border)]"
              }`}
            >
              <img src={s.photo} alt="" className="h-[5.5rem] w-16 shrink-0 object-cover grayscale contrast-125" />
              <div>
                <p className="font-medium">
                  {s.name}{" "}
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[color:var(--fg-subtle)]">
                    {s.initials}
                  </span>
                </p>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[color:var(--fg-subtle)]">{s.role}</p>
                <p className="mt-1 text-sm text-[color:var(--fg-muted)]">Alibi: {s.alibi}</p>
                {clues.includes("camera") && id === "victor" && (
                  <p className="mt-1 text-xs">Log places him at the panel 8:17–8:19.</p>
                )}
                {matching && id === "clara" && (
                  <p className="mt-1 text-xs">Initials match the watch and the scrap.</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!pick}
        className="btn-primary mt-4 w-full"
        onClick={() => {
          if (!pick) return;
          accuse(pick);
          if (useGame.getState().screen === "result") onDone();
        }}
      >
        {ready ? "Charge" : "Insufficient proof"}
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
  const hasNote = clues.includes("torn-note");
  const hasWatch = clues.includes("watch");

  return (
    <div className="space-y-8">
      <section>
        <p className="kicker">Cipher</p>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          {hasNote
            ? "Under the ink: 2 → 4 → 8 → 16 → ? The number is how far to count along the shelf."
            : "Recover the scrap before this page fills."}
        </p>
        {patternSolved ? (
          <p className="mt-3 text-sm">32. Fifth volume on the lower shelf.</p>
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
              disabled={!hasNote}
              onChange={(e) => setVal(e.target.value)}
              placeholder={hasNote ? "Next number" : "Locked"}
            />
            <button type="submit" className="btn-primary" disabled={!hasNote}>
              Log
            </button>
          </form>
        )}
      </section>
      <section>
        <p className="kicker">Initials</p>
        <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
          {hasWatch ? "The case reads C.W. Who owns those letters?" : "Find the watch. The engraving is the name."}
        </p>
        {matchingSolved ? (
          <p className="mt-3 text-sm">C.W. — Clara Wilson. In the study at 8:22.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(SUSPECTS) as SuspectId[]).map((id) => (
              <button
                key={id}
                type="button"
                className="btn-ghost flex items-center gap-2 px-2"
                disabled={!hasWatch}
                onClick={() => solveMatching(id === "clara")}
              >
                <img src={SUSPECTS[id].photo} alt="" className="size-9 object-cover grayscale" />
                <span className="text-left">
                  <span className="block text-[11px] normal-case tracking-normal">{SUSPECTS[id].name}</span>
                  <span className="block text-[10px] text-[color:var(--fg-subtle)]">{SUSPECTS[id].initials}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function rank(score: number) {
  if (score >= 2000) return "Chief Inspector";
  if (score >= 1400) return "Detective";
  if (score >= 800) return "Constable";
  return "Rookie";
}

export function Result() {
  const solved = useGame((s) => s.solved);
  const score = useGame((s) => s.score);
  const clues = useGame((s) => s.clues);
  const timeLeft = useGame((s) => s.timeLeft);
  const failReason = useGame((s) => s.failReason);
  const toMenu = useGame((s) => s.toMenu);
  const [alias, setAlias] = useState("Hart");
  const [board, setBoard] = useState<
    { alias: string; score: number; time_left: number; clues: number; solved: boolean }[]
  >([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void listScores()
      .then(setBoard)
      .catch(() => setStatus("Board unavailable."));
  }, []);

  return (
    <div className="relative z-20 flex min-h-dvh items-center justify-center bg-[color:color-mix(in_oklab,var(--bg)_70%,transparent)] px-4 py-10">
      <div className="dossier panel-enter w-full max-w-lg p-6 md:p-8">
        <div className="flex items-start justify-between">
          <p className="kicker">Disposition</p>
          <span className="stamp-mark">{solved ? "Case closed" : "Case cold"}</span>
        </div>
        {solved && (
          <img
            src={SUSPECTS.clara.photo}
            alt=""
            className="mt-5 h-36 w-28 object-cover grayscale contrast-125"
          />
        )}
        <h2 className="font-display mt-4 text-4xl tracking-[-0.03em]">
          {solved ? "Clara Wilson" : failReason}
        </h2>
        {solved && (
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">
            She knew the passage. The watch engraved C.W. stopped at 8:22. Prints on the desk. The library
            alibi does not survive.
          </p>
        )}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
          <Stat k="Rank" v={rank(score)} />
          <Stat k="Time" v={formatTime(timeLeft)} />
          <Stat k="Filed" v={`${clues.length}/${CLUES.length}`} />
        </div>
        <p className="mt-4 text-center font-mono text-sm text-[color:var(--fg-muted)]">{score} pts</p>
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
              setStatus("Logged.");
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
            placeholder="Sign the log"
          />
          <button type="submit" className="btn-primary">
            Sign
          </button>
        </form>
        {status && <p className="mt-2 text-xs text-[color:var(--fg-subtle)]">{status}</p>}
        <p className="kicker mt-8">Bureau board</p>
        <ol className="mt-3 space-y-1 text-sm">
          {board.map((row, i) => (
            <li key={`${row.alias}-${i}`} className="flex justify-between border-b border-[color:var(--border)] py-2">
              <span>
                {i + 1}. {row.alias}
              </span>
              <span className="font-mono tabular-nums">{row.score}</span>
            </li>
          ))}
          {board.length === 0 && <li className="text-[color:var(--fg-muted)]">No names yet.</li>}
        </ol>
        <button type="button" className="btn-ghost mt-8 w-full" onClick={toMenu}>
          Close file
        </button>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-[color:var(--border)] py-3">
      <p className="kicker">{k}</p>
      <p className="mt-1 text-sm">{v}</p>
    </div>
  );
}
