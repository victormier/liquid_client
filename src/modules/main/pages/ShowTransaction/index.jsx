import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryTransaction } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import { toCurrency } from 'utils/currencies';
import { dateFromSeconds } from 'utils/dates';
import styles from './styles.scss';

const ShowTransaction = ({ data, params }) => {
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <div>Error!</div>;

  const date = dateFromSeconds(data.transaction.made_on);

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <GoBackArrow to={`/accounts/${params.accountId}`} />
      <Row>
        <Col xs={12}>
          <h2>
            { data.transaction.virtual_account.name }
            <br />
            <small>Account</small>
          </h2>
          <hr />
          <h2>
            { data.transaction.description }
            <br />
            <small className={styles.transactionAttributeConcept}>Description</small>
          </h2>
          <h2>
            { toCurrency(data.transaction.amount, data.transaction.virtual_account.currency_code) }
            <br />
            <small className={styles.transactionAttributeConcept}>Amount</small>
          </h2>
          <h2>
            { date.toDateString() }
            <br />
            <small className={styles.transactionAttributeConcept}>Date</small>
          </h2>
        </Col>
      </Row>
    </Grid>);
};

ShowTransaction.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    transaction: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      made_on: PropTypes.number.isRequired,
      created_at: PropTypes.number.isRequired,
      account: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
  }),
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
  }),
};

const ShowTransactionWithGraphQL = graphql(queryTransaction, {
  options: ownProps => ({
    variables: {
      id: ownProps.params.transactionId,
    },
  }),
})(ShowTransaction);

export default withApollo(ShowTransactionWithGraphQL);
