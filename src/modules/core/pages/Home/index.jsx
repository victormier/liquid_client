import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Button from 'components/common/Button';
import gridStyles from 'styles/base/grid.scss';


const Home = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row bottom="xs" className={gridStyles.fullHeight}>
      <Col xs={6}><Button text="Log in" /></Col>
      <Col xs={6}><Button text="Sign up" /></Col>
    </Row>
  </Grid>
);

export default Home;
