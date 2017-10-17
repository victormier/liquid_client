import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { queryUser } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { inject, observer } from 'mobx-react';

@inject('sessionStore')
@observer
class PrivateRoutes extends Component {
  componentWillMount() {
    this.ensureAuthentication(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.ensureAuthentication(newProps);

    // refetch user if finished connecting
    if (this.props.location.pathname.includes('connect') &&
        !newProps.location.pathname.includes('connect')) {
      this.props.data.refetch();
      return;
    }

    if (!newProps.data.loading &&
        newProps.data.user &&
        !newProps.data.user.accounts.length &&
        !newProps.location.pathname.includes('connect') &&
        !newProps.location.pathname.includes('settings')) {
      this.props.router.push('/connect/providers');
    }
  }

  ensureAuthentication(props) {
    if (!props.sessionStore.authenticated ||
        !window.localStorage.auth_token ||
        (props.data &&
        !props.data.loading &&
        !props.data.error &&
        !props.data.user)) {
      // TODO: si hi ha error i l'error és bad login
      // deslogejar i ficar missatge
      // (s'haurà de canviar la condició de dalt per a que arribi)
      this.props.router.push('/login');
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
