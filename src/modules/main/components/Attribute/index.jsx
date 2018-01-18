import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Attribute = ({ title, subtitle, bold }) => (
  <div className={styles.attribute}>
    <div className={bold ? `${styles.attributeValue} ${styles.attributeValueBold}` : styles.attributeValue}>{ title }</div>
    <div>{subtitle}</div>
  </div>
);

Attribute.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bold: PropTypes.bool,
};

export default Attribute;
