import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import { mixpanelEventProps, SELECT_BANK } from 'config/mixpanelEvents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { queryAllSaltedgeProviders } from 'qql';
import _ from 'lodash';
import { getCountryName } from 'utils/iso-countries';
import { Link } from 'react-router';
import styles from './styles.scss';

@inject('mixpanel')
class BankItem extends Component {
  @autobind
  trackEvent() {
    const { saltedgeProvider } = this.props;
    const bankIdentifier = `${saltedgeProvider.name} [${saltedgeProvider.country_code}] [${saltedgeProvider.id}]`;
    const eventProps = {
      ...mixpanelEventProps(SELECT_BANK),
      'Bank country': saltedgeProvider.country_code,
      'Bank name': saltedgeProvider.name,
    };
    this.props.mixpanel.track(SELECT_BANK, { 'Bank selected': bankIdentifier });
    this.props.mixpanel.register(eventProps);
    this.props.mixpanel.people.set(eventProps);
  }

  render() {
    return (
      <li className={styles.bankItem}>
        <Link to={`/connect/providers/${this.props.saltedgeProvider.id}`} onClick={this.trackEvent}>
          { this.props.saltedgeProvider.name }
        </Link>
      </li>
    );
  }
}
BankItem.propTypes = {
  saltedgeProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
BankItem.wrappedComponent.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    identify: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
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
