import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

const Button = props => (
  <button
    {..._.omit(props, ['text'])}
    className={`${styles[props.color || 'default']} ${styles[props.shape || 'round']}`}
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
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'transparent']),
  shape: PropTypes.oneOf(['round', 'circle']),
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default Button;
