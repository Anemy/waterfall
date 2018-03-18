import _ from 'lodash';
import * as d3 from 'd3';
import React, { Component } from 'react';
import './App.css';
import { createWaterfalls } from './utils/layout';

import Shapes from './components/Shapes';

const waterfallUpdateTimer = 10;

class App extends Component {
  state = {
    height: 100,
    width: 100
  }
  
  componentDidMount() {
    this.actuallyUpdateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    if (this.updateDimensionsTimeout) {
      clearTimeout(this.updateDimensionsTimeout);
      this.updateDimensionsTimeout = null;
    }

    this.updateDimensionsTimeout = (() => {
      this.updateDimensionsTimeout = null;

      this.actuallyUpdateDimensions();
    }, 100);
  }

  updateWaterfalls = () => {
    // let newParticles = [];

    // const {
    //   height, width
    // } = this.state;

    if (Date.now() - this.lastUpdate < waterfallUpdateTimer / 2) {
      this.lastUpdate = Date.now();
      return; // Let's catch up and skip this cycle.
    }

    this.lastUpdate = Date.now();

    let stillMakingParticles = 0;
    const svg = d3.select('svg');

    _.each(this.state.waterfalls, waterfall => {
      const newFallParticles = waterfall.createAndDrawNewParticles(svg);

      if (newFallParticles) {
        stillMakingParticles += 1;
      }
    });

    // this.setState({
    //   particles: [...this.state.particles, ...newParticles]
    // });
    // _.each(newParticles, particle => {
    //   svg.append('circle').attr('cx', particle.x).attr('cy', particle.y).attr('r', particle.size).style('stroke', particle.color).style('stroke-width', 1);
    // });

    if (stillMakingParticles === 0) {
      // console.log('Clear particle maker, done drawing.');
      if (this.particleMaker) {
        clearInterval(this.particleMaker);
        this.particleMaker = null;
      }
    }
  }

  actuallyUpdateDimensions() {
    let width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.setState({
      particles: [],
      waterfalls: createWaterfalls(width, height),
      width,
      height
    });

    if (this.particleMaker) {
      console.log('Clear particle maker, update dimensions.');
      clearInterval(this.particleMaker);
      this.particleMaker = null;
      this.setState({
        particles: []
      });
      d3.select('svg').selectAll('*').remove();
    }
    this.particleMaker = setInterval(this.updateWaterfalls, waterfallUpdateTimer);
  }

  updateCounter = 0;
  particleMaker = null;
  updateDimensionsTimeout = null;

  render() {
    const {
      width, height
    } = this.state;

    return (
      <div className="App">
        <svg height={height} width={width} className="waterfall-shapes"/>
        {/* <Shapes
          shapes={particles}
          height={height}
          width={width}
        /> */}
      </div>
    );
  }
}

export default App;
