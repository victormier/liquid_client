import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryAccount } from 'qql';
import { Link } from 'react-router';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import Button from 'components/common/Button';
import { toCurrency } from 'utils/currencies';
import baseStyles from 'styles/base/base.scss';
import RefreshButton from '../../components/RefreshButton';
import TransactionList from '../../components/TransactionList';

const ShowAccount = ({ data }) => {
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <div>Error!</div>;

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Row className={baseStyles.topNav}>
        <Col xs={6}>
          <GoBackArrow to="/accounts" />
        </Col>
        <Col xs={2}>
          {
            data.account.is_mirror_account &&
              <RefreshButton />
          }
        </Col>
        <Col xs={4} className={baseStyles.textRight}>
          <Link to={`/transactions/new/${data.account.id}`}>
            <Button text="Transfer" color="transparent" />
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <h2>{ data.account.name }</h2>
        </Col>
        <Col xs={6}>
          <h2 className={baseStyles.textRight}>
            { toCurrency(data.account.balance, data.account.currency_code) }
          </h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TransactionList
            items={data.account.transactions}
            currencyCode={data.account.currency_code}
            accountId={data.account.id}
          />
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
