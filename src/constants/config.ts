import { Dimensions } from 'react-native';

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/** Card geometry — content width always accounts for padding + border (board rule #4/#5). */
export const CARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CARD_PAD = 16;
export const CARD_BORDER = 1;
export const CARD_FRAME = CARD_PAD + CARD_BORDER;
export const CARD_CONTENT_W = CARD_MAX_W - 2 * CARD_FRAME;

/** Screen gutter used by the work areas. */
export const GUTTER = 20;
export const WORK_W = SCREEN_W - 2 * GUTTER;

/** Jar visual — PAD 6 + BORDER 2 = 8 frame on each side. */
export const JAR_PAD = 6;
export const JAR_BORDER = 2;
export const JAR_FRAME = JAR_PAD + JAR_BORDER;
export const JAR_W = 104;
export const JAR_H = 142;
export const JAR_INNER_W = JAR_W - 2 * JAR_FRAME;
export const JAR_INNER_H = JAR_H - 2 * JAR_FRAME;

/** Controls. */
export const SLIDER_H = 54;
export const SLIDER_TRACK_H = 8;
export const SLIDER_THUMB_W = 28;
export const SLIDER_THUMB_H = 34;
export const BTN_PRIMARY_H = 56;
export const BTN_SECONDARY_H = 48;
export const HEADER_H = 72;
export const HEADER_TOP = 44;
export const ICON_IN_BUTTON = 24;

/** Splash — EXACTLY 8000 ms (rule #13): shorter races the screenshot gate. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;

export type WaxTypeId = 'SOY' | 'PARAFFIN' | 'COCO SOY' | 'BEESWAX';

export type WaxSpec = {
  id: WaxTypeId;
  sg: number;
  maxFoPct: number;
  addFoC: number;
  pourC: number;
  wickShift: -1 | 0 | 1;
  wickNote: string;
};

export const WAX_TABLE: WaxSpec[] = [
  { id: 'SOY', sg: 0.86, maxFoPct: 10, addFoC: 82, pourC: 57, wickShift: 1, wickNote: 'burns cooler, size up one' },
  { id: 'PARAFFIN', sg: 0.9, maxFoPct: 12, addFoC: 85, pourC: 68, wickShift: -1, wickNote: 'hot burn, size down one' },
  { id: 'COCO SOY', sg: 0.88, maxFoPct: 12, addFoC: 79, pourC: 54, wickShift: 0, wickNote: 'wide pool, keep stock size' },
  { id: 'BEESWAX', sg: 0.95, maxFoPct: 6, addFoC: 79, pourC: 74, wickShift: 1, wickNote: 'needs the largest wick' },
];

export const WAX_IDS: WaxTypeId[] = WAX_TABLE.map(w => w.id);

export const getWax = (id: WaxTypeId): WaxSpec =>
  WAX_TABLE.find(w => w.id === id) ?? WAX_TABLE[0];

/** Slider ranges. */
export const DIAMETER = { min: 4, max: 12, step: 0.1, def: 7.4 };
export const FILL_HEIGHT = { min: 3, max: 14, step: 0.1, def: 8 };
export const WATER_WEIGHT = { min: 60, max: 900, step: 5, def: 320 };
export const FRAGRANCE = { min: 0, step: 0.5, def: 8 };
export const POOL_WIDTH = { min: 0, step: 0.1, def: 5.4 };
export const POOL_DEPTH = { min: 0, max: 20, step: 0.5, def: 9 };

/** Batch scaler. */
export const JARS_MIN = 1;
export const JARS_MAX = 24;

/** Thermometer strip range (C). */
export const THERMO_MIN_C = 40;
export const THERMO_MAX_C = 95;

/** Safety. */
export const MAX_BURN_HOURS = 4;
export const DIARY_VISIBLE_ROWS = 6;
