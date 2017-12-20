import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { toCurrency } from 'utils/currencies';
import Button from 'components/common/Button';
import styles from './styles.scss';

const Account = props => (
  <div className={styles.accountContainer}>
    <Button
      color="lightBlueGradient"
      className={styles.account}
      shape="squareRounded"
      {..._.omit(props, ['account'])}
    >
      <div className={`${styles.accountInfo} ${styles.accountDataBlock}`}>
        <div className={styles.accountDataContent}>
          <div className={styles.accountName}>{props.account.name}</div>
          { props.account.is_mirror_account &&
          <div className={styles.accountBank}>{props.account.provider_name}</div>
          }
        </div>
      </div>
      <div className={`${styles.accountBalance} ${styles.accountDataBlock}`}>
        <div className={styles.accountDataContent}>
          {toCurrency(props.account.balance, props.account.currency_code)}
        </div>
      </div>
    </Button>
  </div>
);

Account.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    currency_code: PropTypes.string.isRequired,
    is_mirror_account: PropTypes.bool.isRequired,
    provider_name: PropTypes.string,
  }).isRequired,
};

export default Account;
