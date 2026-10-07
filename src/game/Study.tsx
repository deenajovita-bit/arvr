import { useLayoutEffect, useMemo, useRef } from "react";
import { ContactShadows, RoundedBox, SoftShadows, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "./store";
import type { ClueId } from "./case";
import { makeCamLog } from "./clueArt";

export const CLUE_POS: Record<ClueId, [number, number, number]> = {
  fingerprint: [0.55, 0.92, -1.15],
  "torn-note": [-0.7, 0.12, -0.85],
  footprints: [0.2, 0.03, 0.4],
  camera: [4.35, 1.55, -2.2],
  watch: [2.05, 0.08, -3.55],
  passage: [0.15, 1.3, -4.55],
  key: [0.15, 0.35, -5.05],
};

export const FURNITURE_BOXES = [
  { min: new THREE.Vector3(-1.5, 0, -1.7), max: new THREE.Vector3(1.5, 1.2, -0.5) },
  { min: new THREE.Vector3(-2.2, 0, -5.1), max: new THREE.Vector3(2.2, 2.6, -4.2) },
  { min: new THREE.Vector3(-4.9, 0, 1.4), max: new THREE.Vector3(-3.5, 1.4, 3.2) },
];

const BOOK_COLORS = ["#4a1f1c", "#2c3a2e", "#3d2b1f", "#1f2a38", "#5c3b1e", "#3a1c28", "#2a2420", "#4e3428", "#6b4a2b"];

function useRoomTextures() {
  const maps = useTexture({
    floor: "/textures/floor.jpg",
    wood: "/textures/mahogany.jpg",
    plaster: "/textures/plaster.jpg",
    rug: "/textures/rug.jpg",
    window: "/textures/window.jpg",
    curtain: "/textures/curtain.jpg",
    painting: "/textures/painting.jpg",
    stone: "/textures/stone.jpg",
  });

  useLayoutEffect(() => {
    const { floor, wood, plaster, rug, window, curtain, painting, stone } = maps;
    for (const t of [floor, wood, plaster, rug, window, curtain, painting, stone]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
    floor.repeat.set(4.2, 4.2);
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    wood.repeat.set(2.2, 2.2);
    plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping;
    plaster.repeat.set(2.8, 1.8);
    stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
    stone.repeat.set(1.6, 1.4);
    rug.wrapS = rug.wrapT = THREE.ClampToEdgeWrapping;
    curtain.wrapS = curtain.wrapT = THREE.RepeatWrapping;
    curtain.repeat.set(1, 1.4);
  }, [maps]);

  return maps;
}

export function Study() {
  const clues = useGame((s) => s.clues);
  const passageOpen = useGame((s) => s.passageOpen);
  const near = useGame((s) => s.nearClue);
  const maps = useRoomTextures();

  const mats = useMemo(() => {
    const floor = new THREE.MeshStandardMaterial({
      map: maps.floor,
      roughness: 0.38,
      metalness: 0.04,
    });
    const wood = new THREE.MeshStandardMaterial({
      map: maps.wood,
      roughness: 0.4,
      metalness: 0.12,
    });
    const darkWood = new THREE.MeshStandardMaterial({
      map: maps.wood,
      color: "#5c4638",
      roughness: 0.5,
      metalness: 0.08,
    });
    const plaster = new THREE.MeshStandardMaterial({
      map: maps.plaster,
      roughness: 0.92,
      metalness: 0,
    });
    const rug = new THREE.MeshStandardMaterial({
      map: maps.rug,
      roughness: 0.97,
      metalness: 0,
    });
    const leather = new THREE.MeshStandardMaterial({
      color: "#2c1812",
      roughness: 0.48,
      metalness: 0.06,
    });
    const brass = new THREE.MeshPhysicalMaterial({
      color: "#c4a05a",
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.4,
    });
    const shade = new THREE.MeshStandardMaterial({
      color: "#f0dcb4",
      emissive: "#e0b56a",
      emissiveIntensity: 1.1,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });
    const stone = new THREE.MeshStandardMaterial({
      map: maps.stone,
      roughness: 0.9,
      metalness: 0.02,
    });
    const velvet = new THREE.MeshStandardMaterial({
      map: maps.curtain,
      roughness: 0.86,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    return { floor, wood, darkWood, plaster, rug, leather, brass, shade, stone, velvet };
  }, [maps]);

  const books = useMemo(() => {
    const list: { x: number; y: number; z: number; w: number; h: number; d: number; c: string }[] = [];
    let i = 0;
    for (let shelf = 0; shelf < 4; shelf++) {
      let x = -1.45;
      const y = -0.95 + shelf * 0.58;
      while (x < 1.45) {
        const w = 0.07 + (i % 5) * 0.018;
        const h = 0.32 + ((i * 17) % 11) * 0.012;
        list.push({
          x,
          y: y + h / 2,
          z: 0.08,
          w,
          h,
          d: 0.2,
          c: BOOK_COLORS[i % BOOK_COLORS.length],
        });
        x += w + 0.012;
        i++;
      }
    }
    return list;
  }, []);

  return (
    <group>
      <SoftShadows size={18} samples={8} focus={0.5} />
      <ambientLight intensity={0.18} color="#9a8874" />
      <hemisphereLight args={["#6a7a90", "#1c120c", 0.42]} />
      <directionalLight
        position={[5.2, 7.2, 2.4]}
        intensity={0.55}
        color="#f6ead2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00025}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -0.4]}>
        <planeGeometry args={[10.4, 11.2]} />
        <primitive object={mats.floor} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.05, 0.018, -0.5]} receiveShadow>
        <planeGeometry args={[4.4, 6.1]} />
        <primitive object={mats.rug} attach="material" />
      </mesh>
      <ContactShadows position={[0, 0.02, -0.4]} opacity={0.52} scale={12} blur={2.1} far={4.5} />

      <mesh position={[0, 3.42, -0.2]} receiveShadow>
        <boxGeometry args={[10.4, 0.16, 11]} />
        <primitive object={mats.plaster} attach="material" />
      </mesh>
      {[-3.2, -1.05, 1.05, 3.2].map((x) => (
        <mesh key={x} position={[x, 3.3, -0.2]} castShadow>
          <boxGeometry args={[0.14, 0.14, 10.6]} />
          <primitive object={mats.darkWood} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 3.22, -5.42]}>
        <boxGeometry args={[10.1, 0.12, 0.14]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[-5.08, 3.22, -0.2]}>
        <boxGeometry args={[0.14, 0.12, 10.6]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[5.08, 3.22, -0.2]}>
        <boxGeometry args={[0.14, 0.12, 10.6]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>

      <Chandelier brass={mats.brass} />

      <Wall position={[0, 1.7, -5.55]} args={[10.4, 3.4, 0.18]} mat={mats.plaster} />
      <Wall position={[0, 1.7, 5.15]} args={[10.4, 3.4, 0.18]} mat={mats.plaster} />
      <Wall position={[-5.2, 1.7, -0.2]} args={[0.18, 3.4, 11]} mat={mats.plaster} />
      <Wall position={[5.2, 1.7, -0.2]} args={[0.18, 3.4, 11]} mat={mats.plaster} />
      <mesh position={[0, 0.48, -5.42]} receiveShadow>
        <boxGeometry args={[10.1, 0.96, 0.09]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[-5.08, 0.48, -0.2]} receiveShadow>
        <boxGeometry args={[0.09, 0.96, 10.6]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[5.08, 0.48, -0.2]} receiveShadow>
        <boxGeometry args={[0.09, 0.96, 10.6]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[0, 0.06, -0.2]}>
        <boxGeometry args={[10.2, 0.12, 10.8]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>

      <Window maps={maps} brass={mats.brass} velvet={mats.velvet} />

      <group position={[0, 0, -1.1]}>
        <RoundedBox args={[2.62, 0.08, 1.18]} radius={0.02} smoothness={4} position={[0, 0.74, 0]} castShadow receiveShadow>
          <primitive object={mats.wood} attach="material" />
        </RoundedBox>
        <mesh position={[0, 0.695, 0.02]} receiveShadow>
          <boxGeometry args={[1.55, 0.015, 0.7]} />
          <primitive object={mats.leather} attach="material" />
        </mesh>
        {[-1.16, 1.16].map((x) => (
          <RoundedBox key={x} args={[0.13, 0.74, 0.98]} radius={0.015} position={[x, 0.37, 0]} castShadow>
            <primitive object={mats.darkWood} attach="material" />
          </RoundedBox>
        ))}
        <mesh position={[0, 0.36, 0.38]} castShadow>
          <boxGeometry args={[2.2, 0.42, 0.08]} />
          <primitive object={mats.darkWood} attach="material" />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[2.45, 0.08, 0.98]} />
          <primitive object={mats.darkWood} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.86, -0.28]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.1, 20]} />
          <primitive object={mats.brass} attach="material" />
        </mesh>
        <mesh position={[0.92, 1.18, -0.28]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.52, 10]} />
          <primitive object={mats.brass} attach="material" />
        </mesh>
        <mesh position={[0.92, 1.5, -0.28]} rotation={[0.38, 0, 0]}>
          <coneGeometry args={[0.24, 0.3, 24, 1, true]} />
          <primitive object={mats.shade} attach="material" />
        </mesh>
        <pointLight position={[0.92, 1.36, -0.12]} intensity={22} distance={8} decay={2} color="#ffd19a" castShadow />
        <mesh position={[-0.85, 0.8, -0.22]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.08, 14]} />
          <meshStandardMaterial color="#141414" metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh position={[-0.85, 0.9, -0.22]} rotation={[0.4, 0.2, 0.1]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />
          <meshStandardMaterial color="#1a140c" roughness={0.6} />
        </mesh>
        <mesh position={[-0.38, 0.785, 0.16]} rotation={[0, 0.18, 0]} receiveShadow>
          <boxGeometry args={[0.4, 0.008, 0.52]} />
          <meshStandardMaterial color="#efe6d4" roughness={0.88} />
        </mesh>
        <mesh position={[0.22, 0.8, 0.28]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.22, 0.04, 0.3]} />
          <meshStandardMaterial color="#3a2218" roughness={0.7} />
        </mesh>
        <mesh position={[0.22, 0.85, 0.28]} rotation={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.035, 0.28]} />
          <meshStandardMaterial color="#1e2a38" roughness={0.7} />
        </mesh>
      </group>

      <group position={[0, 0, 0.12]}>
        <RoundedBox args={[0.66, 0.12, 0.62]} radius={0.04} position={[0, 0.44, 0]} castShadow>
          <primitive object={mats.leather} attach="material" />
        </RoundedBox>
        <RoundedBox args={[0.66, 0.86, 0.12]} radius={0.04} position={[0, 0.9, 0.28]} castShadow>
          <primitive object={mats.leather} attach="material" />
        </RoundedBox>
        {[-0.34, 0.34].map((x) => (
          <RoundedBox key={x} args={[0.08, 0.28, 0.5]} radius={0.02} position={[x, 0.62, 0]} castShadow>
            <primitive object={mats.leather} attach="material" />
          </RoundedBox>
        ))}
        {[
          [-0.24, 0.2, -0.22],
          [0.24, 0.2, -0.22],
          [-0.24, 0.2, 0.22],
          [0.24, 0.2, 0.22],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.032, 0.038, 0.4, 10]} />
            <primitive object={mats.darkWood} attach="material" />
          </mesh>
        ))}
      </group>

      <group position={[0.1, 1.35, -4.85]}>
        <RoundedBox args={[3.55, 2.78, 0.52]} radius={0.02} castShadow receiveShadow>
          <primitive object={mats.darkWood} attach="material" />
        </RoundedBox>
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[3.28, 2.5, 0.22]} />
          <meshStandardMaterial color="#0c0a08" roughness={1} />
        </mesh>
        {[-1.05, -0.35, 0.35, 1.05].map((y) => (
          <mesh key={y} position={[0, y, 0.12]} receiveShadow>
            <boxGeometry args={[3.28, 0.05, 0.38]} />
            <primitive object={mats.wood} attach="material" />
          </mesh>
        ))}
        {[-1.1, 1.1].map((x) => (
          <mesh key={x} position={[x, 0, 0.1]}>
            <boxGeometry args={[0.05, 2.5, 0.36]} />
            <primitive object={mats.wood} attach="material" />
          </mesh>
        ))}
        {books.map((b, i) =>
          passageOpen && b.x > 0.05 && b.x < 0.85 ? null : (
            <mesh key={i} position={[b.x, b.y, b.z]} castShadow>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial color={b.c} roughness={0.68} />
            </mesh>
          ),
        )}
        {!passageOpen && (
          <mesh position={[0.42, 0.52, 0.28]}>
            <boxGeometry args={[0.09, 0.34, 0.22]} />
            <meshStandardMaterial
              color="#8a1c18"
              emissive="#d4af37"
              emissiveIntensity={near === "passage" ? 1.3 : 0.45}
            />
          </mesh>
        )}
        {passageOpen && (
          <mesh position={[0.4, 0.05, 0.4]}>
            <boxGeometry args={[0.95, 2.15, 0.12]} />
            <meshStandardMaterial color="#050403" roughness={1} />
          </mesh>
        )}
      </group>

      <group position={[-4.15, 0, 2.2]}>
        <RoundedBox args={[1.18, 0.86, 1.58]} radius={0.025} position={[0, 0.43, 0]} castShadow receiveShadow>
          <primitive object={mats.wood} attach="material" />
        </RoundedBox>
        <mesh position={[0, 1.08, 0]} castShadow>
          <sphereGeometry args={[0.24, 32, 20]} />
          <meshStandardMaterial color="#3a4a3c" roughness={0.45} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.08, 12]} />
          <primitive object={mats.brass} attach="material" />
        </mesh>
        <mesh position={[0.32, 0.9, 0.35]} castShadow>
          <boxGeometry args={[0.18, 0.05, 0.24]} />
          <meshStandardMaterial color="#4a221c" roughness={0.7} />
        </mesh>
      </group>

      <group position={[5.0, 0.9, 0.4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.32, 1.85, 1.85]} />
          <primitive object={mats.stone} attach="material" />
        </mesh>
        <mesh position={[-0.02, 0.95, 0]}>
          <boxGeometry args={[0.38, 0.14, 2.05]} />
          <primitive object={mats.darkWood} attach="material" />
        </mesh>
        <mesh position={[-0.14, -0.18, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.98]} />
          <meshStandardMaterial color="#090706" roughness={1} emissive="#4a1c08" emissiveIntensity={0.7} />
        </mesh>
        <FireGlow />
      </group>

      <mesh position={[3.15, 2.08, -5.44]} castShadow>
        <boxGeometry args={[1.22, 0.98, 0.07]} />
        <primitive object={mats.darkWood} attach="material" />
      </mesh>
      <mesh position={[3.15, 2.08, -5.39]}>
        <planeGeometry args={[0.98, 0.76]} />
        <meshStandardMaterial map={maps.painting} roughness={0.62} metalness={0} />
      </mesh>

      <group position={[4.85, 2.2, -2.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.1, 0.26]} />
          <meshStandardMaterial color="#161616" metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.05, 0.08, 16]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.25} />
        </mesh>
        <spotLight
          position={[-0.2, -0.05, 0]}
          angle={0.35}
          penumbra={0.6}
          intensity={clues.includes("camera") ? 0 : 2.2}
          color="#88c8c0"
          distance={4}
        />
      </group>

      <Dust />
      <Clues clues={clues} passageOpen={passageOpen} near={near} />
    </group>
  );
}

