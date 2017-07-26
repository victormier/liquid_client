import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import Button from 'components/common/Button';
import { Link } from 'react-router';

const SignupSuccess = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row center="xs">
      <Col xs={12}>
        <h1>
          User created successfully.
          <br />
          There&apos;s an email on the way!
        </h1>
      </Col>
      <Col xs={4}>
        <Link to="/login"><Button text="Log in" /></Link>
      </Col>
    </Row>
  </Grid>
);

export default SignupSuccess;
