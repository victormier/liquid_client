import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllAccounts } from 'qql';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import Button from 'components/common/Button';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import styles from './styles.scss';

const ListAccounts = (props) => {
  const { data } = props;
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <p>Error!</p>;

  const accounts = data.all_accounts.map(account => (
    <Link to={`/accounts/${account.id}`} key={account.id} className={styles.account}>
      <Button text={account.name} color="transparent" />
    </Link>
  ));

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Row className={styles.topNav}>
        <Col xs={6}>
          <Link to="/accounts/new">
            <Button text="+" color="transparent" shape="circle" />
          </Link>
        </Col>
        <Col xs={6} />
      </Row>
      <Row>
        <Col xs={12}>
          <h1>Your accounts</h1>
          { accounts }
        </Col>
      </Row>
    </Grid>
  );
};

ListAccounts.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    allAccounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const ListAccountsWithGraphQL = graphql(queryAllAccounts, {
  options: { fetchPolicy: 'cache-and-network' },
})(ListAccounts);

export default withApollo(ListAccountsWithGraphQL);
