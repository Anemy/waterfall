import { createColorString } from './color';

export default class Line {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = .25;
    this.color = createColorString({
      h: 40,
      s: 5,
      l: 88,
      a: 1
    });

    this.render = true;
  }
}