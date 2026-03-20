export const supportedLanguages = ['en', 'he'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = 'en';

export const rtlLanguages = new Set<SupportedLanguage>(['he']);

export function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  if (!value) return false;
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function getLanguageFromPathname(pathname: string): SupportedLanguage {
  const [, maybeLang] = pathname.split('/');
  return isSupportedLanguage(maybeLang) ? maybeLang : defaultLanguage;
}

export function toLocalizedPath(pathname: string, language: SupportedLanguage): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalized.split('/').filter(Boolean);
  const startIndex = isSupportedLanguage(segments[0]) ? 1 : 0;
  const tail = segments.slice(startIndex).join('/');
  return tail ? `/${language}/${tail}` : `/${language}`;
}

export function getDocumentDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
  return rtlLanguages.has(language) ? 'rtl' : 'ltr';
}
