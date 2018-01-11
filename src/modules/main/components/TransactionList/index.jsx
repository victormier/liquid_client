import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router';
import Transaction from '../../components/Transaction';
import styles from './styles.scss';

const TransactionList = ({ items, currencyCode, accountId }) => {
  const transactions = items.map(transaction => (
    <li key={transaction.id} className={styles.transactionLink}>
      <Link
        to={{
          pathname: `/accounts/${accountId}/transactions/${transaction.id}`,
          state: { backTo: window.location.pathname },
        }}
      >
        <Transaction transaction={transaction} currencyCode={currencyCode} />
      </Link>
    </li>
  ));

  return (
    <ul className={styles.transactionList}>{transactions}</ul>
  );
};

TransactionList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      category_name: PropTypes.string.isRequired,
      made_on: PropTypes.number.isRequired,
      created_at: PropTypes.number.isRequired,
    })
  ),
  currencyCode: PropTypes.string,
  accountId: PropTypes.string.isRequired,
};

export default withApollo(TransactionList);
