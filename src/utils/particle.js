import { createColorString } from './color';

export default class Particle {
  static colorRange = {
    // min, range (from min)
    // h: [215, 40], // Blueish
    // h: [0, 25], // Redish
    // h: [90, 40], // Greenish
    // s: [0, 50],
    // l: [0, 50]
    h: [0, 360],
    s: [0, 10],
    l: [66, 34]
  }

  static ploomColorRange = {
    h: [0, 360],
    s: [0, 8],
    l: [90, 10]
  }

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

  static createRandomParticleColor(seeder) {
    return createColorString({
      h: Particle.colorRange.h[0] + (seeder.random() * Particle.colorRange.h[1]),
      s: Particle.colorRange.s[0] + (seeder.random() * Particle.colorRange.s[1]),
      l: Particle.colorRange.l[0] + (seeder.random() * Particle.colorRange.l[1]),
      a: 1
    });
  }

  static createRandomPloomParticleColor(seeder) {
    return createColorString({
      h: Particle.ploomColorRange.h[0] + (seeder.random() * Particle.ploomColorRange.h[1]),
      s: Particle.ploomColorRange.s[0] + (seeder.random() * Particle.ploomColorRange.s[1]),
      l: Particle.ploomColorRange.l[0] + (seeder.random() * Particle.ploomColorRange.l[1]),
      a: 1
    });
  }
}