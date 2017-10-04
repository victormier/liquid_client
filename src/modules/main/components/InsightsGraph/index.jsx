import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class InsightsGraph extends Component {
  render() {
    const barHeight = 300;
    const topValue = Math.abs(this.props.topValue);
    const bottomValue = Math.abs(this.props.bottomValue);
    const totalValue = topValue + bottomValue;
    const topHeight = (topValue / totalValue) * barHeight;
    const bottomHeight = (bottomValue / totalValue) * barHeight;

    return (
      <div className={styles.insightBarContainer}>
        <div className={styles.barContainer} style={{ height: barHeight }}>
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
  label: PropTypes.string.isRequired,
};

export default InsightsGraph;
