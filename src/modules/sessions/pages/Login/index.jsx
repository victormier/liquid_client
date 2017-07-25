import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import { auth } from 'actions/auth';
import ErrorBar from 'components/layout/ErrorBar';
import SessionForm from '../../forms/Session';
import styles from './styles.scss';

@inject('sessionStore')
class Login extends Component {
  handleFormSubmit(data) {
    return auth(data.email, data.password, this.props.sessionStore)
            .then(() => {
              this.props.client.resetStore();
              this.props.router.push('/settings');
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
            <SessionForm onSubmit={data => this.handleFormSubmit(data)} />
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
  sessionStore: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withApollo(Login);
