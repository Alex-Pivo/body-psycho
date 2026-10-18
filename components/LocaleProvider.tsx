'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LOCALE_COOKIE, type Locale } from '@/i18n/config';
import { MESSAGES } from '@/i18n/messages';
import type { Messages } from '@/i18n/types';

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Начальный язык приходит с сервера (cookie → Accept-Language браузера),
 * поэтому страница сразу рисуется на нужном языке, без мигания.
 * Ручной выбор сохраняется в cookie и дальше имеет приоритет.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = MESSAGES[locale].meta.title;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, messages: MESSAGES[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>');
  return ctx;
}