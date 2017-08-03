import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

const Button = props => (
  <button
    {..._.omit(props, ['text'])}
    className={styles[props.color || 'default']}
  >
    { props.text }
  </button>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'transparent']),
};


export default Button;
