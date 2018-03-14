import MersenneTwister from 'mersennetwister';

import Waterfall from './waterfall';

import {
  createRandomSeed,
  floorRandom
} from './random';

export class LayoutProperties {
  static minAmountOfWaterfalls = 4;
  static maxAmountOfWaterfalls = 10;
}

// function distortWaterParticles() {

// }

export function createWaterfalls(width, height, rndSeeder, rndSeed) {
  const {
    minAmountOfWaterfalls,
    maxAmountOfWaterfalls
  } = LayoutProperties;

  const seed = rndSeed || createRandomSeed();
  const seeder = rndSeeder || new MersenneTwister(seed);

  let waterfallParticles = [];
  const amountOfWaterfalls = minAmountOfWaterfalls + floorRandom(maxAmountOfWaterfalls, seeder);

  for (let i = 0; i < amountOfWaterfalls; i++) {
    const newWaterfall = new Waterfall(width, height, seeder);

    waterfallParticles = waterfallParticles.concat(newWaterfall.particles);
  }

  // distortWaterParticles(waterfallParticles);

  return waterfallParticles;
}
