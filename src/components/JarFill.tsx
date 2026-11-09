import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import {
  JAR_BORDER,
  JAR_H,
  JAR_INNER_H,
  JAR_INNER_W,
  JAR_PAD,
  JAR_W,
} from '../constants/config';
import { FlameSvg } from './FlameSvg';

type Props = {
  fillRatio: number;
  burning: boolean;
  caption: string;
};

/**
 * Jar outline + the wax column rising inside it.
 * Geometry note: the inner width/height already subtract PAD + BORDER on both
 * sides, so the wax column can never push the jar outline out.
 * height is NOT a native-driver property -> useNativeDriver:false here.
 */
export function JarFill({ fillRatio, burning, caption }: Props) {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = Math.max(0, Math.min(1, fillRatio)) * JAR_INNER_H;
    Animated.timing(height, {
      toValue: target,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fillRatio, height]);

  return (
    <View style={styles.column}>
      <View style={styles.flameSlot}>
        {burning ? <FlameSvg width={14} height={20} flicker /> : null}
      </View>

      <View style={styles.jar}>
        <View style={styles.inner}>
          <Animated.View style={[styles.waxWrap, { height }]}>
            <LinearGradient
              colors={theme.gradients.wax}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <View style={styles.wick} pointerEvents="none" />
        </View>
      </View>

      <Text style={styles.caption} numberOfLines={1}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: JAR_W,
    alignItems: 'center',
  },
  flameSlot: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  jar: {
    width: JAR_W,
    height: JAR_H,
    padding: JAR_PAD,
    borderWidth: JAR_BORDER,
    borderColor: theme.colors.ui.borderStrong,
    borderRadius: theme.radius.lg,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  inner: {
    width: JAR_INNER_W,
    height: JAR_INNER_H,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  waxWrap: {
    width: JAR_INNER_W,
  },
  wick: {
    position: 'absolute',
    width: 2,
    height: JAR_INNER_H * 0.9,
    top: JAR_INNER_H * 0.05,
    left: JAR_INNER_W / 2 - 1,
    backgroundColor: theme.colors.earth.walnut,
    borderRadius: 1,
  },
  caption: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
});

export default JarFill;
