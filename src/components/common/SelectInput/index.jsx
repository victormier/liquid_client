import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

const SelectInput = (props) => {
  const inputId = props.label ? _.camelCase(props.label) : _.uniqueId('input');

  return (<div className={styles.inputBlock}>
    <div className={styles.inputContainer}>
      <select id={inputId} {...props} className={styles.select}>
        {props.children}
      </select>
    </div>
    { props.label &&
      <label htmlFor={inputId}>{props.label}</label> }
  </div>);
};
SelectInput.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
};

export default SelectInput;
