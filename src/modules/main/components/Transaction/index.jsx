import React from 'react';
import PropTypes from 'prop-types';
import { toCurrency } from 'utils/currencies';
import { dateFromSeconds, monthNameShortFromNumber } from 'utils/dates';
import { Row, Col } from 'react-flexbox-grid';
import arrow from 'assets/images/arrow.svg';
import baseStyles from 'styles/base/base.scss';
import styles from './styles.scss';

const Transaction = ({ transaction, currencyCode }) => {
  const date = dateFromSeconds(transaction.made_on);
  const amount = toCurrency(transaction.amount, currencyCode);

  return (
    <div className={styles.transactionContainer}>
      <div className={styles.transaction}>
        <Row>
          <Col xs={2} className={`${baseStyles.textCentered} ${styles.transactionDate}`}>
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
                <div className={styles.transactionDescription}>{transaction.description}</div>
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
            <div className={`${styles.dataBlock} ${baseStyles.floatRight}`}>
              <div className={styles.dataContent}>
                {amount}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

Transaction.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category_name: PropTypes.string.isRequired,
    made_on: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
  }),
  currencyCode: PropTypes.string,
};

export default Transaction;
