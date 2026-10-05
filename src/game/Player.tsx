import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "./store";
import type { ClueId } from "./case";

const SPEED = 3.4;
const LOOK = 0.0022;
const EYE = 1.62;
const ROOM = { minX: -4.6, maxX: 4.6, minZ: -5.4, maxZ: 4.4 };

type Props = {
  cluePositions: { id: ClueId; pos: THREE.Vector3 }[];
  furniture: { min: THREE.Vector3; max: THREE.Vector3 }[];
  locked: boolean;
  lookDelta: React.MutableRefObject<{ x: number; y: number }>;
  moveAxis: React.MutableRefObject<{ x: number; y: number }>;
};

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _wish = new THREE.Vector3();

export function Player({ cluePositions, furniture, locked, lookDelta, moveAxis }: Props) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pos = useRef(new THREE.Vector3(0, EYE, 3.4));
  const keys = useRef(new Set<string>());
  const vel = useRef(0);
  const collect = useGame((s) => s.collect);
  const tryOpen = useGame((s) => s.tryOpenPassage);
  const setNear = useGame((s) => s.setNearClue);
  const screen = useGame((s) => s.screen);

  useEffect(() => {
    camera.position.copy(pos.current);
    camera.rotation.order = "YXZ";
  }, [camera]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) e.preventDefault();
      if (e.code === "KeyE" && screen === "play") {
        const near = useGame.getState().nearClue;
        if (near === "passage") tryOpen();
        else if (near) collect(near);
      }
    };
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.code);
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
  }, [collect, tryOpen, screen]);

  useEffect(() => {
    const probe = {
      getYaw: () => yaw.current,
      getSpeed: () => vel.current,
      getPitch: () => pitch.current,
      getPosition: () => ({ x: pos.current.x, z: pos.current.z }),
      setKeys: (codes: string[]) => {
        keys.current = new Set(codes);
      },
    };
    window.__controlsTest = probe;
    return () => {
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
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

    const moving = _wish.lengthSq() > 0.0001 && screen === "play";
    vel.current = moving ? SPEED : 0;

    if (moving) {
      const nx = pos.current.x + _wish.x * SPEED * d;
      const nz = pos.current.z + _wish.z * SPEED * d;
      const next = new THREE.Vector3(nx, EYE, nz);
      if (!blocked(next, furniture)) {
        pos.current.x = THREE.MathUtils.clamp(nx, ROOM.minX, ROOM.maxX);
        pos.current.z = THREE.MathUtils.clamp(nz, ROOM.minZ, ROOM.maxZ);
      }
    }

    camera.position.copy(pos.current);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    let nearest: ClueId | null = null;
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

function blocked(p: THREE.Vector3, boxes: { min: THREE.Vector3; max: THREE.Vector3 }[]) {
  const r = 0.28;
  for (const b of boxes) {
    if (
      p.x + r > b.min.x &&
      p.x - r < b.max.x &&
      p.z + r > b.min.z &&
      p.z - r < b.max.z
    ) {
      return true;
    }
  }
  return false;
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPitch?: () => number;
      getPosition?: () => { x: number; z: number };
      setKeys?: (codes: string[]) => void;
    };
  }
}
