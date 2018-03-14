import _ from 'lodash';
import MersenneTwister from 'mersennetwister';

import Particle from './particle';
import noise from './noise';

import {
  createRandomSeed,
  randomLog,
  randomNegativeLog
} from './random';

export class WaterfallStaticProperties {
  // Logarithmic - When this is a high number than the farther the particle
  // ventures from the x axis the more it goes up!
  static airResistance = 0.7;
  // 0 there's no chance, 1 it'll always hit.
  static randomWinResistanceChance = 1;
  static windPower = 12;
  static ploomWindPowerRatio = 0.5;
  static windGridsInX = 10;
  static windGridsInY = 10;

  static sidePaddingRatioToWidth = 0.25;

  static maxParticles = 20000;
  static minParticles = 400;
  static particlesInPloomRatio = 2;

  static minXSpreadRatioToWidth = 0.01;
  static maxXSpreadRatioToWidth = 0.04;
  static xSpreadDeviation = 0.8;

  static ploomXSpreadRatioToNormal = 4;
  static ploomXSpreadDeviation = 0.5;
}

export default class Waterfall {
  constructor(viewWidth, viewHeight, rndSeeder, seed) {
    const {
      windGridsInX,
      windGridsInY,

      minXSpreadRatioToWidth,
      maxXSpreadRatioToWidth,

      minParticles,
      maxParticles,
      particlesInPloomRatio,

      sidePaddingRatioToWidth
    } = WaterfallStaticProperties;

    this.viewHeight = viewHeight;
    this.viewWidth = viewWidth;

    this.seed = seed;
    this.seeder = rndSeeder || new MersenneTwister(createRandomSeed());
    const seeder = this.seeder;

    this.xSpreadMax = viewWidth * (minXSpreadRatioToWidth + ((maxXSpreadRatioToWidth - minXSpreadRatioToWidth) * seeder.rnd()));

    this.bottomY = viewHeight - (viewHeight / 8);
    this.bottomHeight = (viewHeight - this.bottomY);

    // TODO: Add a skew to this.
    const dropParticlesMax = (maxParticles - minParticles);

    this.amountOfDropParticles = minParticles + (dropParticlesMax * seeder.random());
    this.amountOfPloomParticles = this.amountOfDropParticles * particlesInPloomRatio;

    const padding = viewWidth * sidePaddingRatioToWidth;
    this.waterfallX = padding + ((viewWidth - padding * 2) * seeder.random());

    this.windGridSizeX = viewWidth / windGridsInX;
    this.windGridSizeY = viewHeight / windGridsInY;

    this.createWaterfallParticles();
  }

  createWaterfallParticles() {
    const {
      xSpreadMax,
      seeder,
      windGridSizeX,
      windGridSizeY
    } = this;

    const {
      airResistance,
      ploomWindPowerRatio,
      randomWinResistanceChance,
      windPower,
      xSpreadDeviation,
      ploomXSpreadRatioToNormal,
      ploomXSpreadDeviation
    } = WaterfallStaticProperties;

    this.particles = [];
    for (let i = 0; i < this.amountOfDropParticles; i++) {
      const index = (i / this.amountOfDropParticles);

      let x = this.waterfallX;
      x += randomNegativeLog(xSpreadMax, seeder, xSpreadDeviation);
      x += randomNegativeLog(xSpreadMax * index, seeder, xSpreadDeviation); // Slight spread as it gets closer to the bottom.

      let y = this.bottomY * index;

      const newParticle = new Particle(x, y);

      this.particles.push(newParticle);
    }

    const ploomXSpreadMax = xSpreadMax * ploomXSpreadRatioToNormal;
    console.log('xSpreadMax', xSpreadMax, 'ploomXSpreadMax', ploomXSpreadMax);

    for (let i = 0; i < this.amountOfPloomParticles; i++) {
      let y = this.bottomY;
      y += -randomLog(this.bottomHeight, seeder);
      y += -randomLog(this.bottomHeight * 3, seeder, 1.5);
      y += -randomLog(this.bottomHeight * 4, seeder, 1.7);
      y += -randomLog(this.bottomHeight * 6, seeder, 2);
      y += randomNegativeLog(this.bottomHeight * 0.25, seeder, 1.5);

      let x = this.waterfallX;
      x += randomNegativeLog(ploomXSpreadMax, seeder, ploomXSpreadDeviation);

      const newParticle = new Particle(x, y);

      newParticle.isPloom = true;

      this.particles.push(newParticle);
    }

    // Apply the 'wind' (Perlin or Simplex noise field) to the particles.
    _.each(this.particles, particle => {
      const offset = Math.min(this.viewWidth, this.viewHeight) * 3;

      const angle = Math.PI + (noise.simplex2(particle.x / windGridSizeX, particle.y / windGridSizeY) * Math.PI);
      let windPush = Math.abs(noise.simplex2((particle.x / windGridSizeX) + offset, (particle.y / windGridSizeY) + offset) * windPower);

      windPush = (seeder.random() > randomWinResistanceChance) ? seeder.random() * randomWinResistanceChance * windPush : windPush;

      if (particle.isPloom) {
        windPush *= ploomWindPowerRatio;
      }

      particle.x += Math.cos(angle) * windPush;
      particle.y += Math.sin(angle) * windPush;

      // Apply air resistance to water particles that venture far out on the x when they're part of the drop.
      if (!particle.isPloom) {
        const airYPush = Math.pow(Math.abs(this.waterfallX - particle.x), airResistance);
        particle.y -= airYPush;
      }
    });
  }
}