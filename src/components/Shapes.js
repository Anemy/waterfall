import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Shape from './Shape';

class Shapes extends Component {
  static propTypes = {
    shapes: PropTypes.array.isRequired
  }

  renderShapes() {
    // console.log('render', this.props.shapes);

    return _.map(this.props.shapes, (shape, index) => {
      if (shape && shape.render) {
        return (
          <Shape
            index={index}
            key={index}
            {...shape}
          />
        );
      }
    });
  }

  render() {
    const {
      width, height
    } = this.props;

    return (
      <svg
        className="waterfall-shapes"
        height={height}
        width={width}
      >
        <defs>
        <filter id="white-glow">
          <feFlood result="flood" floodColor="#ffffff" floodOpacity="1"></feFlood>
          <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
          <feMorphology in="mask" result="dilated" operator="dilate" radius="5"></feMorphology>
          <feGaussianBlur in="dilated" result="blurred" stdDeviation="5"></feGaussianBlur>
          <feMerge>
              <feMergeNode in="blurred"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        </defs>
        {this.renderShapes()}
      </svg>
    );
  }
}

export default Shapes;
