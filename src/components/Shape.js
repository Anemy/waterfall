import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Shape extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  static defaultProps = { };

  render() {
    const {
      color, x, y, size
    } = this.props.data;

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
