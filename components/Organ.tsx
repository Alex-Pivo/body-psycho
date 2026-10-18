'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MathUtils, MeshStandardMaterial, type Group } from 'three';
import { SECTIONS, type Section } from '@/data/sections';
import { useBodyStore } from '@/store/useBodyStore';
import { createOrganGeometry } from './organGeometries';

interface Props {
  section: Section;
  index: number;
}

/**
 * Low-poly орган со светящимся граненым материалом.
 * Активная секция → орган горит и пульсирует.
 * Режим «Психика» → цвет эмоции. На финале светятся все органы.
 */
export function Organ({ section, index }: Props) {
  const organ = section.organ!;
  const group = useRef<Group>(null);

  const geometry = useMemo(() => createOrganGeometry(section.id), [section.id]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const organColor = useMemo(() => new Color(organ.color), [organ.color]);
  const psycheColor = useMemo(
    () => new Color(section.psyche?.color ?? organ.color),
    [section.psyche?.color, organ.color],
  );

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: organColor,
        emissive: organColor,
        emissiveIntensity: 0.15,
        roughness: 0.6,
        // граненый вид даёт сама геометрия (toFlat), flatShading не нужен
        toneMapped: false, // чтобы Bloom ловил яркость
      }),
    [organColor],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, dt) => {
    const { activeIndex, mode } = useBodyStore.getState();
    const isOutro = SECTIONS[activeIndex].kind === 'outro';
    const active = activeIndex === index || isOutro;

    const target = mode === 'psyche' ? psycheColor : organColor;
    material.color.lerp(target, 1 - Math.exp(-dt * 4));
    material.emissive.copy(material.color);
    material.emissiveIntensity = MathUtils.damp(
      material.emissiveIntensity,
      active ? 1.5 : 0.12,
      4,
      dt,
    );

    const t = state.clock.elapsedTime;
    let s = 1;
    if (organ.pulse === 'heartbeat') {
      const w = Math.PI * 2 * 1.2;
      s =
        1 +
        0.09 * Math.pow(Math.max(0, Math.sin(t * w)), 6) +
        0.04 * Math.pow(Math.max(0, Math.sin(t * w - 0.9)), 6);
    } else if (organ.pulse === 'breath') {
      s = 1 + 0.07 * Math.sin(t * Math.PI * 2 * 0.22);
    } else {
      s = 1 + 0.025 * Math.sin(t * Math.PI * 2 * 0.5 + index);
    }
    group.current?.scale.setScalar(s);
  });

  const sides = organ.mirror ? [-1, 1] : [1];

  return (
    <group ref={group} position={[0, organ.position[1], organ.position[2]]}>
      {sides.map((side) => (
        <mesh
          key={side}
          geometry={geometry}
          material={material}
          position={[organ.position[0] * side, 0, 0]}
          scale={[organ.scale[0] * side, organ.scale[1], organ.scale[2]]}
        />
      ))}
    </group>
  );
}