'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  MathUtils,
  ShaderMaterial,
  Vector2,
  type BufferGeometry,
  type Group,
} from 'three';
import { SECTIONS } from '@/data/sections';
import { useBodyStore } from '@/store/useBodyStore';
import { Organ } from './Organ';
import { motion } from './Motion';
import { toFlat } from './organGeometries';

// --- Настройки ходьбы ---------------------------------------------------
const TRAVEL = 3.0; // на сколько единиц манекен проходит вперёд за весь скролл
const CYCLES = 5; // сколько полных циклов шага (левая+правая нога) за весь скролл
const SPEED_REF = 0.08; // скорость скролла (доля страницы в секунду), при которой шаг «на полную»
const HIP_SWING = 0.4; // размах бедра, радианы
const KNEE_BEND = 0.7; // сгиб колена при переносе ноги
const ARM_SWING = 0.45; // размах рук
// ------------------------------------------------------------------------

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

// Геометрия «плоская» (toFlat), поэтому нормаль постоянна на грани → граненый вид.
// Защита от NaN: нулевая нормаль не должна попасть в Bloom.
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBase;
  uniform float uRim;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    float l = length(vNormal);
    vec3 n = l > 1e-5 ? vNormal / l : vec3(0.0, 0.0, 1.0);
    vec3 v = normalize(-vViewPos);
    float fres = pow(1.0 - abs(dot(n, v)), 2.0);
    float facet = abs(dot(n, normalize(vec3(0.4, 0.8, 0.5))));
    vec3 col = uColor * (0.35 + 0.9 * fres + 0.35 * facet);
    float a = uBase + fres * uRim + facet * 0.06;
    gl_FragColor = vec4(clamp(col, 0.0, 4.0), clamp(a, 0.0, 1.0));
  }
