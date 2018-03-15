import _ from 'lodash';
import * as d3 from 'd3';
import React, { Component } from 'react';
import './App.css';
import { createWaterfalls } from './utils/layout';

import Shapes from './components/Shapes';

const waterfallUpdateTimer = 5;

class App extends Component {
  componentWillMount() {
    this.actuallyUpdateDimensions();
  }

  componentDidMount() {
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

    if (this.particleMaker) {
      clearInterval(this.particleMaker);
      this.particleMaker = null;
      this.setState({
        particles: []
      });
      d3.select('svg').selectAll('*').remove();
    }

    this.updateDimensionsTimeout = (() => {
      this.updateDimensionsTimeout = null;

      this.actuallyUpdateDimensions();
    }, 100);
  }

  updateWaterfalls = () => {
    let newParticles = [];

    if (Date.now() - this.lastUpdate < waterfallUpdateTimer / 2) {
      return; // Let's catch up and skip this cycle.
    }

    let stillMakingParticles = 0;
    _.each(this.state.waterfalls, waterfall => {
      const newFallParticles = waterfall.getNewParticles();

      if (newFallParticles.length > 0) {
        stillMakingParticles += 1;
        newParticles = [...newParticles, ...newFallParticles];
      }
    });

    // this.setState({
    //   particles: [...this.state.particles, ...newParticles]
    // });
    const svg = d3.select('svg');
    _.each(newParticles, particle => {
      svg.append('circle').attr('cx', particle.x).attr('cy', particle.y).attr('r', 0.25).style('stroke', 'white').style('stroke-width', 1);
    });

    if (stillMakingParticles === 0) {
      console.log('done');
      clearInterval(this.particleMaker);
      this.particleMaker = null;
    }

    this.lastUpdate = Date.now();
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

    this.particleMaker = setInterval(this.updateWaterfalls, waterfallUpdateTimer);
  }

  particleMaker = null;
  updateDimensionsTimeout = null;

  render() {
    const {
      particles, width, height
    } = this.state;

    return (
      <div className="App">
        <Shapes
          shapes={particles}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default App;
