/**
 * WARM_EARTHY preset (design-system/presets) with the CandleWickRatio brief accents.
 * The preset key itself is NOT renamed — `name` stays exactly as in preset.ts.
 */

export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#FBF7EF', // wax-white canvas
      secondary: '#F4EDE1', // gradient mid stop
      tertiary: '#E8DFD2', // header backing, chip rails
      accent: '#D8C9A8',
    },
    surface: {
      card: '#FFFFFF',
      sunk: 'rgba(45,36,51,0.05)',
      strip: '#FFFFFF',
    },
    earth: {
      lavender: '#6D597A', // primary — CTAs, headings
      plum: '#574664', // CTA gradient end
      amber: '#E9A23B', // flame amber — sliders, oil, markers
      terracotta: '#D97B4D', // gradient end, "too large"
      sage: '#7FA46B', // totals, "looks good", safety
      walnut: '#8A7C68',
      cream: '#FBF7EF',
    },
    text: {
      primary: '#2D2433',
      secondary: '#6B6072',
      accent: '#6D597A',
      muted: 'rgba(45,36,51,0.45)',
      onDark: '#FBF7EF',
      onDarkSoft: 'rgba(251,247,239,0.62)',
      onPrimary: '#FBF7EF',
    },
    ui: {
      border: 'rgba(45,36,51,0.08)',
      borderStrong: 'rgba(45,36,51,0.14)',
      divider: 'rgba(45,36,51,0.06)',
      lavenderTint: 'rgba(109,89,122,0.08)',
      lavenderTintStrong: 'rgba(109,89,122,0.20)',
      amberTint: 'rgba(233,162,59,0.10)',
      amberBorder: 'rgba(233,162,59,0.35)',
      sageTint: 'rgba(127,164,107,0.10)',
      sageBorder: 'rgba(127,164,107,0.35)',
      overlay: 'rgba(45,36,51,0.6)',
      glass: 'rgba(251,247,239,0.85)',
    },
  },

  gradients: {
    menu: ['#FBF7EF', '#F4EDE1', '#E8DFD2'],
    work: ['#FBF7EF', '#F4EDE1'],
    sheet: ['rgba(251,247,239,0.94)', 'rgba(232,223,210,0.97)'],
    loader: ['rgba(45,36,51,0.92)', 'rgba(109,89,122,0.88)', 'rgba(45,36,51,0.94)'],
    primary: ['#6D597A', '#574664'],
    flame: ['#E9A23B', '#D97B4D'],
    wax: ['#F6E7C9', '#E8DFD2'],
    thermo: ['#E8DFD2', '#E9A23B', '#D97B4D'],
  },

  typography: {
    hero: { fontSize: 44, fontWeight: '800' as const, letterSpacing: 1, lineHeight: 46 },
    display: { fontSize: 32, fontWeight: '800' as const, letterSpacing: 0 },
    title: { fontSize: 20, fontWeight: '800' as const, letterSpacing: 0.5 },
    body: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
    label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.5 },
    caption: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 2, lineHeight: 24 },
  },

  radius: { sm: 8, md: 14, lg: 22, pill: 24, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },

  shadows: {
    card: {
      shadowColor: '#2D2433',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    strip: {
      shadowColor: '#2D2433',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 6,
    },
    cta: {
      shadowColor: '#6D597A',
      shadowOpacity: 0.32,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
  },

  animation: {
    soft: { tension: 40, friction: 9 },
    snappy: { tension: 300, friction: 18 },
    plate: { tension: 48, friction: 8 },
  },
};

export type Theme = typeof theme;
export default theme;
