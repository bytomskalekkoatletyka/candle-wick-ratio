/**
 * CandleWickRatio - offline candle calculator + burn diary.
 * App.tsx is the screen state machine only; the work happens in src/screens.
 */

import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { BurnDiaryScreen } from './src/screens/BurnDiaryScreen';
import { SafetyNotesScreen } from './src/screens/SafetyNotesScreen';
import type { PourResult } from './src/game/candleMath';
import { useRecipeStore } from './src/hooks/useRecipeStore';
import { DIAMETER } from './src/constants/config';
import { theme } from './src/constants/theme';
import { cm } from './src/utils/format';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'diary' | 'safety';

const recipeNameFor = (result: PourResult) => result.waxType + ' ' + cm(result.diameterCm);

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<PourResult | null>(null);
  const { entries, addRecipe, addEntry, recipeCount, bestBurnHours } = useRecipeStore();

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goDiary = useCallback(() => setScreen('diary'), []);
  const goSafety = useCallback(() => setScreen('safety'), []);

  const handlePour = useCallback((pour: PourResult) => {
    setResult(pour);
    setScreen('gameover');
  }, []);

  const handleSaveRecipe = useCallback(
    (pour: PourResult) => {
      addRecipe({
        name: recipeNameFor(pour),
        diameterCm: pour.diameterCm,
        waxType: pour.waxType,
        waxG: pour.waxG,
        foG: pour.foG,
        foPct: pour.foPct,
      });
    },
    [addRecipe],
  );

  const dark = screen === 'loader';

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          recipeCount={recipeCount}
          bestBurnHours={bestBurnHours}
          onStart={goGame}
          onDiary={goDiary}
          onSafety={goSafety}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen onPour={handlePour} onSave={handleSaveRecipe} onBack={goMenu} />
      ) : null}

      {screen === 'gameover' && result ? (
        <ResultScreen
          result={result}
          onMeasureAgain={goGame}
          onBurnTest={goDiary}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'diary' ? (
        <BurnDiaryScreen
          entries={entries}
          diameterCm={result ? result.diameterCm : DIAMETER.def}
          recipeName={result ? recipeNameFor(result) : 'SOY ' + cm(DIAMETER.def)}
          onSaveEntry={addEntry}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'safety' ? <SafetyNotesScreen onBack={goMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});

export default App;
