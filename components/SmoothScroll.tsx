'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { SECTIONS } from '@/data/sections';
import { useBodyStore } from '@/store/useBodyStore';

/** Плавный скролл + запись прогресса (0..1) в стор. Ничего не рендерит. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });

    const update = () => {
      // Считаем по высоте панели (она в svh и не прыгает), а не по innerHeight:
      // на телефонах innerHeight меняется, когда сворачивается адресная строка.
      const panel = document.querySelector<HTMLElement>('.panel');
      const panelH = panel?.offsetHeight ?? window.innerHeight;
      const max = panelH * (SECTIONS.length - 1);
      useBodyStore.getState().setProgress(max > 0 ? lenis.scroll / max : 0);
    };

    lenis.on('scroll', update);
    window.addEventListener('resize', update);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    update();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      lenis.destroy();
    };
  }, []);

  return null;
}