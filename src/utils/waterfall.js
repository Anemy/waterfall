import MersenneTwister from 'mersennetwister';

import Particle from './particle';

import {
  createRandomSeed,
  randomLog,
  randomNegativeLog,
  randomNegative
} from './random';

export class WaterfallStaticProperties {
  static sidePaddingRatioToWidth = 0.25;

  static maxParticles = 1000;
  static minParticles = 500;
  static particlesInPloomRatio = 2;
  // When less than one, there are more small particle amounts.
  // When greater than one there are more large particle amounts.
  static particlesRandomAmountSkew = 1;

  static minBaseXSpreadRatioToWidth = 0.003;
  static maxBaseXSpreadRatioToWidth = 0.01;

  static minAmountOfAirIntervals = 10;
  static maxAmountOfAirIntervals = 20;
}

export default class Waterfall {
  constructor(viewWidth, viewHeight, rndSeeder) {
    const {
      minBaseXSpreadRatioToWidth,
      maxBaseXSpreadRatioToWidth,

      minParticles,
      maxParticles,
      particlesInPloomRatio,
      particlesRandomAmountSkew,

      sidePaddingRatioToWidth,

      minAmountOfAirIntervals,
      maxAmountOfAirIntervals
    } = WaterfallStaticProperties;

    this.seeder = rndSeeder || new MersenneTwister(createRandomSeed());
    const seeder = this.seeder;

    this.xBaseSpread = viewWidth * (minBaseXSpreadRatioToWidth + ((maxBaseXSpreadRatioToWidth - minBaseXSpreadRatioToWidth) * seeder.rnd()));
    this.yAirPush = viewHeight / 50;

    this.bottomY = viewHeight - (viewHeight / 8);
    this.bottomHeight = (viewHeight - this.bottomY);

    let dropParticlesMax = (maxParticles - minParticles);
    if (particlesRandomAmountSkew !== 1) {
      dropParticlesMax = randomLog(dropParticlesMax, seeder, particlesRandomAmountSkew);
    }
    this.amountOfDropParticles = minParticles + (dropParticlesMax * seeder.random());
    this.amountOfPloomParticles = this.amountOfDropParticles * particlesInPloomRatio;

    const padding = viewWidth * sidePaddingRatioToWidth;
    this.waterfallX = padding + ((viewWidth - padding * 2) * seeder.random());

    this.amountOfAirIntervals = minAmountOfAirIntervals + (seeder.random() * (maxAmountOfAirIntervals - minAmountOfAirIntervals));

    this.createWaterfallParticles();
  }

  createWaterfallParticles() {
    const {
      amountOfAirIntervals,
      xBaseSpread,
      yAirPush,
      seeder
    } = this;

    this.particles = [];
    let currentWaveStrength = seeder.random();
    let currentAirXDirection = randomNegative(1, seeder);
    let lastSinInterval;
    for (let i = 0; i < this.amountOfDropParticles; i++) {
      const index = (i / this.amountOfDropParticles);
      const sinInterval = Math.sin(index * amountOfAirIntervals * Math.PI * 2);

      let x = this.waterfallX;
      const airXSpread = (Math.pow(xBaseSpread * 2, -sinInterval)) * currentWaveStrength;
      x += randomNegative(xBaseSpread, seeder);
      x += randomNegativeLog(xBaseSpread * index, seeder); // spread as it gets closer to the bottom.
      x += randomNegativeLog(xBaseSpread, seeder);
      x += randomNegativeLog(xBaseSpread * 2, seeder, 4);
      x += randomNegativeLog(airXSpread * 2, seeder, (1 - seeder.random()) / 2);
      x += currentAirXDirection * randomLog(airXSpread * 2, seeder, (1 - seeder.random()) / 2);

      let y = this.bottomY * index;
      y += randomNegativeLog(xBaseSpread, seeder, 2);
      y += randomNegativeLog(xBaseSpread, seeder, 2);
      const airPush = randomLog(yAirPush * currentWaveStrength + (Math.abs(this.waterfallX - x) * 6), seeder);

      y += airPush * sinInterval;

      const newParticle = new Particle(x, y);

      this.particles.push(newParticle);

      if (sinInterval > 0 && lastSinInterval < 0) {
        currentWaveStrength = seeder.random();
        currentAirXDirection = randomNegative(1, seeder);
      }
      lastSinInterval = sinInterval;
    }

    for (let i = 0; i < this.amountOfPloomParticles; i++) {
      let y = this.bottomY;
      y += -randomLog(this.bottomHeight, seeder);
      y += -randomLog(this.bottomHeight * 3, seeder, 1.5);
      y += -randomLog(this.bottomHeight * 4, seeder, 2.2);
      y += -randomLog(this.bottomHeight * 10, seeder, 3);
      y += randomNegativeLog(this.bottomHeight * 0.25, seeder, 1.5);

      let x = this.waterfallX;
      x += randomNegative(xBaseSpread * 5, seeder);
      x += randomNegativeLog(xBaseSpread * 10, seeder);
      x += randomNegativeLog(xBaseSpread * 12, seeder);
      x += randomNegativeLog(xBaseSpread * 20, seeder, 2);
      x += randomNegativeLog(xBaseSpread * 30, seeder, 2);
      x += randomNegativeLog(xBaseSpread * 40, seeder, 2);
      x += randomNegativeLog(xBaseSpread * 80, seeder, 2);

      const newParticle = new Particle(x, y);

      newParticle.isPloom = true;

      this.particles.push(newParticle);
    }
  }
}