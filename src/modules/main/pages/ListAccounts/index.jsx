import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllAccounts } from 'qql';
import { Link } from 'react-router';
import { withApollo } from 'react-apollo';
import Spinner from 'components/common/Spinner';
import Button from 'components/common/Button';
import baseStyles from 'styles/base/base.scss';

const ListAccounts = (props) => {
  const { data } = props;

  if (data.loading) {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Row>
          <Col className={baseStyles.marginCentered}>
            <Spinner />
          </Col>
        </Row>
      </Grid>);
  }
  if (data.error) {
    return <p>Error!</p>;
  }

  const accounts = data.all_accounts.map(account => (
    <Link to={`/accounts/${account.id}/transactions`} key={account.id}>
      <Button text="Account" color="transparent" />
    </Link>
  ));

  return (
    <Grid fluid className={gridStyles.mainGrid}>
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
      })
    ),
  }).isRequired,
};

const ListAccountsWithGraphQL = graphql(queryAllAccounts)(ListAccounts);

export default withApollo(ListAccountsWithGraphQL);
