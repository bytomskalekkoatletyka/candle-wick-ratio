import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { JARS_MAX, JARS_MIN } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';
import type { IconCmp } from './types';

type Props = {
  jars: number;
  onChange: (next: number) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const BTN = 48;

function StepButton({
  Icon,
  onPress,
  label,
  disabled,
}: {
  Icon: IconCmp;
  onPress: () => void;
  label: string;
  disabled: boolean;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <Pressable
      style={styles.stepPress}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View
        style={[styles.stepFill, disabled ? styles.stepDisabled : null, { transform: [{ scale }] }]}
        pointerEvents="none"
      >
        <Icon
          size={22}
          color={disabled ? theme.colors.text.muted : theme.colors.earth.lavender}
          strokeWidth={2.6}
        />
      </Animated.View>
    </Pressable>
  );
}

/** [-] n JARS [+] - scales the pour sheet to a whole batch. */
export function BatchStepper({ jars, onChange }: Props) {
  const dec = useCallback(() => onChange(Math.max(JARS_MIN, jars - 1)), [jars, onChange]);
  const inc = useCallback(() => onChange(Math.min(JARS_MAX, jars + 1)), [jars, onChange]);

  return (
    <View style={styles.row}>
      <StepButton Icon={Minus} onPress={dec} label="One jar fewer" disabled={jars <= JARS_MIN} />
      <View style={styles.readout}>
        <Text style={styles.count}>{String(jars)}</Text>
        <Text style={styles.unit}>JARS</Text>
      </View>
      <StepButton Icon={Plus} onPress={inc} label="One jar more" disabled={jars >= JARS_MAX} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  stepPress: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
  },
  stepFill: {
    flex: 1,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.lavenderTint,
    borderWidth: 1,
    borderColor: theme.colors.ui.lavenderTintStrong,
  },
  stepDisabled: {
    opacity: 0.45,
  },
  readout: {
    minWidth: 92,
    alignItems: 'center',
  },
  count: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
});

export default BatchStepper;
