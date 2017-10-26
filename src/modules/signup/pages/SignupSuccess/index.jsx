import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import Button from 'components/common/Button';
import { Link } from 'react-router';

const SignupSuccess = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row center="xs">
      <Col xs={12}>
        <h2>
          User created successfully. Please, confirm your email.
          <br />
          There&apos;s an email on the way!
        </h2>
      </Col>
      <Col xs={8} sm={4}>
        <Link to="/"><Button text="Back home" /></Link>
      </Col>
    </Row>
  </Grid>
);

export default SignupSuccess;
