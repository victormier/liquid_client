import React from 'react';
import arrowLeft from 'assets/images/arrowLeft.svg';
import { browserHistory } from 'react-router';
import styles from './styles.scss';

const GoBackArrow = () => (
  <div className={styles.container}>
    <a href="#back" onClick={browserHistory.goBack}>
      <img alt="arrow left" src={arrowLeft} />
    </a>
  </div>
);


export default GoBackArrow;
