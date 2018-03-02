import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllSaltedgeAccounts, selectSaltedgeAccount, queryUser } from 'qql';
import Button from 'components/common/Button';
import Header from 'components/common/Header';
import QueryLoading from 'components/common/QueryLoading';
import ErrorBar from 'components/layout/ErrorBar';
import Account from 'modules/main/components/Account';
import styles from './styles.scss';

@inject('viewStore')
class SelectSaltedgeAccount extends Component {
  onLogout = (e) => {
    e.preventDefault();
    this.props.client.resetStore();
    this.props.viewStore.reset();
    this.props.route.logout();
    this.props.router.push('/');
  }

  handleSelectAccount(saltedgeAccountId) {
    const that = this;
    return this.props.submit(saltedgeAccountId)
        .then(() => {
          that.props.client.query({
            query: queryUser,
            fetchPolicy: 'network-only',
          }).then(() => {
            that.props.router.push('/accounts');
          });
        })
        .catch(() => {
          this.props.viewStore.addError('There was a problem');
        });
  }

  render() {
    const { data } = this.props;
    const contentIsReady = !data.loading && !data.error && data.all_saltedge_accounts;
    let content;

    if (contentIsReady) {
      const accounts = data.all_saltedge_accounts.map(account => (
        <div
          onClick={() => { this.handleSelectAccount(account.id); }}
          key={account.id}
          className={styles.account}
          role="button"
          tabIndex="0"
        >
          <Account account={account} />
        </div>
      ));
      content = accounts.length ?
        <div>{ accounts }</div> :
        <div>We could not find any account. Was the bank connection succesful?</div>;
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Header
          title="Select account"
          rightButton={<Button
            id="logoutButton"
            text="Log out"
            color="transparent"
            onClick={(e) => { this.onLogout(e); }}
          />}
        />
        <Row>
          <Col xs={12}>
            {
              contentIsReady ? content : <QueryLoading error={data.error} />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

SelectSaltedgeAccount.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedge_provider: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
    }),
  }),
  submit: PropTypes.func.isRequired,
  route: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }),
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
};

SelectSaltedgeAccount.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
};

const SelectSaltedgeAccountWithGraphQL = compose(
  graphql(queryAllSaltedgeAccounts),
  graphql(selectSaltedgeAccount, {
    props: ({ mutate }) => ({
      submit: saltedgeAccountId => mutate({
        variables: { saltedgeAccountId },
      }),
    }),
  })
)(SelectSaltedgeAccount);

export default withApollo(SelectSaltedgeAccountWithGraphQL);
