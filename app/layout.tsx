import type { Metadata, Viewport } from 'next';
import { cookies, headers } from 'next/headers';
import { Cormorant, Golos_Text } from 'next/font/google';
import { LocaleProvider } from '@/components/LocaleProvider';
import {
  LOCALE_COOKIE,
  isLocale,
  matchAcceptLanguage,
  type Locale,
} from '@/i18n/config';
import { MESSAGES } from '@/i18n/messages';
import './globals.css';

// cyrillic-ext нужен для украинской «ґ», latin-ext — запас для норвежского и других
const display = Cormorant({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
});

const body = Golos_Text({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-body',
});

/** Сохранённый выбор (cookie) → язык браузера (Accept-Language) → английский. */
async function resolveLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return matchAcceptLanguage((await headers()).get('accept-language'));
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = MESSAGES[await resolveLocale()].meta;
  return { title, description };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // чтобы учитывать вырез экрана (safe area)
  themeColor: '#04050a',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveLocale();

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}