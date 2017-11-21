import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { querySaltedgeProvider, createSaltedgeLogin,
         reconnectSaltedgeLogin, queryUser } from 'qql';
import GoBackArrow from 'components/common/GoBackArrow';
import ErrorBar from 'components/layout/ErrorBar';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { mixpanelEventProps, CONNECT_BANK_FIRST_STEP, CONNECT_BANK } from 'config/mixpanelEvents';
import _ from 'lodash';
import PollProviderLogin from '../../components/PollProviderLogin';
import ProviderLoginForm from '../../forms/ProviderLogin';
import styles from './styles.scss';

const initializeStateFromProps = (props) => {
  switch (props.userQuery.user.bank_connection_phase) {
    case 'needs_reconnection':
      return {
        polling: false,
        saltedgeLoginId: props.saltedgeLogin.id,
      };
    case 'login_pending': {
      const saltedgeLogin = (props.saltedgeLogin && props.saltedgeLogin.killed) ? null : props.saltedgeLogin;
      return {
        polling: true,
        saltedgeLoginId: saltedgeLogin.id,
      };
    }
    case 'login_failed':
    case 'new_login':
    default:
      return {
        polling: false,
        saltedgeLoginId: null,
      };
  }
};

@inject('viewStore',
        'mixpanel')
class NewProviderLogin extends Component {
  constructor(props) {
    super(props);
    this.state = initializeStateFromProps(props);
    this.handleConnectSuccess = this.handleConnectSuccess.bind(this);
    this.handleConnectError = this.handleConnectError.bind(this);
  }

  @autobind
  submitCredentials(data) {
    const dataParams = JSON.stringify(data);
    return this.props.userQuery.user.bank_connection_phase === 'needs_reconnection' ?
      this.submitReconnectSaltedgeLogin(dataParams) :
      this.submitCreateSaltedgeLogin(dataParams);
  }

  @autobind
  submitReconnectSaltedgeLogin(dataParams) {
    return this.props.reconnectSaltedgeLogin(this.state.saltedgeLoginId, dataParams)
            .then((newData) => {
              this.setState({
                polling: true,
                saltedgeLoginId: newData.data.reconnectSaltedgeLogin.id,
              });
            })
            .catch(() => {
              this.props.viewStore.addError('There was a problem');
            });
  }

  @autobind
  submitCreateSaltedgeLogin(dataParams) {
    return this.props.createSaltedgeLogin(this.props.saltedgeProviderQuery.saltedge_provider.id, dataParams)
            .then((newData) => {
              const inputFieldTypes = this.props.saltedgeProviderQuery.saltedge_provider.required_fields.map(f => f.nature);
              const eventProps = { ...mixpanelEventProps(CONNECT_BANK_FIRST_STEP), 'Input field types': inputFieldTypes };
              this.props.mixpanel.track(CONNECT_BANK_FIRST_STEP, { 'Input field types': inputFieldTypes });
              this.props.mixpanel.register(eventProps);
              this.props.mixpanel.people.set(eventProps);
              this.setState({
                polling: true,
                saltedgeLoginId: newData.data.createSaltedgeLogin.id,
              });
            })
            .catch(() => {
              this.props.viewStore.addError('There was a problem');
            });
  }

  @autobind
  handleFormSubmit(data) {
    const dataParams = JSON.stringify(data);
    return (this.props.userQuery.user.bank_connection_phase === 'needs_reconnection') ?
      this.submitReconnectSaltedgeLogin(dataParams) :
      this.submitCreateSaltedgeLogin(dataParams);
  }

  handleConnectError(saltedgeLogin) {
    const saltedgeLoginId = saltedgeLogin.killed ? null : saltedgeLogin.id;

    this.setState({
      polling: false,
      saltedgeLoginId,
    });
    const errorMessage = saltedgeLogin.error_message ? `There was an error: ${saltedgeLogin.error_message}. Please try again` : "We couldn't connect to your bank. Please try again.";
    this.props.viewStore.addError(errorMessage);
  }

