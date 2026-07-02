import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { AsciiOut } from "./AsciiOut";

/** The heritage object: a retro CRT terminal, built from primitives and
 *  rendered as live text. Ink characters by day, phosphor by night —
 *  the machine is made of the same material as the terminal. */

const TWO_PI = Math.PI * 2;

function CrtModel({
  thinking,
  excited,
}: {
  thinking: boolean;
  excited: boolean;
}) {
  const group = useRef<Group>(null);
  const spin = useRef(0);
  const { pointer } = useThree();

  const still =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g || still) return;
    if (thinking) {
      // the agent is generating — the machine whirs
      spin.current += dt * 2.6;
    } else {
      // settle back to the nearest full turn
      const rest = Math.round(spin.current / TWO_PI) * TWO_PI;
      spin.current += (rest - spin.current) * Math.min(1, dt * 2.5);
    }
    const t = state.clock.elapsedTime;
    // 3/4 pose with a slow sway — never shows its flat back
    g.rotation.y =
      -0.55 + Math.sin(t * 0.35) * 0.34 + pointer.x * 0.22 + spin.current;
    const targetX = 0.1 + pointer.y * 0.18;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, dt * 3);
    // idle breathing
    g.position.y = Math.sin(t * 0.8) * 0.06;
    // the terminal is open — the machine perks up
    const targetScale = excited ? 1.06 : 1;
    const s = g.scale.x + (targetScale - g.scale.x) * Math.min(1, dt * 4);
    g.scale.setScalar(s);
  });

  return (
    <group ref={group} rotation={[0.08, -0.55, 0]}>
      {/* AsciiEffect is print-convention: darker surface = denser glyph.
          Mid-grey shell = mid ramp; near-black screen = densest (@). */}
      {/* bezel */}
      <RoundedBox args={[2.5, 1.95, 0.55]} radius={0.1} position={[0, 0.45, 0.45]}>
        <meshStandardMaterial color="#b9b9b9" roughness={0.55} />
      </RoundedBox>
      {/* screen — darkest surface, densest ink; a glow in dark theme */}
      <RoundedBox args={[1.95, 1.4, 0.1]} radius={0.06} position={[0, 0.45, 0.74]}>
        <meshStandardMaterial color="#141414" roughness={0.9} />
      </RoundedBox>
      {/* tube back — tapered frustum */}
      <mesh position={[0, 0.45, -0.35]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.85, 1.55, 1.3, 4]} />
        <meshStandardMaterial color="#a2a2a2" roughness={0.7} flatShading />
      </mesh>
      {/* stand */}
      <mesh position={[0, -0.68, 0.2]}>
        <cylinderGeometry args={[0.28, 0.38, 0.3, 16]} />
        <meshStandardMaterial color="#8d8d8d" roughness={0.7} />
      </mesh>
      <RoundedBox args={[1.5, 0.16, 1.1]} radius={0.05} position={[0, -0.9, 0.2]}>
        <meshStandardMaterial color="#a8a8a8" roughness={0.6} />
      </RoundedBox>
      {/* keyboard wedge */}
      <RoundedBox
        args={[2.2, 0.16, 0.85]}
        radius={0.05}
        position={[0, -0.86, 1.45]}
        rotation={[0.06, 0, 0]}
      >
        <meshStandardMaterial color="#b2b2b2" roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

export default function AsciiCrt() {
  const [thinking, setThinking] = useState(false);
  const [excited, setExcited] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const on = () => setThinking(true);
    const off = () => setThinking(false);
    const perk = () => setExcited(true);
    const calm = () => setExcited(false);
    window.addEventListener("agent:thinking", on);
    window.addEventListener("agent:idle", off);
    window.addEventListener("terminal:visible", perk);
    window.addEventListener("terminal:hidden", calm);
    setCoarse(matchMedia("(pointer: coarse)").matches);
    return () => {
      window.removeEventListener("agent:thinking", on);
      window.removeEventListener("agent:idle", off);
      window.removeEventListener("terminal:visible", perk);
      window.removeEventListener("terminal:hidden", calm);
    };
  }, []);

  return (
    <div className="ascii-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.25, 7.4], fov: 36 }}
        gl={{ antialias: false, powerPreference: "low-power" }}
        dpr={1}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-4, -2, 2]} intensity={0.5} />
        <CrtModel thinking={thinking} excited={excited} />
        <AsciiOut
          characters=" .:-·=+*shrya#%@"
          resolution={coarse ? 0.15 : 0.21}
        />
      </Canvas>
    </div>
  );
}
