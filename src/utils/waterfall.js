import MersenneTwister from 'mersennetwister';

import Particle from './particle';

import {
  randomLog,
  // randomNegativeLog,
  randomFourNegativeLog
} from './random';

// Only 10 million possible shapes right now... I think that's ok.
// We can just increase if we need more.
const defaultSeedRange = 9999999;
export function createRandomSeed(range = defaultSeedRange, existingSeed) {
  let randomRange = (range === null) ? defaultSeedRange : (range || 0);

  let seed = 1 + Math.floor(Math.random() * randomRange);

  // To avoid repeating seeds.
  if (existingSeed !== null) {
    while (seed === existingSeed && range > 2) {
      seed = 1 + Math.floor(Math.random() * randomRange);
    }
  }

  return seed;
}


export function createWaterfall(viewWidth, viewHeight, rndSeeder, rndSeed) {
  const seed = rndSeed || createRandomSeed();
  const seeder = rndSeeder || new MersenneTwister(seed);

  const bottomY = viewHeight - (viewHeight / 8);
  const bottomHeight = (viewHeight - bottomY);
  const amountOfDropParticles = 4000;
  const amountOfPloomParticles = amountOfDropParticles;

  const x = viewWidth / 2;

  const particles = [];
  for (let i = 0; i < amountOfDropParticles; i++) {
    const newParticle = new Particle(x, bottomY * (i / amountOfDropParticles));

    newParticle.x += randomFourNegativeLog(viewWidth / 30, seeder);

    particles.push(newParticle);
  }

  for (let i = 0; i < amountOfPloomParticles; i++) {
    let y = (bottomY - randomLog(viewHeight / 8, seeder));
    y += randomFourNegativeLog(bottomHeight * 0.5, seeder);
    const newParticle = new Particle(x, y);

    newParticle.x += randomFourNegativeLog(viewWidth / 8, seeder);

    particles.push(newParticle);
  }

  return particles;
}
