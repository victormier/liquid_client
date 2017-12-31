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
    let topHeight = (topValue / totalValue) * barHeight;
    let bottomHeight = (bottomValue / totalValue) * barHeight;

    const maxHeightTop = (this.props.topMaxValue / totalValue) * barHeight;
    let top = maxHeightTop - topHeight;
    const maxHeightBottom = (this.props.bottomMaxValue / totalValue) * barHeight;
    let bottom = maxHeightBottom - bottomHeight;
    let mainClassName = this.props.selected ? `${styles.insightBarContainer} ${styles.active}` : styles.insightBarContainer;
    if (topValue === 0 && bottomValue === 0) {
      mainClassName += ` ${styles.insightBarEmptyData}`;
      top -= 3;
      bottom -= 3;
      topHeight = 3;
      bottomHeight = 3;
    }

    return (
      <div className={mainClassName}>
        <div
          onClick={this.handleOnClick}
          className={styles.barContainer}
          style={{ height: barHeight }}
          role="button"
          tabIndex={0}
        >
          <div className={styles.topBar} style={{ height: topHeight, top }} />
          <div className={styles.bottomBar} style={{ height: bottomHeight, bottom }} />
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
  selected: PropTypes.bool.isRequired,
};

export default InsightsGraph;
