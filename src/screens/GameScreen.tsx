import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BookmarkPlus, Droplet, Layers, RotateCcw, Ruler, Thermometer } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { JarFill } from '../components/JarFill';
import { ChipRow } from '../components/ChipRow';
import { WaxDropSlider } from '../components/WaxDropSlider';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import {
  DIAMETER,
  FILL_HEIGHT,
  FRAGRANCE,
  GUTTER,
  JAR_W,
  SCREEN_W,
  WATER_WEIGHT,
  WAX_IDS,
  getWax,
} from '../constants/config';
import type { WaxTypeId } from '../constants/config';
import { PourResult, computePour } from '../game/candleMath';
import { clamp, grams } from '../utils/format';

type Props = {
  onPour: (result: PourResult) => void;
  onSave: (result: PourResult) => void;
  onBack: () => void;
};

const WORK_W = SCREEN_W - GUTTER * 2;
const RIGHT_COL_W = WORK_W - JAR_W - 14;
const CHIP_W = (RIGHT_COL_W - 8) / 2;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TOGGLE_W = 168;

/**
 * Vector icons, NOT the AI sprites: every PNG has its own object aspect ratio, so
 * `resizeMode:'contain'` rendered the three of them at visibly different scales and
 * baselines. A lucide glyph has a fixed canvas — the rail stays pixel-even.
 */
const INGREDIENTS = [
  { Icon: Layers, label: 'WAX', color: theme.colors.earth.lavender },
  { Icon: Droplet, label: 'OIL', color: theme.colors.earth.amber },
  { Icon: Ruler, label: 'WICK', color: theme.colors.earth.sage },
];

