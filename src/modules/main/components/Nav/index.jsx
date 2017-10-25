import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router';
import accounts from 'assets/images/accounts.svg';
import insights from 'assets/images/insights.svg';
import settings from 'assets/images/settings.svg';
import styles from './styles.scss';

const Nav = () => (
  <nav className={styles.container}>
    <Col xs={12}>
      <Row around="xs">
        <Col xs={2} className={styles.navElement}><Link to="/accounts" className={styles.link} activeClassName={styles.activeLink}><img alt="accounts" src={accounts} /></Link></Col>
        <Col xs={2} className={styles.navElement}><Link to="/insights" className={styles.link} activeClassName={styles.activeLink}><img alt="insights" src={insights} /></Link></Col>
        <Col xs={2} className={styles.navElement}><Link to="/settings" className={styles.link} activeClassName={styles.activeLink}><img alt="settings" src={settings} /></Link></Col>
      </Row>
    </Col>
  </nav>
);

export default Nav;
