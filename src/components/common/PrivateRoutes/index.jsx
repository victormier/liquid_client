import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { queryUser } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';

class PrivateRoutes extends Component {
  componentWillMount() {
    if (!this.props.route.authenticated) {
      this.props.router.push('/login');
    }
  }

  componentWillReceiveProps(newProps) {
    // direct to connect path if bank not connected
    if (!newProps.data.loading &&
        newProps.route.authenticated &&
        newProps.data.user &&
        !newProps.data.user.accounts.length &&
        !newProps.location.pathname.includes('connect') &&
        !newProps.location.pathname.includes('settings')) {
      this.props.router.push('/connect/providers');
    }
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <SpinnerBlock />;
    if (data.error) return <div>Error!</div>;

    if (this.props.route.authenticated) {
      return this.props.children;
    }
    return null;
  }
}

PrivateRoutes.propTypes = {
  // submit: PropTypes.func,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
  }),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  data: PropTypes.shape({
    user: PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.shape({
        length: PropTypes.number,
      })),
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
  }),
};

const PrivateRoutesWithGraphQL = graphql(queryUser, {
  skip: ownProps => !ownProps.route.authenticated,
})(PrivateRoutes);

export default PrivateRoutesWithGraphQL;
