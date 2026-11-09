import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { THERMO_MAX_C, THERMO_MIN_C } from '../constants/config';
import { clamp, tempC } from '../utils/format';

type Props = {
  addC: number;
  pourC: number;
  trackW: number;
};

const MARKER = 14;

function useMarker(targetX: number, delay: number) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.spring(x, {
      toValue: targetX,
      tension: theme.animation.soft.tension,
      friction: theme.animation.soft.friction,
      delay,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [delay, targetX, x]);

  return x;
}

/**
 * Temperature strip: the two numbers that matter for a pour.
 * Markers slide with translateX (native driver safe) - never with `left`.
 * The degree sign is written as a plain ASCII C (rule #15).
 */
export function ThermoStrip({ addC, pourC, trackW }: Props) {
  const span = THERMO_MAX_C - THERMO_MIN_C;
  const usable = Math.max(0, trackW - MARKER);
  const addX = clamp((addC - THERMO_MIN_C) / span, 0, 1) * usable;
  const pourX = clamp((pourC - THERMO_MIN_C) / span, 0, 1) * usable;

  const addAnim = useMarker(addX, 180);
  const pourAnim = useMarker(pourX, 180);

  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={styles.label}>{'ADD FO AT ' + tempC(addC) + ' C'}</Text>
        <Text style={[styles.label, styles.labelPour]}>{'POUR AT ' + tempC(pourC) + ' C'}</Text>
      </View>

      <LinearGradient
        colors={theme.gradients.thermo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.strip, { width: trackW }]}
      />

      <View style={[styles.markerRow, { width: trackW }]} pointerEvents="none">
        <Animated.View
          style={[styles.marker, styles.markerPour, { transform: [{ translateX: pourAnim }] }]}
        />
        <Animated.View
          style={[styles.marker, styles.markerAdd, { transform: [{ translateX: addAnim }] }]}
        />
      </View>

      <View style={[styles.scale, { width: trackW }]}>
        <Text style={styles.scaleText}>{tempC(THERMO_MIN_C) + ' C'}</Text>
        <Text style={styles.scaleText}>{tempC(THERMO_MAX_C) + ' C'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.earth.amber,
  },
  labelPour: {
    color: theme.colors.earth.terracotta,
  },
  strip: {
    height: 10,
    borderRadius: 5,
  },
  markerRow: {
    height: MARKER + 4,
    marginTop: -MARKER / 2 - 1,
  },
  marker: {
    position: 'absolute',
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 2,
  },
  markerAdd: {
    borderColor: theme.colors.earth.amber,
  },
  markerPour: {
    borderColor: theme.colors.earth.terracotta,
  },
  scale: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
});

export default ThermoStrip;
