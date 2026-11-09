import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BookmarkPlus } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { BurnTimer } from '../components/BurnTimer';
import { WaxDropSlider } from '../components/WaxDropSlider';
import { VerdictPill } from '../components/VerdictPill';
import { DiaryEntryRow } from '../components/DiaryEntryRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { GUTTER, MAX_BURN_HOURS, POOL_DEPTH, POOL_WIDTH, SCREEN_W } from '../constants/config';
import { verdictForPool } from '../game/candleMath';
import type { BurnEntry } from '../hooks/useRecipeStore';
import { useBurnTimer } from '../hooks/useBurnTimer';
import { clamp } from '../utils/format';

type Props = {
  entries: BurnEntry[];
  diameterCm: number;
  recipeName: string;
  onSaveEntry: (entry: Omit<BurnEntry, 'id' | 'savedAt'>) => void;
  onBack: () => void;
};

const WORK_W = SCREEN_W - GUTTER * 2;
const VISIBLE_ROWS = 3;

/** Timed burn tests: run the clock, measure the melt pool, keep the verdict. */
export function BurnDiaryScreen({ entries, diameterCm, recipeName, onSaveEntry, onBack }: Props) {
  const { running, seconds, toggle, reset } = useBurnTimer();
  const [poolWidthCm, setPoolWidth] = useState(() =>
    clamp(POOL_WIDTH.def, POOL_WIDTH.min, diameterCm),
  );
  const [poolDepthMm, setPoolDepth] = useState(POOL_DEPTH.def);
  const [savedOnce, setSavedOnce] = useState(false);

  const verdict = useMemo(
    () => verdictForPool(poolWidthCm, poolDepthMm, diameterCm),
    [diameterCm, poolDepthMm, poolWidthCm],
  );

  const handleSave = useCallback(() => {
    onSaveEntry({
      recipeName,
      burnSeconds: Math.max(seconds, 60),
      poolWidthCm,
      poolDepthMm,
      diameterCm,
      verdict,
    });
    setSavedOnce(true);
    reset();
  }, [diameterCm, onSaveEntry, poolDepthMm, poolWidthCm, recipeName, reset, seconds, verdict]);

  const visible = entries.slice(0, VISIBLE_ROWS);
  const earlier = Math.max(0, entries.length - VISIBLE_ROWS);

  return (
    <AppShell variant="work">
      <ScreenHeader
        title="BURN DIARY"
        onBack={onBack}
        rightIcon={assets.iconHome}
        onRight={onBack}
        rightLabel="Back to the tray"
      />

      <View style={styles.body}>
        <View style={styles.timerCard}>
          <BurnTimer
            running={running}
            seconds={seconds}
            onToggle={toggle}
            width={WORK_W - 32}
            capHours={MAX_BURN_HOURS}
          />
        </View>

        <View style={styles.sliders}>
          <WaxDropSlider
            label="POOL WIDTH"
            value={Math.min(poolWidthCm, diameterCm)}
            min={POOL_WIDTH.min}
            max={diameterCm}
            step={POOL_WIDTH.step}
            unit="cm"
            onChange={setPoolWidth}
          />
          <WaxDropSlider
            label="POOL DEPTH"
            value={poolDepthMm}
            min={POOL_DEPTH.min}
            max={POOL_DEPTH.max}
            step={POOL_DEPTH.step}
            unit="mm"
            onChange={setPoolDepth}
          />
        </View>

        <View style={styles.verdictSlot}>
          <VerdictPill verdict={verdict} />
        </View>

        <View style={styles.log}>
          <Text style={styles.logTitle}>RECENT TESTS</Text>
          {visible.map(entry => (
            <View key={entry.id} style={styles.logRow}>
              <DiaryEntryRow entry={entry} />
            </View>
          ))}
          {earlier > 0 ? (
            <Text style={styles.earlier}>{'+' + earlier + ' EARLIER TESTS'}</Text>
          ) : null}
        </View>

        <View style={styles.ctaSlot}>
          <PrimaryButton
            label={savedOnce ? 'TEST AGAIN' : 'SAVE TEST'}
            Icon={BookmarkPlus}
            onPress={handleSave}
            width={WORK_W}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    paddingBottom: 18,
  },
  timerCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingVertical: 14,
    paddingHorizontal: 15,
    ...theme.shadows.card,
  },
  sliders: {
    marginTop: 14,
    gap: 8,
  },
  verdictSlot: {
    marginTop: 12,
  },
  log: {
    marginTop: 14,
    gap: 8,
  },
  logTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  logRow: {
    width: '100%',
  },
  earlier: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.earth.lavender,
  },
  ctaSlot: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});

export default BurnDiaryScreen;
