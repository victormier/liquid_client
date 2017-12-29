import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Link } from 'react-router';
import restFetch from 'restApi';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import ErrorBar from 'components/layout/ErrorBar';
import Header from 'components/common/Header';
import SessionForm from '../../forms/Session';
import styles from './styles.scss';

@inject('viewStore')
class Login extends Component {
  handleFormSubmit(data) {
    const { email, password } = data;

    return restFetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        // try to parse errors
        response.json().then((responseData) => {
          if (responseData.errors.length) {
            responseData.errors.forEach((message) => {
              this.props.viewStore.addError(message);
            });
          } else {
            this.props.viewStore.addError("We couldn't log you in");
          }
        });
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((responseData) => {
      window.localStorage.removeItem('auth_token');
      window.localStorage.setItem('auth_token', responseData.auth_token);
      this.props.client.resetStore();
      this.props.router.push('/accounts');
    });
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Header mini backTo={'/'} />

        <Row center="xs" className={styles.logo} >
          <Col xs>
            <img alt="Logo" src={logo} />
          </Col>
        </Row>

        <Row center="xs" >
          <Col xs>
            <SessionForm onSubmit={data => this.handleFormSubmit(data)} />
            <div className={styles.resetPasswordLink} >
              <Link to="/users/request_reset_password">I lost my password</Link>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Login.propTypes = {
  // submit: PropTypes.func,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
};

Login.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
    removeError: PropTypes.func.isRequired,
  }).isRequired,
};

export default withApollo(Login);
