export class WaterfallStaticProperties {
  // Logarithmic - When this is a high number than the farther the particle
  // ventures from the x axis the more it goes up!
  static airResistance = 1.1;
  // 0 there's no chance, 1 it'll always hit.
  static randomWinResistanceChance = 0.7;
  static windPower = 14;
  // 1 it has the same windPower, 0 none
  static ploomWindPowerRatio = 0.7;
  static windGridsInX = 6;
  static windGridsInY = 6;

  static sidePaddingRatioToWidth = 0.25;

  static maxParticles = 500000;
  static minParticles = 20000;
  // Negative it's usually a max particle, higher numbers are closer to min.
  // 0 is random
  static particleAmountTrend = 0.001;
  // 0 is no particles in ploom - 1 is all of them
  static particlesInPloomRatio = 0.5;

  static minXSpreadRatioToWidth = 0.01;
  static maxXSpreadRatioToWidth = 0.07;
  static xSpreadDeviation = 1.1;

  // The trail can deviate this far over the course of it's life.
  static maxTrailFollowWindAmountToWidth = 0.01;

  static ploomXSpreadRatioToNormal = 4;
  static ploomXSpreadDeviation = 0.7;

  static particlesToDrawPerCycle = 300;

  static minParticleSize = 0.0001;
  static maxParticleSize = 0.6;

  // Times normal
  static ploomParticleSizeRatio = 1.2;

  static chanceOfLineParticles = 0.4;
  static chanceOfLineParticlesPloom = 0.3;
  static lineDistanceToWindRatio = 0.25;
}

export class RenderProperties {
  static renderToSVG = false;
}
