import React, { Component } from 'react';

class Shape extends Component {
  render() {
    const {
      color, x, y, size
    } = this.props;

    return (
      <circle
        className="water-drop"
        r={size}
        style={{
          stroke: color
        }}
        cx={x}
        cy={y}
      />
    );
  }
}

export default Shape;
