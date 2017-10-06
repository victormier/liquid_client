import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './styles.scss';

class InsightsGraph extends Component {
  @autobind
  handleOnClick() {
    this.props.onClick(this.props.index);
  }

  render() {
    const barHeight = 300;
    const topValue = Math.abs(this.props.topValue);
    const bottomValue = Math.abs(this.props.bottomValue);

    const totalValue = this.props.topMaxValue + this.props.bottomMaxValue;
    const topHeight = (topValue / totalValue) * barHeight;
    const bottomHeight = (bottomValue / totalValue) * barHeight;

    return (
      <div className={styles.insightBarContainer}>
        <div
          onClick={this.handleOnClick}
          className={styles.barContainer}
          style={{ height: barHeight }}
          role="button"
          tabIndex={0}
        >
          <div className={styles.topBar} style={{ height: topHeight }} />
          <div className={styles.bottomBar} style={{ height: bottomHeight }} />
        </div>
        <div className={styles.label}>{this.props.label}</div>
      </div>
    );
  }
}

InsightsGraph.propTypes = {
  topValue: PropTypes.number.isRequired,
  bottomValue: PropTypes.number.isRequired,
  topMaxValue: PropTypes.number.isRequired,
  bottomMaxValue: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired,
};

export default InsightsGraph;
