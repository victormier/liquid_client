import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';

const FormInput = (props) => {
  const inputId = props.label ? _.camelCase(props.label) : _.uniqueId('input');

  return (<div className={styles.inputBlock}>
    <div className={styles.inputContainer}>
      <input
        id={inputId}
        {...props}
        className={styles.input}
      />
    </div>
    { props.label &&
    <label htmlFor={inputId}>{props.label}</label> }
  </div>);
};

FormInput.propTypes = {
  label: PropTypes.string,
};

export default FormInput;
