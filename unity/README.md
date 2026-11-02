# Augmented Alibi — AR Mystery Hunt (Unity)

College-project AR murder mystery using Unity + AR Foundation.

## Scripts in this folder

| Path | Purpose |
|------|----------|
| `Editor/OneClickBuild.cs` | Menu: Augmented Alibi → Build Clues (One Click) |
| `Editor/AugmentedAlibiSetup.cs` | Menu: Create ARInvestigation Hierarchy |
| `Scripts/GameManager.cs` | Timer, score, evidence, accusation |
| `Scripts/ARClue.cs` | Collectible evidence |
| `Scripts/ARPlacementManager.cs` | Place clues on AR planes / editor fallback |
| `Scripts/BookshelfTrigger.cs` | Secret passage interaction |
| `Scripts/UIManager.cs` | HUD and notifications |
| `Scripts/PuzzleManager.cs` | Pattern + matching puzzles |
| `Scripts/MainMenuController.cs` | Menu scene buttons |
| `Scripts/FirebaseLeaderboard.cs` | REST leaderboard |
| `Scripts/FirebaseSDKLeaderboard.cs` | Official Firebase SDK (optional) |

## Quick start

1. Copy `Editor/` and `Scripts/` into your Unity project `Assets/` folder.
2. Install AR Foundation + ARCore XR Plugin.
3. Menu: **Augmented Alibi → Create ARInvestigation Hierarchy**
4. Menu: **Augmented Alibi → Build Clues (One Click)**
5. Set **Edit → Project Settings → Player → Active Input Handling → Both**
6. Press Play, click the Game view once, then click the clues.

## Correct solution (for testing)

- Culprit: **Clara Wilson**
- Key evidence: Broken Watch (C.W.), Torn Note, Fingerprint, Secret Passage

Full Inspector setup notes: see `SETUP_INSPECTOR.md` (add if needed).
