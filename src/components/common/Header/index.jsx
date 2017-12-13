import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import GoBackArrow from 'components/common/GoBackArrow';
import styles from './styles.scss';

const Header = props => (
  <Row className={baseStyles.topNav}>
    <Col xs={6}>
      {
        props.backTo ?
          <GoBackArrow to="/accounts" /> :
          props.leftButton
      }
    </Col>
    <Col xs={2}>
      <div className={baseStyles.floatRight}>
        {props.rightButtonSecondary}
      </div>
    </Col>
    <Col xs={4} className={baseStyles.textRight}>
      {props.rightButton}
    </Col>
    <Col xs={6}>
      <h1 className={styles.title}>{props.title}</h1>
      <div className={styles.subtitle}>{props.subtitle}</div>
    </Col>
    <Col xs={6}>
      <h2 className={baseStyles.textRight}>
        { props.titleRight }
      </h2>
    </Col>
    <Col xs={12}><hr /></Col>
  </Row>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  titleRight: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  leftButton: PropTypes.object,
  rightButton: PropTypes.object,
  rightButtonSecondary: PropTypes.object,
  backTo: PropTypes.string,
};

export default Header;
