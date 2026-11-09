import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { BTN_SECONDARY_H } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import type { IconCmp } from './types';

type Props = {
  label: string;
  onPress: () => void;
  width: number;
  Icon?: IconCmp;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 20;

export function SecondaryButton({ label, onPress, width, Icon }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      style={[styles.press, { width, height: BTN_SECONDARY_H }]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]} pointerEvents="none">
        <View style={styles.row}>
          {Icon ? (
            <Icon size={ICON} color={theme.colors.earth.lavender} strokeWidth={2.2} />
          ) : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.pill,
  },
  fill: {
    flex: 1,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.ui.lavenderTintStrong,
    backgroundColor: theme.colors.ui.lavenderTint,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 12,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.earth.lavender,
  },
});

export default SecondaryButton;
