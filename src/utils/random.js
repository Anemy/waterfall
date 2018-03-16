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
  if (skew && skew < 1) {
    return Math.random() * (1 + ((seeder.random() * (skew / 2)) * (seeder.random() > 0.5 ? -1 : 1)));
  }

  let random = seeder.random();

  if (skew) {
    for (let i = 0; i < skew - (skew % 1); i++) {
      random = random * seeder.random();
    }

    if (skew % 1 > 0) {
      random *= 1 + (seeder.random() * (skew % 1)) / (skew *
        (seeder.random() > 0.5 ? -1 : 1));
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
const defaultSeedRange = 65535;
export function createRandomSeed(range = defaultSeedRange) {
  const randomRange = (range === null) ? defaultSeedRange : (range || 0);

  return 1 + Math.floor(Math.random() * randomRange);
}
