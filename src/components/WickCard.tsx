import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ruler } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  range: string;
  hint: string;
};

/** Amber advisory card - the wick size suggestion for this diameter. */
export function WickCard({ range, hint }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Ruler size={18} color={theme.colors.earth.amber} strokeWidth={2.2} />
        <Text style={styles.title}>WICK ADVISOR</Text>
      </View>
      <Text style={styles.range}>{range}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.ui.amberTint,
    borderWidth: 1,
    borderColor: theme.colors.ui.amberBorder,
    borderRadius: theme.radius.lg,
    padding: 14,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
  range: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: theme.colors.text.primary,
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
    color: theme.colors.text.secondary,
  },
});

export default WickCard;
