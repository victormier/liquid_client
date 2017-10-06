import React from 'react';
import PropTypes from 'prop-types';
import { dateFromSeconds, monthNameShortFromNumber } from 'utils/dates';
import baseStyles from 'styles/base/base.scss';
import _ from 'lodash';
import InsightsGraph from '../../components/InsightsGraph';
import styles from './styles.scss';

const InsightsGraphBlock = (props) => {
  const { insights, selectedInsight } = props;
  const barWidth = 60;
  const barHeight = 362;
  const containerStyles = {
    width: insights.length * barWidth,
    right: -(selectedInsight * barWidth) - (barWidth / 2),
  };
  const maxIncome = _.max(insights.map(insight => (insight.total_income)));
  const maxExpense = _.max(insights.map(insight => (insight.total_expense)));

  return (
    <div className={styles.graphsMainContainer} style={{ height: barHeight }}>
      <div className={styles.graphsContainer} style={containerStyles}>
        {
          insights.slice(0).reverse().map((insight, index) =>
            (<InsightsGraph
              topValue={insight.total_income}
              bottomValue={insight.total_expense}
              topMaxValue={maxIncome}
              bottomMaxValue={maxExpense}
              label={monthNameShortFromNumber(
                      dateFromSeconds(insight.start_date).getMonth()
                    )}
              key={insight.start_date}
              index={insights.length - index - 1}
              onClick={props.onMonthSelect}
              selected={selectedInsight === (insights.length - index - 1)}
            />)
          )
        }
      </div>
      <div className={baseStyles.clear} />
    </div>
  );
};

InsightsGraphBlock.propTypes = {
  insights: PropTypes.arrayOf(
    PropTypes.shape({
      total_income: PropTypes.number.isRequired,
      total_expense: PropTypes.number.isRequired,
      start_date: PropTypes.number.isRequired,
    })
  ),
  selectedInsight: PropTypes.number.isRequired,
  onMonthSelect: PropTypes.func.isRequired,
};

export default InsightsGraphBlock;
