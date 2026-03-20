import { defaultLanguage, getLanguageFromPathname, type SupportedLanguage } from './config';

export function getRequestLanguage(request: Request): SupportedLanguage {
  try {
    const url = new URL(request.url);
    return getLanguageFromPathname(url.pathname);
  } catch {
    return defaultLanguage;
  }
}
