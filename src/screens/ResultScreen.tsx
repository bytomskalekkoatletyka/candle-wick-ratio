import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Flame, RefreshCw } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { ThermoStrip } from '../components/ThermoStrip';
import { WickCard } from '../components/WickCard';
import { BatchStepper } from '../components/BatchStepper';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { CARD_PAD, GUTTER, SCREEN_W } from '../constants/config';
import { PourResult, scaleBatch } from '../game/candleMath';
import { grams, pct } from '../utils/format';

type Props = {
  result: PourResult;
  onMeasureAgain: () => void;
  onBurnTest: () => void;
  onMenu: () => void;
};

const WORK_W = SCREEN_W - GUTTER * 2;
const CARD_INNER_W = WORK_W - 2 * (CARD_PAD + 1);
const HALF_W = (WORK_W - 12) / 2;

/** The round-result screen: pour sheet, wick advisor and batch scaler. */
export function ResultScreen({ result, onMeasureAgain, onBurnTest, onMenu }: Props) {
  const [jars, setJars] = useState(1);
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(rise, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [rise]);

  /**
   * The headline grams are printed straight from the result — no count-up.
   * Easing them from 0 meant the card read "WAX 116 g" while the batch row below
   * already showed the settled 507 g for one jar: two contradictory numbers on one
   * screen for the first half-second (and in every screenshot taken in it).
   */
  const batch = useMemo(() => scaleBatch(result, jars), [jars, result]);

  const handleJars = useCallback((next: number) => setJars(next), []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });

  return (
    <AppShell variant="sheet">
      <ScreenHeader
        title="POUR SHEET"
        onBack={onMeasureAgain}
        rightIcon={assets.iconHome}
        onRight={onMenu}
        rightLabel="Back to the tray"
      />

      <Animated.View
        style={[styles.body, { opacity: rise, transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          <Image source={assets.sprite5} style={styles.cardArt} resizeMode="contain" />

          <View style={styles.numberRow}>
            <View style={styles.numberCol}>
              <Text style={styles.numberLabel}>WAX</Text>
              <Text style={styles.numberWax}>{grams(result.waxG) + ' g'}</Text>
              <Text style={styles.numberCaption}>
                {result.waxType + ' · SG ' + result.sg.toFixed(2)}
              </Text>
            </View>
            <View style={styles.numberCol}>
              <Text style={styles.numberLabel}>OIL</Text>
              <Text style={styles.numberOil}>{grams(result.foG) + ' g'}</Text>
              <Text style={styles.numberCaption}>{pct(result.foPct) + '% LOAD'}</Text>
            </View>
          </View>

          <ThermoStrip addC={result.addC} pourC={result.pourC} trackW={CARD_INNER_W} />
        </View>

        <View style={styles.wickSlot}>
          <WickCard
            range={result.wickRange}
            hint={
              result.waxType +
              ' ' +
              result.wickHint +
              '. Confirm the size with a 4 h burn test.'
            }
          />
        </View>

        <View style={styles.batchSlot}>
          <BatchStepper jars={jars} onChange={handleJars} />
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={grams(batch.waxG)}
                label="batch wax"
                color={theme.colors.earth.lavender}
              />
            </View>
            {batch.foG > 0 ? (
              <View style={styles.statSlot}>
                <StatCard
                  value={grams(batch.foG)}
                  label="batch oil"
                  color={theme.colors.earth.amber}
                />
              </View>
            ) : null}
            <View style={styles.statSlot}>
              <StatCard
                value={grams(batch.totalG)}
                label="batch total"
                color={theme.colors.earth.sage}
              />
            </View>
          </View>
        </View>

        <View style={styles.ctaSlot}>
          <PrimaryButton
            label="MEASURE AGAIN"
            Icon={RefreshCw}
            onPress={onMeasureAgain}
            width={WORK_W}
          />
          <View style={styles.secondaryRow}>
            <SecondaryButton
              label="START BURN TEST"
              Icon={Flame}
              onPress={onBurnTest}
              width={HALF_W}
            />
            <SecondaryButton label="TRAY" onPress={onMenu} width={HALF_W} />
          </View>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    paddingBottom: 18,
    /** Spreads the leftover height instead of parking it all in one mid-screen hole. */
    justifyContent: 'space-between',
  },
  card: {
    width: WORK_W,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: CARD_PAD,
    ...theme.shadows.card,
  },
  /** Positive insets only - a sprite must never poke past the rounded corner. */
  cardArt: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 58,
    height: 58,
    opacity: 0.95,
  },
  numberRow: {
    flexDirection: 'row',
    gap: 18,
  },
  numberCol: {
    minWidth: 104,
  },
  numberLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  numberWax: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.earth.lavender,
    fontVariant: ['tabular-nums'],
  },
  numberOil: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.earth.amber,
    fontVariant: ['tabular-nums'],
  },
  numberCaption: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
  wickSlot: {
    marginTop: 12,
  },
  batchSlot: {
    paddingTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
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

export default ResultScreen;
