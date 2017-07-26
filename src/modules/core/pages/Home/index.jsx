import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router';
import Button from 'components/common/Button';
import gridStyles from 'styles/base/grid.scss';

const Home = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row bottom="xs" className={gridStyles.fullHeight}>
      <Col xs={6}>
        <Link to="/login"><Button text="Log in" color="blue" /></Link>
      </Col>
      <Col xs={6}>
        <Link to="/signup"><Button text="Sign up" color="transparent" /></Link>
      </Col>
    </Row>
  </Grid>
);

export default Home;
