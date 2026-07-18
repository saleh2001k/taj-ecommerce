/**
 * Buttons — one component per variant (like the text primitives).
 *
 * Call sites say what the button IS: `<PrimaryButton tx="…" />`, not
 * `<Button variant="primary" />`. Every button:
 *  - takes `tx` (typed locale key) for its label, plus optional left/right icons
 *  - animates a touch-point ripple + press scale + web hover on the UI thread
 *    (no re-render; the ripple works on iOS, Android AND web)
 *  - guards against double-tap (`useSafePress`)
 *  - supports `loading` (spinner) and `disabled`
 *  - never re-renders on a theme change (memoized, styles resolved by Unistyles)
 *
 * `Pressable` is the TouchableOpacity-style wrapper for non-button content
 * (cards, rows) — same animation and guards, but it just dims its children.
 */
import { createButton } from './createButton';

export const PrimaryButton = createButton('PrimaryButton', 'primary');
export const SecondaryButton = createButton('SecondaryButton', 'secondary');
export const AccentButton = createButton('AccentButton', 'accent');
export const OutlineButton = createButton('OutlineButton', 'outline');
export const GhostButton = createButton('GhostButton', 'ghost');
export const DangerButton = createButton('DangerButton', 'danger');

export type { ButtonProps, ButtonVariant, ButtonSize } from './createButton';

export { Pressable, type PressableProps } from './Pressable';
export { SAFE_PRESS_COOLDOWN_MS } from './useSafePress';
