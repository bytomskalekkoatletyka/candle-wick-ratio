import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { BTN_PRIMARY_H, ICON_IN_BUTTON } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import type { IconCmp } from './types';

type Props = {
  label: string;
  onPress: () => void;
  width: number;
  Icon?: IconCmp;
  tone?: 'lavender' | 'amber';
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * Pressable is the PARENT, the scaling Animated.View lives inside it,
 * so onPress never gets eaten on an Android release build.
 */
export function PrimaryButton({ label, onPress, width, Icon, tone = 'lavender' }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const amber = tone === 'amber';

  return (
    <Pressable
      style={[styles.press, { width, height: BTN_PRIMARY_H }]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View
        style={[
          styles.fill,
          amber ? theme.shadows.card : theme.shadows.cta,
          { transform: [{ scale }] },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={amber ? theme.gradients.flame : theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.row}>
            {Icon ? (
              <Icon size={ICON_IN_BUTTON} color={theme.colors.text.onPrimary} strokeWidth={2.2} />
            ) : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.lg,
  },
  fill: {
    flex: 1,
    borderRadius: theme.radius.lg,
  },
  gradient: {
    flex: 1,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: ICON_IN_BUTTON,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.onPrimary,
  },
});

export default PrimaryButton;
