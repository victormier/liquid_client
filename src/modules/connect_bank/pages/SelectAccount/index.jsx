import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllSaltedgeAccounts, selectSaltedgeAccount } from 'qql';
import ErrorBar from 'components/layout/ErrorBar';
import SpinnerBlock from 'components/common/SpinnerBlock';
import Account from 'modules/main/components/Account';
import styles from './styles.scss';

@inject('viewStore')
class SelectSaltedgeAccount extends Component {
  handleSelectAccount(saltedgeAccountId) {
    return this.props.submit(saltedgeAccountId)
        .then((newData) => {
          this.props.router.push('/accounts');
        })
        .catch(() => {
          this.props.viewStore.addError('There was a problem');
        });
  }

  render() {
    const { data } = this.props;

    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <div>Error!</div>;

    const accounts = data.all_saltedge_accounts.map(account => (
      <div
        onClick={() => { this.handleSelectAccount(account.id); }}
        key={account.id}
        className={styles.account}
      >
        <Account account={account} />
      </div>
    ));

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Row>
          <Col xs={12}>
            <h1>Select account</h1>
            {
              data.all_saltedge_accounts.length ?
                <div>{ accounts }</div> :
                <div>We couldn't find any account. Was the bank connection succesful?</div>
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
};

SelectSaltedgeAccount.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
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
