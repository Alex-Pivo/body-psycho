'use client';

import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
} from 'three';

const COUNT = 220;
const BOX: [number, number, number] = [4, 3, 14]; // размер облака
const CENTER: [number, number, number] = [0, 1.2, 3]; // центр облака

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + aSeed * 6.2831) * 0.08;
    p.x += cos(uTime * 0.25 + aSeed * 12.0) * 0.06;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = uSize * aScale * uPixelRatio / max(-mv.z, 0.1);
    gl_PointSize = clamp(s, 1.5 * uPixelRatio, 16.0 * uPixelRatio);
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.2 + aSeed * 20.0));
  }
`;

// Круглая мягкая точка. За пределами круга пиксели отбрасываются (discard),
// поэтому квадратного фона быть не может.
const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 2.0) * vAlpha;
    gl_FragColor = vec4(vec3(0.72, 0.84, 1.0), a);
  }
`;

export function Particles() {
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const scale = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = CENTER[0] + (Math.random() - 0.5) * BOX[0];
      pos[i * 3 + 1] = CENTER[1] + (Math.random() - 0.5) * BOX[1];
      pos[i * 3 + 2] = CENTER[2] + (Math.random() - 0.5) * BOX[2];
      seed[i] = Math.random();
      scale[i] = 0.5 + Math.random();
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new BufferAttribute(seed, 1));
    g.setAttribute('aScale', new BufferAttribute(scale, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 5 },
          uPixelRatio: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}