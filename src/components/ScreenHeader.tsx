import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { HEADER_H, HEADER_TOP } from '../constants/config';

type Props = {
  title: string;
  onBack?: () => void;
  rightIcon?: ImageSourcePropType;
  onRight?: () => void;
  rightLabel?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** One header for every screen — same metrics, different slots. */
export function ScreenHeader({ title, onBack, rightIcon, onRight, rightLabel }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.slot}>
        {onBack ? (
          <Pressable
            style={styles.iconBtn}
            onPress={onBack}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={theme.colors.earth.lavender} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.slot, styles.slotRight]}>
        {rightIcon && onRight ? (
          <Pressable
            style={styles.iconBtn}
            onPress={onRight}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel={rightLabel ?? 'Home'}
          >
            <Image source={rightIcon} style={styles.rightImg} resizeMode="contain" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_H + HEADER_TOP,
    paddingTop: HEADER_TOP,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232,223,210,0.70)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  slot: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  slotRight: {
    alignItems: 'flex-end',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.lavenderTint,
  },
  rightImg: {
    width: 28,
    height: 28,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
});

export default ScreenHeader;
