import { o as __toESM } from "../_runtime.mjs";
import { _ as Vector3, a as Canvas, b as require_react, d as ClampToEdgeWrapping, f as MathUtils, g as SRGBColorSpace, h as RepeatWrapping, i as useTexture, l as BufferAttribute, m as MeshStandardMaterial, n as RoundedBox, o as useFrame, p as MeshPhysicalMaterial, r as SoftShadows, s as useThree, t as ContactShadows, u as BufferGeometry, y as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { c as Fingerprint, i as Users, l as Clock, n as VolumeX, o as Search, r as Volume2, s as Lightbulb, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GameClient-Cc4D_fcB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CASE = {
	id: "001",
	title: "The Crimson Eye",
	mansion: "Blackwood Mansion",
	timeLimit: 900,
	victim: "Dr. Adrian Blake",
	victimRole: "Archaeologist",
	missing: "The Crimson Eye",
	crimeWindow: "8:15 PM – 8:25 PM",
	twist: "The thief did not leave through the door. They used a hidden passage behind a bookshelf."
};
var SUSPECTS = {
	eleanor: {
		name: "Eleanor Blake",
		role: "Daughter",
		alibi: "I was in the dining room preparing dinner.",
		motive: "Learned her father planned to change his will.",
		herring: "A half-written letter about the will sits in the dining room, but no physical trail places her in the study."
	},
	marcus: {
		name: "Marcus Reed",
		role: "Museum curator",
		alibi: "I was outside making a phone call.",
		motive: "Knew the gemstone's market value better than anyone.",
		herring: "Phone records confirm a call at 8:18 PM. Motive without access."
	},
	victor: {
		name: "Victor Stone",
		role: "Security guard",
		alibi: "I was checking the security cameras.",
		motive: "Cameras failed during the crime window.",
		herring: "The log shows he was trying to restart the system. Incompetent, not the thief."
	},
	clara: {
		name: "Clara Wilson",
		role: "Research assistant",
		alibi: "I was organizing documents in the library.",
		motive: "Access to the study and knowledge of the artifact.",
		herring: "Her alibi collapses against the watch, prints, and passage."
	}
};
var CORRECT_SUSPECT = "clara";
var CLUES = [
	{
		id: "fingerprint",
		name: "Fingerprint",
		points: 100,
		detail: "Lifted from the study table. Later analysis matches Clara Wilson."
	},
	{
		id: "torn-note",
		name: "Torn Note",
		points: 150,
		detail: "“8:20. Behind the old books.” A hint toward the secret passage."
	},
	{
		id: "footprints",
		name: "Footprints",
		points: 100,
		detail: "A trail on the rug, from the desk toward the bookshelf."
	},
	{
		id: "camera",
		name: "Camera Log",
		points: 100,
		detail: "Feed disabled at 8:17 PM. Victor looks guilty — until you read the restart attempts."
	},
	{
		id: "watch",
		name: "Broken Watch",
		points: 300,
		detail: "Stopped at 8:22 PM. Initials engraved: C.W."
	},
	{
		id: "passage",
		name: "Secret Passage",
		points: 300,
		detail: "Bookshelf swings open. Only someone who knew the mansion could use this.",
		requires: "torn-note"
	},
	{
		id: "key",
		name: "Hidden Key",
		points: 200,
		detail: "Inside the passage: a key, a glove, a receipt, and a photo of the Crimson Eye.",
		requires: "passage"
	}
];
function formatTime(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
function unlockAudio() {
	if (!ctx) {
		ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfx = ctx.createGain();
		sfx.connect(master);
		master.connect(ctx.destination);
		master.gain.value = .7;
		sfx.gain.value = .9;
	}
	if (ctx.state === "suspended") ctx.resume();
}
function setMuted(v) {
	muted = v;
	if (master && ctx) master.gain.setTargetAtTime(v ? 0 : .7, ctx.currentTime, .02);
}
function isMuted() {
	return muted;
}
function beep(freq, dur, type = "sine", gain = .08) {
	if (!ctx || !sfx || muted) return;
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	g.gain.setValueAtTime(1e-4, now);
	g.gain.exponentialRampToValueAtTime(gain, now + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, now + dur);
	osc.connect(g);
	g.connect(sfx);
	osc.start(now);
	osc.stop(now + dur + .02);
	osc.onended = () => {
		osc.disconnect();
		g.disconnect();
	};
}
var sfxCollect = () => {
	beep(520, .12, "triangle", .06);
	beep(780, .18, "sine", .05);
};
var sfxOpen = () => {
	beep(180, .28, "sawtooth", .04);
	beep(90, .4, "square", .03);
};
var sfxWrong = () => beep(140, .25, "square", .05);
var sfxWin = () => {
	beep(392, .16, "triangle", .05);
	setTimeout(() => beep(523, .18, "triangle", .05), 90);
	setTimeout(() => beep(659, .28, "sine", .06), 180);
};
var HINT_COST = 100;
function has(list, id) {
	return list.includes(id);
}
var useGame = create((set, get) => ({
	screen: "menu",
	timeLeft: CASE.timeLimit,
	score: 0,
	clues: [],
	nearClue: null,
	passageOpen: false,
	patternSolved: false,
	matchingSolved: false,
	accused: null,
	solved: false,
	failReason: null,
	hintUsed: false,
	notice: null,
	startedAt: 0,
	setNearClue: (id) => set({ nearClue: id }),
	setNotice: (msg) => set({ notice: msg }),
	collect: (id) => {
		const s = get();
		if (s.clues.includes(id) || s.screen !== "play") return false;
		const def = CLUES.find((c) => c.id === id);
		if (!def) return false;
		if (def.requires && !has(s.clues, def.requires)) {
			set({ notice: "You need another piece of evidence first." });
			return false;
		}
		const next = [...s.clues, id];
		sfxCollect();
		set({
			clues: next,
			score: s.score + def.points,
			notice: `Evidence logged: ${def.name}`
		});
		return true;
	},
	tryOpenPassage: () => {
		const s = get();
		if (s.passageOpen) return;
		if (!has(s.clues, "torn-note")) {
			set({ notice: "The bookshelf will not yield. You are missing a clue." });
			return;
		}
		sfxOpen();
		const already = has(s.clues, "passage");
		set({
			passageOpen: true,
			clues: already ? s.clues : [...s.clues, "passage"],
			score: already ? s.score : s.score + 300,
			notice: "Secret passage opened."
		});
	},
	tick: (dt) => {
		const s = get();
		if (s.screen !== "play") return;
		const next = s.timeLeft - dt;
		if (next <= 0) {
			set({
				timeLeft: 0,
				screen: "result",
				solved: false,
				failReason: "The window closed. Case timed out."
			});
			return;
		}
		set({ timeLeft: next });
	},
	useHint: () => {
		const s = get();
		if (s.screen !== "play") return;
		const missing = CLUES.filter((c) => !s.clues.includes(c.id));
		const hint = missing[0]?.id === "passage" ? "Scan the bookshelf after you have the torn note." : missing[0] ? `Look closer near: ${missing[0].name}.` : "You have the evidence. Accuse when ready.";
		set({
			hintUsed: true,
			score: Math.max(0, s.score - HINT_COST),
			notice: hint
		});
	},
	solvePattern: (answer) => {
		const s = get();
		if (answer.trim() === "32") {
			set({
				patternSolved: true,
				score: s.score + 200,
				notice: "Pattern confirmed. The note's cipher checks out."
			});
			sfxCollect();
			return true;
		}
		sfxWrong();
		set({ notice: "That sequence is wrong." });
		return false;
	},
	solveMatching: (ok) => {
		const s = get();
		if (ok) {
			set({
				matchingSolved: true,
				score: s.score + 250,
				notice: "Evidence board aligned."
			});
			sfxCollect();
		} else {
			sfxWrong();
			set({
				score: Math.max(0, s.score - 50),
				notice: "Incorrect pairing. Re-read the watch and prints."
			});
		}
	},
	accuse: (id) => {
		const s = get();
		const correct = id === CORRECT_SUSPECT;
		let score = s.score;
		if (correct) {
			score += 500;
			if (has(s.clues, "passage") && has(s.clues, "watch")) score += 300;
			const timeBonus = Math.round(s.timeLeft / 60) * 50;
			score += timeBonus;
			sfxWin();
			set({
				accused: id,
				solved: true,
				score,
				screen: "result",
				failReason: null
			});
		} else {
			sfxWrong();
			set({
				accused: id,
				solved: false,
				score: Math.max(0, score - 300),
				screen: "result",
				failReason: "Wrong accusation. The true thief walks free."
			});
		}
	},
	briefing: () => set({ screen: "briefing" }),
	start: () => set({
		screen: "play",
		timeLeft: CASE.timeLimit,
		score: 0,
		clues: [],
		nearClue: null,
		passageOpen: false,
		patternSolved: false,
		matchingSolved: false,
		accused: null,
		solved: false,
		failReason: null,
		hintUsed: false,
		notice: "Walk the study. Look for glowing evidence.",
		startedAt: performance.now()
	}),
	toMenu: () => set({
		screen: "menu",
		timeLeft: CASE.timeLimit,
		score: 0,
		clues: [],
		nearClue: null,
		passageOpen: false,
		patternSolved: false,
		matchingSolved: false,
		accused: null,
		solved: false,
		failReason: null,
		notice: null
	})
}));
var SPEED = 3.4;
var LOOK = .0022;
var EYE = 1.62;
var ROOM = {
	minX: -4.6,
	maxX: 4.6,
	minZ: -5.4,
	maxZ: 4.4
};
var _fwd = new Vector3();
var _right = new Vector3();
var _wish = new Vector3();
function Player({ cluePositions, furniture, locked, lookDelta, moveAxis }) {
	const { camera } = useThree();
	const yaw = (0, import_react.useRef)(0);
	const pitch = (0, import_react.useRef)(0);
	const pos = (0, import_react.useRef)(new Vector3(0, EYE, 3.4));
	const keys = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const vel = (0, import_react.useRef)(0);
	const collect = useGame((s) => s.collect);
	const tryOpen = useGame((s) => s.tryOpenPassage);
	const setNear = useGame((s) => s.setNearClue);
	const screen = useGame((s) => s.screen);
	(0, import_react.useEffect)(() => {
		camera.position.copy(pos.current);
		camera.rotation.order = "YXZ";
	}, [camera]);
	(0, import_react.useEffect)(() => {
		const onDown = (e) => {
			keys.current.add(e.code);
			if ([
				"KeyW",
				"KeyA",
				"KeyS",
				"KeyD",
				"Space"
			].includes(e.code)) e.preventDefault();
			if (e.code === "KeyE" && screen === "play") {
				const near = useGame.getState().nearClue;
				if (near === "passage") tryOpen();
				else if (near) collect(near);
			}
		};
		const onUp = (e) => keys.current.delete(e.code);
		const clear = () => keys.current.clear();
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		window.addEventListener("blur", clear);
		document.addEventListener("visibilitychange", clear);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
			window.removeEventListener("blur", clear);
			document.removeEventListener("visibilitychange", clear);
		};
	}, [
		collect,
		tryOpen,
		screen
	]);
	(0, import_react.useEffect)(() => {
		const probe = {
			getYaw: () => yaw.current,
			getSpeed: () => vel.current,
			getPitch: () => pitch.current,
			getPosition: () => ({
				x: pos.current.x,
				z: pos.current.z
			}),
			setKeys: (codes) => {
				keys.current = new Set(codes);
			}
		};
		window.__controlsTest = probe;
		return () => {
			if (window.__controlsTest === probe) delete window.__controlsTest;
		};
	}, []);
	useFrame((_, delta) => {
		const d = Math.min(delta, .1);
		if (screen === "play") useGame.getState().tick(d);
		if (locked || lookDelta.current.x || lookDelta.current.y) {
			yaw.current -= lookDelta.current.x * LOOK;
			pitch.current -= lookDelta.current.y * LOOK;
			pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
			lookDelta.current.x = 0;
			lookDelta.current.y = 0;
		}
		_fwd.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
		_right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
		let ax = moveAxis.current.x;
		let az = moveAxis.current.y;
		if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) az += 1;
		if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) az -= 1;
		if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) ax += 1;
		if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) ax -= 1;
		ax = Math.max(-1, Math.min(1, ax));
		az = Math.max(-1, Math.min(1, az));
		_wish.set(0, 0, 0);
		_wish.addScaledVector(_fwd, az);
		_wish.addScaledVector(_right, ax);
		if (_wish.lengthSq() > 1) _wish.normalize();
		const moving = _wish.lengthSq() > 1e-4 && screen === "play";
		vel.current = moving ? SPEED : 0;
		if (moving) {
			const nx = pos.current.x + _wish.x * SPEED * d;
			const nz = pos.current.z + _wish.z * SPEED * d;
			if (!blocked(new Vector3(nx, EYE, nz), furniture)) {
				pos.current.x = MathUtils.clamp(nx, ROOM.minX, ROOM.maxX);
				pos.current.z = MathUtils.clamp(nz, ROOM.minZ, ROOM.maxZ);
			}
		}
		camera.position.copy(pos.current);
		camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
		let nearest = null;
		let best = 1.35;
		for (const c of cluePositions) {
			const dx = c.pos.x - pos.current.x;
			const dz = c.pos.z - pos.current.z;
			const dist = Math.hypot(dx, dz);
			if (dist < best) {
				best = dist;
				nearest = c.id;
			}
		}
		if (useGame.getState().nearClue !== nearest) setNear(nearest);
	});
	return null;
}
function blocked(p, boxes) {
	const r = .28;
	for (const b of boxes) if (p.x + r > b.min.x && p.x - r < b.max.x && p.z + r > b.min.z && p.z - r < b.max.z) return true;
	return false;
}
var CLUE_POS = {
	fingerprint: [
		.55,
		.92,
		-1.15
	],
	"torn-note": [
		-.7,
		.12,
		-.85
	],
	footprints: [
		.2,
		.03,
		.4
	],
	camera: [
		3.9,
		2.15,
		-2.2
	],
	watch: [
		2.05,
		.08,
		-3.55
	],
	passage: [
		.15,
		1.3,
		-4.55
	],
	key: [
		.15,
		.35,
		-5.05
	]
};
var FURNITURE_BOXES = [
	{
		min: new Vector3(-1.5, 0, -1.7),
		max: new Vector3(1.5, 1.2, -.5)
	},
	{
		min: new Vector3(-2.2, 0, -5.1),
		max: new Vector3(2.2, 2.6, -4.2)
	},
	{
		min: new Vector3(-4.9, 0, 1.4),
		max: new Vector3(-3.5, 1.4, 3.2)
	}
];
var BOOK_COLORS = [
	"#4a1f1c",
	"#2c3a2e",
	"#3d2b1f",
	"#1f2a38",
	"#5c3b1e",
	"#3a1c28",
	"#2a2420",
	"#4e3428",
	"#6b4a2b"
];
function useRoomTextures() {
	const maps = useTexture({
		floor: "/textures/floor.jpg",
		wood: "/textures/mahogany.jpg",
		plaster: "/textures/plaster.jpg",
		rug: "/textures/rug.jpg",
		window: "/textures/window.jpg",
		curtain: "/textures/curtain.jpg",
		painting: "/textures/painting.jpg",
		stone: "/textures/stone.jpg"
	});
	(0, import_react.useLayoutEffect)(() => {
		const { floor, wood, plaster, rug, window, curtain, painting, stone } = maps;
		for (const t of [
			floor,
			wood,
			plaster,
			rug,
			window,
			curtain,
			painting,
			stone
		]) {
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
		}
		floor.wrapS = floor.wrapT = RepeatWrapping;
		floor.repeat.set(4.2, 4.2);
		wood.wrapS = wood.wrapT = RepeatWrapping;
		wood.repeat.set(2.2, 2.2);
		plaster.wrapS = plaster.wrapT = RepeatWrapping;
		plaster.repeat.set(2.8, 1.8);
		stone.wrapS = stone.wrapT = RepeatWrapping;
		stone.repeat.set(1.6, 1.4);
		rug.wrapS = rug.wrapT = ClampToEdgeWrapping;
		curtain.wrapS = curtain.wrapT = RepeatWrapping;
		curtain.repeat.set(1, 1.4);
	}, [maps]);
	return maps;
}
function Study() {
	const clues = useGame((s) => s.clues);
	const passageOpen = useGame((s) => s.passageOpen);
	const near = useGame((s) => s.nearClue);
	const maps = useRoomTextures();
	const mats = (0, import_react.useMemo)(() => {
		return {
			floor: new MeshStandardMaterial({
				map: maps.floor,
				roughness: .38,
				metalness: .04
			}),
			wood: new MeshStandardMaterial({
				map: maps.wood,
				roughness: .4,
				metalness: .12
			}),
			darkWood: new MeshStandardMaterial({
				map: maps.wood,
				color: "#5c4638",
				roughness: .5,
				metalness: .08
			}),
			plaster: new MeshStandardMaterial({
				map: maps.plaster,
				roughness: .92,
				metalness: 0
			}),
			rug: new MeshStandardMaterial({
				map: maps.rug,
				roughness: .97,
				metalness: 0
			}),
			leather: new MeshStandardMaterial({
				color: "#2c1812",
				roughness: .48,
				metalness: .06
			}),
			brass: new MeshPhysicalMaterial({
				color: "#c4a05a",
				metalness: .92,
				roughness: .22,
				clearcoat: .4
			}),
			shade: new MeshStandardMaterial({
				color: "#f0dcb4",
				emissive: "#e0b56a",
				emissiveIntensity: 1.1,
				roughness: .65,
				side: 2
			}),
			stone: new MeshStandardMaterial({
				map: maps.stone,
				roughness: .9,
				metalness: .02
			}),
			velvet: new MeshStandardMaterial({
				map: maps.curtain,
				roughness: .86,
				metalness: 0,
				side: 2
			})
		};
	}, [maps]);
	const books = (0, import_react.useMemo)(() => {
		const list = [];
		let i = 0;
		for (let shelf = 0; shelf < 4; shelf++) {
			let x = -1.45;
			const y = -.95 + shelf * .58;
			while (x < 1.45) {
				const w = .07 + i % 5 * .018;
				const h = .32 + i * 17 % 11 * .012;
				list.push({
					x,
					y: y + h / 2,
					z: .08,
					w,
					h,
					d: .2,
					c: BOOK_COLORS[i % BOOK_COLORS.length]
				});
				x += w + .012;
				i++;
			}
		}
		return list;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoftShadows, {
			size: 18,
			samples: 8,
			focus: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			intensity: .18,
			color: "#9a8874"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#6a7a90",
			"#1c120c",
			.42
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				5.2,
				7.2,
				2.4
			],
			intensity: .55,
			color: "#f6ead2",
			castShadow: true,
			"shadow-mapSize-width": 2048,
			"shadow-mapSize-height": 2048,
			"shadow-camera-near": .5,
			"shadow-camera-far": 24,
			"shadow-camera-left": -8,
			"shadow-camera-right": 8,
			"shadow-camera-top": 8,
			"shadow-camera-bottom": -8,
			"shadow-bias": -25e-5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			position: [
				0,
				0,
				-.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [10.4, 11.2] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.floor,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				.05,
				.018,
				-.5
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [4.4, 6.1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.rug,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
			position: [
				0,
				.02,
				-.4
			],
			opacity: .52,
			scale: 12,
			blur: 2.1,
			far: 4.5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				3.42,
				-.2
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10.4,
				.16,
				11
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.plaster,
				attach: "material"
			})]
		}),
		[
			-3.2,
			-1.05,
			1.05,
			3.2
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				3.3,
				-.2
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.14,
				.14,
				10.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}, x)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				3.22,
				-5.42
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10.1,
				.12,
				.14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-5.08,
				3.22,
				-.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.14,
				.12,
				10.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				5.08,
				3.22,
				-.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.14,
				.12,
				10.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chandelier, { brass: mats.brass }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				0,
				1.7,
				-5.55
			],
			args: [
				10.4,
				3.4,
				.18
			],
			mat: mats.plaster
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				0,
				1.7,
				5.15
			],
			args: [
				10.4,
				3.4,
				.18
			],
			mat: mats.plaster
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				-5.2,
				1.7,
				-.2
			],
			args: [
				.18,
				3.4,
				11
			],
			mat: mats.plaster
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wall, {
			position: [
				5.2,
				1.7,
				-.2
			],
			args: [
				.18,
				3.4,
				11
			],
			mat: mats.plaster
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.48,
				-5.42
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10.1,
				.96,
				.09
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-5.08,
				.48,
				-.2
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.09,
				.96,
				10.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				5.08,
				.48,
				-.2
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.09,
				.96,
				10.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.06,
				-.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10.2,
				.12,
				10.8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Window, {
			maps,
			brass: mats.brass,
			velvet: mats.velvet
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				0,
				-1.1
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						2.62,
						.08,
						1.18
					],
					radius: .02,
					smoothness: 4,
					position: [
						0,
						.74,
						0
					],
					castShadow: true,
					receiveShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.wood,
						attach: "material"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.695,
						.02
					],
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						1.55,
						.015,
						.7
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.leather,
						attach: "material"
					})]
				}),
				[-1.16, 1.16].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						.13,
						.74,
						.98
					],
					radius: .015,
					position: [
						x,
						.37,
						0
					],
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})
				}, x)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.36,
						.38
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2.2,
						.42,
						.08
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.08,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						2.45,
						.08,
						.98
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.92,
						.86,
						-.28
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.08,
						.12,
						.1,
						20
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.brass,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.92,
						1.18,
						-.28
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.016,
						.016,
						.52,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.brass,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.92,
						1.5,
						-.28
					],
					rotation: [
						.38,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						.24,
						.3,
						24,
						1,
						true
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.shade,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					position: [
						.92,
						1.36,
						-.12
					],
					intensity: 22,
					distance: 8,
					decay: 2,
					color: "#ffd19a",
					castShadow: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.85,
						.8,
						-.22
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.045,
						.05,
						.08,
						14
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#141414",
						metalness: .55,
						roughness: .32
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.85,
						.9,
						-.22
					],
					rotation: [
						.4,
						.2,
						.1
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.004,
						.004,
						.22,
						6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#1a140c",
						roughness: .6
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.38,
						.785,
						.16
					],
					rotation: [
						0,
						.18,
						0
					],
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.4,
						.008,
						.52
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#efe6d4",
						roughness: .88
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.22,
						.8,
						.28
					],
					rotation: [
						0,
						-.3,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.22,
						.04,
						.3
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#3a2218",
						roughness: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.22,
						.85,
						.28
					],
					rotation: [
						0,
						-.25,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.2,
						.035,
						.28
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#1e2a38",
						roughness: .7
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				0,
				.12
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						.66,
						.12,
						.62
					],
					radius: .04,
					position: [
						0,
						.44,
						0
					],
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.leather,
						attach: "material"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						.66,
						.86,
						.12
					],
					radius: .04,
					position: [
						0,
						.9,
						.28
					],
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.leather,
						attach: "material"
					})
				}),
				[-.34, .34].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						.08,
						.28,
						.5
					],
					radius: .02,
					position: [
						x,
						.62,
						0
					],
					castShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.leather,
						attach: "material"
					})
				}, x)),
				[
					[
						-.24,
						.2,
						-.22
					],
					[
						.24,
						.2,
						-.22
					],
					[
						-.24,
						.2,
						.22
					],
					[
						.24,
						.2,
						.22
					]
				].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: p,
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.032,
						.038,
						.4,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})]
				}, i))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				.1,
				1.35,
				-4.85
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						3.55,
						2.78,
						.52
					],
					radius: .02,
					castShadow: true,
					receiveShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						0,
						.18
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3.28,
						2.5,
						.22
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#0c0a08",
						roughness: 1
					})]
				}),
				[
					-1.05,
					-.35,
					.35,
					1.05
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						y,
						.12
					],
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						3.28,
						.05,
						.38
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.wood,
						attach: "material"
					})]
				}, y)),
				[-1.1, 1.1].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						x,
						0,
						.1
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.05,
						2.5,
						.36
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.wood,
						attach: "material"
					})]
				}, x)),
				books.map((b, i) => passageOpen && b.x > .05 && b.x < .85 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						b.x,
						b.y,
						b.z
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						b.w,
						b.h,
						b.d
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: b.c,
						roughness: .68
					})]
				}, i)),
				!passageOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.42,
						.52,
						.28
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.09,
						.34,
						.22
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#8a1c18",
						emissive: "#d4af37",
						emissiveIntensity: near === "passage" ? 1.3 : .45
					})]
				}),
				passageOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.4,
						.05,
						.4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.95,
						2.15,
						.12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#050403",
						roughness: 1
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-4.15,
				0,
				2.2
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
					args: [
						1.18,
						.86,
						1.58
					],
					radius: .025,
					position: [
						0,
						.43,
						0
					],
					castShadow: true,
					receiveShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.wood,
						attach: "material"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.08,
						0
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.24,
						32,
						20
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#3a4a3c",
						roughness: .45,
						metalness: .18
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.86,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.04,
						.08,
						.08,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.brass,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.32,
						.9,
						.35
					],
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.18,
						.05,
						.24
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#4a221c",
						roughness: .7
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				5,
				.9,
				.4
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					receiveShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.32,
						1.85,
						1.85
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.stone,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.02,
						.95,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.38,
						.14,
						2.05
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
						object: mats.darkWood,
						attach: "material"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.14,
						-.18,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.18,
						.9,
						.98
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#090706",
						roughness: 1,
						emissive: "#4a1c08",
						emissiveIntensity: .7
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FireGlow, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				3.15,
				2.08,
				-5.44
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.22,
				.98,
				.07
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: mats.darkWood,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				3.15,
				2.08,
				-5.39
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.98, .76] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				map: maps.painting,
				roughness: .62,
				metalness: 0
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				4.85,
				2.2,
				-2.2
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					castShadow: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.16,
						.1,
						.26
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#161616",
						metalness: .55,
						roughness: .32
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-.1,
						0,
						0
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.045,
						.05,
						.08,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#111",
						metalness: .6,
						roughness: .25
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
					position: [
						-.2,
						-.05,
						0
					],
					angle: .35,
					penumbra: .6,
					intensity: clues.includes("camera") ? 0 : 2.2,
					color: "#88c8c0",
					distance: 4
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dust, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clues, {
			clues,
			passageOpen,
			near
		})
	] });
}
function Wall({ position, args, mat }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
			object: mat,
			attach: "material"
		})]
	});
}
function Chandelier({ brass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			3.18,
			-.6
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.05,
				.12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: brass,
				attach: "material"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.18,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.28,
					.018,
					8,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
					object: brass,
					attach: "material"
				})]
			}),
			[
				0,
				2,
				4
			].map((i) => {
				const a = i / 3 * Math.PI * 2;
				const x = Math.cos(a) * .28;
				const z = Math.sin(a) * .28;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
					position: [
						x,
						-.32,
						z
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.05,
						12,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#f2e2b8",
						emissive: "#e8c878",
						emissiveIntensity: 1.4,
						roughness: .35
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
						intensity: 6.5,
						distance: 6,
						decay: 2,
						color: "#ffd8a8"
					})]
				}, i);
			})
		]
	});
}
function FireGlow() {
	const light = (0, import_react.useRef)(null);
	useFrame((s) => {
		if (!light.current) return;
		const t = s.clock.elapsedTime;
		light.current.intensity = 11 + Math.sin(t * 9.2) * 2.4 + Math.sin(t * 17.1) * 1.4;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
		ref: light,
		position: [
			-.38,
			.05,
			0
		],
		distance: 6.2,
		decay: 2,
		color: "#ff6a28"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			-.2,
			-.45,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.08,
			.22,
			.18
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#ff9a3a",
			emissive: "#ff6a1a",
			emissiveIntensity: 2.2,
			toneMapped: false
		})]
	})] });
}
function Window({ maps, brass, velvet }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-5.11,
			1.9,
			-1.55
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				2.05,
				2.35
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: brass,
				attach: "material"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.05,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.85, 1.62] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					map: maps.window,
					toneMapped: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.06,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.03,
					1.65,
					.045
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2118" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.06,
					0,
					0
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.03,
					1.9,
					.045
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2118" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				position: [
					.85,
					.05,
					0
				],
				angle: .72,
				penumbra: .75,
				intensity: 16,
				distance: 9,
				color: "#c5d4ea",
				castShadow: false
			}),
			[-1.22, 1.22].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.16,
					-.12,
					z
				],
				rotation: [
					0,
					z > 0 ? .12 : -.12,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.42, 2.55] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
					object: velvet,
					attach: "material"
				})]
			}, z))
		]
	});
}
function Dust() {
	const ref = (0, import_react.useRef)(null);
	const geo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 160;
		const pos = /* @__PURE__ */ new Float32Array(480);
		for (let i = 0; i < n; i++) {
			pos[i * 3] = (Math.random() - .5) * 8;
			pos[i * 3 + 1] = .4 + Math.random() * 2.4;
			pos[i * 3 + 2] = (Math.random() - .5) * 8;
		}
		g.setAttribute("position", new BufferAttribute(pos, 3));
		return g;
	}, []);
	useFrame((_, dt) => {
		if (!ref.current) return;
		ref.current.rotation.y += dt * .01;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref,
		geometry: geo,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color: "#e8dcc4",
			size: .016,
			transparent: true,
			opacity: .22,
			depthWrite: false
		})
	});
}
function Clues({ clues, passageOpen, near }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		!clues.includes("fingerprint") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position: CLUE_POS.fingerprint,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					.2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.09, 24] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#9ad8ff",
					emissive: "#6ec8ff",
					emissiveIntensity: near === "fingerprint" ? 1.6 : .7,
					transparent: true,
					opacity: .85,
					toneMapped: false
				})]
			})
		}),
		!clues.includes("torn-note") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: CLUE_POS["torn-note"],
			rotation: [
				-Math.PI / 2,
				0,
				.35
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.28, .18] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#efe6d0",
				emissive: "#c9b27a",
				emissiveIntensity: near === "torn-note" ? .55 : .18,
				roughness: .9,
				side: 2
			})]
		}),
		!clues.includes("footprints") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { hot: near === "footprints" }),
		!clues.includes("watch") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: CLUE_POS.watch,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.055,
					.016,
					10,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#cfd6de",
					metalness: .8,
					roughness: .25,
					emissive: "#8aa0b8",
					emissiveIntensity: near === "watch" ? .6 : .15
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.042,
				.042,
				.018,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#dfe6ee",
				metalness: .5,
				roughness: .2
			})] })]
		}),
		!clues.includes("camera") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: CLUE_POS.camera,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.04,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9ad0c6",
				emissive: "#9ad0c6",
				emissiveIntensity: 1.4,
				toneMapped: false
			})]
		}),
		passageOpen && !clues.includes("key") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: CLUE_POS.key,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.018,
					.018,
					.16,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d7b45a",
					metalness: .75,
					roughness: .3,
					emissive: "#c9a227",
					emissiveIntensity: .4
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.09,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.03,
					.01,
					8,
					14
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d7b45a",
					metalness: .75,
					roughness: .3
				})]
			})]
		})
	] });
}
function Footprints({ hot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: [
		[
			.15,
			.025,
			.85
		],
		[
			.28,
			.025,
			.2
		],
		[
			.42,
			.025,
			-.5
		],
		[
			.55,
			.025,
			-1.4
		],
		[
			.7,
			.025,
			-2.3
		],
		[
			.9,
			.025,
			-3.2
		]
	].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: p,
		rotation: [
			-Math.PI / 2,
			0,
			.4
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.11, .26] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#1a120e",
			emissive: "#6a4a32",
			emissiveIntensity: hot ? .55 : .22,
			transparent: true,
			opacity: .62,
			side: 2
		})]
	}, i)) });
}
function Investigation({ playing }) {
	const [locked, setLocked] = (0, import_react.useState)(false);
	const lookDelta = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const moveAxis = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const dragging = (0, import_react.useRef)(false);
	const last = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const onLock = () => setLocked(!!document.pointerLockElement);
		document.addEventListener("pointerlockchange", onLock);
		return () => document.removeEventListener("pointerlockchange", onLock);
	}, []);
	const cluePositions = (0, import_react.useMemo)(() => Object.keys(CLUE_POS).map((id) => ({
		id,
		pos: new Vector3(...CLUE_POS[id])
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0",
		style: { touchAction: "none" },
		onPointerDown: (e) => {
			if (!playing) return;
			if (e.target.closest("[data-ui]")) return;
			dragging.current = true;
			last.current = {
				x: e.clientX,
				y: e.clientY
			};
			e.currentTarget.setPointerCapture(e.pointerId);
			const canvas = e.currentTarget.querySelector("canvas");
			if (canvas && document.pointerLockElement !== canvas && e.pointerType === "mouse") canvas.requestPointerLock?.();
		},
		onPointerMove: (e) => {
			if (!playing) return;
			if (document.pointerLockElement) {
				lookDelta.current.x += e.movementX;
				lookDelta.current.y += e.movementY;
				return;
			}
			if (!dragging.current) return;
			lookDelta.current.x += e.clientX - last.current.x;
			lookDelta.current.y += e.clientY - last.current.y;
			last.current = {
				x: e.clientX,
				y: e.clientY
			};
		},
		onPointerUp: () => {
			dragging.current = false;
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			camera: {
				fov: 62,
				near: .08,
				far: 40,
				position: [
					0,
					1.62,
					3.4
				]
			},
			dpr: [1, 1.75],
			shadows: true,
			gl: {
				antialias: true,
				alpha: false,
				toneMapping: 4,
				toneMappingExposure: 1.12
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: ["#1a1410"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
					attach: "fog",
					args: [
						"#1a1410",
						11,
						20
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Study, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
					cluePositions,
					furniture: FURNITURE_BOXES,
					locked,
					lookDelta,
					moveAxis
				})
			]
		}), playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchStick, { axis: moveAxis })]
	});
}
function TouchStick({ axis }) {
	const origin = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const active = (0, import_react.useRef)(false);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ui": true,
		className: "absolute bottom-6 left-4 z-20 h-36 w-36 md:hidden",
		onPointerDown: (e) => {
			active.current = true;
			origin.current = {
				x: e.clientX,
				y: e.clientY
			};
			e.currentTarget.setPointerCapture(e.pointerId);
		},
		onPointerMove: (e) => {
			if (!active.current) return;
			const dx = e.clientX - origin.current.x;
			const dy = e.clientY - origin.current.y;
			const len = Math.hypot(dx, dy) || 1;
			const max = 42;
			const k = Math.min(1, len / max);
			const nx = dx / len * k;
			const ny = dy / len * k;
			axis.current = {
				x: nx,
				y: -ny
			};
			setKnob({
				x: nx * max,
				y: ny * max
			});
		},
		onPointerUp: () => {
			active.current = false;
			axis.current = {
				x: 0,
				y: 0
			};
			setKnob({
				x: 0,
				y: 0
			});
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-full w-full rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--bg)_55%,transparent)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-1/2 size-11 rounded-full bg-[color:var(--fg)]/80",
				style: { transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }
			})
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parseEntry(data) {
	if (typeof data !== "object" || data === null) throw new Error("Invalid score");
	const d = data;
	const alias = typeof d.alias === "string" ? d.alias.trim() : "";
	if (!/^[A-Za-z0-9_]{3,16}$/.test(alias)) throw new Error("Use 3–16 letters, numbers, or underscores");
	const score = Number(d.score);
	const timeLeft = Number(d.timeLeft);
	const clues = Number(d.clues);
	const solved = Boolean(d.solved);
	if (!Number.isFinite(score) || score < 0 || score > 2e4) throw new Error("Bad score");
	if (!Number.isFinite(timeLeft) || timeLeft < 0 || timeLeft > 900) throw new Error("Bad time");
	if (!Number.isFinite(clues) || clues < 0 || clues > 12) throw new Error("Bad clues");
	return {
		alias,
		score: Math.floor(score),
		timeLeft: Math.floor(timeLeft),
		clues: Math.floor(clues),
		solved
	};
}
var listScores = createServerFn({ method: "GET" }).handler(createSsrRpc("3fdb87f05144b09f0150cbd3952d9c447411cbf9add4bdeaed37fa14c5b92f91"));
var submitScore = createServerFn({ method: "POST" }).validator(parseEntry).handler(createSsrRpc("5381fb3cd5349d27a2ea7dd0022cf62daf80b33fc3aef4b287643d9c33ed77ba"));
function Menu() {
	const briefing = useGame((s) => s.briefing);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 flex min-h-dvh flex-col items-center justify-center bg-[color:color-mix(in_oklab,var(--bg)_42%,transparent)] px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stamp mb-6 text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]",
				children: "CASE FILE — BLACKWOOD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display max-w-xl text-center text-5xl leading-[0.95] tracking-[-0.04em] text-[color:var(--fg)] md:text-7xl",
				children: "Augmented Alibi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-md text-center text-[color:var(--fg-muted)]",
				children: "The crime scene is the room around you. Fifteen minutes. Four suspects. One thief."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex w-full max-w-sm flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary",
					onClick: briefing,
					children: "Open case"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/unity",
					className: "btn-ghost text-center",
					children: "Unity build kit"
				})]
			})
		]
	});
}
function Briefing() {
	const start = useGame((s) => s.start);
	const toMenu = useGame((s) => s.toMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-[color:color-mix(in_oklab,var(--bg)_50%,transparent)] px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]",
				children: ["CASE #", CASE.id]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-4xl tracking-[-0.03em]",
				children: CASE.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-[color:var(--fg-muted)]",
				children: [
					CASE.victim,
					", ",
					CASE.victimRole.toLowerCase(),
					", is found unconscious in his study.",
					" ",
					CASE.missing,
					" is gone. The door was locked. The cameras failed. You have",
					" ",
					formatTime(CASE.timeLimit),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-6 grid grid-cols-2 gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					k: "Window",
					v: CASE.crimeWindow
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					k: "Scene",
					v: CASE.mansion
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 border-l border-[color:var(--border-strong)] pl-3 text-sm text-[color:var(--fg)]",
				children: CASE.twist
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 space-y-1 text-sm text-[color:var(--fg-muted)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Move with WASD or the stick. Drag or mouse-look to inspect." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Press E or Collect when a clue glows nearby." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Accuse only when the evidence board holds." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary flex-1",
					onClick: () => {
						unlockAudio();
						start();
					},
					children: "Begin investigation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: toMenu,
					children: "Back"
				})]
			})
		]
	});
}
function Info({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] tracking-wide text-[color:var(--fg-subtle)]",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1",
			children: v
		})]
	});
}
function PlayHud() {
	const timeLeft = useGame((s) => s.timeLeft);
	const score = useGame((s) => s.score);
	const clues = useGame((s) => s.clues);
	const near = useGame((s) => s.nearClue);
	const notice = useGame((s) => s.notice);
	const collect = useGame((s) => s.collect);
	const tryOpen = useGame((s) => s.tryOpenPassage);
	const useHint = useGame((s) => s.useHint);
	const [panel, setPanel] = (0, import_react.useState)("none");
	const [mute, setMute] = (0, import_react.useState)(isMuted());
	const nearDef = CLUES.find((c) => c.id === near);
	const already = near ? clues.includes(near) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ui": true,
			className: "pointer-events-none absolute inset-x-0 top-0 z-20 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto mx-auto flex max-w-3xl items-start justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-chip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatTime(timeLeft)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-chip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								clues.length,
								"/",
								CLUES.length
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-chip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[color:var(--fg-subtle)]",
							children: "Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: score
						})]
					})
				]
			}), notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-md rounded-[var(--radius-sm)] bg-[color:var(--bg-elevated)] px-3 py-2 text-center text-sm text-[color:var(--fg)]",
				children: notice
			})]
		}),
		nearDef && !already && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-ui": true,
			className: "absolute bottom-28 left-1/2 z-20 w-[min(92vw,22rem)] -translate-x-1/2 md:bottom-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.2em] text-[color:var(--fg-subtle)]",
						children: "NEARBY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display mt-1 text-xl",
						children: nearDef.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[color:var(--fg-muted)]",
						children: nearDef.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-primary mt-3 w-full",
						onClick: () => near === "passage" ? tryOpen() : collect(near),
						children: near === "passage" ? "Open bookshelf" : "Collect evidence"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-ui": true,
			className: "absolute bottom-4 right-4 z-20 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Evidence",
					onClick: () => setPanel(panel === "evidence" ? "none" : "evidence"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Suspects",
					onClick: () => setPanel(panel === "suspects" ? "none" : "suspects"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Puzzles",
					onClick: () => setPanel(panel === "puzzle" ? "none" : "puzzle"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Hint",
					onClick: useHint,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: mute ? "Unmute" : "Mute",
					onClick: () => {
						unlockAudio();
						setMuted(!mute);
						setMute(!mute);
					},
					children: mute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
				})
			]
		}),
		panel !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
			onClose: () => setPanel("none"),
			children: [
				panel === "evidence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceList, {}),
				panel === "suspects" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuspectBoard, { onDone: () => setPanel("none") }),
				panel === "puzzle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzles, {})
			]
		})
	] });
}
function IconBtn({ children, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--fg)]",
		children
	});
}
function Sheet({ children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-ui": true,
		className: "absolute inset-0 z-30 flex items-end justify-center bg-black/45 p-3 md:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[80dvh] w-full max-w-lg overflow-auto rounded-[calc(var(--radius-md)+16px)] border border-[color:var(--border)] bg-[color:var(--bg)] p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: onClose,
					className: "btn-ghost size-11 p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mx-auto size-4" })
				})
			}), children]
		})
	});
}
function EvidenceList() {
	const collected = useGame((s) => s.clues);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "font-display text-2xl",
		children: "Evidence"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 space-y-2",
		children: CLUES.map((c) => {
			const got = collected.includes(c.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-[var(--radius-md)] border border-[color:var(--border)] p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: got ? c.name : "Unknown fragment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[color:var(--fg-muted)]",
					children: got ? c.detail : "Still in the room."
				})]
			}, c.id);
		})
	})] });
}
function SuspectBoard({ onDone }) {
	const [pick, setPick] = (0, import_react.useState)(null);
	const accuse = useGame((s) => s.accuse);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-2xl",
			children: "Suspects"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-2",
			children: Object.keys(SUSPECTS).map((id) => {
				const s = SUSPECTS[id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPick(id),
					className: `rounded-[var(--radius-md)] border p-3 text-left ${pick === id ? "border-[color:var(--fg)] bg-[color:var(--bg-elevated)]" : "border-[color:var(--border)]"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-wide text-[color:var(--fg-subtle)]",
							children: s.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-[color:var(--fg-muted)]",
							children: ["Alibi: ", s.alibi]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-[color:var(--fg-muted)]",
							children: ["Motive: ", s.motive]
						})
					]
				}, id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: !pick,
			className: "btn-primary mt-4 w-full disabled:opacity-40",
			onClick: () => {
				if (!pick) return;
				accuse(pick);
				onDone();
			},
			children: "Submit accusation"
		})
	] });
}
function Puzzles() {
	const patternSolved = useGame((s) => s.patternSolved);
	const matchingSolved = useGame((s) => s.matchingSolved);
	const clues = useGame((s) => s.clues);
	const solvePattern = useGame((s) => s.solvePattern);
	const solveMatching = useGame((s) => s.solveMatching);
	const [val, setVal] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl",
				children: "Field puzzles"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Sequence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[color:var(--fg-muted)]",
					children: "2 → 4 → 8 → 16 → ?"
				}),
				patternSolved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: "Resolved."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						solvePattern(val);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field flex-1",
						inputMode: "numeric",
						value: val,
						onChange: (e) => setVal(e.target.value),
						placeholder: "Answer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary",
						children: "Check"
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Match the watch"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[color:var(--fg-muted)]",
					children: "Initials C.W. belong to which suspect?"
				}),
				matchingSolved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: "Resolved."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ghost",
							onClick: () => solveMatching(false),
							children: "Eleanor Blake"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ghost",
							onClick: () => solveMatching(false),
							children: "Marcus Reed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ghost",
							onClick: () => solveMatching(false),
							children: "Victor Stone"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ghost",
							disabled: !clues.includes("watch"),
							onClick: () => solveMatching(true),
							children: "Clara Wilson"
						})
					]
				}),
				!clues.includes("watch") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-[color:var(--fg-subtle)]",
					children: "Find the watch first."
				})
			] })
		]
	});
}
function Result() {
	const solved = useGame((s) => s.solved);
	const score = useGame((s) => s.score);
	const clues = useGame((s) => s.clues);
	const timeLeft = useGame((s) => s.timeLeft);
	const failReason = useGame((s) => s.failReason);
	const toMenu = useGame((s) => s.toMenu);
	const [alias, setAlias] = (0, import_react.useState)("Rookie");
	const [board, setBoard] = (0, import_react.useState)([]);
	const [status, setStatus] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listScores().then(setBoard).catch(() => setStatus("Board unavailable in this session."));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.28em] text-[color:var(--fg-muted)]",
				children: solved ? "CASE CLOSED" : "CASE COLD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-4xl tracking-[-0.03em]",
				children: solved ? "Clara Wilson" : failReason
			}),
			solved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-[color:var(--fg-muted)]",
				children: "She knew the passage. The watch engraved C.W. stopped at 8:22. Prints on the desk. The library alibi does not survive the trail."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-3 gap-2 text-center text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Score",
						v: String(score)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Time",
						v: formatTime(timeLeft)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Clues",
						v: `${clues.length}/${CLUES.length}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 flex gap-2",
				onSubmit: async (e) => {
					e.preventDefault();
					try {
						const rows = await submitScore({ data: {
							alias,
							score,
							timeLeft: Math.floor(timeLeft),
							clues: clues.length,
							solved
						} });
						setBoard(rows);
						setStatus("Posted.");
					} catch (err) {
						setStatus(err instanceof Error ? err.message : "Could not post.");
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field flex-1",
					value: alias,
					maxLength: 16,
					onChange: (e) => setAlias(e.target.value),
					placeholder: "Detective alias"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "btn-primary",
					children: "Post"
				})]
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-[color:var(--fg-subtle)]",
				children: status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 text-sm tracking-[0.2em] text-[color:var(--fg-subtle)]",
				children: "LEADERBOARD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-3 space-y-1 text-sm",
				children: [board.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between border-b border-[color:var(--border)] py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						i + 1,
						". ",
						row.alias
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: row.score
					})]
				}, `${row.alias}-${i}`)), board.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-[color:var(--fg-muted)]",
					children: "No ranks yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-ghost mt-8",
				onClick: toMenu,
				children: "Return to file"
			})
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-md)] border border-[color:var(--border)] py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-[color:var(--fg-subtle)]",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 tabular-nums",
			children: v
		})]
	});
}
function GameClient() {
	const screen = useGame((s) => s.screen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-fg)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Investigation, { playing: screen === "play" }),
			screen === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {}),
			screen === "briefing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefing, {}),
			screen === "play" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayHud, {}),
			screen === "result" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {})
		]
	});
}
//#endregion
export { GameClient };
