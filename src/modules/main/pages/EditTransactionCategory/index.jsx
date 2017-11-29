import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryTransaction } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import FormInput from 'components/common/FormInput';

const EditTransactionCategory = ({ data, params }) => {
  if (data.loading) return <SpinnerBlock />;
  if (data.error) return <div>Error!</div>;

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <GoBackArrow to={`/accounts/${params.accountId}/transactions/${params.transactionId}`} />
      <Row>
        <Col xs={12}>
          <h1>Transaction Category</h1>
          <FormInput
            value={data.transaction.category}
            type="text"
            disabled
          />
          <hr />
        </Col>
      </Row>
    </Grid>);
};

EditTransactionCategory.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    transaction: PropTypes.shape({
      category: PropTypes.string.isRequired,
    }),
  }),
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
  }),
};

const EditTransactionCategoryWithGraphQL = graphql(queryTransaction, {
  options: ownProps => ({
    variables: {
      id: ownProps.params.transactionId,
    },
  }),
})(EditTransactionCategory);

export default withApollo(EditTransactionCategoryWithGraphQL);
