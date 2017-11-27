import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const SelectInput = props => (
  <select {...props} className={styles.select}>
    {props.children}
  </select>
);
SelectInput.propTypes = {
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default SelectInput;
