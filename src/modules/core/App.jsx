import React from 'react';
import 'normalize.css';
import PropTypes from 'prop-types';
import 'styles/base/mobile-reset.scss';
import styles from 'styles/base/base.scss';

const App = props => (
  <div className={styles.mainContainer}>
    { props.children }
  </div>
);

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default App;
