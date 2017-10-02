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
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default SquareRoundedBlock;
