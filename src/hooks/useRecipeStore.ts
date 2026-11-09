import { useCallback, useMemo, useState } from 'react';
import type { Verdict } from '../game/candleMath';
import type { WaxTypeId } from '../constants/config';

export type Recipe = {
  id: string;
  name: string;
  diameterCm: number;
  waxType: WaxTypeId;
  waxG: number;
  foG: number;
  foPct: number;
  savedAt: number;
};

export type BurnEntry = {
  id: string;
  recipeName: string;
  savedAt: number;
  burnSeconds: number;
  poolWidthCm: number;
  poolDepthMm: number;
  diameterCm: number;
  verdict: Verdict;
};

const DAY = 86400000;
const NOW = Date.now();

/** Seeded so the tray and the diary are never empty on first launch. */
const SEED_RECIPES: Recipe[] = [
  { id: 'r1', name: 'Lavender 7.4', diameterCm: 7.4, waxType: 'SOY', waxG: 262.1, foG: 21, foPct: 8, savedAt: NOW - 6 * DAY },
  { id: 'r2', name: 'Amber Tin 6.2', diameterCm: 6.2, waxType: 'COCO SOY', waxG: 171.4, foG: 17.1, foPct: 10, savedAt: NOW - 3 * DAY },
  { id: 'r3', name: 'Coco Pillar 8.6', diameterCm: 8.6, waxType: 'BEESWAX', waxG: 402, foG: 20.1, foPct: 5, savedAt: NOW - DAY },
];

const SEED_ENTRIES: BurnEntry[] = [
  {
    id: 'e1', recipeName: 'Lavender 7.4', savedAt: NOW - 5 * DAY, burnSeconds: 10800,
    poolWidthCm: 7.1, poolDepthMm: 9, diameterCm: 7.4, verdict: 'WICK LOOKS GOOD',
  },
  {
    id: 'e2', recipeName: 'Amber Tin 6.2', savedAt: NOW - 2 * DAY, burnSeconds: 7200,
    poolWidthCm: 3.4, poolDepthMm: 5, diameterCm: 6.2, verdict: 'WICK TOO SMALL',
  },
];

let seq = 100;
const nextId = (prefix: string) => prefix + ++seq;

export function useRecipeStore() {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES);
  const [entries, setEntries] = useState<BurnEntry[]>(SEED_ENTRIES);

  const addRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'savedAt'>) => {
    setRecipes(prev => [{ ...recipe, id: nextId('r'), savedAt: Date.now() }, ...prev].slice(0, 24));
  }, []);

  const addEntry = useCallback((entry: Omit<BurnEntry, 'id' | 'savedAt'>) => {
    setEntries(prev => [{ ...entry, id: nextId('e'), savedAt: Date.now() }, ...prev].slice(0, 24));
  }, []);

  const recipeCount = recipes.length;

  const bestBurnHours = useMemo(() => {
    const best = entries.reduce((max, e) => Math.max(max, e.burnSeconds), 0);
    return Math.round((best / 3600) * 10) / 10;
  }, [entries]);

  const goodBurns = useMemo(
    () => entries.filter(e => e.verdict === 'WICK LOOKS GOOD').length,
    [entries],
  );

  return { recipes, entries, addRecipe, addEntry, recipeCount, bestBurnHours, goodBurns };
}

export default useRecipeStore;
