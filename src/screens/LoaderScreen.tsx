import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Droplet, Layers, Ruler } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { FlameSvg } from '../components/FlameSvg';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { LOADER_DURATION_MS, LOADER_FADE_MS } from '../constants/config';

type Props = {
  onDone: () => void;
};

const BAR_W = 190;

/** Vector glyphs, not the AI sprites — a fixed canvas keeps the rail pixel-even. */
const RAIL = [
  { Icon: Layers, key: 'WAX' },
  { Icon: Droplet, key: 'OIL' },
  { Icon: Ruler, key: 'WICK' },
];

/**
 * Dark, chrome-free splash - deliberately the opposite palette of the wax-white
 * Menu so the two screens never hash to the same image.
 */
export function LoaderScreen({ onDone }: Props) {
  const plate = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.spring(plate, {
      toValue: 1,
      tension: theme.animation.plate.tension,
      friction: theme.animation.plate.friction,
      useNativeDriver: true,
    }).start();

    Animated.timing(logoFade, {
      toValue: 1,
      duration: 240,
      delay: 240,
      useNativeDriver: true,
    }).start();

    // width is not a native-driver property.
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => clearTimeout(timer);
  }, [logoFade, plate, progress, screenFade]);

  const plateScale = plate.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <AppShell variant="loader">
      <Animated.View style={[styles.root, { opacity: screenFade }]}>
        <View style={styles.flameSlot}>
          <FlameSvg width={28} height={40} flicker />
        </View>

        <Animated.View
          style={[styles.plate, { opacity: plate, transform: [{ scale: plateScale }] }]}
          pointerEvents="none"
        >
          <Animated.Image
            source={assets.logo}
            style={[styles.logo, { opacity: logoFade }]}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.brandTop}>CANDLE WICK</Text>
        <Text style={styles.brandBottom}>RATIO</Text>
        <Text style={styles.subtitle}>WAX · OIL · WICK · BURN</Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.flame}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING STUDIO...</Text>

        <View style={styles.spriteRail} pointerEvents="none">
          {RAIL.map(({ Icon, key }) => (
            <Icon key={key} size={22} color={theme.colors.text.onDark} strokeWidth={2.2} />
          ))}
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  flameSlot: {
    height: 44,
    justifyContent: 'flex-end',
  },
  plate: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251,247,239,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(233,162,59,0.35)',
  },
  logo: {
    width: 148,
    height: 148,
  },
  brandTop: {
    marginTop: 26,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  brandBottom: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 10,
    color: theme.colors.earth.amber,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.text.onDarkSoft,
  },
  barTrack: {
    marginTop: 30,
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(251,247,239,0.18)',
    overflow: 'hidden',
  },
  barFillWrap: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(251,247,239,0.50)',
  },
  spriteRail: {
    position: 'absolute',
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    opacity: 0.55,
  },
});

export default LoaderScreen;
