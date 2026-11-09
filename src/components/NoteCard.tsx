import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { IconCmp } from './types';

type Props = {
  Icon: IconCmp;
  title: string;
  body: string;
};

/** Sage-tinted safety note. */
export function NoteCard({ Icon, title, body }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconSlot}>
        <Icon size={20} color={theme.colors.earth.sage} strokeWidth={2.2} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: theme.colors.ui.sageTint,
    borderWidth: 1,
    borderColor: theme.colors.ui.sageBorder,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconSlot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,164,107,0.16)',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  body: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    color: theme.colors.text.secondary,
  },
});

export default NoteCard;
