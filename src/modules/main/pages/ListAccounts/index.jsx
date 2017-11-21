import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllAccounts, queryAllSaltedgeLogins } from 'qql';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import Button from 'components/common/Button';
import { Grid, Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import errorStyles from 'components/layout/ErrorBar/styles.scss';
import RefreshButton from '../../components/RefreshButton';
import Account from '../../components/Account';
import Nav from '../../components/Nav';

const ListAccounts = (props) => {
  const { allAccountsQuery, saltedgeLoginsQuery } = props;
  let error;

  if (allAccountsQuery.loading) return <SpinnerBlock />;
  if (allAccountsQuery.error) return <p>Error!</p>;

  if (saltedgeLoginsQuery &&
      !saltedgeLoginsQuery.loading &&
      _.find(saltedgeLoginsQuery.all_saltedge_logins, sl => (sl.needs_reconnection))) {
    error = (
      <div className={`${errorStyles.staticErrorContainer} ${baseStyles.textCentered}`}>
        <ul className={errorStyles.errorList} >
          <li className={errorStyles.errorListItem} >! Your bank stopped responding</li>
        </ul>
      </div>
    );
  }


  const accounts = allAccountsQuery.all_accounts.map(account => (
    <Link to={`/accounts/${account.id}`} key={account.id}>
      <Account account={account} />
    </Link>
  ));

  const mirrorAccount = _.find(allAccountsQuery.all_accounts, a => a.is_mirror_account);

  return (
    <div>
      { error }
      <Grid fluid className={gridStyles.mainGrid}>
        <Row className={baseStyles.topNav}>
          <Col xs={6}>
            <Link to="/accounts/new">
              <Button text="+" color="transparent" shape="circle" />
            </Link>
          </Col>
          <Col xs={2}>
            { mirrorAccount &&
              <div className={baseStyles.floatRight}>
                <RefreshButton accountId={mirrorAccount.id} />
              </div>
            }
          </Col>
          <Col xs={4} className={baseStyles.textRight}>
            <Link to="/transactions/new">
              <Button text="Transfer" color="transparent" />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h1>Your accounts</h1>
            { accounts }
          </Col>
        </Row>
        <Nav />
      </Grid>
    </div>
  );
};

ListAccounts.propTypes = {
  allAccountsQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    all_accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  saltedgeLoginsQuery: PropTypes.shape({
    error: PropTypes.object,
    all_saltedge_logins: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        needs_reconnection: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const ListAccountsWithGraphQL = compose(
  graphql(queryAllAccounts, {
    name: 'allAccountsQuery',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  graphql(queryAllSaltedgeLogins, { name: 'saltedgeLoginsQuery' })
)(ListAccounts);

export default withApollo(ListAccountsWithGraphQL);
