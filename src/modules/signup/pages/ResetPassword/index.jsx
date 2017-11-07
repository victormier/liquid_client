import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import restFetch from 'restApi';
import { mixpanelDateNow } from 'utils/dates';
import { SETUP_SIGNUP_PASSWORD } from 'config/mixpanelEvents';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import ErrorBar from 'components/layout/ErrorBar';
import PasswordForm from '../../forms/Password';
import styles from './styles.scss';

@inject('viewStore',
        'userStore',
        'mixpanel')
@observer
class ResetPassword extends Component {
  componentDidMount() {
    this.props.userStore.getUserFromResetPasswordToken(
      this.props.location.query.reset_password_token,
      this.props.viewStore
    );
  }

  handleFormSubmit(dataValues) {
    const { password, password_confirmation } = dataValues;

    return restFetch(`/users/${this.props.userStore.user.id}/set_password`, {
      method: 'POST',
      body: JSON.stringify({
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
              this.props.viewStore.addError("We couldn't save the password");
            }
          });
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.props.mixpanel.identify(this.props.userStore.user.email);
        this.props.mixpanel.track(SETUP_SIGNUP_PASSWORD);
        const mixpanelProps = {
          'Last Set-up signup password': mixpanelDateNow(),
          'Previous Event Name': SETUP_SIGNUP_PASSWORD,
        };
        this.props.mixpanel.register(mixpanelProps);
        this.props.mixpanel.people.set(mixpanelProps);

        window.localStorage.setItem('auth_token', data.auth_token);
        this.props.router.push('/accounts');
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
            { this.props.userStore.user.email ?
              <PasswordForm
                onSubmit={data => this.handleFormSubmit(data)}
                initialValues={{ email: this.props.userStore.user.email }}
              /> :
              <p>Password reset token is not valid.</p>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

ResetPassword.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      reset_password_token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

ResetPassword.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    identify: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
  userStore: PropTypes.shape({
    getUserFromResetPasswordToken: PropTypes.func.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.integer,
    }).isRequired,
  }).isRequired,
};

export default withApollo(ResetPassword);
