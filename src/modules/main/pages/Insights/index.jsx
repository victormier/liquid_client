import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllInsights } from 'qql';
// import moment from 'moment/src/moment';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { toCurrency } from 'utils/currencies';
import { dateFromSeconds } from 'utils/dates';
import { autobind } from 'core-decorators';
import QueryLoading from 'components/common/QueryLoading';
import Nav from '../../components/Nav';
import InsightsGraphBlock from '../../components/InsightsGraphBlock';
import InsightsData from '../../components/InsightsData';
import styles from './styles.scss';

class Insights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedInsight: 0,
    };
  }

  @autobind
  handleMonthSelect(index) {
    this.setState({ selectedInsight: index });
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <p>Error!</p>;
    const contentIsReady = !data.loading && !data.error && data.all_insights;
    let selectedStartDate;

    if (contentIsReady) {
      selectedStartDate = dateFromSeconds(data.all_insights[this.state.selectedInsight].start_date);
    }

    return (
      <Grid fluid className={`${gridStyles.mainGrid} ${gridStyles.withBottomNav} ${gridStyles.basePadding}`}>
        { contentIsReady ?
          <div>
            <Row className={styles.balances} center="xs">
              <Col xs={3} className={styles.mainStats}>
                <div className={styles.amountTitle}>Current balance</div>
                <div className={styles.amountData}>
                  {toCurrency(data.all_insights[this.state.selectedInsight].total_balance, data.all_insights[this.state.selectedInsight].mirror_account.currency_code)}
                </div>
              </Col>
              <Col xs={3} className={styles.totalIncome}>
                <div className={styles.amountTitle}>Income</div>
                <div className={styles.amountData}>
                  {toCurrency(data.all_insights[this.state.selectedInsight].total_income, data.all_insights[this.state.selectedInsight].mirror_account.currency_code)}
                </div>
              </Col>
              <Col xs={3} className={styles.totalExpense}>
                <div className={styles.amountTitle}>Expenses</div>
                <div className={styles.amountData}>
                  {toCurrency(data.all_insights[this.state.selectedInsight].total_expense, data.all_insights[this.state.selectedInsight].mirror_account.currency_code)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <InsightsGraphBlock
                  insights={data.all_insights}
                  selectedInsight={this.state.selectedInsight}
                  onMonthSelect={this.handleMonthSelect}
                />
              </Col>
            </Row>

            <InsightsData
              month={selectedStartDate.getMonth()}
              year={selectedStartDate.getFullYear()}
            />
          </div> :
          <QueryLoading error={data.error} />
        }

        <Nav />
      </Grid>
    );
  }
}

Insights.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    all_insights: PropTypes.arrayOf(
      PropTypes.shape({
        start_date: PropTypes.number.isRequired,
        end_date: PropTypes.number.isRequired,
        total_income: PropTypes.number.isRequired,
        total_expense: PropTypes.number.isRequired,
        mirror_account: PropTypes.shape({
          currency_code: PropTypes.string.isRequired,
        }),
      })
    ),
  }).isRequired,
};

const InsightsWithGraphQL = graphql(queryAllInsights)(Insights);

export default withApollo(InsightsWithGraphQL);
