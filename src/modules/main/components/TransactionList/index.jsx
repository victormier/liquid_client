import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import baseStyles from 'styles/base/base.scss';
import { toCurrency } from 'utils/currencies';
import styles from './styles.scss';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TransactionItem = ({ transaction, currencyCode }) => {
  const date = new Date(0);
  date.setUTCSeconds(transaction.made_on);
  const amount = toCurrency(transaction.amount, currencyCode);

  return (
    <li className={styles.transaction}>
      <Grid>
        <Row>
          <Col xs={2}>
            <div>{date.getDate()}</div>
            <div>{monthNames[date.getMonth()]}</div>
          </Col>
          <Col xs={7}>
            <div>{transaction.description}</div>
            <div className={styles.transactionCategory}>{transaction.category}</div>
          </Col>
          <Col xs={3} className={baseStyles.textRight}>{amount}</Col>
        </Row>
      </Grid>
    </li>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    made_on: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
  }),
  currencyCode: PropTypes.string.isRequired,
};

const TransactionList = ({ items, currencyCode }) => {
  const transactions = items.map(transaction => <TransactionItem key={transaction.id} transaction={transaction} currencyCode={currencyCode} />);

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
      category: PropTypes.string.isRequired,
      made_on: PropTypes.number.isRequired,
      created_at: PropTypes.number.isRequired,
    })
  ),
  currencyCode: PropTypes.string,
};

export default withApollo(TransactionList);
