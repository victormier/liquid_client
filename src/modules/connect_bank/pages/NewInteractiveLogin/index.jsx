import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import gridStyles from 'styles/base/grid.scss';
import baseStyles from 'styles/base/base.scss';
import { Grid } from 'react-flexbox-grid';
import { querySaltedgeProvider, submitInteractiveFields,
         queryUser, querySaltedgeLogin } from 'qql';
import Header from 'components/common/Header';
import QueryLoading from 'components/common/QueryLoading';
import ErrorBar from 'components/layout/ErrorBar';
import _ from 'lodash';
import ProviderLoginForm from '../../forms/ProviderLogin';

@inject('viewStore')
class NewInteractiveLogin extends Component {

  @autobind
  handleFormSubmit(data) {
    const dataParams = JSON.stringify(data);
    return this.props.submitInteractiveFields(this.props.saltedgeLoginQuery.saltedge_login.id, dataParams)
            .then(() => {
              this.props.router.push(`/connect/providers/${this.props.params.saltedgeProviderId}`);
            })
            .catch(() => {
              this.props.viewStore.addError('There was a problem');
            });
  }


  render() {
    const { saltedgeProviderQuery, userQuery, saltedgeLoginQuery } = this.props;
    const contentIsReady = !(saltedgeProviderQuery.loading || saltedgeLoginQuery.loading || userQuery.loading) &&
                           !(saltedgeProviderQuery.error || saltedgeLoginQuery.error || userQuery.error);

    return (
      <Grid fluid className={gridStyles.mainGrid}>
        <ErrorBar />
        <Header
          title="Interactive Login"
          backTo="/connect/providers"
        />
        { contentIsReady ?
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: saltedgeLoginQuery.saltedge_login.interactive_html }}
              className={baseStyles.baseMarginBottom}
            />
            <ProviderLoginForm
              onSubmit={formData => this.handleFormSubmit(formData)}
              fieldsDescription={
                  _.filter(
                    saltedgeProviderQuery.saltedge_provider.interactive_fields,
                    field => (saltedgeLoginQuery.saltedge_login.interactive_fields.includes(field.name))
                  )
                }
            />
          </div> :
          <QueryLoading error={saltedgeProviderQuery.error || saltedgeLoginQuery.error || userQuery.error} />
        }
      </Grid>
    );
  }
}

NewInteractiveLogin.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  saltedgeProviderQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedge_provider: PropTypes.shape({
      interactive: PropTypes.bool,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country_code: PropTypes.string.isRequired,
      required_fields: PropTypes.arrayOf(PropTypes.shape({
        nature: PropTypes.string.isRequired,
      })),
    }),
  }),
  saltedgeLoginQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    saltedge_login: PropTypes.shape({
      id: PropTypes.string.isRequired,
      interactive_html: PropTypes.string.isRequired,
      interactive_fields: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  userQuery: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    user: PropTypes.shape({
      saltedge_login: PropTypes.shape({
        id: PropTypes.number,
      }),
      bank_connection_phase: PropTypes.string.isRequired,
    }),
    refetch: PropTypes.func.isRequired,
  }),
  submitInteractiveFields: PropTypes.func.isRequired,
  params: PropTypes.shape({
    saltedgeProviderId: PropTypes.string.isRequired,
  }).isRequired,
};

NewInteractiveLogin.wrappedComponent.propTypes = {
  viewStore: PropTypes.shape({
    addError: PropTypes.func.isRequired,
  }).isRequired,
};

const NewInteractiveLoginWithGraphQL = compose(
  graphql(queryUser, {
    name: 'userQuery',
    props: ({ userQuery, ownProps: { params: { saltedgeProviderId } } }) => {
      const saltedgeLogin = _.find(userQuery.user.saltedge_logins, sl => (sl.saltedge_provider.id === saltedgeProviderId));
      return { userQuery, saltedgeLogin };
    },
  }),
  graphql(querySaltedgeLogin, {
    name: 'saltedgeLoginQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.params.saltedgeLoginId,
      },
    }),
  }),
  graphql(querySaltedgeProvider, {
    name: 'saltedgeProviderQuery',
    options: ownProps => ({
      variables: {
        id: ownProps.params.saltedgeProviderId,
      },
    }),
  }),
  graphql(submitInteractiveFields, {
    name: 'submitInteractiveFieldsMutation',
    props: ({ submitInteractiveFieldsMutation }) => ({
      submitInteractiveFields: (saltedgeLoginId, credentials) => submitInteractiveFieldsMutation({
        variables: { saltedgeLoginId, credentials },
        refetchQueries: [{
          query: queryUser,
        }],
      }),
    }),
  })
)(NewInteractiveLogin);

export default withApollo(NewInteractiveLoginWithGraphQL);
