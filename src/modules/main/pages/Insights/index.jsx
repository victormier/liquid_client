import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryInsights } from 'qql';
// import moment from 'moment/src/moment';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import { toCurrency } from 'utils/currencies';
import { monthNameLongFromNumber, dateFromSeconds } from 'utils/dates';
import SquareRoundedBlock from 'components/common/SquareRoundedBlock';
import Nav from '../../components/Nav';
import styles from './styles.scss';

const Insights = (props) => {
  const { data } = props;
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <p>Error!</p>;

  return (
    <Grid fluid className={`${gridStyles.mainGrid} ${gridStyles.withBottomNav}`}>
      <Row>
        <Col xs={8}>
          <h2>
            Income
            <br />
            <small>{monthNameLongFromNumber((new Date()).getMonth())}</small>
          </h2>
        </Col>
        <Col xs={4} className={baseStyles.textRight}>
          <h2>
            { toCurrency(data.insights.total_income, data.insights.mirror_account.currency_code) }
          </h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {
            data.insights.income_transactions.length ?
              <ul className={styles.blockList}>
                {
                  data.insights.income_transactions.map(transaction => (
                    <li>
                      <SquareRoundedBlock>
                        <Grid>
                          <Row>
                            <Col xs={6}>
                              <div className={styles.itemTitle}>{transaction.description}</div>
                              <div className={styles.itemDetail}>{`${dateFromSeconds(transaction.made_on).getDay() + 1}/${dateFromSeconds(transaction.made_on).getMonth() + 1}`}</div>
                            </Col>
                            <Col xs={6} className={baseStyles.textRight}>
                              <span className={styles.itemData}>
                                {toCurrency(transaction.amount, data.insights.mirror_account.currency_code)}
                              </span>
                            </Col>
                          </Row>
                        </Grid>
                      </SquareRoundedBlock>
                    </li>
                  ))
                }
              </ul> :
              <p>There&apos;s no income transactions for this month.</p>

          }
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <h2>
            Expenses
            <br />
            <small>{monthNameLongFromNumber((new Date()).getMonth())}</small>
          </h2>
        </Col>
        <Col xs={4} className={baseStyles.textRight}>
          <h2>
            { toCurrency(data.insights.total_expense, data.insights.mirror_account.currency_code) }
          </h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {
            data.insights.category_insights.length ?
              <ul className={styles.blockList}>
                {
                  data.insights.category_insights.map(categoryInsight => (
                    <li>
                      <SquareRoundedBlock>
                        <Grid>
                          <Row>
                            <Col xs={6}>
                              <div className={styles.itemTitle}>{categoryInsight.name}</div>
                              <div className={styles.itemDetail}>{categoryInsight.percentage}%</div>
                            </Col>
                            <Col xs={6} className={baseStyles.textRight}>
                              <span className={styles.itemData}>
                                {toCurrency(categoryInsight.amount, data.insights.mirror_account.currency_code)}
                              </span>
                            </Col>
                          </Row>
                        </Grid>
                      </SquareRoundedBlock>
                    </li>
                  ))
                }
              </ul> :
              <p>There&apos;s no category data for this month.</p>

          }
        </Col>
      </Row>
      <Nav />
    </Grid>
  );
};

Insights.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    insights: PropTypes.shape({
      mirror_account: PropTypes.shape({
        id: PropTypes.string.isRequired,
        currency_code: PropTypes.string.isRequired,
      }),
      income_transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired,
          made_on: PropTypes.number.isRequired,
        })
      ),
      total_income: PropTypes.number.isRequired,
      category_insights: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          percentage: PropTypes.number.isRequired,
        })
      ),
    }),
  }).isRequired,
};

const InsightsWithGraphQL = graphql(queryInsights, {
  options: () => ({
    fetchPolicy: 'cache-and-network',
    variables: {
      month: (new Date()).getMonth(),
      year: (new Date()).getFullYear(),
    },
  }),
})(Insights);

export default withApollo(InsightsWithGraphQL);