  handleConnectSuccess() {
    const saltedgeProvider = this.props.saltedgeProviderQuery.saltedge_provider;
    const bankIdentifier = `${saltedgeProvider.name} [${saltedgeProvider.country_code}] [${saltedgeProvider.id}]`;
    const eventProps = { ...mixpanelEventProps(CONNECT_BANK), 'Connected bank': bankIdentifier };
    this.props.mixpanel.track(CONNECT_BANK);
    this.props.mixpanel.register(eventProps);
    this.props.mixpanel.people.set(eventProps);

    if (this.props.userQuery.user.bank_connection_phase === 'needs_reconnection') {
      this.props.router.push('/accounts');
    } else {
      this.props.router.push('/connect/select_account');
    }
  }

  render() {
    const { saltedgeProviderQuery, userQuery } = this.props;

    if (saltedgeProviderQuery.loading || userQuery.loading) return <SpinnerBlock />;
    if (saltedgeProviderQuery.error || userQuery.error) return <div>Error!</div>;

    if (this.state.polling) {
      return (<PollProviderLogin
        saltedgeLoginId={this.state.saltedgeLoginId}
        onConnectSuccess={this.handleConnectSuccess}
        onConnectError={this.handleConnectError}
      />);
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <GoBackArrow to="/connect/providers" />
        <Row>
          <Col xs={12}>
            <h1>
              {
                (this.props.userQuery.user.bank_connection_phase === 'needs_reconnection') ?
                  'Reconnect to your account' :
                  'Connect to your account'
              }
            </h1>
            <div className={styles.bankNameInput}>
              <FormInput
                value={saltedgeProviderQuery.saltedge_provider.name}
                type="text"
                onChange={this.onChange}
                disabled
              />
            </div>
            <ProviderLoginForm
              onSubmit={formData => this.handleFormSubmit(formData)}
              fieldsDescription={saltedgeProviderQuery.saltedge_provider.required_fields}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewProviderLogin.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  saltedgeProviderQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedge_provider: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
      required_fields: PropTypes.arrayOf(PropTypes.shape({
        nature: PropTypes.string.isRequired,
      })),
    }),
  }),
  userQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    user: PropTypes.shape({
      saltedge_login: PropTypes.shape({
        id: PropTypes.number,
      }),
      bank_connection_phase: PropTypes.string.isRequired,
    }),
  }),
  reconnectSaltedgeLogin: PropTypes.func.isRequired,
  createSaltedgeLogin: PropTypes.func.isRequired,
};

NewProviderLogin.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

const NewProviderLoginWithGraphQL = compose(
  graphql(queryUser, {
    name: 'userQuery',
    props: ({ userQuery, ownProps: { params: { saltedgeProviderId } } }) => {
      const saltedgeLogin = _.find(userQuery.user.saltedge_logins, sl => (sl.saltedge_provider.id === saltedgeProviderId));
      return { userQuery, saltedgeLogin };
    },
  }),
  graphql(querySaltedgeProvider, {
    name: 'saltedgeProviderQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.params.saltedgeProviderId,
      },
    }),
  }),
  graphql(createSaltedgeLogin, {
    name: 'createSaltedgeLoginMutation',
    props: ({ createSaltedgeLoginMutation }) => ({
      createSaltedgeLogin: (saltedgeProviderId, credentials) => createSaltedgeLoginMutation({
        variables: { saltedgeProviderId, credentials },
      }),
    }),
  }),
  graphql(reconnectSaltedgeLogin, {
    name: 'reconnectSaltedgeLoginMutation',
    props: ({ reconnectSaltedgeLoginMutation }) => ({
      reconnectSaltedgeLogin: (saltedgeLoginId, credentials) => reconnectSaltedgeLoginMutation({
        variables: { saltedgeLoginId, credentials },
      }),
    }),
  })
)(NewProviderLogin);

export default withApollo(NewProviderLoginWithGraphQL);
