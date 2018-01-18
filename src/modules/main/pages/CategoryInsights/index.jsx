import React from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { queryInsights } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import { toCurrency } from 'utils/currencies';
import { Grid, Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import Header from 'components/common/Header';
import gridStyles from 'styles/base/grid.scss';
import TransactionList from '../../components/TransactionList';

const CategoryInsights = (props) => {
  const { data } = props;
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <p>Error!</p>;
  const category = _.find(data.insights.category_insights, ci => (ci.code === props.params.category));
  const currencyCode = data.insights.mirror_account.currency_code;
  const accountId = data.insights.mirror_account.id;

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Header
        title={category ? category.name : props.params.category}
        subtitle="Category"
        titleRight={toCurrency((category ? category.amount : 0), currencyCode)}
        backTo="/insights"
      />
      <Row>
        <Col xs={12}>
          { category ?
            <TransactionList
              items={category.transactions}
              currencyCode={currencyCode}
              accountId={accountId}
            /> :
            <p>We don&apos;t have any data for this category and dates</p>
          }
        </Col>
      </Row>
    </Grid>
  );
};

CategoryInsights.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    insights: PropTypes.shape({
      mirror_account: PropTypes.shape({
        id: PropTypes.string.isRequired,
        currency_code: PropTypes.string.isRequired,
      }),
      category_insights: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          percentage: PropTypes.number.isRequired,
          transactions: PropTypes.array,
        })
      ),
    }),
  }).isRequired,
};

const CategoryInsightsWithGraphQL = graphql(queryInsights, {
  options: ownProps => ({
    variables: {
      month: parseInt(ownProps.params.month, 10),
      year: parseInt(ownProps.params.year, 10),
    },
  }),
})(CategoryInsights);

export default CategoryInsightsWithGraphQL;
