/**
 * Badge — small pill for status/labels (SALE, NEW, sold-out, counts).
 *
 * Tone maps to a semantic color pair. Takes `tx` (typed copy) or raw `children`
 * (a number/short code). Memoized + styles from Unistyles → no re-render on
 * theme change.
 */
import { memo, type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Overline } from './text';
import type { TextColorToken } from './text';
import type { TxKey } from './text/tx';

export type BadgeTone = 'primary' | 'accent' | 'success' | 'danger' | 'neutral';

type BadgeContent = { tx: TxKey; children?: never } | { tx?: never; children: ReactNode };

export type BadgeProps = {
  tone?: BadgeTone;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
} & BadgeContent;

const FG: Record<BadgeTone, TextColorToken> = {
  primary: 'onPrimary',
  accent: 'onAccent',
  success: 'onSuccess',
  danger: 'onDanger',
  neutral: 'text',
};

const styles = StyleSheet.create(theme => ({
  badge: (tone: BadgeTone) => {
    const bg: Record<BadgeTone, string> = {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
      success: theme.colors.success,
      danger: theme.colors.danger,
      neutral: theme.colors.surface,
    };
    return {
      alignSelf: 'flex-start',
      backgroundColor: bg[tone],
      borderColor: tone === 'neutral' ? theme.colors.border : 'transparent',
      borderRadius: theme.radius.sm,
      borderWidth: theme.borderWidths.thin,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
    };
  },
}));

export const Badge = memo(function Badge({ tone = 'primary', tx, children, style }: BadgeProps) {
  return (
    <View style={[styles.badge(tone), style]}>
      {tx ? (
        <Overline tx={tx} color={FG[tone]} />
      ) : (
        <Overline color={FG[tone]}>{children}</Overline>
      )}
    </View>
  );
});

Badge.displayName = 'Badge';
