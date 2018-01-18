import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import restFetch from 'restApi';
import { mixpanelEventProps, SETUP_SIGNUP_PASSWORD, VIEW_SIGNUP_PASSWORD_PAGE } from 'config/mixpanelEvents';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import logo from 'assets/images/logo.svg';
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

  componentWillUpdate(newProps) {
    if (newProps.userStore.user.email) {
      this.props.mixpanel.identify(newProps.userStore.user.email);
      this.props.mixpanel.track(VIEW_SIGNUP_PASSWORD_PAGE);
      this.props.mixpanel.register(mixpanelEventProps(VIEW_SIGNUP_PASSWORD_PAGE));
      this.props.mixpanel.people.set(mixpanelEventProps(VIEW_SIGNUP_PASSWORD_PAGE));
    }
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
        this.props.mixpanel.track(SETUP_SIGNUP_PASSWORD);
        this.props.mixpanel.register(mixpanelEventProps(SETUP_SIGNUP_PASSWORD));
        this.props.mixpanel.people.set(mixpanelEventProps(SETUP_SIGNUP_PASSWORD));

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
              <div>
                <div className={baseStyles.baseMarginBottom}>
                  <PasswordForm
                    onSubmit={data => this.handleFormSubmit(data)}
                    initialValues={{ email: this.props.userStore.user.email }}
                  />
                </div>
                {
                   this.props.userStore.isNewUser &&
                   <Row center="xs" className={baseStyles.baseMarginBottom}>
                     <Col xs={6} className={styles.legalText}>
                        By signing up, you agree to the <a href="/terms_of_service" target="_blank">Terms of Service</a> and <a href="/privacy_policy" target="_blank">Privacy Policy</a>, and <a href="https://www.saltedge.com/pages/end_user_license_terms" target="_blank" rel="noreferrer noopener">those of our providers</a>.
                     </Col>
                   </Row>
                }
              </div> :
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
    isNewUser: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withApollo(ResetPassword);
