import React from 'react';
import styles from './styles.scss';

const FormInput = props => (
  <input
    {...props}
    className={styles.input}
  />
);

export default FormInput;
