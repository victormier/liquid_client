import React, { Component } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryAccount, queryUser } from 'qql';
import { Link } from 'react-router';
import moment from 'node-moment';
import Header from 'components/common/Header';
import QueryLoading from 'components/common/QueryLoading';
import Button from 'components/common/Button';
import ErrorBar from 'components/layout/ErrorBar';
import { toCurrency } from 'utils/currencies';
import RefreshButton from '../../components/RefreshButton';
import TransactionList from '../../components/TransactionList';

const checkPolling = (props) => {
  if (!props.accountQuery.loading && !props.accountQuery.error) {
    if (props.accountQuery.account.is_refreshing) {
      props.accountQuery.startPolling(5000);
    } else {
      props.accountQuery.stopPolling();
    }
  }
};

class ShowAccount extends Component {
  componentDidMount() {
    checkPolling(this.props);
  }

  componentWillReceiveProps(newProps) {
    checkPolling(newProps);
  }

  render() {
    const { accountQuery, userQuery, params } = this.props;
    const contentIsReady = !accountQuery.loading && !accountQuery.error && accountQuery.account;

    let title = '';
    let subtitle;
    let rightButtonSecondary;
    let titleRight;
    let cachedAccount;

    if (contentIsReady) {
      if (accountQuery.account.is_refreshing) {
        subtitle = 'Syncing account...It might take 2 min.';
      } else if (accountQuery.account.is_mirror_account && accountQuery.account.last_updated) {
        subtitle = `Updated ${moment.unix(accountQuery.account.last_updated).fromNow()}`;
      }
      title = accountQuery.account.name;
      if (accountQuery.account.is_mirror_account) rightButtonSecondary = <RefreshButton accountId={accountQuery.account.id} />;
      titleRight = toCurrency(accountQuery.account.balance, accountQuery.account.currency_code);
    } else {
      cachedAccount = this.props.client.readFragment({
        id: `VirtualAccount_${params.accountId}`,
        fragment: gql`
           fragment myAccount on VirtualAccount {
             id
             name
             balance
             currency_code
             is_mirror_account
           }
         `,
      });

      if (cachedAccount) {
        title = cachedAccount.name;
        titleRight = toCurrency(cachedAccount.balance, cachedAccount.currency_code);
      }
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Header
          title={title}
          subtitle={subtitle}
          backTo="/accounts"
          rightButtonSecondary={rightButtonSecondary}
          rightButton={(userQuery.user.accounts && userQuery.user.accounts.length >= 2) && <Link to={`/transactions/new/${params.accountId}`}>
            <Button text="Transfer" color="transparent" />
          </Link>}
          titleRight={titleRight}
        />
        <Row>
          <Col xs={12}>
            { contentIsReady ?
              <TransactionList
                items={accountQuery.account.transactions}
                currencyCode={accountQuery.account.currency_code}
                accountId={accountQuery.account.id}
              /> :
              <QueryLoading error={accountQuery.error} />
            }
          </Col>
        </Row>
      </Grid>);
  }
}

ShowAccount.propTypes = {
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
  }),
  accountQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      currency_code: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          category: PropTypes.string.isRequired,
          made_on: PropTypes.number.isRequired,
          created_at: PropTypes.number.isRequired,
        })
      ),
    }),
  }),
  userQuery: PropTypes.shape({
    user: PropTypes.shape({
      total_balance: PropTypes.number,
      currency_code: PropTypes.string,
    }).isRequired,
  }),
  client: PropTypes.shape({
    readFragment: PropTypes.func.isRequired,
  }),
};

const ShowAccountWithGraphQL = compose(
  graphql(queryAccount, {
    name: 'accountQuery',
    options: ownProps => ({
      variables: { id: ownProps.params.accountId },
    }),
  }),
  graphql(queryUser, { name: 'userQuery' })
)(ShowAccount);

export default withApollo(ShowAccountWithGraphQL);
