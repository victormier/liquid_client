import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { inject } from 'mobx-react';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryTransaction, queryAllCategories, updateMirrorTransactionCategory } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import FormInput from 'components/common/FormInput';
import ErrorBar from 'components/layout/ErrorBar';
import styles from './styles.scss';

const CategoryInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Find category..."
  />);

@inject('viewStore')
class EditTransactionCategory extends Component {
  handleCategoryClick(categoryKey) {
    const { params } = this.props;
    this.props.submit({ mirrorTransactionId: params.transactionId, categoryCode: categoryKey })
              .catch(() => {
                this.props.viewStore.addError('There was a problem updating the category');
              });
    this.props.router.push(`/accounts/${params.accountId}/transactions/${params.transactionId}`);
  }

  renderCategoryItem({ name, key, subcategories }) {
    const className = subcategories ? `${styles.categoryItem} ${styles.parentCategory}` : styles.categoryItem;
    return (
      <li key={key} className={className}>
        <div onClick={() => { this.handleCategoryClick(key); }} role="button" tabIndex="0">
          {name}
        </div>
      </li>
    );
  }

  render() {
    const { transactionQuery, allCategoriesQuery, params, categoryName } = this.props;

    if (transactionQuery.loading || allCategoriesQuery.loading) return <SpinnerBlock />;
    if (transactionQuery.error || allCategoriesQuery.error) return <div>Error!</div>;

    let categories = [];
    allCategoriesQuery.all_saltedge_categories.forEach((category) => {
      categories.push(category);
      categories.push(...category.subcategories);
    });

    if (categoryName && categoryName.length >= 1) {
      const regex = new RegExp(categoryName, 'i');
      categories = _.filter(categories, cat => (regex.test(cat.name)));
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <GoBackArrow to={`/accounts/${params.accountId}/transactions/${params.transactionId}`} />
        <Row>
          <Col xs={12}>
            <h1>Transaction Category</h1>
            <FormInput
              value={transactionQuery.transaction.category_name}
              type="text"
              disabled
            />
            <hr />
            <h2>Change category</h2>
            <Field
              name="categoryName"
              type="text"
              component={CategoryInput}
            />
            <hr />
            {
              categories &&
                <div>
                  <ul>
                    {categories.map(category => this.renderCategoryItem(category))}
                  </ul>
                </div>
            }
          </Col>
        </Row>
      </Grid>);
  }
}

EditTransactionCategory.propTypes = {
  transactionQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    transaction: PropTypes.shape({
      category_name: PropTypes.string.isRequired,
    }),
  }),
  allCategoriesQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    all_saltedge_categories: PropTypes.array,
  }),
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  submit: PropTypes.func.isRequired,
  categoryName: PropTypes.string,
};
EditTransactionCategory.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
};

const EditTransactionCategoryWithGraphQL = compose(
  graphql(queryTransaction, {
    name: 'transactionQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.params.transactionId,
      },
    }),
  }),
  graphql(queryAllCategories, { name: 'allCategoriesQuery' }),
  graphql(updateMirrorTransactionCategory, {
    props: ({ mutate }) => ({
      submit: ({ mirrorTransactionId, categoryCode }) => mutate({
        variables: { mirrorTransactionId, categoryCode },
        optimisticResponse: {
          __typename: 'Mutation',
          updateMirrorTransactionCategory: {
            id: mirrorTransactionId,
            __typename: 'Transaction',
            category: categoryCode,
          },
        },
      }),
    }),
  })
)(EditTransactionCategory);

const EditTransactionCategoryWithGraphQLReduxForm = reduxForm({
  form: 'EditTransactionCategory',
})(EditTransactionCategoryWithGraphQL);

// Decorate with connect to read input value
const selector = formValueSelector('EditTransactionCategory');
const ConnectedEditTransactionCategory = connect(state => ({
  categoryName: selector(state, 'categoryName'),
}))(EditTransactionCategoryWithGraphQLReduxForm);

export default withApollo(ConnectedEditTransactionCategory);
