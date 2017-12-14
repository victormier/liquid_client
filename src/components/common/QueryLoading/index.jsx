import React from 'react';
import PropTypes from 'prop-types';
import SpinnerBlock from 'components/common/SpinnerBlock';

const QueryLoading = props => (
  props.error ?
    <p>Error!</p> :
    <SpinnerBlock />
);

QueryLoading.propTypes = {
  error: PropTypes.object,
};

export default QueryLoading;
