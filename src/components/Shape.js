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
          stroke: color,
          fill: 'none',
          strokeWidth: 1
        }}
        cx={x}
        cy={y}
      />
    );
  }
}

export default Shape;
