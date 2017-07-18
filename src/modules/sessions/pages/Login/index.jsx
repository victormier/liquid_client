import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
// import PropTypes from 'prop-types';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import { auth } from 'actions/auth';
import ErrorBar from 'components/layout/ErrorBar';
import SessionForm from '../../forms/Session';
import styles from './styles.scss';

class Login extends Component {
  handleFormSubmit(data) {
    return auth(data.email, data.password);
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
            <SessionForm onSubmit={data => this.handleFormSubmit(data)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Login.propTypes = {
  // submit: PropTypes.func,
  // router: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
};

export default Login;
