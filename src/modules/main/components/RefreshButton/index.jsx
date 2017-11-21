import React from 'react';
import PropTypes from 'prop-types';
// import { graphql, withApollo } from 'react-apollo';
// import { Grid, Row, Col } from 'react-flexbox-grid';
// import gridStyles from 'styles/base/grid.scss';
// import { queryAccount } from 'qql';
// import { Link } from 'react-router';
// import SpinnerBlock from 'components/common/SpinnerBlock';
// import GoBackArrow from 'components/common/GoBackArrow';
// import Button from 'components/common/Button';
// import { toCurrency } from 'utils/currencies';
// import baseStyles from 'styles/base/base.scss';
import refresh from 'assets/images/refresh.svg';
import styles from './styles.scss';

const RefreshButton = props => (
  <div className={styles.refreshIcon}>
    <img alt="refresh" src={refresh} />
  </div>
);

RefreshButton.propTypes = {
  accountId: PropTypes.number.isRequired,
};

export default RefreshButton;
