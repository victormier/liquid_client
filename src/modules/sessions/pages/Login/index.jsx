import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.png';
import SessionForm from '../../forms/Session';
import styles from './styles.scss';

class Login extends Component {
  handleFormSubmit(data) {
    return this.props.submit(data)
      .then((response) => {
        console.log('success!!!');
        console.log(response);
      })
      .catch(() => this.setState({ errorText: 'There was an error while creating your post.' }));
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
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
  submit: PropTypes.func,
  // router: PropTypes.shape({
  //   push: PropTypes.func.isRequired,
  // }).isRequired,
};

export default Login;
