# Augmented Alibi — Unity Inspector & Hierarchy (screenshot-style)

Unity 2022.3 LTS · 3D URP · AR Foundation + ARCore

Use this as a checklist while you click through the Inspector. Field names match the scripts in `Scripts/`.

---

## 0. One-time project setup

1. Unity Hub → New Project → **3D (URP)** → name `AugmentedAlibi` → 2022.3 LTS.
2. Copy this kit into `Assets/`:
   - `Scripts/*.cs` → `Assets/Scripts/`
   - `Editor/AugmentedAlibiSetup.cs` → `Assets/Editor/`
3. Window → Package Manager → Unity Registry:
   - AR Foundation
   - ARCore XR Plugin
4. Edit → Project Settings → XR Plug-in Management → Android tab → **ARCore** checked.
5. Player Settings:
   - Company Name / Product Name (package id becomes unique)
   - Minimum API Level **24**
   - Internet Access = **Require** (Firebase)
6. Window → TextMeshPro → Import TMP Essentials.

Menu bar: **Augmented Alibi → Create ARInvestigation Hierarchy** builds empty GameSystems + Canvas.

---

## 1. Scenes (File → New Scene, save under Assets/Scenes)

| Order in Build Settings | Scene            | Purpose        |
|-------------------------|------------------|----------------|
| 0                       | MainMenu         | Start button   |
| 1                       | Briefing         | Case text      |
| 2                       | ARInvestigation  | Camera + clues |
| 3                       | Leaderboard      | Scores         |

File → Build Settings → Add Open Scenes. First scene = MainMenu.

---

## 2. Hierarchy — ARInvestigation (select this, fill Inspector)

```
ARInvestigation                          (scene root)
├── AR Session                           XR → AR Session
├── AR Session Origin                    XR → AR Session Origin
│   ├── AR Camera                        tag: MainCamera
│   ├── AR Plane Manager                 component on Origin
│   └── AR Raycast Manager               component on Origin
├── GameSystems
│   ├── GameManager                      script GameManager
│   ├── UIManager                        script UIManager
│   ├── PuzzleManager                    script PuzzleManager
│   ├── ARPlacementManager               script ARPlacementManager
│   └── FirebaseLeaderboard              script FirebaseLeaderboard
├── EventSystem
└── Canvas_HUD                           Screen Space - Overlay
    ├── SafeArea
    │   ├── TimerText                    TextMeshProUGUI
    │   ├── ScoreText
    │   ├── EvidenceCount
    │   └── NotificationPanel            starts inactive
    │       └── NotificationText
    ├── Buttons
    │   ├── EvidenceBtn
    │   ├── SuspectsBtn
    │   ├── HintBtn
    │   └── AccuseBtn
    ├── EvidencePanel                    inactive
    ├── SuspectsPanel                    inactive
    ├── AccusationPanel                  inactive
    │   ├── EleanorBtn / MarcusBtn / VictorBtn / ClaraBtn
    ├── PatternPuzzlePanel               inactive
    │   ├── PatternQuestion (TMP)
    │   ├── PatternInput (TMP Input)
    │   └── SubmitPattern (Button)
    └── FinalResultPanel                 inactive
        ├── ResultTitle, ResultMessage
        ├── FinalScore, FinalTime, FinalClues, RankText
        └── RestartBtn
```

**AR Camera Inspector**

| Property        | Value        |
|-----------------|--------------|
| Tag             | MainCamera   |
| Clear Flags     | Solid Color  |
| Background      | black        |
| Near            | 0.05         |
| Far             | 20           |

**AR Plane Manager** (on AR Session Origin)

| Property        | Value        |
|-----------------|--------------|
| Detection Mode  | Horizontal   |

**AR Raycast Manager** — no extra fields. Leave default.

---

## 3. Inspector — GameManager

Select `GameSystems/GameManager`.

```
Game Manager (Script)
├── Game Settings
│   ├── Total Time     900
│   └── Total Clues    7
└── Current State      (runtime — leave default)
```

Script calls DontDestroyOnLoad. Either put the same object in MainMenu, or load ARInvestigation after GameManager already exists.

---

## 4. Inspector — ARPlacementManager

Select `GameSystems/ARPlacementManager`. Drag from Hierarchy / Project.

