import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-K754Sc_J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [client, setClient] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("./GameClient-Cc4D_fcB.mjs").then(setClient);
	}, []);
	if (!client) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-dvh items-center justify-center bg-[#0c0b0a] text-[#e8e2d6]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-[Cormorant_Garamond,serif] text-3xl tracking-[-0.03em]",
			children: "Augmented Alibi"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(client.GameClient, {});
}
//#endregion
export { Home as component };
