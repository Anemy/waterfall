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
  static windPower = 8;
  static ploomWindPowerRatio = 0.5;
  static windGridsInX = 6;
  static windGridsInY = 6;

  static sidePaddingRatioToWidth = 0.25;

  static maxParticles = 40000;
  static minParticles = 1000;
  // 0 is no particles in ploom - 1 is all of them
  static particlesInPloomRatio = 0.6;

  static minXSpreadRatioToWidth = 0.01;
  static maxXSpreadRatioToWidth = 0.04;
  static xSpreadDeviation = 0.8;

  static ploomXSpreadRatioToNormal = 4;
  static ploomXSpreadDeviation = 0.5;

  static particlesToDrawPerCycle = 10;
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

    this.amountOfParticles = minParticles + (dropParticlesMax * seeder.random());
    this.amountOfDropParticles = this.amountOfParticles * (1 - particlesInPloomRatio);
    this.amountOfPloomParticles = this.amountOfParticles * particlesInPloomRatio;

    const padding = viewWidth * sidePaddingRatioToWidth;
    this.waterfallX = padding + ((viewWidth - padding * 2) * seeder.random());

    this.windGridSizeX = viewWidth / windGridsInX;
    this.windGridSizeY = viewHeight / windGridsInY;

    this.particlesBuilt = 0;
  }

  getNewParticles() {
    const {
      particlesToDrawPerCycle
    } = WaterfallStaticProperties;

    const newParticles = [];

    for (let i = 0; i < particlesToDrawPerCycle; i++) {
      this.particlesBuilt++;
      if (this.particlesBuilt < this.amountOfDropParticles) {
        newParticles.push(this.createParticle(this.particlesBuilt / this.amountOfDropParticles));
      } else if (this.particlesBuilt < this.amountOfParticles) {
        // Ploom
        newParticles.push(this.createPloomParticle());
      } else {
        // We done.
        return newParticles;
      }
    }

    return newParticles;
  }

  // Cycle number is -1 that means it's in the ploom
  createParticle(index) {
    const {
      xSpreadMax,
      seeder,
      windGridSizeX,
      windGridSizeY
    } = this;

    const {
      airResistance,
      randomWinResistanceChance,
      windPower,
      xSpreadDeviation
    } = WaterfallStaticProperties;

    this.particles = [];
    let x = this.waterfallX;
    x += randomNegativeLog(xSpreadMax, seeder, xSpreadDeviation);
    x += randomNegativeLog(xSpreadMax * index, seeder, xSpreadDeviation); // Slight spread as it gets closer to the bottom.

    let y = this.bottomY * index;

    // Apply the 'wind' (Perlin or Simplex noise field) to the particles.
    const offset = Math.min(this.viewWidth, this.viewHeight) * 3;

    const angle = Math.PI + (noise.simplex2(x / windGridSizeX, y / windGridSizeY) * Math.PI);
    let windPush = Math.abs(noise.simplex2((x / windGridSizeX) + offset, (y / windGridSizeY) + offset) * windPower);

    windPush = (seeder.random() > randomWinResistanceChance) ? seeder.random() * randomWinResistanceChance * windPush : windPush;
    windPush += Math.pow(Math.abs(this.waterfallX - (x + Math.cos(angle) * windPush)), airResistance / 2);

    x += Math.cos(angle) * windPush;
    y += Math.sin(angle) * windPush;

    // Apply air resistance to water particles that venture far out on the x when they're part of the drop.
    const airYPush = Math.pow(Math.abs(this.waterfallX - x), airResistance);
    y -= airYPush;

    return new Particle(x, y);
  }

  createPloomParticle() {
    const {
      xSpreadMax,
      seeder,
      windGridSizeX,
      windGridSizeY
    } = this;

    const {
      ploomWindPowerRatio,
      randomWinResistanceChance,
      windPower,
      ploomXSpreadRatioToNormal,
      ploomXSpreadDeviation
    } = WaterfallStaticProperties;

    const ploomXSpreadMax = xSpreadMax * ploomXSpreadRatioToNormal;

    let y = this.bottomY;
    y += -randomLog(this.bottomHeight * 2, seeder, 0.2);
    y += randomNegativeLog(this.bottomHeight * 0.2, seeder, 0.8);

    let x = this.waterfallX;
    x += randomNegativeLog(ploomXSpreadMax, seeder, ploomXSpreadDeviation);

    if (y > this.bottomY) {
      x += randomNegativeLog(ploomXSpreadMax, seeder, ploomXSpreadDeviation / 2);
    }

    // Apply the 'wind' (Perlin or Simplex noise field) to the particle.
    const offset = Math.min(this.viewWidth, this.viewHeight) * 3;

    const angle = Math.PI + (noise.simplex2(x / windGridSizeX, y / windGridSizeY) * Math.PI);
    let windPush = Math.abs(noise.simplex2((x / windGridSizeX) + offset, (y / windGridSizeY) + offset) * windPower);

    windPush = (seeder.random() > randomWinResistanceChance) ? seeder.random() * randomWinResistanceChance * windPush : windPush;

    windPush *= ploomWindPowerRatio;

    x += Math.cos(angle) * windPush;
    y += Math.sin(angle) * windPush;

    const newParticle = new Particle(x, y);
    newParticle.isPloom = true;
    return newParticle;
  }
}