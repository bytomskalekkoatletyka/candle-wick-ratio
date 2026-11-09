import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pause, Play } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { clock } from '../utils/format';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  running: boolean;
  seconds: number;
  onToggle: () => void;
  width: number;
  capHours: number;
};

/** Burn stopwatch: tabular digits so the layout never jitters while it ticks. */
export function BurnTimer({ running, seconds, onToggle, width, capHours }: Props) {
  const overCap = seconds >= capHours * 3600;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>BURN TIME</Text>
      <Text style={[styles.time, overCap ? styles.timeOver : null]}>{clock(seconds)}</Text>
      <Text style={styles.cap}>
        {overCap ? 'SAFETY CAP REACHED · SNUFF THE FLAME' : 'SAFE WINDOW · ' + capHours + ' H MAX'}
      </Text>

      <View style={styles.btnSlot}>
        <PrimaryButton
          label={running ? 'PAUSE TEST' : 'START BURN'}
          Icon={running ? Pause : Play}
          onPress={onToggle}
          width={width}
          tone={running ? 'lavender' : 'amber'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  time: {
    marginTop: 2,
    fontSize: 40,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  timeOver: {
    color: theme.colors.earth.terracotta,
  },
  cap: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  btnSlot: {
    marginTop: 12,
  },
});

export default BurnTimer;
