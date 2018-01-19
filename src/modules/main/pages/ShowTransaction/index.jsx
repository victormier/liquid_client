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
import Attribute from '../../components/Attribute';
import styles from './styles.scss';

const ShowTransaction = ({ data, location, params, client }) => {
  const contentIsReady = !data.loading && !data.error && data.transaction;
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
    if (location.state && location.state.backTo) backTo = location.state.backTo;
  }

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Header
        title="Details"
        backTo={backTo}
      />
      <Row>
        {
          transaction && virtualAccount ?
            <Col xs={12}>
              <div className={styles.accountName}>
                <Attribute title={virtualAccount.name} subtitle="Account" bold />
              </div>
              <hr />
              <Attribute title={transaction.description} subtitle="Description" />
              <Attribute title={toCurrency(transaction.amount, virtualAccount.currency_code)} subtitle="Amount" />
              <Attribute title={date.toDateString()} subtitle="Date" />
              <div>
                { transaction.type === 'MirrorTransaction' &&
                  <div className={styles.attribute}>
                    <Link to={`/accounts/${params.accountId}/transactions/${params.transactionId}/category`}>
                      <div className={styles.category}>{transaction.category_name}</div>
                    </Link>
                    <div>Category</div>
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
    error: PropTypes.object,
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
