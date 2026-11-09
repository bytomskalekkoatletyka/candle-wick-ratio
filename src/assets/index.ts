/**
 * Re-export of the Codex-generated PNGs (fixed asset contract).
 * ONLY these names exist — never invent another file name.
 */

export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'), // soy wax flakes
  sprite2: require('../../assets/sprite_2.png'), // fragrance oil bottle
  sprite3: require('../../assets/sprite_3.png'), // cotton wick spool
  sprite4: require('../../assets/sprite_4.png'), // finished poured candle (Menu hero)
  sprite5: require('../../assets/sprite_5.png'), // pouring pitcher + thermometer
};

export type AssetKey = keyof typeof assets;
