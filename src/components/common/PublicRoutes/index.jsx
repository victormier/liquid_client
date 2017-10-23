import { Component } from 'react';
import PropTypes from 'prop-types';

class PublicRoutes extends Component {
  componentWillMount() {
    if (this.props.location.pathname === '/users/reset_password') {
      this.props.route.logout();
    }
    if (this.props.route.authenticated()) {
      this.props.router.push('/accounts');
    }
  }

  render() {
    if (!this.props.route.authenticated()) {
      return this.props.children;
    }
    return null;
  }
}

PublicRoutes.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    logout: PropTypes.func.isRequired,
    authenticated: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default PublicRoutes;