function Wall({
  position,
  args,
  mat,
}: {
  position: [number, number, number];
  args: [number, number, number];
  mat: THREE.Material;
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={args} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Chandelier({ brass }: { brass: THREE.Material }) {
  return (
    <group position={[0, 3.18, -0.6]}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.05, 0.12, 10]} />
        <primitive object={brass} attach="material" />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <torusGeometry args={[0.28, 0.018, 8, 20]} />
        <primitive object={brass} attach="material" />
      </mesh>
      {[0, 2, 4].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        const x = Math.cos(a) * 0.28;
        const z = Math.sin(a) * 0.28;
        return (
          <group key={i} position={[x, -0.32, z]}>
            <mesh>
              <sphereGeometry args={[0.05, 12, 10]} />
              <meshStandardMaterial color="#f2e2b8" emissive="#e8c878" emissiveIntensity={1.4} roughness={0.35} />
            </mesh>
            <pointLight intensity={6.5} distance={6} decay={2} color="#ffd8a8" />
          </group>
        );
      })}
    </group>
  );
}

function FireGlow() {
  const light = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (!light.current) return;
    const t = s.clock.elapsedTime;
    light.current.intensity = 11 + Math.sin(t * 9.2) * 2.4 + Math.sin(t * 17.1) * 1.4;
  });
  return (
    <>
      <pointLight ref={light} position={[-0.38, 0.05, 0]} distance={6.2} decay={2} color="#ff6a28" />
      <mesh position={[-0.2, -0.45, 0]}>
        <boxGeometry args={[0.08, 0.22, 0.18]} />
        <meshStandardMaterial color="#ff9a3a" emissive="#ff6a1a" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </>
  );
}

