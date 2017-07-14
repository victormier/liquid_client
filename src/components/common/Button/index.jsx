import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Button = props => <button className={styles[props.color || 'default']}>{ props.text }</button>;

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'transparent']),
};


export default Button;
