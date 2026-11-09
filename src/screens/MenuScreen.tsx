import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Droplet, FlaskConical, Layers, Ruler, ShieldCheck, Timer } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { SCREEN_W } from '../constants/config';

type Props = {
  recipeCount: number;
  bestBurnHours: number;
  onStart: () => void;
  onDiary: () => void;
  onSafety: () => void;
};

const PAD = 24;
const CONTENT_W = SCREEN_W - PAD * 2;
const PILL_W = (CONTENT_W - 12) / 2;
const CTA_W = Math.min(212, CONTENT_W - 40);

/** Vector glyphs, not the AI sprites — a fixed canvas keeps the rail pixel-even. */
const RAIL = [
  { Icon: Layers, key: 'WAX' },
  { Icon: Droplet, key: 'OIL' },
  { Icon: Ruler, key: 'WICK' },
];

function useRise(delay: number) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: 1,
      duration: 380,
      delay,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  return { opacity: anim, transform: [{ translateY }] };
}

/** M4 asymmetric / editorial: three-line hero flush left, candle art in the right column. */
export function MenuScreen({ recipeCount, bestBurnHours, onStart, onDiary, onSafety }: Props) {
  const line1 = useRise(0);
  const line2 = useRise(70);
  const line3 = useRise(140);
  const tag = useRise(240);
  const cta = useRise(420);

  const art = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.spring(art, {
      toValue: 1,
      tension: theme.animation.soft.tension,
      friction: theme.animation.soft.friction,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [art]);

  const artShift = art.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const showStats = recipeCount > 0 && bestBurnHours > 0;

  return (
    <AppShell variant="menu">
      <View style={styles.root}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <FlaskConical size={14} color={theme.colors.earth.lavender} strokeWidth={2.4} />
            <Text style={styles.badgeText}>{recipeCount + ' SAVED'}</Text>
          </View>
        </View>

        <Animated.Image
          source={assets.sprite4}
          style={[styles.art, { opacity: art, transform: [{ translateY: artShift }] }]}
          resizeMode="contain"
        />

        <View style={styles.hero}>
          <Animated.Text style={[styles.heroLine, styles.heroDark, line1]}>CANDLE</Animated.Text>
          <Animated.Text style={[styles.heroLine, styles.heroLav, line2]}>WICK</Animated.Text>
          <Animated.Text style={[styles.heroLine, styles.heroLav, line3]}>RATIO</Animated.Text>
          <View style={styles.rule} />
          <Animated.Text style={[styles.tagline, tag]}>
            Save accurate pours and better burns.
          </Animated.Text>
        </View>

        <Animated.View style={[styles.ctaSlot, cta]} pointerEvents="box-none">
          <PrimaryButton label="START RECIPE" Icon={FlaskConical} onPress={onStart} width={CTA_W} />
        </Animated.View>

        {showStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={String(recipeCount)}
                label="recipes"
                color={theme.colors.earth.lavender}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={bestBurnHours + 'h'}
                label="best burn"
                color={theme.colors.earth.amber}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.pillRow}>
          <SecondaryButton label="BURN DIARY" Icon={Timer} onPress={onDiary} width={PILL_W} />
          <SecondaryButton label="SAFETY" Icon={ShieldCheck} onPress={onSafety} width={PILL_W} />
        </View>

        <View style={styles.footerRail} pointerEvents="none">
          {RAIL.map(({ Icon, key }) => (
            <View key={key} style={styles.railIcon}>
              <Icon size={18} color={theme.colors.earth.walnut} strokeWidth={2.2} />
            </View>
          ))}
          <Text style={styles.railText}>WAX · OIL · WICK</Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: PAD,
    paddingBottom: 18,
  },
  badgeRow: {
    height: 34,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109,89,122,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(109,89,122,0.22)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 14,
    color: theme.colors.earth.lavender,
  },
  art: {
    position: 'absolute',
    top: 120,
    right: 8,
    width: 140,
    height: 170,
    opacity: 0.96,
  },
  hero: {
    marginTop: 16,
  },
  heroLine: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroDark: {
    color: theme.colors.text.primary,
  },
  heroLav: {
    color: theme.colors.earth.lavender,
  },
  rule: {
    width: 56,
    height: 3,
    borderRadius: 2,
    marginVertical: 14,
    backgroundColor: theme.colors.earth.amber,
  },
  tagline: {
    maxWidth: 200,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  /** Hint sits ABOVE the CTA - a button shadow must never clip it. */
  ctaSlot: {
    marginTop: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  statSlot: {
    flex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  footerRail: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    paddingTop: 16,
  },
  railIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(138,124,104,0.12)',
  },
  railText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});

export default MenuScreen;
