import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router';
import Button from 'components/common/Button';
import gridStyles from 'styles/base/grid.scss';
import logo from 'assets/images/logo.svg';
import styles from './styles.scss';

const Home = () => (
  <Grid fluid className={gridStyles.mainGrid}>
    <Row className={gridStyles.fullHeight}>
      <Row top="xs" className={gridStyles.fullWidth}>
        <Col xs={8} className={styles.logo}>
          <img alt="Logo" src={logo} />
          <h1>
            The simplest way<br />
            to take back control<br />
            of your cashflow
          </h1>
        </Col>
      </Row>
      <Row bottom="xs" className={gridStyles.fullWidth}>
        <Col xs={6}>
          <Link to="/login"><Button text="Log in" color="blue" /></Link>
        </Col>
        <Col xs={6}>
          <Link to="/signup">
            <Button text="Sign up" color="transparent" />
          </Link>
        </Col>
      </Row>
    </Row>
  </Grid>
);

export default Home;
