import { createColorString } from './color';

export default class Particle {
  static color = createColorString({
    h: 40,
    s: 5,
    l: 88,
    a: 1
  });

  constructor(x, y, size) {
    this.x = x;
    this.y = y;

    this.size = size;
    this.color = createColorString({
      h: 40,
      s: 5,
      l: 88,
      a: 1
    });

    this.render = true;
  }
}