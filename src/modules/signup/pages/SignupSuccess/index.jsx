import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import Button from 'components/common/Button';
import Header from 'components/common/Header';
import { Link } from 'react-router';

const SignupSuccess = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Header mini backTo={'/'} />
    <Row center="xs">
      <Col xs={12}>
        <br />
        <br />
        <br />
        <h3>
          User created successfully.
          <br />
          Please, confirm your email.
          <br />
          There&apos;s an email on the way!
        </h3>
        <br />
        <br />
      </Col>
      <Col xs={8} sm={4}>
        <Link to="/"><Button text="Back home" /></Link>
      </Col>
    </Row>
  </Grid>
);

export default SignupSuccess;
