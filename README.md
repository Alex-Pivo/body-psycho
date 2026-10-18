# Тело изнутри

Next.js (App Router) + React Three Fiber. Скролл ведёт камеру вниз по телу, органы подсвечиваются,
переключатель «Органы / Психика» меняет текст и цвет.

## Запуск
```bash
npm install
npm run dev
```

## Структура
- `data/sections.ts` — весь контент и позиции органов/камеры (правишь тут, не в коде сцены)
- `store/useBodyStore.ts` — прогресс скролла, активная секция, режим
- `components/Mannequin.tsx` — тело (пока из примитивов) + шейдер Френеля
- `components/Organ.tsx` — светящийся орган с пульсацией
- `components/CameraRig.tsx` — камера по ключевым кадрам
- `components/Overlay.tsx` — текст, переключатель, индикатор
- `components/SmoothScroll.tsx` — Lenis → прогресс в стор
