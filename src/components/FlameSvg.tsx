import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../constants/theme';

type Props = {
  width?: number;
  height?: number;
  flicker?: boolean;
};

/** Inline SVG flame - no glyph fonts, no emoji (rules #15/#16). */
export function FlameSvg({ width = 28, height = 40, flicker = true }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!flicker) {
      anim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 620,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 620,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, flicker]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.06] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1] });

  return (
    <Animated.View
      style={[styles.wrap, { width, height, opacity, transform: [{ scale }] }]}
      pointerEvents="none"
    >
      <Svg width={width} height={height} viewBox="0 0 28 40">
        <Path
          d="M14 1C14 1 6 10.5 6 20.5C6 28 9.6 33 14 39C18.4 33 22 28 22 20.5C22 10.5 14 1 14 1Z"
          fill={theme.colors.earth.amber}
        />
        <Path
          d="M14 13C14 13 10.5 18.5 10.5 23.6C10.5 28 12 31 14 34.5C16 31 17.5 28 17.5 23.6C17.5 18.5 14 13 14 13Z"
          fill={theme.colors.earth.cream}
          opacity={0.9}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FlameSvg;
