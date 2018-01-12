import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withApollo } from 'react-apollo';
import restFetch from 'restApi';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.svg';
import GoBackArrow from 'components/common/GoBackArrow';
import ResetPasswordForm from '../../forms/ResetPassword';
import styles from './styles.scss';

class RequestResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { resetPasswordRequested: false };
  }

  handleFormSubmit(dataValues) {
    const { email } = dataValues;
    const that = this;

    return restFetch('/users/request_reset_password', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    })
      .then(() => {
        that.setState({ resetPasswordRequested: true });
      });
  }

  render() {
    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <GoBackArrow />

        <Row center="xs" className={styles.logo} >
          <Col xs>
            <img alt="Logo" src={logo} />
          </Col>
        </Row>

        <Row center="xs" >
          <Col xs>
            { this.state.resetPasswordRequested ?
              <p>
                Your request has been submited.
                You will receive an email soon.
              </p> :
              <ResetPasswordForm
                onSubmit={data => this.handleFormSubmit(data)}
              />
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withApollo(RequestResetPassword);
