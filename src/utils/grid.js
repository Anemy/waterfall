import {
  createColorString,
  getRandomColorCreatorMethod,
  getWhiteColor
} from './color';

import { floorRandom } from './random';

export const padding = 2;

export function createGrid(fullWidth, fullHeight, gridOptions) {
  const options = {
    defaultValue: {
      color: getWhiteColor(),
      set: false
    },
    ...gridOptions
  };

  let width = fullWidth - (padding * 2);
  let height = fullHeight - (padding * 2);

  if (width < 0) width = 0;
  if (height < 0) height = 0;

  const grid = [];

  const colorFunction = getRandomColorCreatorMethod();

  const centerX = width / 2;
  const centerY = height / 2;
  const minDistToCenter = Math.min(width, height) * ( 3 / 8);

  for (let i = 0; i < width; i++) {
    grid[i] = [];
    for (let k = 0; k < height; k++) {
      const render = // floorRandom(4) === 0 &&
        Math.floor(Math.pow(width, Math.random())) < 14 &&
        Math.floor(Math.pow(width, Math.random())) < 14 &&
        Math.floor(Math.pow(Math.abs((height / 2) - k), Math.random())) < 20 &&
        Math.floor(Math.pow(Math.abs((height / 2) - k), Math.random())) < 30;

      // const inDiamond = Math.abs((width / 2) - i) + Math.abs((height / 2) - k) < Math.min(width, height) / 2;
      // const inCircle = Math.abs((width / 2) - i) + Math.abs((height / 2) - k) < Math.min(width, height) / 2
      const distanceFromCenter = Math.sqrt(((i - centerX) * (i - centerX)) + ((k - centerY) * (k - centerY)));

      if (render && (distanceFromCenter < minDistToCenter || floorRandom(distanceFromCenter - minDistToCenter) < 3)) {
        const color = colorFunction();

        color.l -= floorRandom((i / width) * 100);

        grid[i][k] = {
          ...options.defaultValue,
          color: createColorString(color),
          size: floorRandom(10) === 0 ? Math.random() * Math.random() : Math.random() * 0.25,
          x: width - i,
          y: height - k,
          render
        };
      }
    }
  }

  return grid;
}

