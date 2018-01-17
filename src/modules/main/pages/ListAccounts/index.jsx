import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryAllAccounts, queryAllSaltedgeLogins, queryUser } from 'qql';
import { Link } from 'react-router';
import { Grid } from 'react-flexbox-grid';
import { toCurrency } from 'utils/currencies';
import _ from 'lodash';
import moment from 'node-moment';
import Button from 'components/common/Button';
import QueryLoading from 'components/common/QueryLoading';
import Header from 'components/common/Header';
import errorStyles from 'components/layout/ErrorBar/styles.scss';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import RefreshButton from '../../components/RefreshButton';
import Account from '../../components/Account';
import Nav from '../../components/Nav';

const ListAccounts = (props) => {
  const { allAccountsQuery, saltedgeLoginsQuery, userQuery } = props;
  const contentIsReady = (!allAccountsQuery.loading && !allAccountsQuery.error) || allAccountsQuery.all_accounts;
  let error;
  let accounts;
  let mirrorAccount;
  let subtitle;
  let totalBalance;

  if (contentIsReady) {
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

    accounts = allAccountsQuery.all_accounts.map(account => (
      <Link to={`/accounts/${account.id}`} key={account.id}>
        <Account account={account} />
      </Link>
    ));

    mirrorAccount = _.find(allAccountsQuery.all_accounts, a => a.is_mirror_account);

    if (mirrorAccount) {
      if (mirrorAccount.is_refreshing) {
        subtitle = 'Syncing account...It might take 2 min.';
      } else if (mirrorAccount.last_updated) {
        subtitle = `Updated ${moment.unix(mirrorAccount.last_updated).fromNow()}`;
      }
    }

    if (userQuery.user.currency_code) {
      totalBalance = toCurrency(userQuery.user.total_balance, userQuery.user.currency_code);
    }
  }

  return (
    <div>
      { error }
      <Grid fluid className={gridStyles.mainGrid}>
        <Header
          title="Accounts"
          subtitle={subtitle}
          titleRight={totalBalance}
          leftButton={<Link to="/accounts/new">
            <Button text="+" color="transparent" shape="circle" />
          </Link>}
          rightButton={(contentIsReady && allAccountsQuery.all_accounts.length >= 2) && <Link to="/transactions/new">
            <Button text="Transfer" color="transparent" />
          </Link>}
          rightButtonSecondary={
            (contentIsReady && mirrorAccount) ? <RefreshButton accountId={mirrorAccount.id} /> : null
          }
        />
        { contentIsReady ?
            accounts :
            <QueryLoading
              error={allAccountsQuery.error}
            />
        }
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
  userQuery: PropTypes.shape({
    user: PropTypes.shape({
      total_balance: PropTypes.number,
      currency_code: PropTypes.string,
    }).isRequired,
  }),
};

const ListAccountsWithGraphQL = compose(
  graphql(queryAllAccounts, {
    name: 'allAccountsQuery',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  graphql(queryUser, { name: 'userQuery' }),
  graphql(queryAllSaltedgeLogins, { name: 'saltedgeLoginsQuery' })
)(ListAccounts);

export default withApollo(ListAccountsWithGraphQL);
