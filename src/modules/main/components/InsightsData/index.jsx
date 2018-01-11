import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryInsights } from 'qql';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { toCurrency } from 'utils/currencies';
import { monthNameLongFromNumber } from 'utils/dates';
import SquareRoundedBlock from 'components/common/SquareRoundedBlock';
import { Grid, Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import Transaction from '../../components/Transaction';
import styles from './styles.scss';

const InsightsData = (props) => {
  const { data } = props;
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <p>Error!</p>;
  const currencyCode = data.insights.mirror_account.currency_code;

  return (
    <Grid>
      <Row>
        <Col xs={4}>
          <h2>
            <span className={styles.blockTitle}>Income</span>
            <br />
            <small>{monthNameLongFromNumber(props.month)}</small>
          </h2>
        </Col>
        <Col xs={8} className={baseStyles.textRight}>
          <h2>
            { toCurrency(
                data.insights.total_income,
                currencyCode)
            }
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
                    <li key={transaction.id}>
                      <Link to={{
                        pathname: `/accounts/${data.insights.mirror_account.id}/transactions/${transaction.id}`,
                        state: { backTo: window.location.pathname },
                      }}
                      >
                        <Transaction transaction={transaction} currencyCode={currencyCode} />
                      </Link>
                    </li>
                  ))
                }
              </ul> :
              <p>There&apos;s no income transactions for this month.</p>

          }
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <h2>
            <span className={styles.blockTitle}>Expenses</span>
            <br />
            <small>{monthNameLongFromNumber(props.month)}</small>
          </h2>
        </Col>
        <Col xs={8} className={baseStyles.textRight}>
          <h2>
            { toCurrency(data.insights.total_expense, currencyCode) }
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
                    <li key={categoryInsight.id}>
                      <Link to={`insights/categories/${categoryInsight.code}/${props.year}/${props.month + 1}`}>
                        <SquareRoundedBlock>
                          <Row>
                            <Col xs={6}>
                              <div className={styles.itemTitle}>{categoryInsight.name}</div>
                              <div className={styles.itemDetail}>{categoryInsight.percentage}%</div>
                            </Col>
                            <Col xs={6} className={baseStyles.textRight}>
                              <span className={styles.itemData}>
                                {
                                  toCurrency(
                                    categoryInsight.amount,
                                    currencyCode
                                  )
                                }
                              </span>
                            </Col>
                          </Row>
                        </SquareRoundedBlock>
                      </Link>
                    </li>
                  ))
                }
              </ul> :
              <p>There&apos;s no category data for this month.</p>

          }
        </Col>
      </Row>
    </Grid>
  );
};

InsightsData.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
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
          id: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          percentage: PropTypes.number.isRequired,
        })
      ),
    }),
  }).isRequired,
};

const InsightsDataWithGraphQL = graphql(queryInsights, {
  options: ownProps => ({
    fetchPolicy: 'cache-and-network',
    variables: {
      month: ownProps.month + 1,
      year: ownProps.year,
    },
  }),
})(InsightsData);

export default InsightsDataWithGraphQL;