`;

const DEFAULT_TINT = '#6ea8ff';

function createTorso() {
  const profile = [
    [0.0, 0.74], [0.1, 0.75], [0.15, 0.82], [0.165, 0.9],
    [0.14, 1.02], [0.145, 1.12], [0.17, 1.28], [0.195, 1.4],
    [0.17, 1.5], [0.07, 1.54], [0.0, 1.55],
  ].map(([r, y]) => new Vector2(r, y));
  return new LatheGeometry(profile, 10);
}

type Pivots = (Group | null)[];

export function Mannequin() {
  const root = useRef<Group>(null);
  const upper = useRef<Group>(null); // торс, голова, руки, органы
  // Индекс 0 — левая сторона (s = -1), индекс 1 — правая (s = +1)
  const hips = useRef<Pivots>([null, null]);
  const knees = useRef<Pivots>([null, null]);
  const shoulders = useRef<Pivots>([null, null]);
  const elbows = useRef<Pivots>([null, null]);

  const anim = useRef({ phase: 0, weight: 0, last: 0, ready: false });

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color(DEFAULT_TINT) },
          uBase: { value: 0.05 },
          uRim: { value: 0.85 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  const geo = useMemo(() => {
    const joint = (r: number) => toFlat(new IcosahedronGeometry(r, 0));
    return {
      head: toFlat(new IcosahedronGeometry(0.105, 1)),
      neck: toFlat(new CylinderGeometry(0.04, 0.05, 0.12, 6)),
      torso: toFlat(createTorso()),
      shoulder: joint(0.058),
      upperArm: toFlat(new CylinderGeometry(0.04, 0.033, 0.28, 6)),
      lowerArm: toFlat(new CylinderGeometry(0.033, 0.026, 0.27, 6)),
      hand: joint(0.034),
      upperLeg: toFlat(new CylinderGeometry(0.078, 0.057, 0.4, 7)),
      lowerLeg: toFlat(new CylinderGeometry(0.052, 0.04, 0.38, 7)),
      knee: joint(0.056),
      foot: toFlat(new BoxGeometry(0.075, 0.04, 0.15)),
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g: BufferGeometry) => g.dispose());
      material.dispose();
    },
    [geo, material],
  );

  // Фигура маленькая, а части двигаются → отключаем отсечение по камере,
  // чтобы ни одна часть не могла «пропасть» из-за неверной оценки границ.
  useEffect(() => {
    root.current?.traverse((o) => {
      o.frustumCulled = false;
    });
  }, []);

  const tint = useMemo(() => new Color(), []);

  useFrame((_, dt) => {
    const { progress, activeIndex, mode } = useBodyStore.getState();
    const st = anim.current;

    // --- Ходьба -------------------------------------------------------
    if (!st.ready) {
      st.last = progress;
      st.ready = true;
    }
    const dp = progress - st.last;
    st.last = progress;
    st.phase += dp * CYCLES * Math.PI * 2;

    const speed = dt > 0 ? Math.abs(dp) / dt : 0;
    const targetW = Math.min(1, speed / SPEED_REF);
    st.weight = MathUtils.damp(st.weight, targetW, targetW > st.weight ? 10 : 3, dt);

    const w = st.weight;
    const ph = st.phase;

    if (root.current) {
      root.current.position.z = MathUtils.damp(
        root.current.position.z,
        progress * TRAVEL,
        4,
        dt,
      );
      root.current.position.y = -0.012 * w * Math.abs(Math.sin(ph));
      motion.z = root.current.position.z; // камера едет следом
    }

    if (upper.current) {
      upper.current.rotation.y = Math.sin(ph) * 0.07 * w;
      upper.current.rotation.z = Math.sin(ph) * 0.02 * w;
    }

    for (let i = 0; i < 2; i++) {
      const legPhase = ph + (i === 0 ? Math.PI : 0);
      const armPhase = legPhase + Math.PI; // рука противоположна ноге
      // Вперёд = отрицательный rotation.x (манекен смотрит в +Z)
      const hip = hips.current[i];
      if (hip) hip.rotation.x = -Math.sin(legPhase) * HIP_SWING * w;
      const knee = knees.current[i];
      if (knee) knee.rotation.x = w * (0.08 + KNEE_BEND * Math.max(0, Math.cos(legPhase)));
      const sh = shoulders.current[i];
      if (sh) sh.rotation.x = -Math.sin(armPhase) * ARM_SWING * w;
      const el = elbows.current[i];
      if (el) el.rotation.x = -w * (0.2 + 0.25 * (1 + Math.sin(armPhase)) * 0.5);
    }

    // --- Цвет контура -------------------------------------------------
    const s = SECTIONS[activeIndex];
    tint.set((mode === 'psyche' ? s.psyche?.color : s.organ?.color) ?? DEFAULT_TINT);
    (material.uniforms.uColor.value as Color).lerp(tint, 1 - Math.exp(-dt * 3));
  });

  return (
    <group ref={root}>
      <group ref={upper}>
        {/* голова и шея */}
        <mesh geometry={geo.head} material={material} position={[0, 1.7, 0]} scale={[0.9, 1.15, 1]} />
        <mesh geometry={geo.neck} material={material} position={[0, 1.57, 0]} />

        {/* торс с тазом */}
        <mesh geometry={geo.torso} material={material} scale={[1.15, 1, 0.7]} />

        {/* руки: плечо → локоть */}
        {[-1, 1].map((s, i) => (
          <group
            key={`arm${s}`}
            ref={(el) => {
              shoulders.current[i] = el;
            }}
            position={[s * 0.225, 1.46, 0]}
            rotation={[0, 0, s * 0.07]}
          >
            <mesh geometry={geo.shoulder} material={material} />
            <mesh geometry={geo.upperArm} material={material} position={[s * 0.01, -0.15, 0]} />
            <group
              ref={(el) => {
                elbows.current[i] = el;
              }}
              position={[s * 0.015, -0.285, 0]}
            >
              <mesh geometry={geo.lowerArm} material={material} position={[0, -0.135, 0]} />
              <mesh geometry={geo.hand} material={material} position={[s * 0.01, -0.305, 0]} />
            </group>
          </group>
        ))}

        {/* органы внутри */}
        {SECTIONS.map((s, idx) =>
          s.organ ? <Organ key={s.id} section={s} index={idx} /> : null,
        )}
      </group>

      {/* ноги: бедро → колено */}
      {[-1, 1].map((s, i) => (
        <group
          key={`leg${s}`}
          ref={(el) => {
            hips.current[i] = el;
          }}
          position={[s * 0.09, 0.76, 0]}
        >
          <mesh geometry={geo.upperLeg} material={material} position={[0, -0.2, 0]} />
          <group
            ref={(el) => {
              knees.current[i] = el;
            }}
            position={[0, -0.4, 0]}
          >
            <mesh geometry={geo.knee} material={material} />
            <mesh geometry={geo.lowerLeg} material={material} position={[0, -0.19, 0]} />
            <mesh geometry={geo.foot} material={material} position={[0, -0.34, 0.035]} />
          </group>
        </group>
      ))}
    </group>
  );
}