// import noise from './noise';

export default class NoiseField {
  constructor(width, height, smoothSize) {
    this.width = width;
    this.height = height;
    this.smoothSize = smoothSize;

    this.grid = [];

    for (let i = 0; i < Math.ceil(width / smoothSize); i++) {
      //
    }
  }
}

// const field = new NoiseField(1000, 1000, 50);
// console.log('example noise field:', field);