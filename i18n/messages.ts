import type { Locale } from './config';
import type { Messages } from './types';
import { en } from './locales/en';
import { nb } from './locales/nb';
import { uk } from './locales/uk';
import { ru } from './locales/ru';

export const MESSAGES: Record<Locale, Messages> = { en, nb, uk, ru };