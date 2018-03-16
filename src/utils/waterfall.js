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
  static airResistance = 1.1;
  // 0 there's no chance, 1 it'll always hit.
  static randomWinResistanceChance = 0.7;
  static windPower = 12;
  // 1 it has the same windPower, 0 none
  static ploomWindPowerRatio = 0.7;
  static windGridsInX = 6;
  static windGridsInY = 6;

  static sidePaddingRatioToWidth = 0.25;

  static maxParticles = 80000;
  static minParticles = 2000;
  // 0 is no particles in ploom - 1 is all of them
  static particlesInPloomRatio = 0.5;

  static minXSpreadRatioToWidth = 0.01;
  static maxXSpreadRatioToWidth = 0.07;
  static xSpreadDeviation = 1.1;

  // Each particle in drop displacement impacts the center by it's 1/particles * this.
  // Also impacted by the size. Max particles are half as impacted.
  static mainTrailFollowWindAmount = 0.004;

  static ploomXSpreadRatioToNormal = 4;
  static ploomXSpreadDeviation = 0.6;

  static particlesToDrawPerCycle = 100;

  static minParticleSize = 0.001;
  static maxParticleSize = 0.2;

  // Times normal
  static ploomParticleSizeRatio = 2.5;
}

export default class Waterfall {
  constructor(viewWidth, viewHeight, rndSeeder, seed) {
    const {
      windGridsInX,
      windGridsInY,

      mainTrailFollowWindAmount,

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

    this.followTrailForWindAmount = mainTrailFollowWindAmount * (1 - (this.amountOfParticles / maxParticles));
  }

  createAndDrawNewParticles(svg) {
    const {
      particlesToDrawPerCycle
    } = WaterfallStaticProperties;

    // const newParticles = [];

    for (let i = 0; i < particlesToDrawPerCycle; i++) {
      this.particlesBuilt++;
      if (this.particlesBuilt < this.amountOfDropParticles) {
        // newParticles.push(this.createParticle(this.particlesBuilt / this.amountOfDropParticles));
        this.createParticle(this.particlesBuilt / this.amountOfDropParticles, svg);
      } else if (this.particlesBuilt < this.amountOfParticles) {
        // Ploom
        // newParticles.push(this.createPloomParticle());
        this.createPloomParticle(svg);
      } else {
        // We done.
        return false; // newParticles;
      }
    }

    return true;
  }

  // Cycle number is -1 that means it's in the ploom
  createParticle(index, svg) {
    const {
      viewWidth,
      viewHeight,

      amountOfDropParticles,
      amountOfParticles,
      xSpreadMax,
      seeder,
      windGridSizeX,
      windGridSizeY,
      followTrailForWindAmount
    } = this;

    const {
      airResistance,
      randomWinResistanceChance,
      windPower,
      xSpreadDeviation,

      minParticleSize,
      maxParticleSize
    } = WaterfallStaticProperties;

    this.particles = [];
    let x = this.waterfallX;
    x += randomNegativeLog(xSpreadMax, seeder, xSpreadDeviation);
    x += randomNegativeLog(xSpreadMax * index, seeder, xSpreadDeviation); // Slight spread as it gets closer to the bottom.

    let y = this.bottomY * index;

    // Apply the 'wind' (Perlin or Simplex noise field) to the particles.
    const offset = Math.min(this.viewWidth, this.viewHeight) * 10;

    const angle = Math.PI + (noise.simplex2(x / windGridSizeX, y / windGridSizeY) * Math.PI);
    let windPush = noise.simplex2((x / windGridSizeX) + offset, (y / windGridSizeY) + offset) * windPower;

    windPush = (seeder.random() > randomWinResistanceChance) ? seeder.random() * randomWinResistanceChance * windPush : windPush;
    const preXForce = x + (Math.cos(angle) * windPush);
    windPush += Math.pow(Math.abs(this.waterfallX - preXForce), airResistance / 2) * (preXForce > 0 ? 1 : -1);

    x += Math.cos(angle) * windPush;
    this.waterfallX -= (this.waterfallX - x) * ((amountOfDropParticles / amountOfParticles) * followTrailForWindAmount);
    y += Math.sin(angle) * windPush;

    // Apply air resistance to water particles that venture far out on the x.
    const airYPush = Math.pow(Math.abs(this.waterfallX - x), airResistance);
    y -= airYPush;
    const size = minParticleSize + (seeder.random() * (maxParticleSize - minParticleSize));

    if (x > 0 && x < viewWidth && y < viewHeight && y > 0) {
      svg.append('circle').attr('cx', x).attr('cy', y).attr('r', size).style('stroke', Particle.createRandomParticleColor(seeder)).style('stroke-width', 1);
    }
    // return new Particle(x, y, size);
  }

  createPloomParticle(svg) {
    const {
      xSpreadMax,
      seeder,
      windGridSizeX,
      windGridSizeY,
      viewHeight,
      viewWidth
    } = this;

    const {
      ploomWindPowerRatio,
      randomWinResistanceChance,
      windPower,
      ploomXSpreadRatioToNormal,
      ploomXSpreadDeviation,

      minParticleSize,
      maxParticleSize,
      ploomParticleSizeRatio
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

    const size = ploomParticleSizeRatio * (minParticleSize + (seeder.random() * (maxParticleSize - minParticleSize)));

    if (x > 0 && x < viewWidth && y < viewHeight && y > 0) {
      svg.append('circle').attr('cx', x).attr('cy', y).attr('r', size).style('stroke', Particle.createRandomPloomParticleColor(seeder)).style('stroke-width', 1);
    }

    // const newParticle = new Particle(x, y, size);
    // newParticle.isPloom = true;
    // return newParticle;
  }
}