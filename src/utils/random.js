export function floorRandom(bound, seeder) {
  return Math.floor(seeder.random() * bound);
}

export function randomNegative(bound, seeder) {
  return seeder.random() * bound * (seeder.random() > 0.5 ? -1 : 1);
}

export function addOrSubtractOne(randomNumber) {
  return randomNumber > 0 ? randomNumber - 1 : randomNumber + 1;
}

export function getSkewRandom(skew, seeder) {
  let random = seeder.random();

  if (skew) {
    let skewAmount = skew < 1 ? (1 / skew) : skew;

    for (let i = 0; i < skewAmount - (skewAmount % 1); i++) {
      random = random * seeder.random();
    }

    if (skewAmount % 1 > 0) {
      random += (seeder.random() * (skewAmount % 1)) / skewAmount *
        (seeder.random() > 0.5 ? -1 : 1);
    }

    if (skew < 1) {
      random = 1 - random;
    }
  }

  return random;
}

export function randomLog(bound, seeder, skew) {
  const random = getSkewRandom(skew, seeder);
  return addOrSubtractOne(Math.pow(bound, random));
}

export function randomNegativeLog(bound, seeder, skew) {
  const random = getSkewRandom(skew, seeder);
  const rndNum = Math.pow(bound, random) * (seeder.random() > 0.5 ? -1 : 1);
  return addOrSubtractOne(rndNum);
}

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
