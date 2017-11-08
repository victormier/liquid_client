import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { inject } from 'mobx-react';
import { mixpanelEventProps, SEARCH_BANK } from 'config/mixpanelEvents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllSaltedgeProviders } from 'qql';
import _ from 'lodash';
import { getCountryName } from 'utils/iso-countries';
import BankItem from '../../components/BankItem';
import styles from './styles.scss';

const BankNameInput = componentProps => (
  <FormInput
    value={componentProps.input.value}
    onChange={componentProps.input.onChange}
    type="text"
    placeholder="Your Bank"
  />);

@inject('mixpanel')
class SelectProvider extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.bankName &&
        nextProps.bankName.length &&
        (nextProps.bankName !== this.props.bankName)) {
      const eventProps = mixpanelEventProps(SEARCH_BANK);
      this.props.mixpanel.track(SEARCH_BANK, { 'Searched characters': nextProps.bankName });
      this.props.mixpanel.register(eventProps);
      this.props.mixpanel.people.set(eventProps);
    }
  }

  render() {
    let bankItems;
    const { data } = this.props;

    if (data.loading) {
      return <p>Loading...</p>;
    }
    if (data.error) {
      return <p>Error!</p>;
    }

    if (this.props.bankName && this.props.bankName.length >= 2) {
      const regex = new RegExp(this.props.bankName, 'i');
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
  }
}

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
SelectProvider.wrappedComponent.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
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
