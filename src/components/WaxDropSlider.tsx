import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import {
  SLIDER_H,
  SLIDER_THUMB_H,
  SLIDER_THUMB_W,
  SLIDER_TRACK_H,
} from '../constants/config';
import { clamp, snap } from '../utils/format';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (next: number) => void;
  format?: (value: number) => string;
};

/**
 * Responder-driven slider built on the built-in RN responder props only.
 * The thumb and the fill are pointerEvents="none", so locationX always comes from
 * the track container itself.
 */
export function WaxDropSlider({ label, value, min, max, step, unit, onChange, format }: Props) {
  const [trackW, setTrackW] = useState(0);
  const [active, setActive] = useState(false);
  const trackWRef = useRef(0);
  const lastEmitted = useRef(value);
  const thumbScale = useRef(new Animated.Value(1)).current;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWRef.current = w;
    setTrackW(w);
  }, []);

  const applyTouch = useCallback(
    (e: GestureResponderEvent) => {
      const w = trackWRef.current;
      if (w <= 0) {
        return;
      }
      const usable = Math.max(1, w - SLIDER_THUMB_W);
      const x = clamp(e.nativeEvent.locationX - SLIDER_THUMB_W / 2, 0, usable);
      const next = snap(min + (x / usable) * (max - min), min, max, step);
      if (next !== lastEmitted.current) {
        lastEmitted.current = next;
        Vibration.vibrate(8);
        onChange(next);
      }
    },
    [max, min, onChange, step],
  );

  const onGrant = useCallback(
    (e: GestureResponderEvent) => {
      setActive(true);
      Animated.spring(thumbScale, {
        toValue: 1.12,
        tension: theme.animation.snappy.tension,
        friction: theme.animation.snappy.friction,
        useNativeDriver: true,
      }).start();
      applyTouch(e);
    },
    [applyTouch, thumbScale],
  );

  const onRelease = useCallback(() => {
    setActive(false);
    Animated.spring(thumbScale, {
      toValue: 1,
      tension: theme.animation.snappy.tension,
      friction: theme.animation.snappy.friction,
      useNativeDriver: true,
    }).start();
  }, [thumbScale]);

  const ratio = max > min ? clamp((value - min) / (max - min), 0, 1) : 0;
  const usableW = Math.max(0, trackW - SLIDER_THUMB_W);
  const thumbLeft = usableW * ratio;
  const fillW = thumbLeft + SLIDER_THUMB_W / 2;

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, active ? styles.valueActive : null]}>
            {format ? format(value) : value.toFixed(step < 1 ? 1 : 0)}
          </Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      <View
        style={styles.touchArea}
        onLayout={onTrackLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onGrant}
        onResponderMove={applyTouch}
        onResponderRelease={onRelease}
        onResponderTerminate={onRelease}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
      >
        <View style={styles.track} pointerEvents="none">
          {fillW > 0 ? (
            <LinearGradient
              colors={theme.gradients.flame}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: fillW }]}
            />
          ) : null}
        </View>

        <Animated.View
          style={[styles.thumb, { left: thumbLeft, transform: [{ scale: thumbScale }] }]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: SLIDER_H,
    width: '100%',
  },
  head: {
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  valueActive: {
    color: theme.colors.earth.amber,
  },
  unit: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  touchArea: {
    height: SLIDER_H - 18,
    justifyContent: 'center',
  },
  track: {
    height: SLIDER_TRACK_H,
    borderRadius: SLIDER_TRACK_H / 2,
    backgroundColor: 'rgba(45,36,51,0.10)',
    overflow: 'hidden',
  },
  fill: {
    height: SLIDER_TRACK_H,
    borderRadius: SLIDER_TRACK_H / 2,
  },
  /** Wax-drop thumb: rounded bottom, tighter top. */
  thumb: {
    position: 'absolute',
    width: SLIDER_THUMB_W,
    height: SLIDER_THUMB_H,
    borderRadius: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.colors.earth.cream,
    borderWidth: 2,
    borderColor: theme.colors.earth.amber,
    shadowColor: '#2D2433',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export default WaxDropSlider;
