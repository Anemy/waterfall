import { floorRandom } from './random';

const hBound = 361;
const slBound = 101;

export function getWhiteColor() {
  return {
    h: 0,
    s: 0,
    l: 100
  };
}

export function getBlackColor() {
  return {
    h: 0,
    s: 0,
    l: 100
  };
}

export function getRandomColorCreatorMethod() {
  return randomColorFunctions[floorRandom(randomColorFunctions.length)];
}

export function blueOrWhiteRandomColor() {
  return floorRandom(2) === 0 ? createRandomBlueColor() : getWhiteColor();
}

export function createRandomBlueColor() {
  return {
    h: floorRandom(70, 180),
    s: floorRandom(70, 30),
    l: floorRandom(50, 20)
  };
}

export function createRandomColor() {
  return {
    h: floorRandom(hBound),
    s: floorRandom(slBound),
    l: floorRandom(slBound)
  };
}

export function createColorString(c) {
  if (c.hasOwnProperty('h')) { // hsl
    return `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
  } else if (c.hasOwnProperty('r')) { // rgb(a)
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a || 1})`;
  } else {
    // Just give them red.
    return 'rgb(255, 0, 0)';
  }
}

export const randomColorFunctions = [
  getWhiteColor,
  createRandomColor,
  createRandomBlueColor,
  blueOrWhiteRandomColor
];
