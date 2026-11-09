import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type ShellVariant = 'loader' | 'menu' | 'work' | 'sheet';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<ShellVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  work: theme.gradients.work,
  sheet: theme.gradients.sheet,
};

/** bg_game is the only background art — the screens are told apart by their overlay. */
const IMAGE_OPACITY: Record<ShellVariant, number> = {
  loader: 0.85,
  menu: 0.22,
  work: 0.1,
  sheet: 0.16,
};

const ANGLE: Record<ShellVariant, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  loader: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  menu: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  work: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  sheet: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
};

export function AppShell({ variant, children }: Props) {
  const dark = variant === 'loader';

  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bgGame}
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: IMAGE_OPACITY[variant] }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={ANGLE[variant].start}
        end={ANGLE[variant].end}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.decor} pointerEvents="none">
        <View
          style={[
            styles.blobLavender,
            dark ? styles.blobLavenderDark : null,
          ]}
        />
        <View style={styles.blobAmber} />
        {dark ? null : <View style={styles.columnRule} />}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  decor: {
    ...StyleSheet.absoluteFillObject,
  },
  blobLavender: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(109,89,122,0.07)',
  },
  blobLavenderDark: {
    backgroundColor: 'rgba(233,162,59,0.10)',
  },
  blobAmber: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(233,162,59,0.08)',
  },
  /** 1 px editorial column rule — the magazine grid hint. */
  columnRule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 24,
    width: 1,
    backgroundColor: theme.colors.ui.divider,
  },
});

export default AppShell;
