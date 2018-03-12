const baseOffset = 0;

export function floorRandom(bound, offset = baseOffset, seeder) {
  return Math.floor(offset + (seeder.random() * bound));
}

export function randomNegative(bound, seeder) {
  return seeder.random() * bound * (seeder.random() > 0.5 ? -1 : 1);
}

export function randomNegativeLog(bound, seeder) {
  const rndNum = randomLog(bound, seeder) * (seeder.random() > 0.5 ? -1 : 1);
  return addOrSubtractOne(rndNum);
}

export function addOrSubtractOne(randomNumber) {
  return randomNumber > 0 ? randomNumber - 1 : randomNumber + 1;
}

export function randomLog(bound, seeder) {
  return (Math.pow(bound, seeder.random()));
}

export function randomFourNegativeLog(bound, seeder) {
  const rndNum = (Math.pow(bound, seeder.random() * seeder.random()))
    * (seeder.random() > 0.5 ? -1 : 1);
  return addOrSubtractOne(rndNum);
}