```
AR Placement Manager (Script)
├── AR Components
│   ├── Raycast Manager     → AR Session Origin (ARRaycastManager)
│   └── Plane Manager       → AR Session Origin (ARPlaneManager)
├── Clue Prefabs
│   ├── Fingerprint Prefab  → Assets/Prefabs/Clue_Fingerprint
│   ├── Torn Note Prefab    → Assets/Prefabs/Clue_TornNote
│   ├── Footprints Prefab   → Assets/Prefabs/Clue_Footprints
│   ├── Watch Prefab        → Assets/Prefabs/Clue_Watch
│   ├── Key Prefab          → Assets/Prefabs/Clue_Key
│   └── Bookshelf Trigger   → Assets/Prefabs/Bookshelf_Interact
└── Settings
    ├── Auto Place On Start   false
    └── Max Planes To Use     5
```

First tap on a detected plane places every clue. In Editor Play, a click in the Game view uses a fallback pose in front of the camera.

---

## 5. Inspector — each ARClue prefab

Open the prefab (double-click in Project).

```
AR Clue (Script)
├── Clue Name              Fingerprint | Torn Note | Footprints | Broken Watch | Hidden Key
├── Points                 100 | 150 | 100 | 300 | 200
├── Visual Object          child mesh (the Quad / Cylinder)
├── Collected Effect       (optional particle, can be None)
├── Interaction Distance   1.5
└── Require Tap            true
```

Also on the same GameObject:

- Box Collider — Is Trigger **off**, size covering the mesh
- Layer **Default**
- Mesh Renderer with the glow material

---

## 6. Inspector — BookshelfTrigger prefab

```
Bookshelf_Interact
├── Closed          (Cube 1.2 × 1.8 × 0.3, active)
├── Open            (same size, darker hole, inactive)
└── GlowBook        (small Cube, emission cyan, inactive until player is close)

Bookshelf Trigger (Script)
├── Closed Bookshelf   → child Closed
├── Open Bookshelf     → child Open
├── Glowing Book       → child GlowBook
├── Open Effect        → optional ParticleSystem
├── Required Clue      Torn Note
└── Points             300
```

Root needs a Box Collider so taps hit it.

---

## 7. Inspector — UIManager

Select `GameSystems/UIManager`. Every slot is a drag from Canvas_HUD.

```
UI Manager (Script)
├── HUD
│   ├── Timer Text           TimerText
│   ├── Score Text           ScoreText
│   ├── Evidence Count Text  EvidenceCount
│   ├── Notification Text    NotificationText
│   └── Notification Panel   NotificationPanel
├── Panels
│   ├── Evidence Panel       EvidencePanel
│   ├── Suspects Panel       SuspectsPanel
│   ├── Accusation Panel     AccusationPanel
│   ├── Final Result Panel   FinalResultPanel
│   └── Hint Panel           (optional)
├── Final Result
│   ├── Result Title / Message / Final Score / Time / Clues / Rank Text
└── Suspect Buttons          size 4 — Eleanor, Marcus, Victor, Clara
```

**Button OnClick (Inspector → Button → On Click ())**

| Button        | Target     | Method                    |
|---------------|------------|---------------------------|
| EvidenceBtn   | UIManager  | ToggleEvidencePanel       |
| SuspectsBtn   | UIManager  | ToggleSuspectsPanel       |
| AccuseBtn     | UIManager  | OpenAccusation            |
| HintBtn       | UIManager  | OnHintButton              |
| EleanorBtn    | UIManager  | AccuseEleanor             |
| MarcusBtn     | UIManager  | AccuseMarcus              |
| VictorBtn     | UIManager  | AccuseVictor              |
| ClaraBtn      | UIManager  | AccuseClara               |
| RestartBtn    | UIManager  | Restart                   |
| SubmitPattern | PuzzleManager | SubmitPatternAnswer    |

---

## 8. Inspector — PuzzleManager

```
Puzzle Manager (Script)
├── Pattern Puzzle Panel   PatternPuzzlePanel
├── Pattern Input          PatternInput (TMP_InputField)
└── Pattern Question       PatternQuestion
```

Correct answer is `32`. Call `PuzzleManager.Instance.TriggerPatternPuzzle()` when the torn note is collected (optional hook), or add a button on EvidencePanel.

---

## 9. Inspector — Canvas_HUD

| Property      | Value                              |
|---------------|------------------------------------|
| Render Mode   | Screen Space Overlay               |
| Scaler        | Scale With Screen Size             |
| Reference     | 1080 × 1920                        |
| Match         | 0.5                                |
| Raycaster     | enabled                            |

