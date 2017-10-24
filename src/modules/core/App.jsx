import React from 'react';
import 'normalize.css';
import PropTypes from 'prop-types';
import 'styles/base/mobile-reset.scss';
import 'styles/base/common-base.scss';
import styles from 'styles/base/base.scss';

const App = props => (
  <div className={styles.baseContainer}>
    <div className={styles.bgContainer} />
    <div className={styles.viewportContainer}>
      <div className={styles.mainContainer}>
        { props.children }
      </div>
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default App;
