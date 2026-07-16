/**
 * RTL / layout-direction control — powered by react-native-rtl.
 *
 * Native: `setRTL` re-mirrors every live Fabric surface AND the native chrome
 * (headers, tab bar, iOS swipe-back) at runtime — no restart, no remount.
 * It also keeps JS-side `I18nManager.isRTL` in sync.
 * (Needs a development build; it safe-no-ops in Expo Go and tests.)
 *
 * Web: the document `dir` attribute flips CSS layout (flex rows, text `start`
 * alignment) live — no reload.
 */
import { Platform } from 'react-native';
import { isRTLLocale, setRTL } from 'react-native-rtl';
import type { Language } from '@/store/settings';

export function isRTL(language: Language): boolean {
  return isRTLLocale(language);
}

/** Sync the platform layout direction to `language`, in place. */
export async function applyLanguageDirection(language: Language): Promise<void> {
  const rtl = isRTL(language);

  if (Platform.OS === 'web') {
    // Guarded: also runs during static rendering, where there is no document.
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
    return;
  }

  await setRTL(rtl);
}
