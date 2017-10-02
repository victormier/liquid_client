import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { inject } from 'mobx-react';
import gridStyles from 'styles/base/grid.scss';
import { queryAllAccounts, createTransaction } from 'qql';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import ErrorBar from 'components/layout/ErrorBar';
import TransactionForm from '../../forms/Transaction';

@inject('viewStore')
class NewTransactionStep2 extends Component {
  @autobind
  handleFormSubmit(data) {
    data.amount = parseFloat(data.amount);
    return this.props.submit(data)
      .then(() => {
        this.props.router.push('/accounts');
      })
      .catch(() => {
        this.props.viewStore.addError('There was a problem');
      });
  }

  @autobind
  handleCancel() {
    this.props.router.push('/accounts');
  }

  render() {
    const { data, params } = this.props;
    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <p>Error!</p>;

    const originAccount = _.find(data.all_accounts, ['id', params.accountId]);
    const destinationAccounts = _.without(data.all_accounts, originAccount);

    return (
      <Grid fluid className={`${gridStyles.mainGrid}`}>
        <ErrorBar />
        <GoBackArrow />
        <Row>
          <Col xs={12}>
            <TransactionForm
              onSubmit={formData => this.handleFormSubmit(formData)}
              onCancel={this.handleCancel}
              initialValues={{ originAccountId: originAccount.id }}
              originAccount={originAccount}
              accounts={destinationAccounts}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewTransactionStep2.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  submit: PropTypes.func.isRequired,
  params: PropTypes.shape({
    accountId: PropTypes.number.isRequired,
  }),
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

NewTransactionStep2.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
};

const NewTransactionStep2WithGraphql = compose(
  graphql(queryAllAccounts),
  graphql(createTransaction, {
    props: ({ mutate }) => ({
      submit: ({ originAccountId, destinationAccountId, amount }) => mutate({
        variables: { originAccountId, destinationAccountId, amount },
        refetchQueries: [
          'allAccounts',
          'account',
        ],
      }),
    }),
  })
)(NewTransactionStep2);

export default NewTransactionStep2WithGraphql;
