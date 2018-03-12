import React, { Component } from 'react';

class Shape extends Component {
  render() {
    const {
      color, x, y, size
    } = this.props;

    return (
      <circle
        r={size}
        style={{
          fill: 'none',
          strokeWidth: 1,
          stroke: color
        }}
        cx={x}
        cy={y}
      />
    );
  }
}

export default Shape;
