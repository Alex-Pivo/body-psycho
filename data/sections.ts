export type Pulse = 'heartbeat' | 'breath' | 'slow';
export type Mode = 'organs' | 'psyche';

export type SectionId =
  | 'intro'
  | 'brain'
  | 'throat'
  | 'lungs'
  | 'heart'
  | 'stomach'
  | 'intestines'
  | 'outro';

export interface OrganData {
  color: string; // цвет в режиме «Органы»
  position: [number, number, number];
  scale: [number, number, number];
  pulse: Pulse;
  mirror?: boolean; // парный орган (лёгкие) — рисуем по обе стороны от оси
}

export interface PsycheData {
  color: string; // цвет в режиме «Психика»
}

export interface Section {
  id: SectionId;
  kind: 'intro' | 'organ' | 'outro';
  organ?: OrganData;
  psyche?: PsycheData;
  // Камера: высота, расстояние до тела, куда смотрим по Y
  cam: { y: number; z: number; lookY: number };
}

/**
 * Здесь только геометрия, цвета и камера. ВСЕ ТЕКСТЫ лежат в i18n/locales/*.ts
 * под теми же id. Порядок = порядок скролла сверху вниз.
 * Координаты: ноги на y = 0, макушка ~ y = 1.8, камера смотрит вдоль -Z.
 */
export const SECTIONS: Section[] = [
  { id: 'intro', kind: 'intro', cam: { y: 1.58, z: 1.7, lookY: 1.55 } },
  {
    id: 'brain',
    kind: 'organ',
    organ: { color: '#ff9fc0', position: [0, 1.7, 0.0], scale: [0.085, 0.07, 0.09], pulse: 'slow' },
    psyche: { color: '#8b5cf6' },
    cam: { y: 1.7, z: 1.1, lookY: 1.7 },
  },
  {
    id: 'throat',
    kind: 'organ',
    organ: { color: '#ffb08a', position: [0, 1.52, 0.015], scale: [0.03, 0.05, 0.03], pulse: 'slow' },
    psyche: { color: '#2dd4bf' },
    cam: { y: 1.5, z: 1.1, lookY: 1.5 },
  },
  {
    id: 'lungs',
    kind: 'organ',
    organ: {
      color: '#ff8fa3',
      position: [0.085, 1.31, 0.0],
      scale: [0.065, 0.12, 0.06],
      pulse: 'breath',
      mirror: true,
    },
    psyche: { color: '#3b82f6' },
    cam: { y: 1.3, z: 1.2, lookY: 1.28 },
  },
  {
    id: 'heart',
    kind: 'organ',
    organ: { color: '#ff2d4a', position: [0.03, 1.23, 0.045], scale: [0.052, 0.06, 0.05], pulse: 'heartbeat' },
    psyche: { color: '#ff3d9a' },
    cam: { y: 1.22, z: 1.0, lookY: 1.22 },
  },
  {
    id: 'stomach',
    kind: 'organ',
    organ: { color: '#ffb347', position: [-0.055, 1.05, 0.04], scale: [0.075, 0.06, 0.05], pulse: 'slow' },
    psyche: { color: '#facc15' },
    cam: { y: 1.05, z: 1.15, lookY: 1.05 },
  },
  {
    id: 'intestines',
    kind: 'organ',
    organ: { color: '#ff8f6b', position: [0, 0.92, 0.035], scale: [0.12, 0.09, 0.06], pulse: 'slow' },
    psyche: { color: '#fb923c' },
    cam: { y: 0.92, z: 1.2, lookY: 0.92 },
  },
  { id: 'outro', kind: 'outro', cam: { y: 1.0, z: 4.2, lookY: 0.95 } },
];