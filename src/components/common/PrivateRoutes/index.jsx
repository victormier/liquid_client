import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { queryUser } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
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

@observer
@inject('mixpanel')
class PrivateRoutes extends Component {
  componentWillMount() {
    ensureAuthentication(this.props);
  }

  componentWillReceiveProps(newProps) {
    ensureAuthentication(newProps);

    // refetch user if finished connecting
    if (this.props.location.pathname.includes('connect') &&
        !newProps.location.pathname.includes('connect')) {
      this.props.data.refetch();
      return;
    }

    if (!newProps.data.loading &&
        newProps.data.user &&
        !newProps.location.pathname.includes('connect') &&
        !newProps.location.pathname.includes('settings')) {
      switch (newProps.data.user.bank_connection_phase) {
        case 'select_account':
          this.props.router.push('/connect/select_account');
          break;
        case 'login_failed':
        case 'login_pending': {
          const saltedgeLogin = _.find(newProps.data.user.saltedge_logins, sl => (!sl.active));
          const providerId = saltedgeLogin.saltedge_provider.id;
          this.props.router.push(`/connect/providers/${providerId}`);
          break;
        }
        case 'new_login':
          this.props.router.push('/connect/providers');
          break;
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
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    user: PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.shape({
        length: PropTypes.number,
      })),
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    refetch: PropTypes.func.isRequired,
  }),
};

const PrivateRoutesWithGraphQL = graphql(queryUser, {
  skip: () => !window.localStorage.auth_token,
})(PrivateRoutes);

export default PrivateRoutesWithGraphQL;