function Window({
  maps,
  brass,
  velvet,
}: {
  maps: { window: THREE.Texture };
  brass: THREE.Material;
  velvet: THREE.Material;
}) {
  return (
    <group position={[-5.11, 1.9, -1.55]}>
      <mesh>
        <boxGeometry args={[0.08, 2.05, 2.35]} />
        <primitive object={brass} attach="material" />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <planeGeometry args={[1.85, 1.62]} />
        <meshBasicMaterial map={maps.window} toneMapped={false} />
      </mesh>
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.03, 1.65, 0.045]} />
        <meshStandardMaterial color="#2a2118" />
      </mesh>
      <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.03, 1.9, 0.045]} />
        <meshStandardMaterial color="#2a2118" />
      </mesh>
      <spotLight
        position={[0.85, 0.05, 0]}
        angle={0.72}
        penumbra={0.75}
        intensity={16}
        distance={9}
        color="#c5d4ea"
        castShadow={false}
      />
      {[-1.22, 1.22].map((z) => (
        <mesh key={z} position={[0.16, -0.12, z]} rotation={[0, z > 0 ? 0.12 : -0.12, 0]} castShadow>
          <planeGeometry args={[0.42, 2.55]} />
          <primitive object={velvet} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 160;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = 0.4 + Math.random() * 2.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.01;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#e8dcc4" size={0.016} transparent opacity={0.22} depthWrite={false} />
    </points>
  );
}

function Clues({
  clues,
  passageOpen,
  near,
}: {
  clues: ClueId[];
  passageOpen: boolean;
  near: ClueId | null;
}) {
  const maps = useTexture({
    prints: "/textures/clues/fingerprint.jpg",
    mud: "/textures/clues/boot.jpg",
    note: "/textures/clues/note.jpg",
    watch: "/textures/clues/watch.jpg",
    key: "/textures/clues/key.jpg",
  });
  const log = useMemo(() => makeCamLog(), []);
  useLayoutEffect(() => {
    for (const t of Object.values(maps)) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  }, [maps]);

  return (
    <group>
      {!clues.includes("fingerprint") && (
        <group position={CLUE_POS.fingerprint}>
          <mesh rotation={[-Math.PI / 2, 0, 0.12]} receiveShadow>
            <planeGeometry args={[0.28, 0.28]} />
            <meshStandardMaterial map={maps.prints} roughness={0.78} metalness={0.04} />
          </mesh>
          <GlowRing on={near === "fingerprint"} />
        </group>
      )}
      {!clues.includes("torn-note") && (
        <group position={CLUE_POS["torn-note"]}>
          <mesh rotation={[-Math.PI / 2, 0, 0.38]} castShadow>
            <planeGeometry args={[0.38, 0.28]} />
            <meshStandardMaterial map={maps.note} roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
          <GlowRing on={near === "torn-note"} />
        </group>
      )}
      {!clues.includes("footprints") && <Footprints hot={near === "footprints"} map={maps.mud} />}
      {!clues.includes("watch") && (
        <group position={CLUE_POS.watch}>
          <mesh rotation={[-Math.PI / 2, 0, 0.35]} receiveShadow>
            <planeGeometry args={[0.28, 0.28]} />
            <meshStandardMaterial map={maps.watch} roughness={0.45} metalness={0.2} />
          </mesh>
          <GlowRing on={near === "watch"} />
        </group>
      )}
      {!clues.includes("camera") && (
        <group position={CLUE_POS.camera}>
          <mesh rotation={[0, -Math.PI / 2, 0]} castShadow>
            <planeGeometry args={[0.46, 0.28]} />
            <meshStandardMaterial map={log} roughness={0.4} emissive="#0d2a24" emissiveIntensity={0.55} />
          </mesh>
          <mesh position={[-0.02, 0, 0]}>
            <boxGeometry args={[0.03, 0.3, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.4} />
          </mesh>
          <GlowRing on={near === "camera"} />
        </group>
      )}
      {passageOpen && !clues.includes("key") && (
        <group position={CLUE_POS.key}>
          <mesh rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
            <planeGeometry args={[0.32, 0.22]} />
            <meshStandardMaterial map={maps.key} roughness={0.4} metalness={0.35} />
          </mesh>
          <GlowRing on={near === "key"} />
        </group>
      )}
    </group>
  );
}

function GlowRing({ on }: { on: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
      <ringGeometry args={[0.14, 0.18, 24]} />
      <meshBasicMaterial
        color="#d4af37"
        transparent
        opacity={on ? 0.85 : 0.16}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function Footprints({ hot, map }: { hot: boolean; map: THREE.Texture }) {
  const spots: [number, number, number, number][] = [
    [0.15, 0.028, 0.85, 0.35],
    [0.28, 0.028, 0.2, 0.38],
    [0.42, 0.028, -0.5, 0.42],
    [0.55, 0.028, -1.4, 0.36],
    [0.7, 0.028, -2.3, 0.4],
    [0.9, 0.028, -3.2, 0.45],
  ];
  return (
    <group>
      {spots.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[-Math.PI / 2, 0, p[3]]}>
          <planeGeometry args={[0.16, 0.34]} />
          <meshStandardMaterial map={map} roughness={1} transparent opacity={hot ? 0.95 : 0.82} depthWrite={false} />
        </mesh>
      ))}
      <GlowRing on={hot} />
    </group>
  );
}
