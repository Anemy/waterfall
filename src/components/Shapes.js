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
        style={{
          backgroundColor: 'rgba(38, 35, 36, 1)'
        }}
        width={width}
      >
        {this.renderShapes()}
      </svg>
    );
  }
}

export default Shapes;
