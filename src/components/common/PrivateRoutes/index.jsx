import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { queryUser } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import conditionalRoutePush from 'utils/routing';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

const ensureAuthentication = (props) => {
  if (!props.route.authenticated() ||
      !window.localStorage.auth_token ||
      (props.data &&
      !props.data.loading &&
      !props.data.error &&
      !props.data.user)) {
    // TODO: si hi ha error i l'error és bad login
    // deslogejar i ficar missatge
    // (s'haurà de canviar la condició de dalt per a que arribi)
    window.location.replace('/login');
  } else if (props.data.user) {
    props.mixpanel.identify(props.data.user.email);
  }
};

// this paths are always accessible
const ALWAYS_ACCESSIBLE_PRIVATE_PATHS = [
  '/settings',
];

@inject('mixpanel') @observer
class PrivateRoutes extends Component {
  componentWillMount() {
    ensureAuthentication(this.props);
  }

  componentWillReceiveProps(newProps) {
    ensureAuthentication(newProps);
    const { location: { pathname }, data, router } = newProps;
    const { user } = data;
    const contentIsReady = !data.loading && data.user;

    // forced redirections
    if (contentIsReady && !ALWAYS_ACCESSIBLE_PRIVATE_PATHS.includes(pathname)) {
      switch (user.bank_connection_phase) {
        case 'new_login':
          if (!pathname.includes('/connect/providers')) {
            conditionalRoutePush(router, '/connect/providers');
          }
          break;
        case 'interactive': {
          const saltedgeLogin = _.find(user.saltedge_logins, sl => (sl.interactive_session_active));
          const providerId = saltedgeLogin.saltedge_provider.id;
          conditionalRoutePush(router, `/connect/providers/${providerId}/logins/${saltedgeLogin.id}/interactive`);
          break;
        }
        case 'login_failed':
        case 'login_pending': {
          if (!pathname.includes('/connect/providers') || pathname.includes('interactive')) {
            const saltedgeLogin = _.find(newProps.data.user.saltedge_logins, sl => (!sl.active));
            const providerId = saltedgeLogin.saltedge_provider.id;
            conditionalRoutePush(router, `/connect/providers/${providerId}`);
          }
          break;
        }
        case 'select_account':
          conditionalRoutePush(router, '/connect/select_account');
          break;
        case 'needs_reconnection':
        case 'connected':
        default:
          break;
      }
    }
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <div>Error!</div>;

    return this.props.children;
  }
}

PrivateRoutes.propTypes = {
  // submit: PropTypes.func,
  // router: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  // location: PropTypes.shape({
  //   pathname: PropTypes.string.isRequired,
  // }),
  data: PropTypes.shape({
    user: PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.shape({
        length: PropTypes.number,
      })),
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    refetch: PropTypes.func.isRequired,
  }),
};

const PrivateRoutesWithGraphQL = graphql(queryUser, {
  skip: () => !window.localStorage.auth_token,
})(PrivateRoutes);

export default PrivateRoutesWithGraphQL;
