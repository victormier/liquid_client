import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Button from 'components/common/Button';
import gridStyles from 'styles/base/grid.scss';
import { logout } from 'actions/auth';

@inject(
  'viewStore',
  'sessionStore'
)
export class Settings extends Component {
  onLogout = (e) => {
    e.preventDefault();
    logout();
    this.props.client.resetStore();
    this.props.viewStore.reset();
    this.props.sessionStore.reset();
    this.props.router.push('/');
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Row>
          <Col xs={12}>
            <h1>Settings</h1>
            <Button id="logoutButton" text="Log out" color="transparent" onClick={this.onLogout} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Settings.propTypes = {
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Settings.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    reset: PropTypes.func.isRequired,
  }).isRequired,
  sessionStore: PropTypes.shape({
    reset: PropTypes.func.isRequired,
  }).isRequired,
};

export default withApollo(Settings);
