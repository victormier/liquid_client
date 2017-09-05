import React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllSaltedgeProviders } from 'qql';
import _ from 'lodash';
import { getCountryName } from 'utils/iso-countries';
import { Link } from 'react-router';
import styles from './styles.scss';

const BankItem = props => (
  <li className={styles.bankItem}>
    <Link to={`/connect/providers/${props.saltedgeProvider.id}`}>
      { props.saltedgeProvider.name }
    </Link>
  </li>
);
BankItem.propTypes = {
  saltedgeProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const BankNameInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Your Bank"
  />);

const SelectProvider = (props) => {
  let bankItems;
  const { data } = props;

  if (data.loading) {
    return <p>Loading...</p>;
  }
  if (data.error) {
    return <p>Error!</p>;
  }

  if (props.bankName && props.bankName.length >= 2) {
    const regex = new RegExp(props.bankName, 'i');
    const filteredProviders = _.filter(data.all_saltedge_providers,
                                sp => (regex.test(sp.name)));
    const groupedProviders = _.groupBy(filteredProviders, 'country_code');
    bankItems = Object.keys(groupedProviders).map(countryCode => (
      <div key={countryCode}>
        <h2>{getCountryName(countryCode)}</h2>
        <ul className={styles.bankList}>
          { groupedProviders[countryCode].map(
              sp => <BankItem key={sp.id} saltedgeProvider={sp} />
            )
          }
        </ul>
      </div>
    ));
  }

  return (
    <Grid fluid className={gridStyles.mainGrid}>
      <Row>
        <Col xs={12}>
          <h1>Search for your bank</h1>
          <Field
            name="bankName"
            type="text"
            component={BankNameInput}
          />
          <hr />
          {
            bankItems &&
              <ul className={styles.bankList}>{bankItems}</ul>
          }
        </Col>
      </Row>
    </Grid>
  );
};

SelectProvider.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    allSaltedgeProviders: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        country_code: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  bankName: PropTypes.string,
};

const SelectProviderWithGraphQL = graphql(
  queryAllSaltedgeProviders,
  {}
)(SelectProvider);

const SelectProviderWithGraphQLReduxForm = reduxForm({
  form: 'SelectProvider',
})(SelectProviderWithGraphQL);

// Decorate with connect to read input value
const selector = formValueSelector('SelectProvider');
const ConnectedSelectProvider = connect(state => ({
  bankName: selector(state, 'bankName'),
}))(SelectProviderWithGraphQLReduxForm);

export default ConnectedSelectProvider;
