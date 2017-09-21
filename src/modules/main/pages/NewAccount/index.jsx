import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { inject } from 'mobx-react';
import gridStyles from 'styles/base/grid.scss';
import { createVirtualAccount } from 'qql';
import { graphql } from 'react-apollo';
import AccountForm from '../../forms/Account';

@inject('viewStore')
class NewAccount extends Component {
  handleFormSubmit(data) {
    return this.props.submit(data)
      .then(() => {
        this.props.router.push('/accounts');
      })
      .catch(() => {
        this.props.viewStore.addError('There was a problem');
      });
  }

  render() {
    return (
      <Grid fluid className={`${gridStyles.mainGrid} ${gridStyles.emptyHeader}`}>
        <Row>
          <Col xs={12}>
            <h1>New Account</h1>
            <AccountForm onSubmit={formData => this.handleFormSubmit(formData)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewAccount.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  submit: PropTypes.func.isRequired,
};

NewAccount.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
};

const NewAccountWithGraphql = graphql(createVirtualAccount, {
  props: ({ mutate }) => ({
    submit: ({ name }) => mutate({ variables: { name } }),
  }),
})(NewAccount);

export default NewAccountWithGraphql;
