import React, { Component } from 'react';
import './App.css';
import { createWaterfalls } from './utils/layout';

import Shapes from './components/Shapes';

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
      shapes: createWaterfalls(width, height),
      width,
      height
    });
  }

  render() {
    const {
      shapes, width, height
    } = this.state;

    return (
      <div className="App">
        <Shapes
          shapes={shapes}
          height={height}
          width={width}
        />
      </div>
    );
  }
}

export default App;
