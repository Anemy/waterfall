import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Shape from './Shape';

class Grid extends Component {
  static propTypes = {
    grid: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = { };

  renderGridRow(row, rowIndex) {
    return _.map(row, (col, colIndex) => {
      if (col && col.render) {
        return (
          <Shape
            colIndex={colIndex}
            data={col}
            key={`${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
          />
        );
      }
    });
  }

  renderGridRows() {
    return _.map(this.props.grid, this.renderGridRow.bind(this));
  }

  // TODO: We can make a set interval to build the grid overtime here. mount or update created/killed.

  render() {
    const {
      width, height
    } = this.props;

    return (
      <svg
        className="footpath-grid"
        height={height}
        style={{
          backgroundColor: 'rgba(55, 55, 55, 1)'
        }}
        width={width}
      >
        {this.renderGridRows()}
      </svg>
    );
  }
}

export default Grid;
