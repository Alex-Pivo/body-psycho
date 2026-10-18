'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type PerspectiveCamera } from 'three';
import { SECTIONS } from '@/data/sections';
import { useBodyStore } from '@/store/useBodyStore';
import { motion } from './Motion';

const { lerp, damp, smoothstep } = MathUtils;

const PORTRAIT_ASPECT = 0.9; // уже этого считаем экран «портретным»
const PORTRAIT_SHIFT = 0.14; // на сколько поднять картинку (доля высоты), чтобы текст снизу не перекрывал

/**
 * Камера едет по «рельсам» между ключевыми кадрами из SECTIONS.cam.
 * На узких экранах (телефон вертикально) камера отодвигается, чтобы торс
 * помещался по ширине, а картинка приподнимается над карточкой с текстом.
 */
export function CameraRig() {
  const look = useRef({ y: SECTIONS[0].cam.lookY });
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const portrait = width / height < PORTRAIT_ASPECT;

  useEffect(() => {
    if (portrait) {
      camera.setViewOffset(width, height, 0, height * PORTRAIT_SHIFT, width, height);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }, [camera, width, height, portrait]);

  useFrame((state, dt) => {
    const { progress } = useBodyStore.getState();
    const n = SECTIONS.length;
    const t = progress * (n - 1);
    const i = Math.min(Math.floor(t), n - 2);
    const f = smoothstep(t - i, 0, 1);

    const a = SECTIONS[i].cam;
    const b = SECTIONS[i + 1].cam;

    const aspect = state.size.width / state.size.height;
    const distScale = Math.min(1.8, Math.max(1, 0.8 / aspect));

    const targetY = lerp(a.y, b.y, f);
    const targetZ = lerp(a.z, b.z, f) * distScale;
    const targetLook = lerp(a.lookY, b.lookY, f);

    const cam = state.camera;
    cam.position.y = damp(cam.position.y, targetY, 4, dt);
    // Камера держит заданную дистанцию до манекена, который идёт вперёд
    cam.position.z = damp(cam.position.z, targetZ + motion.z, 4, dt);
    // Лёгкий параллакс от мыши
    cam.position.x = damp(cam.position.x, state.pointer.x * 0.12, 3, dt);
    look.current.y = damp(look.current.y, targetLook, 4, dt);

    cam.lookAt(0, look.current.y, motion.z);
  });

  return null;
}