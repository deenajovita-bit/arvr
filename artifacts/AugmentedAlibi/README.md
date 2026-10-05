# Augmented Alibi — AR Mystery Hunt
### College Project Ready Unity AR Game

**Tagline:** The crime scene is real. The clues are augmented. Can you find the killer?

---

## What You Get
Complete C# scripts for a fully playable AR murder-mystery game using Unity + AR Foundation.

### Included Scripts
| Script | Purpose |
|--------|---------|
| `GameManager.cs` | Core game state, timer, scoring, evidence list, accusation logic |
| `ARClue.cs` | Individual collectible AR evidence (fingerprint, watch, note…) |
| `ARPlacementManager.cs` | Places all clues on detected AR planes when player taps |
| `BookshelfTrigger.cs` | Interactive secret passage that requires the Torn Note first |
| `UIManager.cs` | All HUD, notifications, final result screen |
| `PuzzleManager.cs` | Pattern puzzle + evidence matching |
| `FirebaseLeaderboard.cs` | REST leaderboard — no Firebase SDK |
| `FirebaseSDKLeaderboard.cs` | Official SDK (define FIREBASE_INSTALLED) |

---

## Quick Start (30–60 minutes)

### 1. Create Unity Project
1. Open **Unity Hub**
2. New Project → **3D (URP)** or **3D** template
3. Name it `AugmentedAlibi`
4. Unity version: **2022.3 LTS** recommended

### 2. Install AR Packages
1. Window → Package Manager
2. Install:
   - **AR Foundation**
   - **ARCore XR Plugin** (Android)
   - **ARKit XR Plugin** (if you also want iOS)
3. Edit → Project Settings → XR Plug-in Management
   - Enable **ARCore** on Android tab
   - Enable **ARKit** on iOS tab

### 3. Create Scenes
Create these scenes (File → New Scene):
- `MainMenu`
- `Briefing`
- `ARInvestigation`  ← main AR scene
- `Leaderboard` (optional)

### 4. Setup ARInvestigation Scene
1. Delete the default Main Camera
2. Right-click in Hierarchy → XR → **AR Session**
3. Right-click → XR → **AR Session Origin**
4. On AR Session Origin add:
   - `AR Raycast Manager`
   - `AR Plane Manager`
5. Create empty GameObjects and attach the scripts:
   - `GameManager` (with DontDestroyOnLoad)
   - `UIManager`
   - `ARPlacementManager`
   - `PuzzleManager`

### 5. Create Simple Prefabs for Clues
For each clue (Fingerprint, Torn Note, Footprints, Broken Watch, Key):
1. Create a Cube / Sphere / Quad
2. Scale it small (0.1 – 0.3)
3. Add a bright material (emissive / glowing)
4. Add `ARClue.cs` component
5. Add a Box Collider
6. Drag into Project → Prefabs folder
7. Assign the prefabs in `ARPlacementManager`

For the Bookshelf:
- Use a bigger cube or free bookshelf model
- Attach `BookshelfTrigger.cs`

### 6. Build UI (Canvas)
Create a Canvas (Screen Space - Overlay) with:
- Timer text (top left)
- Score text
- Evidence counter
- Notification panel (center, hidden by default)
- Buttons: Evidence, Suspects, Hint, Accuse
- Final Result panel (hidden)

Assign all references in the `UIManager` inspector.

### 7. Test in Editor
- Press Play
- Click in the Game view → clues will spawn in front of the camera (editor fallback)
- Walk close and click the objects to collect them

### 8. Build to Phone
1. File → Build Settings → Android
2. Switch Platform
3. Player Settings → set Package Name (`com.yourname.augmentedalibi`)
4. Minimum API Level 24+
5. Build and Run on a real Android phone that supports ARCore

---

## Correct Solution (for testing)
**Culprit:** Clara Wilson  
**Key Evidence:** Broken Watch (C.W.), Torn Note, Fingerprint, Secret Passage

---

## Scoring
| Action                    | Points |
|---------------------------|--------|
| Find clue                 | +100–300 |
| Solve puzzle              | +200–250 |
| Correct suspect           | +500 |
| Correct method (passage)  | +300 |
| Time bonus                | variable |
| Wrong accusation          | –300 |
| Use hint                  | –100 |

---

## Next Improvements You Can Add
1. Real 3D models (Sketchfab free assets)
2. Sound effects + background music
3. Firebase leaderboard (`FirebaseLeaderboard.cs` — paste Realtime Database URL)
4. More puzzles
5. UV light shader toggle
6. Simple dialogue for suspects

---

## Project Structure
```
AugmentedAlibi/
├── SETUP_INSPECTOR.md    ← hierarchy, Inspector slots, primitives, Firebase
├── Editor/
│   └── AugmentedAlibiSetup.cs
├── Scripts/
│   ├── GameManager.cs
│   ├── ARClue.cs
│   ├── ARPlacementManager.cs
│   ├── BookshelfTrigger.cs
│   ├── UIManager.cs
│   ├── PuzzleManager.cs
│   ├── MainMenuController.cs
│   ├── FirebaseLeaderboard.cs
│   └── FirebaseSDKLeaderboard.cs
├── Prefabs/
├── Scenes/
├── UI/
└── Materials/
```

You now have everything needed to build a working AR mystery game that will impress judges.

Good luck with your project!  
If you get stuck on any specific step, just ask.
