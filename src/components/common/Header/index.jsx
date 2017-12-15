import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import gridStyles from 'styles/base/grid.scss';
import GoBackArrow from 'components/common/GoBackArrow';
import styles from './styles.scss';

const Header = props => (
  <div>
    <Row className={styles.topRow}>
      <Col xs={6}>
        <div className={gridStyles.gridDisplacedLeft}>
          {
            props.backTo ?
              <GoBackArrow to={props.backTo} /> :
              props.leftButton
          }
        </div>
      </Col>
      <Col xs={2}>
        <div className={baseStyles.floatRight}>
          {props.rightButtonSecondary}
        </div>
      </Col>
      <Col xs={4} className={baseStyles.textRight}>
        <div className={gridStyles.gridDisplacedRight}>
          {props.rightButton}
        </div>
      </Col>
    </Row>
    <Row>
      <Col xs={8}>
        <h1 className={styles.title}>{props.title}</h1>
        <div className={styles.subtitle}>{props.subtitle}</div>
      </Col>
      <Col xs={4}>
        <h2 className={styles.titleRight}>
          { props.titleRight }
        </h2>
      </Col>
      <Col xs={12}><hr /></Col>
    </Row>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  titleRight: PropTypes.string,
  subtitle: PropTypes.string,
  leftButton: PropTypes.object,
  rightButton: PropTypes.object,
  rightButtonSecondary: PropTypes.object,
  backTo: PropTypes.string,
};

export default Header;
