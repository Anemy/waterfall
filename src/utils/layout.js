import MersenneTwister from 'mersennetwister';

import Waterfall from './waterfall';

import {
  createRandomSeed,
  floorRandom
} from './random';

export class LayoutProperties {
  static minAmountOfWaterfalls = 7;
  static maxAmountOfWaterfalls = 7;
}

export function createWaterfalls(width, height, rndSeeder, rndSeed) {
  const {
    minAmountOfWaterfalls,
    maxAmountOfWaterfalls
  } = LayoutProperties;

  const seed = rndSeed || createRandomSeed();
  const seeder = rndSeeder || new MersenneTwister(seed);

  const waterfalls = [];
  const amountOfWaterfalls = minAmountOfWaterfalls + floorRandom(maxAmountOfWaterfalls, seeder);

  for (let i = 0; i < amountOfWaterfalls; i++) {
    const newWaterfall = new Waterfall(width, height, seeder);

    waterfalls.push(newWaterfall);
  }

  return waterfalls;
}
