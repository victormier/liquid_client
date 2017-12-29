import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllAccounts } from 'qql';
import { Link } from 'react-router';
import QueryLoading from 'components/common/QueryLoading';
import Header from 'components/common/Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import Account from '../../components/Account';
import styles from './styles.scss';

const accounts = accountsData => (
  accountsData.map(account => (
    <Link
      to={`/transactions/new/${account.id}`}
      key={account.id}
      className={styles.account}
    >
      <Account account={account} />
    </Link>
  ))
);

const NewTransaction = (props) => {
  const { data } = props;
  const contentIsReady = !data.loading && !data.error && data.all_accounts;

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Header
        title="Select origin account"
        backTo="/accounts"
      />
      <Row>
        <Col xs={12}>
          { contentIsReady ?
              accounts(data.all_accounts) :
              <QueryLoading error={data.error} />
          }
        </Col>
      </Row>
    </Grid>
  );
};

NewTransaction.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    allAccounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const NewTransactionWithGraphQL = graphql(queryAllAccounts)(NewTransaction);

export default withApollo(NewTransactionWithGraphQL);
