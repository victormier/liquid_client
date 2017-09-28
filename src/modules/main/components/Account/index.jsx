import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/common/Button';
import { toCurrency } from 'utils/currencies';
import styles from './styles.scss';

const Account = props => (
  <Button color="lightBlueGradient" className={styles.account} {...props} >
    <div className={styles.accountInfo}>
      <div className={styles.accountName}>{props.account.name}</div>
    </div>
    <div className={styles.accountBalance}>{toCurrency(props.account.balance, props.account.currency_code)}</div>
  </Button>
);

Account.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    currency_code: PropTypes.string.isRequired,
  }).isRequired,
};

export default Account;
