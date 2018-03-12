export default class Line {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = 0.01;
    this.color = 'white';

    this.render = true;
  }
}