import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import type { Verdict } from '../game/candleMath';

type Props = {
  verdict: Verdict;
};

const TONE: Record<Verdict, string> = {
  'WICK LOOKS GOOD': theme.colors.earth.sage,
  'WICK TOO SMALL': theme.colors.earth.amber,
  'WICK TOO LARGE': theme.colors.earth.terracotta,
};

/** Colour-coded melt-pool verdict. Colour is never the only cue - the text says it too. */
export function VerdictPill({ verdict }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      tension: theme.animation.soft.tension,
      friction: theme.animation.soft.friction,
      useNativeDriver: true,
    }).start();
  }, [anim, verdict]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const color = TONE[verdict];

  return (
    <Animated.View
      style={[
        styles.pill,
        { borderColor: color, backgroundColor: color + '1F', opacity: anim, transform: [{ scale }] },
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {verdict}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default VerdictPill;
