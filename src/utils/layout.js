import MersenneTwister from 'mersennetwister';

import Waterfall from './waterfall';

import {
  createRandomSeed
} from './random';

export class LayoutProperties {
  static minAmountOfWaterfalls = 5;
  static maxAmountOfWaterfalls = 15;
}

export function createWaterfalls(width, height, rndSeeder, rndSeed) {
  const {
    minAmountOfWaterfalls,
    maxAmountOfWaterfalls
  } = LayoutProperties;

  const seed = rndSeed || createRandomSeed();
  const seeder = rndSeeder || new MersenneTwister(seed);

  const waterfalls = [];
  const amountOfWaterfalls = minAmountOfWaterfalls + Math.round(maxAmountOfWaterfalls - minAmountOfWaterfalls, seeder.random());

  for (let i = 0; i < amountOfWaterfalls; i++) {
    const newWaterfall = new Waterfall(width, height, seeder);

    waterfalls.push(newWaterfall);
  }

  return waterfalls;
}
