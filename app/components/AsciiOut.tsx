import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

/** Thin AsciiEffect binding. Exists instead of drei's <AsciiRenderer>
 *  because the effect must never render before setSize — NaN dimensions
 *  crash getImageData. Text color is inherited from CSS, so the theme
 *  can restyle the object without touching the scene. */
export function AsciiOut({
  characters,
  resolution,
}: {
  characters: string;
  resolution: number;
}) {
  const { gl, scene, camera, size } = useThree();
  const sized = useRef(false);

  const effect = useMemo(() => {
    // invert:false — empty space stays empty; only the lit object becomes text
    const e = new AsciiEffect(gl, characters, { invert: false, resolution });
    e.domElement.style.position = "absolute";
    e.domElement.style.inset = "0";
    e.domElement.style.pointerEvents = "none";
    // color: inherited from .ascii-stage — theme-aware for free
    return e;
  }, [gl, characters, resolution]);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      effect.setSize(size.width, size.height);
      sized.current = true;
    }
  }, [effect, size]);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    gl.domElement.style.opacity = "0";
    parent.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "";
      effect.domElement.remove();
    };
  }, [effect, gl]);

  useFrame(() => {
    if (sized.current) effect.render(scene, camera);
  }, 1);

  return null;
}
