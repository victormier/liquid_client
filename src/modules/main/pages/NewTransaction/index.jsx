import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllAccounts } from 'qql';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import Account from '../../components/Account';
import styles from './styles.scss';

const NewTransaction = (props) => {
  const { data } = props;
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <p>Error!</p>;

  const accounts = data.all_accounts.map(account => (
    <Link to={`/transactions/new/${account.id}`} key={account.id} className={styles.account}>
      <Account account={account} />
    </Link>
  ));

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <GoBackArrow to="/accounts" />
      <Row>
        <Col xs={12}>
          <h1>Select origin account</h1>
          { accounts }
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
