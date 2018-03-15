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



// function createWaterfallParticles() {
//   const {
//     xSpreadMax,
//     seeder,
//     windGridSizeX,
//     windGridSizeY
//   } = this;

//   const {
//     airResistance,
//     ploomWindPowerRatio,
//     randomWinResistanceChance,
//     windPower,
//     xSpreadDeviation,
//     ploomXSpreadRatioToNormal,
//     ploomXSpreadDeviation
//   } = WaterfallStaticProperties;

//   this.particles = [];
//   for (let i = 0; i < this.amountOfDropParticles; i++) {
//     const index = (i / this.amountOfDropParticles);

//     let x = this.waterfallX;
//     x += randomNegativeLog(xSpreadMax, seeder, xSpreadDeviation);
//     x += randomNegativeLog(xSpreadMax * index, seeder, xSpreadDeviation); // Slight spread as it gets closer to the bottom.

//     let y = this.bottomY * index;

//     const newParticle = new Particle(x, y);

//     this.particles.push(newParticle);
//   }

//   const ploomXSpreadMax = xSpreadMax * ploomXSpreadRatioToNormal;

//   for (let i = 0; i < this.amountOfPloomParticles; i++) {
//     let y = this.bottomY;
//     y += -randomLog(this.bottomHeight * 6, seeder, 2);
//     y += randomNegativeLog(this.bottomHeight * 0.25, seeder, 1.5);

//     let x = this.waterfallX;
//     x += randomNegativeLog(ploomXSpreadMax, seeder, ploomXSpreadDeviation);

//     if (y > this.bottomY) {
//       x += randomNegativeLog(ploomXSpreadMax, seeder, ploomXSpreadDeviation / 2);
//     }

//     const newParticle = new Particle(x, y);

//     newParticle.isPloom = true;

//     this.particles.push(newParticle);
//   }

//   // Apply the 'wind' (Perlin or Simplex noise field) to the particles.
//   _.each(this.particles, particle => {
//     const offset = Math.min(this.viewWidth, this.viewHeight) * 3;

//     const angle = Math.PI + (noise.simplex2(particle.x / windGridSizeX, particle.y / windGridSizeY) * Math.PI);
//     let windPush = Math.abs(noise.simplex2((particle.x / windGridSizeX) + offset, (particle.y / windGridSizeY) + offset) * windPower);

//     windPush = (seeder.random() > randomWinResistanceChance) ? seeder.random() * randomWinResistanceChance * windPush : windPush;

//     if (particle.isPloom) {
//       windPush *= ploomWindPowerRatio;
//     }

//     particle.x += Math.cos(angle) * windPush;
//     particle.y += Math.sin(angle) * windPush;

//     // Apply air resistance to water particles that venture far out on the x when they're part of the drop.
//     if (!particle.isPloom) {
//       const airYPush = Math.pow(Math.abs(this.waterfallX - particle.x), airResistance);
//       particle.y -= airYPush;
//     }
//   });
// }