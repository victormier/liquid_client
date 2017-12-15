import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryTransaction, transactionFieldsFragment, virtualAccountFieldsFragment } from 'qql';
import { toCurrency } from 'utils/currencies';
import { dateFromSeconds } from 'utils/dates';
import Header from 'components/common/Header';
import QueryLoading from 'components/common/QueryLoading';
import styles from './styles.scss';

const ShowTransaction = ({ data, location, params, client }) => {
  const contentIsReady = !data.loading && !data.error && data.transaction;

  let title = 'Account';
  let backTo = `/accounts/${params.accountId}`;
  let date;

  const cachedTransaction = client.readFragment({
    id: `Transaction_${params.transactionId}`,
    fragment: transactionFieldsFragment,
  });
  const transaction = contentIsReady ? data.transaction : cachedTransaction;
  const cachedVirtualAccount = client.readFragment({
    id: `VirtualAccount_${params.accountId}`,
    fragment: virtualAccountFieldsFragment,
  });
  const virtualAccount = contentIsReady ? data.transaction.virtual_account : cachedVirtualAccount;

  if (transaction) {
    date = dateFromSeconds(transaction.made_on);
    backTo = (location.state && location.state.backTo) ? location.state.backTo : `/accounts/${params.accountId}`;
  }
  if (virtualAccount) {
    title = virtualAccount.name;
  }

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Header
        title={title}
        backTo={backTo}
        subtitle="Account"
      />
      <Row>
        {
          transaction && virtualAccount ?
            <Col xs={12}>
              <h2>
                { transaction.description }
                <br />
                <small className={styles.transactionAttributeConcept}>
                  Description
                </small>
              </h2>
              <h2>
                { toCurrency(transaction.amount, virtualAccount.currency_code) }
                <br />
                <small className={styles.transactionAttributeConcept}>Amount</small>
              </h2>
              <h2>
                { date.toDateString() }
                <br />
                <small className={styles.transactionAttributeConcept}>Date</small>
              </h2>
              <div>
                { transaction.type === 'MirrorTransaction' &&
                <div>
                  <Link to={`/accounts/${params.accountId}/transactions/${params.transactionId}/category`}>
                    <div className={styles.category}>{transaction.category_name}</div>
                  </Link>
                  <small className={styles.transactionAttributeConcept}>
                    Category
                  </small>
                </div>
                }
              </div>
            </Col> :
            <QueryLoading error={data.error} />
        }
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
      category_name: PropTypes.string.isRequired,
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
  location: PropTypes.shape({
    state: PropTypes.shape({
      backTo: PropTypes.string,
    }),
  }),
  client: PropTypes.shape({
    readFragment: PropTypes.func.isRequired,
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
