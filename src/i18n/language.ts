/**
 * Language switching — the ONE entry point for changing the app language.
 *
 * Order matters (react-native-rtl integration contract):
 *   1. flip the layout direction — native runtime flip via `setRTL`
 *      (no restart, no remount) and `document.dir` on web
 *   2. update the persisted store — drives `LocaleDirContext` so navigation
 *      animations / swipe-back mirror too
 *   3. THEN swap the strings — the tree must already be RTL when the new
 *      text re-measures
 *
 * No reload anywhere, on any platform.
 */
import { useSettings, type Language } from '@/store/settings';
import { applyLanguageDirection } from '@/theme/rtl';
import i18next from './index';

export async function changeAppLanguage(language: Language): Promise<void> {
  // 1. Direction first (native flip + web document.dir).
  await applyLanguageDirection(language);

  // 2. Persist + notify subscribers (LocaleDirContext, settings UI).
  useSettings.getState().setLanguage(language);

  // 3. Strings last, once the tree is already laid out in the new direction.
  await i18next.changeLanguage(language);
}
