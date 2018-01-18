import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import FormInput from 'components/common/FormInput';
import Header from 'components/common/Header';
import Button from 'components/common/Button';
import QueryLoading from 'components/common/QueryLoading';
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
    label="Bank"
  />);

@inject(
  'mixpanel',
  'viewStore'
)
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

  onLogout = (e) => {
    e.preventDefault();
    this.props.client.resetStore();
    this.props.viewStore.reset();
    this.props.route.logout();
    this.props.router.push('/');
  }

  render() {
    let bankItems;
    const { data } = this.props;
    const contentIsReady = !data.loading && !data.error && data.all_saltedge_providers;

    if (contentIsReady) {
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
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <Header
          title="Search your bank"
          rightButton={<Button
            id="logoutButton"
            text="Log out"
            color="transparent"
            onClick={(e) => { this.onLogout(e); }}
          />}
        />
        <Row>
          {
            contentIsReady ?
              <Col xs={12}>
                <Field
                  name="bankName"
                  type="text"
                  component={BankNameInput}
                />
                <hr />
                { bankItems && <ul className={styles.bankList}>{bankItems}</ul> }
              </Col> :
              <QueryLoading error={data.error} />
          }
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
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }),
};
SelectProvider.wrappedComponent.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
  viewStore: PropTypes.shape({
    reset: PropTypes.func.isRequired,
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

export default withApollo(ConnectedSelectProvider);
