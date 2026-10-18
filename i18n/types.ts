import type { SectionId } from '@/data/sections';

export interface SectionText {
  title?: string; // intro / outro
  text?: string; // intro / outro
  organ?: { name: string; fact: string };
  psyche?: { emotion: string; text: string };
}

export interface Messages {
  meta: { title: string; description: string };
  ui: {
    brand: string;
    modeLabel: string;
    organs: string;
    psyche: string;
    scrollHint: string;
    languageLabel: string;
  };
  // Record<SectionId, …> заставит TypeScript ругаться, если в языке пропущена секция
  sections: Record<SectionId, SectionText>;
}