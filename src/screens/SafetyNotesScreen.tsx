import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, Flame, Ruler, Scissors, ShieldCheck, Thermometer } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { NoteCard } from '../components/NoteCard';
import { SecondaryButton } from '../components/SecondaryButton';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { GUTTER, SCREEN_W } from '../constants/config';
import type { IconCmp } from '../components/types';

type Props = {
  onBack: () => void;
};

const WORK_W = SCREEN_W - GUTTER * 2;

const NOTES: { Icon: IconCmp; title: string; body: string }[] = [
  { Icon: Thermometer, title: 'FLASH POINT', body: 'Never add fragrance above its flash point.' },
  { Icon: Clock, title: 'FOUR HOURS', body: 'Burn no longer than 4 hours in one session.' },
  { Icon: Scissors, title: 'TRIM THE WICK', body: 'Trim to 5 mm before every single burn.' },
  { Icon: Ruler, title: 'LAST 13 MM', body: 'Stop burning with 13 mm of wax left in the jar.' },
  { Icon: Flame, title: 'NEVER UNATTENDED', body: 'Never leave a lit flame out of sight.' },
  { Icon: ShieldCheck, title: 'KEEP SPACING', body: 'Keep 10 cm of air between burning jars.' },
];

export function SafetyNotesScreen({ onBack }: Props) {
  return (
    <AppShell variant="sheet">
      <ScreenHeader
        title="SAFETY NOTES"
        onBack={onBack}
        rightIcon={assets.iconHome}
        onRight={onBack}
        rightLabel="Back to the tray"
      />

      <View style={styles.body}>
        <Text style={styles.intro}>Six rules that keep a studio pour calm and safe.</Text>

        <View style={styles.list}>
          {NOTES.map(note => (
            <NoteCard key={note.title} Icon={note.Icon} title={note.title} body={note.body} />
          ))}
        </View>

        <View style={styles.ctaSlot}>
          <SecondaryButton label="BACK TO TRAY" Icon={ShieldCheck} onPress={onBack} width={WORK_W} />
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
  intro: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
  ctaSlot: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});

export default SafetyNotesScreen;
