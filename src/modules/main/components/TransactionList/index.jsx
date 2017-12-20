import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router';
import baseStyles from 'styles/base/base.scss';
import { toCurrency } from 'utils/currencies';
import { dateFromSeconds, monthNameShortFromNumber } from 'utils/dates';
import arrow from 'assets/images/arrow.svg';
import styles from './styles.scss';

const TransactionItem = ({ transaction, currencyCode, accountId }) => {
  const date = dateFromSeconds(transaction.made_on);
  const amount = toCurrency(transaction.amount, currencyCode);

  return (
    <Link
      to={{
        pathname: `/accounts/${accountId}/transactions/${transaction.id}`,
        state: { backTo: window.location.pathname },
      }}
      key={transaction.id}
      className={styles.transactionLink}
    >
      <li className={styles.transaction}>
        <Row>
          <Col xs={2} className={`${baseStyles.textCentered} ${styles.date}`}>
            <div className={styles.dataBlock}>
              <div className={styles.dataContent}>
                <div>{date.getDate()}</div>
                <div>{monthNameShortFromNumber(date.getMonth())}</div>
              </div>
            </div>
          </Col>
          <Col xs={7}>
            <div className={styles.dataBlock}>
              <div className={styles.dataContent}>
                <div>{transaction.description}</div>
                { transaction.type === 'VirtualTransaction' &&
                <div className={styles.transactionCategory}>
                  Manual transfer
                  <img alt="arrow" src={arrow} />
                </div>
                }
              </div>
            </div>
          </Col>
          <Col xs={3} className={`${baseStyles.textRight} ${styles.amount}`}>
            <div className={styles.dataBlock}>
              <div className={styles.dataContent}>
                {amount}
              </div>
            </div>
          </Col>
        </Row>
      </li>
    </Link>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category_name: PropTypes.string.isRequired,
    made_on: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
  }),
  currencyCode: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
};

const TransactionList = ({ items, currencyCode, accountId }) => {
  const transactions = items.map(transaction =>
    (<TransactionItem
      key={transaction.id}
      transaction={transaction}
      currencyCode={currencyCode}
      accountId={accountId}
    />)
  );

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
