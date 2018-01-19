import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const SquareRoundedBlock = (props) => {
  const className = props.className ?
                      `${props.className} ${styles.block}` :
                      styles.block;

  return (<div {...props} className={className} >
    {props.children}
  </div>);
};

SquareRoundedBlock.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

export default SquareRoundedBlock;
