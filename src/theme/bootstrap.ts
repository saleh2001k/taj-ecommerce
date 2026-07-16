/**
 * Startup side-effects that must run BEFORE the router renders:
 *  1. configure Unistyles (register themes/breakpoints/initial theme)
 *  2. initialize i18next with the persisted language (synchronous)
 *  3. align the layout direction to that language (react-native-rtl on
 *     native, document `dir` on web) — so a cold start in Arabic is already
 *     RTL before the first paint
 *
 * Imported first from /index.ts.
 */
import './unistyles';
import '@/i18n';

import { readInitialSettings } from '@/store/settings';
import { applyLanguageDirection } from './rtl';

void applyLanguageDirection(readInitialSettings().language);
