import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import FormInput from 'components/common/FormInput';
import gridStyles from 'styles/base/grid.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { querySaltedgeProvider, createSaltedgeLogin } from 'qql';
import GoBackArrow from 'components/common/GoBackArrow';
import ErrorBar from 'components/layout/ErrorBar';
import { mixpanelEventProps, CONNECT_BANK_FIRST_STEP, CONNECT_BANK } from 'config/mixpanelEvents';
import PollProviderLogin from '../../components/PollProviderLogin';
import ProviderLoginForm from '../../forms/ProviderLogin';
import styles from './styles.scss';

@inject('viewStore',
        'mixpanel')
class NewProviderLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polling: false,
      saltedgeLoginId: null,
    };
    this.handleConnectSuccess = this.handleConnectSuccess.bind(this);
    this.handleConnectError = this.handleConnectError.bind(this);
  }

  handleFormSubmit(data) {
    return this.props.submit(
      this.props.data.saltedge_provider.id,
      JSON.stringify(data))
        .then((newData) => {
          const inputFieldTypes = this.props.data.saltedge_provider.required_fields.map(f => f.nature);
          const eventProps = { ...mixpanelEventProps(CONNECT_BANK_FIRST_STEP), 'Input field types': inputFieldTypes };
          this.props.mixpanel.track(CONNECT_BANK_FIRST_STEP, { 'Input field types': inputFieldTypes });
          this.props.mixpanel.register(eventProps);
          this.props.mixpanel.people.set(eventProps);

          this.setState({
            polling: true,
            saltedgeLoginId: newData.data.createSaltedgeLogin.id,
          });
        })
        .catch(() => {
          this.props.viewStore.addError('There was a problem');
        });
  }

  handleConnectError() {
    this.setState({
      polling: false,
      saltedgeLoginId: null,
    });
    this.props.viewStore.addError(
      "We couldn't connect to your bank. Please try again."
    );
  }

  handleConnectSuccess() {
    const saltedgeProvider = this.props.data.saltedge_provider;
    const bankIdentifier = `${saltedgeProvider.name} [${saltedgeProvider.country_code}] [${saltedgeProvider.id}]`;
    const eventProps = { ...mixpanelEventProps(CONNECT_BANK), 'Connected bank': bankIdentifier };
    this.props.mixpanel.track(CONNECT_BANK);
    this.props.mixpanel.register(eventProps);
    this.props.mixpanel.people.set(eventProps);

    this.props.router.push('/connect/select_account');
  }

  render() {
    const { data } = this.props;

    if (data.loading) {
      return <p>Loading provider...</p>;
    }
    if (data.error) {
      return <p>Error!</p>;
    }
    if (this.state.polling) {
      return (<PollProviderLogin
        saltedgeLoginId={this.state.saltedgeLoginId}
        onConnectSuccess={this.handleConnectSuccess}
        onConnectError={this.handleConnectError}
      />);
    }

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <GoBackArrow to="/connect/providers" />
        <Row>
          <Col xs={12}>
            <h1>Connect to your account</h1>
            <div className={styles.bankNameInput}>
              <FormInput
                value={data.saltedge_provider.name}
                type="text"
                onChange={this.onChange}
                disabled
              />
            </div>
            <ProviderLoginForm
              onSubmit={formData => this.handleFormSubmit(formData)}
              fieldsDescription={data.saltedge_provider.required_fields}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

NewProviderLogin.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedge_provider: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
      required_fields: PropTypes.arrayOf(PropTypes.shape({
        nature: PropTypes.string.isRequired,
      })),
    }),
  }),
  submit: PropTypes.func.isRequired,
};

NewProviderLogin.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    people: PropTypes.shape({
      set: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

const NewProviderLoginWithGraphQL = compose(
  graphql(querySaltedgeProvider, {
    options: ownProps => ({
      variables: {
        id: ownProps.params.saltedgeProviderId,
      },
    }),
  }),
  graphql(createSaltedgeLogin, {
    props: ({ mutate }) => ({
      submit: (saltedgeProviderId, credentials) => mutate({
        variables: { saltedgeProviderId, credentials },
      }),
    }),
  })
)(NewProviderLogin);

export default withApollo(NewProviderLoginWithGraphQL);
