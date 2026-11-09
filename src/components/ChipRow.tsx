import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props<T extends string> = {
  options: T[];
  value: T;
  onChange: (next: T) => void;
  chipWidth: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CHIP_H = 40;

function Chip<T extends string>({
  option,
  selected,
  onChange,
  chipWidth,
}: {
  option: T;
  selected: boolean;
  onChange: (next: T) => void;
  chipWidth: number;
}) {
  const handlePress = useCallback(() => onChange(option), [onChange, option]);

  return (
    <Pressable
      style={[
        styles.chip,
        { width: chipWidth, height: CHIP_H },
        selected ? styles.chipActive : null,
      ]}
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={option}
    >
      <Text style={[styles.label, selected ? styles.labelActive : null]} numberOfLines={1}>
        {option}
      </Text>
    </Pressable>
  );
}

/** Wax family selector - plain pill chips, two per row. */
export function ChipRow<T extends string>({ options, value, onChange, chipWidth }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map(option => (
        <Chip
          key={option}
          option={option}
          selected={option === value}
          onChange={onChange}
          chipWidth={chipWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: theme.colors.surface.sunk,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipActive: {
    backgroundColor: 'rgba(233,162,59,0.16)',
    borderWidth: 1.5,
    borderColor: theme.colors.earth.amber,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: theme.colors.text.secondary,
  },
  labelActive: {
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
});

export default ChipRow;