/** G3 split panel: jar + inputs on top, a thin live result strip above the controls. */
export function GameScreen({ onPour, onSave, onBack }: Props) {
  const [diameterCm, setDiameter] = useState(DIAMETER.def);
  const [fillHeightCm, setFillHeight] = useState(FILL_HEIGHT.def);
  const [waterWeightG, setWaterWeight] = useState(WATER_WEIGHT.def);
  const [useHeight, setUseHeight] = useState(true);
  const [waxType, setWaxType] = useState<WaxTypeId>('SOY');
  const [foPct, setFoPct] = useState(FRAGRANCE.def);

  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(enter, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [enter]);

  const maxFoPct = getWax(waxType).maxFoPct;

  const live = useMemo(
    () => computePour({ diameterCm, fillHeightCm, waterWeightG, useHeight, waxType, foPct }),
    [diameterCm, fillHeightCm, waterWeightG, useHeight, waxType, foPct],
  );

  const onWaxChange = useCallback((next: WaxTypeId) => {
    setWaxType(next);
    setFoPct(prev => Math.min(prev, getWax(next).maxFoPct));
  }, []);

  const toggleMode = useCallback(() => setUseHeight(prev => !prev), []);

  const handlePour = useCallback(() => onPour(live), [live, onPour]);
  const handleSave = useCallback(() => onSave(live), [live, onSave]);

  const handleReset = useCallback(() => {
    setDiameter(DIAMETER.def);
    setFillHeight(FILL_HEIGHT.def);
    setWaterWeight(WATER_WEIGHT.def);
    setUseHeight(true);
    setWaxType('SOY');
    setFoPct(FRAGRANCE.def);
  }, []);

  const fillRatio = useHeight
    ? clamp(fillHeightCm / FILL_HEIGHT.max, 0.04, 1)
    : clamp(waterWeightG / WATER_WEIGHT.max, 0.04, 1);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <AppShell variant="work">
      <ScreenHeader
        title="JAR MEASURE"
        onBack={onBack}
        rightIcon={assets.iconHome}
        onRight={onBack}
        rightLabel="Back to the tray"
      />

      <Animated.View
        style={[styles.body, { opacity: enter, transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <View style={styles.work}>
          <View style={styles.topRow}>
            <JarFill fillRatio={fillRatio} burning={false} caption="JAR FILL" />

            <View style={styles.rightCol}>
              <Text style={styles.colLabel}>WAX FAMILY</Text>
              <ChipRow
                options={WAX_IDS}
                value={waxType}
                onChange={onWaxChange}
                chipWidth={CHIP_W}
              />
            </View>
          </View>

          <View style={styles.rail} pointerEvents="none">
            {INGREDIENTS.map(({ Icon, label, color }) => (
              <View key={label} style={styles.railItem}>
                <View style={[styles.railIcon, { backgroundColor: color + '1A' }]}>
                  <Icon size={20} color={color} strokeWidth={2.2} />
                </View>
                <Text style={styles.railLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sliders}>
            <WaxDropSlider
              label="DIAMETER"
              value={diameterCm}
              min={DIAMETER.min}
              max={DIAMETER.max}
              step={DIAMETER.step}
              unit="cm"
              onChange={setDiameter}
            />

            {useHeight ? (
              <WaxDropSlider
                label="FILL HEIGHT"
                value={fillHeightCm}
                min={FILL_HEIGHT.min}
                max={FILL_HEIGHT.max}
                step={FILL_HEIGHT.step}
                unit="cm"
                onChange={setFillHeight}
              />
            ) : (
              <WaxDropSlider
                label="WATER WEIGHT"
                value={waterWeightG}
                min={WATER_WEIGHT.min}
                max={WATER_WEIGHT.max}
                step={WATER_WEIGHT.step}
                unit="g"
                onChange={setWaterWeight}
                format={v => String(Math.round(v))}
              />
            )}

            <Pressable
              style={styles.toggle}
              onPress={toggleMode}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Switch measuring mode"
            >
              <Text style={styles.toggleText}>
                {useHeight ? 'USE WATER WEIGHT' : 'USE HEIGHT'}
              </Text>
            </Pressable>

            <WaxDropSlider
              label="FRAGRANCE"
              value={foPct}
              min={FRAGRANCE.min}
              max={maxFoPct}
              step={FRAGRANCE.step}
              unit="%"
              onChange={setFoPct}
            />
          </View>
        </View>

        <View style={styles.strip}>
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={grams(live.waxG)}
                label="wax g"
                color={theme.colors.earth.lavender}
              />
            </View>
            {live.foG >= 0.05 ? (
              <View style={styles.statSlot}>
                <StatCard value={grams(live.foG)} label="oil g" color={theme.colors.earth.amber} />
              </View>
            ) : null}
            <View style={styles.statSlot}>
              <StatCard
                value={grams(live.totalG)}
                label="total g"
                color={theme.colors.earth.sage}
              />
            </View>
          </View>

          <View style={styles.ctaSlot}>
            <PrimaryButton
              label="POUR SHEET"
              Icon={Thermometer}
              onPress={handlePour}
              width={WORK_W}
            />
          </View>

          <View style={styles.secondaryRow}>
            <SecondaryButton
              label="SAVE TO TRAY"
              Icon={BookmarkPlus}
              onPress={handleSave}
              width={(WORK_W - 12) / 2}
            />
            <SecondaryButton
              label="RESET"
              Icon={RotateCcw}
              onPress={handleReset}
              width={(WORK_W - 12) / 2}
            />
          </View>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  work: {
    flex: 1,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    /** Spreads the leftover height instead of parking it all in one mid-screen hole. */
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  rightCol: {
    width: RIGHT_COL_W,
    paddingTop: 22,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    color: theme.colors.text.secondary,
  },
  rail: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  railItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  /** Fixed 32x32 tile + fixed 20px glyph — identical geometry on every item. */
  railIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    lineHeight: 14,
    color: theme.colors.text.secondary,
  },
  sliders: {
    paddingBottom: 10,
    gap: 8,
  },
  toggle: {
    width: TOGGLE_W,
    height: 28,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.earth.lavender,
    textDecorationLine: 'underline',
  },
  /** The thin white result strip is the G3 signature. */
  strip: {
    backgroundColor: theme.colors.surface.strip,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: GUTTER - 1,
    paddingTop: 12,
    paddingBottom: 18,
    ...theme.shadows.strip,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statSlot: {
    flex: 1,
  },
  ctaSlot: {
    marginTop: 14,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});

export default GameScreen;
