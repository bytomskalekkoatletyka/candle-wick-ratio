import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { BurnEntry } from '../hooks/useRecipeStore';
import { poolRatio } from '../game/candleMath';
import type { Verdict } from '../game/candleMath';
import { hours, shortDate } from '../utils/format';

type Props = {
  entry: BurnEntry;
};

const TONE: Record<Verdict, string> = {
  'WICK LOOKS GOOD': theme.colors.earth.sage,
  'WICK TOO SMALL': theme.colors.earth.amber,
  'WICK TOO LARGE': theme.colors.earth.terracotta,
};

export function DiaryEntryRow({ entry }: Props) {
  const tone = TONE[entry.verdict];
  const ratio = Math.round(poolRatio(entry.poolWidthCm, entry.diameterCm) * 100);

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <View style={styles.nameCol}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.recipeName}
        </Text>
        <Text style={styles.date}>{shortDate(entry.savedAt)}</Text>
      </View>
      <View style={styles.metaCol}>
        <Text style={styles.hours}>{hours(entry.burnSeconds) + ' h'}</Text>
        <Text style={[styles.ratio, { color: tone }]}>{'POOL ' + ratio + '%'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.radius.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nameCol: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  metaCol: {
    alignItems: 'flex-end',
  },
  hours: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  ratio: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default DiaryEntryRow;
