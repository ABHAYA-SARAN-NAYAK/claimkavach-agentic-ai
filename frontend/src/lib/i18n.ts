import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import ta from '../i18n/ta.json';

export type Language = 'en' | 'hi' | 'ta';

const translations: Record<Language, any> = { en, hi, ta };

export function t(key: string, lang: Language = 'en'): string {
  const dict = translations[lang] || translations.en;
  const parts = key.split('.');
  let curr = dict;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      // Fallback to English
      let fallback = translations.en;
      for (const fPart of parts) {
        if (fallback && typeof fallback === 'object' && fPart in fallback) {
          fallback = fallback[fPart];
        } else {
          return key;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }
  return typeof curr === 'string' ? curr : key;
}
