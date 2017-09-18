import { Component } from 'react';
import PropTypes from 'prop-types';

class PublicRoutes extends Component {
  componentWillMount() {
    if (this.props.route.authenticated) {
      this.props.router.push('/accounts');
    }
  }

  render() {
    if (!this.props.route.authenticated) {
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
    authenticated: PropTypes.bool.isRequired,
  }),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default PublicRoutes;
