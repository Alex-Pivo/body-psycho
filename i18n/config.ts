export const LOCALES = ['en', 'nb', 'uk', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'lang';

// Названия на самих языках: так человек находит свой, даже если интерфейс ему непонятен
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  nb: 'Norsk',
  uk: 'Українська',
  ru: 'Русский',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** 'ru-RU' → 'ru', 'nn' / 'no' / 'nb-NO' → 'nb'. Неизвестный язык → null. */
function toLocale(tag: string): Locale | null {
  const base = tag.toLowerCase().split('-')[0];
  switch (base) {
    case 'en':
      return 'en';
    case 'nb':
    case 'nn':
    case 'no':
      return 'nb';
    case 'uk':
      return 'uk';
    case 'ru':
      return 'ru';
    default:
      return null;
  }
}

/**
 * Разбирает заголовок Accept-Language, например "ru-RU,ru;q=0.9,en-US;q=0.8",
 * и берёт первый язык по приоритету, который мы поддерживаем.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const items = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.trim(), q: qParam ? parseFloat(qParam.trim().slice(2)) : 1 };
    })
    .filter((i) => i.tag && i.tag !== '*' && !Number.isNaN(i.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of items) {
    const locale = toLocale(tag);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}