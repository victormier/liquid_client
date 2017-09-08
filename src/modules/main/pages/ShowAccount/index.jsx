import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryAccount } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import { toCurrency } from 'utils/currencies';
import TransactionList from '../../components/TransactionList';
// <TransactionList items={props.data.account.transactions} />

const ShowAccount = ({ data }) => {
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <div>Error!</div>;

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <GoBackArrow to="/accounts" />
      <Row>
        <Col xs={8}>
          <h2>{ data.account.name }</h2>
        </Col>
        <Col xs={4}>
          <h2>{ toCurrency(data.account.balance, data.account.currency_code) }</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TransactionList items={data.account.transactions} currencyCode={data.account.currency_code} />
        </Col>
      </Row>
    </Grid>);
};

ShowAccount.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
      currency_code: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          category: PropTypes.string.isRequired,
          made_on: PropTypes.number.isRequired,
          created_at: PropTypes.number.isRequired,
        })
      ),
    }),
  }),
};

const ShowAccountWithGraphQL = graphql(queryAccount, {
  options: ownProps => ({
    variables: {
      id: ownProps.params.accountId,
    },
  }),
})(ShowAccount);

export default withApollo(ShowAccountWithGraphQL);
