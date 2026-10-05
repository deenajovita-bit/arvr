import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/unity")({ component: UnityKit });

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[color:var(--border)] py-1.5 text-[11px] sm:grid-cols-[minmax(7rem,11rem)_1fr] sm:text-xs">
      <span className="text-[color:var(--fg-muted)]">{k}</span>
      <span className="rounded-[var(--radius-xs)] bg-[color:var(--bg-subtle)] px-2 py-0.5 font-mono text-[color:var(--fg)]">
        {v}
      </span>
    </div>
  );
}

function Inspector({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
      <div className="flex items-center gap-2 border-b border-[color:var(--border)] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
        <p className="text-xs font-medium tracking-wide">{title}</p>
        <p className="ml-auto text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-subtle)]">
          Inspector
        </p>
      </div>
      <div className="px-3 py-1">{children}</div>
    </div>
  );
}

function Section({ label }: { label: string }) {
  return (
    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]">{label}</p>
  );
}

function UnityKit() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 text-[color:var(--fg)]">
      <Link to="/" className="text-sm text-[color:var(--fg-muted)]">
        Back to case
      </Link>
      <h1 className="font-display mt-4 text-4xl tracking-[-0.03em]">Unity build kit</h1>
      <p className="mt-3 text-[color:var(--fg-muted)]">
        Exact hierarchy, Inspector slots, primitive placeholders, and Firebase
        leaderboard. Field names match the C# scripts.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a className="btn-primary inline-flex items-center" href="/downloads/AugmentedAlibi_Unity_Kit.zip">
          Download Unity kit
        </a>
        <a className="btn-ghost inline-flex items-center" href="#firebase">
          Firebase
        </a>
      </div>

      <h2 className="font-display mt-12 text-2xl">1. Scenes</h2>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        File → New Scene. Save into Assets/Scenes. Build Settings order:
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        <li>MainMenu — start button (index 0)</li>
        <li>Briefing — case text</li>
        <li>ARInvestigation — camera, planes, clues</li>
        <li>Leaderboard — Firebase list</li>
      </ol>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        After scripts are in Assets/Editor, use menu{" "}
        <span className="text-[color:var(--fg)]">Augmented Alibi → Create ARInvestigation Hierarchy</span>.
      </p>

      <h2 className="font-display mt-12 text-2xl">2. Hierarchy — ARInvestigation</h2>
      <pre className="mt-3 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-[11px] leading-6 sm:text-xs">
        {`ARInvestigation
├── AR Session
├── AR Session Origin
│   ├── AR Camera                 tag: MainCamera
│   ├── AR Plane Manager          Horizontal
│   └── AR Raycast Manager
├── GameSystems
│   ├── GameManager
│   ├── UIManager
│   ├── PuzzleManager
│   ├── ARPlacementManager
│   └── FirebaseLeaderboard
├── EventSystem
└── Canvas_HUD                    Screen Space Overlay
    ├── SafeArea
    │   ├── TimerText
    │   ├── ScoreText
    │   ├── EvidenceCount
    │   └── NotificationPanel
    ├── Buttons (Evidence, Suspects, Hint, Accuse)
    ├── EvidencePanel / SuspectsPanel / AccusationPanel
    ├── PatternPuzzlePanel
    └── FinalResultPanel`}
      </pre>

      <h2 className="font-display mt-12 text-2xl">3. Inspector — copy these values</h2>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        Click the object in Hierarchy, then match every slot below. Drag
        references; do not type GameObject names except where noted.
      </p>

      <div className="mt-6 grid gap-4">
        <Inspector title="AR Camera">
          <Field k="Tag" v="MainCamera" />
          <Field k="Clear Flags" v="Solid Color" />
          <Field k="Background" v="black" />
          <Field k="Near / Far" v="0.05 / 20" />
        </Inspector>

        <Inspector title="AR Session Origin">
          <Section label="AR Plane Manager" />
          <Field k="Detection Mode" v="Horizontal" />
          <Section label="AR Raycast Manager" />
          <Field k="—" v="defaults" />
        </Inspector>

        <Inspector title="GameManager">
          <Section label="Game Settings" />
          <Field k="Total Time" v="900" />
          <Field k="Total Clues" v="7" />
        </Inspector>

        <Inspector title="ARPlacementManager">
          <Section label="AR Components" />
          <Field k="Raycast Manager" v="AR Session Origin" />
          <Field k="Plane Manager" v="AR Session Origin" />
          <Section label="Clue Prefabs" />
          <Field k="Fingerprint Prefab" v="Prefabs/Clue_Fingerprint" />
          <Field k="Torn Note Prefab" v="Prefabs/Clue_TornNote" />
          <Field k="Footprints Prefab" v="Prefabs/Clue_Footprints" />
          <Field k="Watch Prefab" v="Prefabs/Clue_Watch" />
          <Field k="Key Prefab" v="Prefabs/Clue_Key" />
          <Field k="Bookshelf Trigger" v="Prefabs/Bookshelf_Interact" />
          <Section label="Settings" />
          <Field k="Auto Place On Start" v="false" />
          <Field k="Max Planes To Use" v="5" />
        </Inspector>

        <Inspector title="ARClue  (each prefab)">
          <Field k="Clue Name" v="Fingerprint / Torn Note / …" />
          <Field k="Points" v="100 / 150 / 100 / 300 / 200" />
          <Field k="Visual Object" v="child mesh" />
          <Field k="Interaction Distance" v="1.5" />
          <Field k="Require Tap" v="true" />
          <Field k="Box Collider" v="Is Trigger off" />
        </Inspector>

        <Inspector title="BookshelfTrigger">
          <Field k="Closed Bookshelf" v="child Closed" />
          <Field k="Open Bookshelf" v="child Open (inactive)" />
          <Field k="Glowing Book" v="child GlowBook" />
          <Field k="Required Clue" v="Torn Note" />
          <Field k="Points" v="300" />
        </Inspector>

        <Inspector title="UIManager">
          <Section label="HUD — drag from Canvas_HUD" />
          <Field k="Timer Text" v="TimerText" />
          <Field k="Score Text" v="ScoreText" />
          <Field k="Evidence Count Text" v="EvidenceCount" />
          <Field k="Notification Text / Panel" v="Notification*" />
          <Section label="Panels (start inactive)" />
          <Field k="Evidence / Suspects / Accusation" v="matching panels" />
          <Field k="Final Result Panel" v="FinalResultPanel" />
        </Inspector>
      </div>

      <h3 className="mt-8 text-sm tracking-wide text-[color:var(--fg-subtle)]">BUTTON ONCLICK</h3>
      <div className="mt-3 overflow-auto text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[color:var(--fg-subtle)]">
              <th className="border-b border-[color:var(--border)] py-2 pr-3">Button</th>
              <th className="border-b border-[color:var(--border)] py-2 pr-3">Target</th>
              <th className="border-b border-[color:var(--border)] py-2">Method</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {[
              ["EvidenceBtn", "UIManager", "ToggleEvidencePanel"],
              ["SuspectsBtn", "UIManager", "ToggleSuspectsPanel"],
              ["AccuseBtn", "UIManager", "OpenAccusation"],
              ["HintBtn", "UIManager", "OnHintButton"],
              ["EleanorBtn", "UIManager", "AccuseEleanor"],
              ["MarcusBtn", "UIManager", "AccuseMarcus"],
              ["VictorBtn", "UIManager", "AccuseVictor"],
              ["ClaraBtn", "UIManager", "AccuseClara"],
              ["RestartBtn", "UIManager", "Restart"],
              ["SubmitPattern", "PuzzleManager", "SubmitPatternAnswer"],
              ["StartBtn", "MainMenuController", "StartCase"],
              ["PostBtn", "FirebaseLeaderboard", "PostCurrentGame"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((c) => (
                  <td key={c} className="border-b border-[color:var(--border)] py-2 pr-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display mt-12 text-2xl">4. Placeholder 3D models</h2>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        No Blender for the first demo. Hierarchy → 3D Object, then drag into Prefabs.
      </p>
      <img
        src="/unity-guide/placeholders.jpg"
        alt="Primitive placeholder clues: glowing plate, note, footprints, watch, key, bookshelf"
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[color:var(--border)]"
      />
      <img
        src="/unity-guide/scene-layout.jpg"
        alt="Clues placed on a floor plane leading to a bookshelf"
        className="mt-3 w-full rounded-[var(--radius-md)] border border-[color:var(--border)]"
      />
      <div className="mt-4 overflow-auto text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[color:var(--fg-subtle)]">
              <th className="border-b border-[color:var(--border)] py-2 pr-3">Prefab</th>
              <th className="border-b border-[color:var(--border)] py-2 pr-3">Primitive</th>
              <th className="border-b border-[color:var(--border)] py-2 pr-3">Scale</th>
              <th className="border-b border-[color:var(--border)] py-2">Material</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 pr-3">Fingerprint</td>
              <td>Quad, rotate X 90°</td>
              <td>0.12</td>
              <td>Unlit cyan, Emission 2</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Torn Note</td>
              <td>Quad</td>
              <td>0.18 × 0.12</td>
              <td>Unlit bone paper</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Footprints</td>
              <td>3× Quad in a line</td>
              <td>0.08 × 0.16</td>
              <td>Brown, 70% alpha</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Watch</td>
              <td>Cylinder + Cube strap</td>
              <td>0.05 × 0.008</td>
              <td>Metallic silver</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Key</td>
              <td>Cube + Cylinder</td>
              <td>~0.04</td>
              <td>Gold, Emission 1.5</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">Bookshelf</td>
              <td>Cube 1.2 × 1.8 × 0.3</td>
              <td>1</td>
              <td>Dark wood + GlowBook child</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm">
        <li>Create → Material. Shader: URP / Unlit (or Lit).</li>
        <li>Enable Emission. Intensity 1.5–3.</li>
        <li>Assign to Mesh Renderer. Add Box Collider, fit with Edit Collider.</li>
        <li>Add ARClue. Drag the mesh child into Visual Object.</li>
        <li>Drag the root from Hierarchy into Assets/Prefabs. Delete the scene instance.</li>
      </ol>

      <h2 id="firebase" className="font-display mt-12 text-2xl">
        5. Firebase leaderboard
      </h2>
      <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
        REST script needs no SDK. Paste the database URL in the Inspector.
      </p>
      <Inspector title="FirebaseLeaderboard">
        <Field k="Database Url" v="https://YOUR-ID-default-rtdb.firebaseio.com" />
        <Field k="List Root" v="ListRoot (Vertical Layout)" />
        <Field k="Row Prefab" v="optional TMP row" />
        <Field k="Alias Input" v="AliasInput" />
        <Field k="Status Text" v="StatusText" />
      </Inspector>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
        <li>Firebase Console → Add project → Build → Realtime Database → Create (test mode for the demo).</li>
        <li>Copy the URL. No trailing slash. Paste into Database Url.</li>
        <li>Player Settings → Internet Access = Require.</li>
        <li>
          Rules for a public college demo (tighten after the presentation):
        </li>
      </ol>
      <pre className="mt-3 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-xs">
        {`{
  "rules": {
    "scores": {
      ".read": true,
      ".write": true
    }
  }
}`}
      </pre>
      <p className="mt-3 text-sm text-[color:var(--fg-muted)]">
        Alias 3–16 characters. No emails. PostCurrentGame reads GameManager score /
        time / clues / solved. Official SDK: define FIREBASE_INSTALLED and use
        FirebaseSDKLeaderboard.cs instead.
      </p>

      <h2 className="font-display mt-12 text-2xl">6. Editor play test</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
        <li>Open ARInvestigation → Play.</li>
        <li>Click the Game view. Clues spawn in front of the camera.</li>
        <li>Click a glow object → evidence counter ticks.</li>
        <li>Collect Torn Note, tap the bookshelf → Secret Passage.</li>
        <li>Accuse Clara Wilson → CASE SOLVED.</li>
        <li>Leaderboard scene → alias → Post.</li>
      </ol>
      <p className="mt-4 text-sm text-[color:var(--fg-muted)]">
        Full checklist lives in SETUP_INSPECTOR.md inside the zip.
      </p>
    </article>
  );
}
