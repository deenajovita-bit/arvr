import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Player } from "./Player";
import { CLUE_POS, FURNITURE_BOXES, Study } from "./Study";
import type { ClueId } from "./case";

export function Investigation({ playing }: { playing: boolean }) {
  const [locked, setLocked] = useState(false);
  const lookDelta = useRef({ x: 0, y: 0 });
  const moveAxis = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onLock = () => setLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onLock);
    return () => document.removeEventListener("pointerlockchange", onLock);
  }, []);

  const cluePositions = useMemo(
    () =>
      (Object.keys(CLUE_POS) as ClueId[]).map((id) => ({
        id,
        pos: new THREE.Vector3(...CLUE_POS[id]),
      })),
    [],
  );

  return (
    <div
      className="absolute inset-0"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (!playing) return;
        if ((e.target as HTMLElement).closest("[data-ui]")) return;
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        const canvas = e.currentTarget.querySelector("canvas");
        if (canvas && document.pointerLockElement !== canvas && e.pointerType === "mouse") {
          canvas.requestPointerLock?.();
        }
      }}
      onPointerMove={(e) => {
        if (!playing) return;
        if (document.pointerLockElement) {
          lookDelta.current.x += e.movementX;
          lookDelta.current.y += e.movementY;
          return;
        }
        if (!dragging.current) return;
        lookDelta.current.x += e.clientX - last.current.x;
        lookDelta.current.y += e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <Canvas
        camera={{ fov: 62, near: 0.08, far: 40, position: [0, 1.62, 3.4] }}
        dpr={[1, 1.75]}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <color attach="background" args={["#1a1410"]} />
        <fog attach="fog" args={["#1a1410", 11, 20]} />
        <Suspense fallback={null}>
          <Study />
        </Suspense>
        <Player
          cluePositions={cluePositions}
          furniture={FURNITURE_BOXES}
          locked={locked}
          lookDelta={lookDelta}
          moveAxis={moveAxis}
        />
      </Canvas>
      {playing && <TouchStick axis={moveAxis} />}
    </div>
  );
}

function TouchStick({ axis }: { axis: React.MutableRefObject<{ x: number; y: number }> }) {
  const origin = useRef({ x: 0, y: 0 });
  const active = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  return (
    <div
      data-ui
      className="absolute bottom-6 left-4 z-20 h-36 w-36 md:hidden"
      onPointerDown={(e) => {
        active.current = true;
        origin.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!active.current) return;
        const dx = e.clientX - origin.current.x;
        const dy = e.clientY - origin.current.y;
        const len = Math.hypot(dx, dy) || 1;
        const max = 42;
        const k = Math.min(1, len / max);
        const nx = (dx / len) * k;
        const ny = (dy / len) * k;
        axis.current = { x: nx, y: -ny };
        setKnob({ x: nx * max, y: ny * max });
      }}
      onPointerUp={() => {
        active.current = false;
        axis.current = { x: 0, y: 0 };
        setKnob({ x: 0, y: 0 });
      }}
    >
      <div className="relative h-full w-full rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--bg)_55%,transparent)]">
        <div
          className="absolute left-1/2 top-1/2 size-11 rounded-full bg-[color:var(--fg)]/80"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>
    </div>
  );
}
