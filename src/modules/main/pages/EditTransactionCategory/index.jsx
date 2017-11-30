import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import { Grid, Row, Col } from 'react-flexbox-grid';
import gridStyles from 'styles/base/grid.scss';
import { queryTransaction, queryAllCategories } from 'qql';
import SpinnerBlock from 'components/common/SpinnerBlock';
import GoBackArrow from 'components/common/GoBackArrow';
import FormInput from 'components/common/FormInput';
import styles from './styles.scss';

const CategoryInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Find category..."
  />);

const CategoryItem = ({ category: { name, key, subcategories } }) => {
  const className = subcategories ? `${styles.categoryItem} ${styles.parentCategory}` : styles.categoryItem;
  return <li key={key} className={className}>{name}</li>;
};

class EditTransactionCategory extends Component {
  handleCategoryClick(categoryKey) {
    console.log(categoryKey);
  }

  renderCategoryItem({ name, key, subcategories }) {
    const className = subcategories ? `${styles.categoryItem} ${styles.parentCategory}` : styles.categoryItem;
    return <li key={key} className={className} onClick={() => { this.handleCategoryClick(key); }}>{name}</li>;
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
        <GoBackArrow to={`/accounts/${params.accountId}/transactions/${params.transactionId}`} />
        <Row>
          <Col xs={12}>
            <h1>Transaction Category</h1>
            <FormInput
              value={transactionQuery.transaction.category}
              type="text"
              disabled
            />
            <hr />
            <Field
              name="categoryName"
              type="text"
              component={CategoryInput}
            />
            <hr />
            {
              categories &&
                <ul>
                  {categories.map(category => this.renderCategoryItem(category))}
                </ul>
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
      category: PropTypes.string.isRequired,
    }),
  }),
  params: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
  }),
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
  graphql(queryAllCategories, { name: 'allCategoriesQuery' })
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
