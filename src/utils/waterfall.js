import MersenneTwister from 'mersennetwister';

import Particle from './particle';
import noise from './noise';

import {
  createRandomSeed,
  randomLog,
  randomNegativeLog
} from './random';

import {
  RenderProperties,
  WaterfallStaticProperties
} from './config';

export default class Waterfall {
  constructor(viewWidth, viewHeight, rndSeeder, seed) {
    const {
      windGridsInX,
      windGridsInY,

      maxTrailFollowWindAmountToWidth,

      minXSpreadRatioToWidth,
      maxXSpreadRatioToWidth,

      minParticles,
      maxParticles,
      particleAmountTrend,
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

    this.amountOfParticles = minParticles + ((particleAmountTrend > 0 ? 0 : -dropParticlesMax ) + randomLog(dropParticlesMax, seeder, particleAmountTrend));
    this.amountOfDropParticles = this.amountOfParticles * (1 - particlesInPloomRatio);
    this.amountOfPloomParticles = this.amountOfParticles * particlesInPloomRatio;

    const padding = viewWidth * sidePaddingRatioToWidth;
    this.waterfallX = padding + ((viewWidth - padding * 2) * seeder.random());

    this.windGridSizeX = viewWidth / windGridsInX;
    this.windGridSizeY = viewHeight / windGridsInY;

    this.particlesBuilt = 0;

    this.followTrailForWindAmount = (maxTrailFollowWindAmountToWidth * viewWidth) / this.amountOfDropParticles;// * (this.amountOfDropParticles / maxParticles);
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
      maxParticleSize,

      chanceOfLineParticles,
      lineDistanceToWindRatio
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

    const xMove = Math.cos(angle) * windPush;
    x += xMove;
    this.waterfallX -= (this.waterfallX - x) * followTrailForWindAmount;
    
    let yMove = Math.sin(angle) * windPush;
    // Apply air resistance to water particles that venture far out on the x.
    const airYPush = Math.pow(Math.abs(this.waterfallX - x), airResistance);

    y -= airYPush;
    y += yMove;

    if (x > 0 && x < viewWidth && y < viewHeight && y > 0) {
      // if (Math.random() > 0.99) {
      //   console.log('(Math.pow(xMove, seeder.random()) * (xMove > 0 ? 1 : -1))', xMove, (Math.pow(xMove, seeder.random()) * (xMove > 0 ? 1 : -1)));
      // }
      if (chanceOfLineParticles && seeder.random() > 1 - chanceOfLineParticles) {
        const x2 = x + (Math.pow(Math.abs(xMove), seeder.random()) * (xMove > 0 ? 1 : -1)) * lineDistanceToWindRatio;
        yMove -= airYPush / 10;
        const y2 = y + (Math.pow(Math.abs(yMove), seeder.random()) * (yMove > 0 ? 1 : -1)) * lineDistanceToWindRatio;

        if (RenderProperties.renderToSVG) {
          svg.append('line').attr('x1', x).attr('y1', y).attr('x2', x2).attr('y2', y2).style('stroke', Particle.createRandomParticleColor(seeder)).style('stroke-width', 0.5);
        } else {
          svg.strokeStyle = Particle.createRandomParticleColor(seeder);
          svg.beginPath();
          svg.moveTo(x, y);
          svg.lineTo(x2, y2);
          svg.closePath();
          svg.stroke();
        }
      } else {
        const size = minParticleSize + (seeder.random() * (maxParticleSize - minParticleSize));
        if (RenderProperties.renderToSVG) {
          svg.append('circle').attr('cx', x).attr('cy', y).attr('r', size).style('fill', Particle.createRandomParticleColor(seeder));// .style('stroke-width', 1);
        } else {
          svg.fillStyle = Particle.createRandomParticleColor(seeder);
          svg.beginPath();
          svg.arc(x, y, size, 0, 2*Math.PI);
          svg.fill();
        }
      }
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
      ploomParticleSizeRatio,

      chanceOfLineParticlesPloom,
      lineDistanceToWindRatio
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

    const xMove = Math.cos(angle) * windPush;
    x += xMove;
    const yMove = Math.sin(angle) * windPush;
    y += yMove;

    if (x > 0 && x < viewWidth && y < viewHeight && y > 0) {
      if (chanceOfLineParticlesPloom && seeder.random() > 1 - chanceOfLineParticlesPloom) {
        const x2 = x + (Math.pow(Math.abs(xMove), seeder.random()) * (xMove > 0 ? 1 : -1)) * lineDistanceToWindRatio;
        const y2 = y + (Math.pow(Math.abs(yMove), seeder.random()) * (yMove > 0 ? 1 : -1)) * lineDistanceToWindRatio;
        
        if (RenderProperties.renderToSVG) {
          svg.append('line').attr('x1', x).attr('y1', y).attr('x2', x2).attr('y2', y2).style('stroke', Particle.createRandomPloomParticleColor(seeder)).style('stroke-width', 0.5);
        } else {
          svg.strokeStyle = Particle.createRandomParticleColor(seeder);
          svg.beginPath();
          svg.moveTo(x, y);
          svg.lineTo(x2, y2);
          svg.closePath();
          svg.stroke();
        }
      } else {
        const size = ploomParticleSizeRatio * (minParticleSize + (seeder.random() * (maxParticleSize - minParticleSize)));
        if (RenderProperties.renderToSVG) {
          svg.append('circle').attr('cx', x).attr('cy', y).attr('r', size).style('fill', Particle.createRandomPloomParticleColor(seeder));// .style('stroke-width', 1);
        } else {
          svg.fillStyle = Particle.createRandomParticleColor(seeder);
          svg.beginPath();
          svg.arc(x, y, size, 0, 2 * Math.PI);
          svg.fill();
        }
      }
    }

    // const newParticle = new Particle(x, y, size);
    // newParticle.isPloom = true;
    // return newParticle;
  }
}