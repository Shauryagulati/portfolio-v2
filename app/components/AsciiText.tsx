import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/** Rasterizes the scene to ASCII and streams it into an EXISTING <pre>
 *  via textContent. The pre is prerendered with a frozen frame and never
 *  remounts, so the browser records one early LCP and no layout shift —
 *  swapping in a fresh DOM table (three's AsciiEffect) re-fired LCP at
 *  the moment the live scene appeared. */

// print convention, same ramp as before: dark surface = dense glyph
const RAMP = " .:-·=+*shrya#%@";

export function AsciiText({
  target,
  resolution,
  fps = 15,
}: {
  target: React.RefObject<HTMLPreElement | null>;
  resolution: number;
  fps?: number;
}) {
  const { gl, scene, camera, size } = useThree();
  const acc = useRef(0);
  const dims = useRef({ cols: 0, rows: 0 });

  const sampler = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    return { canvas, ctx };
  }, []);

  // grid follows container size; pre's font is fitted to fill the stage
  useEffect(() => {
    if (size.width <= 0 || size.height <= 0) return;
    // same density as three's AsciiEffect: one char per sampled pixel
    // across, every second row down (chars are ~2x taller than wide)
    const cols = Math.max(40, Math.floor(size.width * resolution));
    const rows = Math.max(24, Math.floor((size.height * resolution) / 2));
    dims.current = { cols, rows };
    sampler.canvas.width = cols;
    sampler.canvas.height = rows;
    // NO style mutation on the pre: font metrics are constant for a
    // given resolution and live in CSS. Mutating them here resized the
    // frozen frame, which re-fired LCP and caused layout shift.
  }, [size, resolution, sampler]);

  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 1 / fps) return;
    acc.current = 0;
    const { cols, rows } = dims.current;
    const pre = target.current;
    if (!cols || !rows || !pre) return;

    gl.render(scene, camera);
    sampler.ctx.clearRect(0, 0, cols, rows);
    sampler.ctx.drawImage(gl.domElement, 0, 0, cols, rows);
    const data = sampler.ctx.getImageData(0, 0, cols, rows).data;

    let out = "";
    const max = RAMP.length - 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        if (data[i + 3] === 0) {
          out += " "; // transparent background stays paper
          continue;
        }
        const lum =
          (0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]) / 255;
        out += RAMP[Math.round((1 - lum) * max)];
      }
      out += "\n";
    }
    pre.textContent = out;
  }, 1);

  return null;
}
