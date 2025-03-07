import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import gridStyles from 'styles/base/grid.scss';
import GoBackArrow from 'components/common/GoBackArrow';
import styles from './styles.scss';

const Header = props => (
  <div className={styles.header}>
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
      <Col xs={6} className={baseStyles.textRight}>
        <div className={gridStyles.gridDisplacedRight}>
          <div className={styles.rightButton}>
            {props.rightButton}
          </div>
          <div className={baseStyles.floatRight}>
            {props.rightButtonSecondary}
          </div>
        </div>
      </Col>
    </Row>
    { !props.mini &&
    <Row>
      <Col xs={props.titleRight ? 8 : 12}>
        <h1 className={styles.title}>{props.title}</h1>
      </Col>
      { props.titleRight &&
      <Col xs={4}>
        <h2 className={styles.titleRight}>
          { props.titleRight }
        </h2>
      </Col>
      }
      <Col xs={12}>
        <div className={styles.subtitle}>{props.subtitle}</div>
        <hr />
      </Col>
    </Row>
    }
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  titleRight: PropTypes.string,
  subtitle: PropTypes.string,
  leftButton: PropTypes.object,
  rightButton: PropTypes.object,
  rightButtonSecondary: PropTypes.object,
  backTo: PropTypes.string,
  mini: PropTypes.bool,
};

export default Header;
