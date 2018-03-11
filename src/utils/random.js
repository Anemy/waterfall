const baseOffset = 0;

export function floorRandom(bound, offset = baseOffset) {
  return Math.floor(offset + (Math.random() * bound));
}
