import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import restFetch from 'restApi';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import ErrorBar from 'components/layout/ErrorBar';
import UserForm from '../../forms/User';
import styles from './styles.scss';

@inject('viewStore')
class Signup extends Component {
  handleFormSubmit(dataValues) {
    const { email, password, password_confirmation } = dataValues;

    return restFetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        password_confirmation,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // try to parse errors
          response.json().then((data) => {
            if (data.errors.length) {
              data.errors.forEach((message) => {
                this.props.viewStore.addError(message);
              });
            } else {
              this.props.viewStore.addError("We couldn't register the user");
            }
          });
          throw Error(response.statusText);
        } else {
          this.props.router.push('/settings');
        }
      });
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />

        <Row center="xs" className={styles.logo} >
          <Col xs>
            <img alt="Logo" src={logo} />
          </Col>
        </Row>

        <Row center="xs" className={styles.formRow} >
          <Col xs>
            <UserForm onSubmit={data => this.handleFormSubmit(data)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Signup.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Signup.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
};

export default withApollo(Signup);
