import { y as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unity-CKQDmrZU.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[color:var(--border)] py-1.5 text-[11px] sm:grid-cols-[minmax(7rem,11rem)_1fr] sm:text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[color:var(--fg-muted)]",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-[var(--radius-xs)] bg-[color:var(--bg-subtle)] px-2 py-0.5 font-mono text-[color:var(--fg)]",
			children: v
		})]
	});
}
function Inspector({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-[color:var(--border)] px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[color:var(--color-accent)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "ml-auto text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-subtle)]",
					children: "Inspector"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 py-1",
			children
		})]
	});
}
function Section({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]",
		children: label
	});
}
function UnityKit() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-10 text-[color:var(--fg)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-sm text-[color:var(--fg-muted)]",
				children: "Back to case"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-4 text-4xl tracking-[-0.03em]",
				children: "Unity build kit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[color:var(--fg-muted)]",
				children: "Exact hierarchy, Inspector slots, primitive placeholders, and Firebase leaderboard. Field names match the C# scripts."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "btn-primary inline-flex items-center",
					href: "/downloads/AugmentedAlibi_Unity_Kit.zip",
					children: "Download Unity kit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "btn-ghost inline-flex items-center",
					href: "#firebase",
					children: "Firebase"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-2xl",
				children: "1. Scenes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[color:var(--fg-muted)]",
				children: "File → New Scene. Save into Assets/Scenes. Build Settings order:"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-3 list-decimal space-y-1 pl-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "MainMenu — start button (index 0)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Briefing — case text" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ARInvestigation — camera, planes, clues" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Leaderboard — Firebase list" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-[color:var(--fg-muted)]",
				children: [
					"After scripts are in Assets/Editor, use menu",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[color:var(--fg)]",
						children: "Augmented Alibi → Create ARInvestigation Hierarchy"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-2xl",
				children: "2. Hierarchy — ARInvestigation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-[11px] leading-6 sm:text-xs",
				children: `ARInvestigation
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
    └── FinalResultPanel`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-2xl",
				children: "3. Inspector — copy these values"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[color:var(--fg-muted)]",
				children: "Click the object in Hierarchy, then match every slot below. Drag references; do not type GameObject names except where noted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "AR Camera",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Tag",
								v: "MainCamera"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Clear Flags",
								v: "Solid Color"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Background",
								v: "black"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Near / Far",
								v: "0.05 / 20"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "AR Session Origin",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "AR Plane Manager" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Detection Mode",
								v: "Horizontal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "AR Raycast Manager" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "—",
								v: "defaults"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "GameManager",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "Game Settings" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Total Time",
								v: "900"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Total Clues",
								v: "7"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "ARPlacementManager",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "AR Components" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Raycast Manager",
								v: "AR Session Origin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Plane Manager",
								v: "AR Session Origin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "Clue Prefabs" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Fingerprint Prefab",
								v: "Prefabs/Clue_Fingerprint"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Torn Note Prefab",
								v: "Prefabs/Clue_TornNote"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Footprints Prefab",
								v: "Prefabs/Clue_Footprints"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Watch Prefab",
								v: "Prefabs/Clue_Watch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Key Prefab",
								v: "Prefabs/Clue_Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Bookshelf Trigger",
								v: "Prefabs/Bookshelf_Interact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "Settings" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Auto Place On Start",
								v: "false"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Max Planes To Use",
								v: "5"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "ARClue  (each prefab)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Clue Name",
								v: "Fingerprint / Torn Note / …"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Points",
								v: "100 / 150 / 100 / 300 / 200"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Visual Object",
								v: "child mesh"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Interaction Distance",
								v: "1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Require Tap",
								v: "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Box Collider",
								v: "Is Trigger off"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "BookshelfTrigger",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Closed Bookshelf",
								v: "child Closed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Open Bookshelf",
								v: "child Open (inactive)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Glowing Book",
								v: "child GlowBook"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Required Clue",
								v: "Torn Note"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Points",
								v: "300"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
						title: "UIManager",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "HUD — drag from Canvas_HUD" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Timer Text",
								v: "TimerText"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Score Text",
								v: "ScoreText"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Evidence Count Text",
								v: "EvidenceCount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Notification Text / Panel",
								v: "Notification*"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { label: "Panels (start inactive)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Evidence / Suspects / Accusation",
								v: "matching panels"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								k: "Final Result Panel",
								v: "FinalResultPanel"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 text-sm tracking-wide text-[color:var(--fg-subtle)]",
				children: "BUTTON ONCLICK"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-auto text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[color:var(--fg-subtle)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2 pr-3",
								children: "Button"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2 pr-3",
								children: "Target"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2",
								children: "Method"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "font-mono text-xs",
						children: [
							[
								"EvidenceBtn",
								"UIManager",
								"ToggleEvidencePanel"
							],
							[
								"SuspectsBtn",
								"UIManager",
								"ToggleSuspectsPanel"
							],
							[
								"AccuseBtn",
								"UIManager",
								"OpenAccusation"
							],
							[
								"HintBtn",
								"UIManager",
								"OnHintButton"
							],
							[
								"EleanorBtn",
								"UIManager",
								"AccuseEleanor"
							],
							[
								"MarcusBtn",
								"UIManager",
								"AccuseMarcus"
							],
							[
								"VictorBtn",
								"UIManager",
								"AccuseVictor"
							],
							[
								"ClaraBtn",
								"UIManager",
								"AccuseClara"
							],
							[
								"RestartBtn",
								"UIManager",
								"Restart"
							],
							[
								"SubmitPattern",
								"PuzzleManager",
								"SubmitPatternAnswer"
							],
							[
								"StartBtn",
								"MainMenuController",
								"StartCase"
							],
							[
								"PostBtn",
								"FirebaseLeaderboard",
								"PostCurrentGame"
							]
						].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: row.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-[color:var(--border)] py-2 pr-3",
							children: c
						}, c)) }, row[0]))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-2xl",
				children: "4. Placeholder 3D models"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[color:var(--fg-muted)]",
				children: "No Blender for the first demo. Hierarchy → 3D Object, then drag into Prefabs."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/unity-guide/placeholders.jpg",
				alt: "Primitive placeholder clues: glowing plate, note, footprints, watch, key, bookshelf",
				className: "mt-4 w-full rounded-[var(--radius-md)] border border-[color:var(--border)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/unity-guide/scene-layout.jpg",
				alt: "Clues placed on a floor plane leading to a bookshelf",
				className: "mt-3 w-full rounded-[var(--radius-md)] border border-[color:var(--border)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-auto text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[color:var(--fg-subtle)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2 pr-3",
								children: "Prefab"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2 pr-3",
								children: "Primitive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2 pr-3",
								children: "Scale"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-[color:var(--border)] py-2",
								children: "Material"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Fingerprint"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Quad, rotate X 90°" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "0.12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Unlit cyan, Emission 2" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Torn Note"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Quad" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "0.18 × 0.12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Unlit bone paper" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Footprints"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "3× Quad in a line" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "0.08 × 0.16" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Brown, 70% alpha" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Watch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Cylinder + Cube strap" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "0.05 × 0.008" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Metallic silver" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Cube + Cylinder" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "~0.04" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Gold, Emission 1.5" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: "Bookshelf"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Cube 1.2 × 1.8 × 0.3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Dark wood + GlowBook child" })
						] })
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 list-decimal space-y-1 pl-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Create → Material. Shader: URP / Unlit (or Lit)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Enable Emission. Intensity 1.5–3." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Assign to Mesh Renderer. Add Box Collider, fit with Edit Collider." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Add ARClue. Drag the mesh child into Visual Object." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Drag the root from Hierarchy into Assets/Prefabs. Delete the scene instance." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "firebase",
				className: "font-display mt-12 text-2xl",
				children: "5. Firebase leaderboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[color:var(--fg-muted)]",
				children: "REST script needs no SDK. Paste the database URL in the Inspector."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Inspector, {
				title: "FirebaseLeaderboard",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						k: "Database Url",
						v: "https://YOUR-ID-default-rtdb.firebaseio.com"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						k: "List Root",
						v: "ListRoot (Vertical Layout)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						k: "Row Prefab",
						v: "optional TMP row"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						k: "Alias Input",
						v: "AliasInput"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						k: "Status Text",
						v: "StatusText"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 list-decimal space-y-2 pl-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Firebase Console → Add project → Build → Realtime Database → Create (test mode for the demo)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Copy the URL. No trailing slash. Paste into Database Url." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Player Settings → Internet Access = Require." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Rules for a public college demo (tighten after the presentation):" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 text-xs",
				children: `{
  "rules": {
    "scores": {
      ".read": true,
      ".write": true
    }
  }
}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-[color:var(--fg-muted)]",
				children: "Alias 3–16 characters. No emails. PostCurrentGame reads GameManager score / time / clues / solved. Official SDK: define FIREBASE_INSTALLED and use FirebaseSDKLeaderboard.cs instead."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-2xl",
				children: "6. Editor play test"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-2 list-decimal space-y-1 pl-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open ARInvestigation → Play." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click the Game view. Clues spawn in front of the camera." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click a glow object → evidence counter ticks." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Collect Torn Note, tap the bookshelf → Secret Passage." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Accuse Clara Wilson → CASE SOLVED." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Leaderboard scene → alias → Post." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-[color:var(--fg-muted)]",
				children: "Full checklist lives in SETUP_INSPECTOR.md inside the zip."
			})
		]
	});
}
//#endregion
export { UnityKit as component };
