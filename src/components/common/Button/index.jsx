import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

const Button = props => (
  <button
    {..._.omit(props, ['text', 'small'])}
    className={`${styles[props.color || 'default']} ${styles[props.shape || 'round']} ${props.small ? styles.small : ''} ${props.className ? props.className : ''}`}
  >
    <span>
      {
      props.children ?
        props.children :
        props.text
    }
    </span>
  </button>
);

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'transparent', 'red', 'lightBlueGradient']),
  shape: PropTypes.oneOf(['round', 'circle', 'squareRounded']),
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  className: PropTypes.string,
  small: PropTypes.bool,
};

export default Button;
