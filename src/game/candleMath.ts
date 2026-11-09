import { getWax, MAX_BURN_HOURS, WaxTypeId } from '../constants/config';

export type Verdict = 'WICK LOOKS GOOD' | 'WICK TOO SMALL' | 'WICK TOO LARGE';

export type PourInput = {
  diameterCm: number;
  fillHeightCm: number;
  waterWeightG: number;
  useHeight: boolean;
  waxType: WaxTypeId;
  foPct: number;
};

export type PourResult = {
  totalG: number;
  waxG: number;
  foG: number;
  waterWeightG: number;
  sg: number;
  addC: number;
  pourC: number;
  wickRange: string;
  wickHint: string;
  waxType: WaxTypeId;
  foPct: number;
  diameterCm: number;
  fillHeightCm: number;
  fullMeltHours: number;
};

/** Water weight of the jar fill — 1 cm3 of water is about 1 g. */
export function waterWeightFor(diameterCm: number, fillHeightCm: number): number {
  const r = diameterCm / 2;
  return Math.PI * r * r * fillHeightCm;
}

/** Wax and oil split the same volume; the oil load is a percentage of the wax. */
export function splitTotals(totalG: number, foPct: number) {
  const waxG = totalG / (1 + foPct / 100);
  return { waxG, foG: totalG - waxG };
}

const WICK_LADDER = [
  'CD 4 - CD 6 / ECO 1 - ECO 2',
  'CD 6 - CD 8 / ECO 4 - ECO 6',
  'CD 10 - CD 12 / ECO 8 - ECO 10',
  'CD 14 - CD 16 / ECO 12 - ECO 14',
  'two wicks, CD 8 - CD 10 each',
];

function ladderIndex(diameterCm: number): number {
  if (diameterCm < 5) {
    return 0;
  }
  if (diameterCm <= 6.4) {
    return 1;
  }
  if (diameterCm <= 7.6) {
    return 2;
  }
  if (diameterCm <= 8.9) {
    return 3;
  }
  return 4;
}

/** Base range by diameter, then shifted one step by the wax family. */
export function wickForDiameter(diameterCm: number, waxType: WaxTypeId): string {
  const wax = getWax(waxType);
  const base = ladderIndex(diameterCm);
  const shifted = Math.min(WICK_LADDER.length - 1, Math.max(0, base + wax.wickShift));
  return WICK_LADDER[shifted];
}

/** One hour of burn per 2.5 cm of diameter, capped at the 4 h safety limit. */
export function fullMeltHours(diameterCm: number): number {
  return Math.min(MAX_BURN_HOURS, Math.round((diameterCm / 2.5) * 10) / 10);
}

export function computePour(input: PourInput): PourResult {
  const wax = getWax(input.waxType);
  const water = input.useHeight
    ? waterWeightFor(input.diameterCm, input.fillHeightCm)
    : input.waterWeightG;
  const totalG = water * wax.sg;
  const { waxG, foG } = splitTotals(totalG, input.foPct);

  return {
    totalG,
    waxG,
    foG,
    waterWeightG: water,
    sg: wax.sg,
    addC: wax.addFoC,
    pourC: wax.pourC,
    wickRange: wickForDiameter(input.diameterCm, input.waxType),
    wickHint: wax.wickNote,
    waxType: input.waxType,
    foPct: input.foPct,
    diameterCm: input.diameterCm,
    fillHeightCm: input.fillHeightCm,
    fullMeltHours: fullMeltHours(input.diameterCm),
  };
}

export function scaleBatch(result: PourResult, jars: number) {
  const n = Math.max(1, Math.round(jars));
  return {
    waxG: Math.round(result.waxG * n),
    foG: Math.round(result.foG * n),
    totalG: Math.round(result.totalG * n),
  };
}

/** Melt-pool verdict — tunneling vs overheating. */
export function verdictForPool(poolWidthCm: number, poolDepthMm: number, diameterCm: number): Verdict {
  const ratio = diameterCm > 0 ? poolWidthCm / diameterCm : 0;
  if (ratio < 0.6) {
    return 'WICK TOO SMALL';
  }
  if (poolDepthMm > 13 || ratio > 1.02) {
    return 'WICK TOO LARGE';
  }
  return 'WICK LOOKS GOOD';
}

export function poolRatio(poolWidthCm: number, diameterCm: number): number {
  return diameterCm > 0 ? poolWidthCm / diameterCm : 0;
}
