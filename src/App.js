import React, { Component } from 'react';
import './App.css';
import { createGrid } from './utils/grid';

import Grid from './components/Grid';

class App extends Component {
  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.setState({
      grid: createGrid(width, height),
      width,
      height
    });
  }

  render() {
    const {
      grid, width, height
    } = this.state;

    return (
      <div className="App">
        {/* <h2>{width} x {height}</h2> */}
        <Grid
          grid={grid}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default App;