---

## 10. Placeholder 3D models (no Blender)

Hierarchy → 3D Object. Then drag the root into `Assets/Prefabs`.

| Prefab              | Primitive                         | Transform                         | Material                         |
|---------------------|-----------------------------------|-----------------------------------|----------------------------------|
| Clue_Fingerprint    | Quad, Rotation X = 90             | Scale 0.12, 0.12, 0.12            | Unlit cyan, Emission 2           |
| Clue_TornNote       | Quad                              | Scale 0.18, 0.12, 1               | Unlit bone `#e8e2d6`             |
| Clue_Footprints     | 3 Quads parented, spaced 0.15 m   | Each 0.08 × 0.16                  | Dark brown, 70% alpha            |
| Clue_Watch          | Cylinder + child Cube strap       | 0.05, 0.008, 0.05                 | Metallic silver                  |
| Clue_Key            | Cube + Cylinder                   | ~0.04                             | Metallic gold, Emission 1.5      |
| Bookshelf_Interact  | Cube                              | 1.2 × 1.8 × 0.3                   | Dark wood + child GlowBook       |

Material recipe:

1. Create → Material.
2. Shader: **Universal Render Pipeline / Unlit** (or Lit).
3. Enable **Emission**. Color = glow. Intensity 1.5–3.
4. Assign to Mesh Renderer.
5. Add Box Collider. Edit Collider until it hugs the mesh.
6. Add `ARClue`. Drag the visible mesh into **Visual Object**.
7. Drag root Hierarchy object into `Assets/Prefabs`. Delete the scene instance.

Later: Sketchfab CC0 “vintage pocket watch”, “wooden bookshelf”. Keep table clues under 0.5 m.

---

## 11. Hierarchy — MainMenu

```
MainMenu
├── EventSystem
├── Canvas
│   ├── Title (TMP)          “AUGMENTED ALIBI”
│   ├── StartBtn             OnClick → MainMenuController.StartCase
│   ├── HowToBtn             OnClick → OpenHowToPlay
│   └── LeaderboardBtn       OnClick → OpenLeaderboard
└── GameManager              (optional bootstrap so DontDestroyOnLoad exists)
```

Attach `MainMenuController` to Canvas or an empty `Menu`.

---

## 12. Hierarchy — Leaderboard + Firebase Inspector

```
Leaderboard
├── EventSystem
├── Canvas
│   ├── AliasInput           TMP Input Field
│   ├── PostBtn              OnClick → FirebaseLeaderboard.PostCurrentGame
│   ├── RefreshBtn           OnClick → FirebaseLeaderboard.Refresh
│   ├── StatusText           TMP
│   └── ListRoot             empty with Vertical Layout Group
│       └── (rows spawn here)
└── LeaderboardSystem        script FirebaseLeaderboard
```

```
Firebase Leaderboard (Script)
├── Database Url    https://YOUR-PROJECT-default-rtdb.firebaseio.com
├── List Root       ListRoot
├── Row Prefab      (optional TMP row; if empty, script creates text)
├── Alias Input     AliasInput
└── Status Text     StatusText
```

### Firebase Console (REST — no SDK)

1. console.firebase.google.com → Add project.
2. Build → Realtime Database → Create, **test mode** for the demo.
3. Copy the URL (`https://….firebaseio.com`) into **Database Url**. Do not add a trailing slash.
4. Rules for the college demo (lock this down after the presentation):

```
{
  "rules": {
    "scores": {
      ".read": true,
      ".write": true
    }
  }
}
```

5. Player Settings → Internet Access = Require.

Official SDK path: import Firebase Unity SDK, add scripting define `FIREBASE_INSTALLED`, use `FirebaseSDKLeaderboard.cs` instead.

Do **not** store emails. Alias 3–16 characters only.

---

## 13. Play-mode test (Editor, no phone)

1. Open ARInvestigation. Press Play.
2. Click in the Game view. Clues spawn ~1.5 m in front of the camera.
3. Click a glowing object → notification + evidence count.
4. Collect Torn Note, tap the bookshelf → Secret Passage.
5. Accuse Clara Wilson → CASE SOLVED.
6. Open Leaderboard scene, type an alias, Post.

## 14. Phone build

File → Build Settings → Android → Switch Platform → Build and Run.  
ARCore-capable device. Bright, textured floor helps plane detection.
