import { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withApollo } from 'react-apollo';

@inject('sessionStore')
class PrivateRoutes extends Component {
  componentWillMount() {
    if (!this.props.sessionStore.authenticated) {
      this.props.router.push('/login');
    }
  }

  render() {
    if (this.props.sessionStore.authenticated) {
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
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

PrivateRoutes.wrappedComponent.propTypes = {
  sessionStore: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withApollo(PrivateRoutes);
