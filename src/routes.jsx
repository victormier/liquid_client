import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { observer } from 'mobx-react';
import store, { history } from 'store';
import client from 'config/apolloClient';
import App from 'modules/core/App';
import PrivateRoutes from 'components/common/PrivateRoutes';
import PublicRoutes from 'components/common/PublicRoutes';

// Makes dynamic route loading more convenient
const loadRoute = cb => module => cb(null, module.default);

// Catch unexpected errors when loading routes
const errorLoading = err => (
  console.error(`Dynamic route loading failed ${err}`)
);

@observer
class AppRouter extends Component {
  render() {
    return (
      <ApolloProvider {...this.props} store={store} client={client}>
        <Router history={history}>
          <Route path={'/'} component={App}>
            <Route
              component={PublicRoutes}
              authenticated={this.props.authenticated}
              logout={this.props.logout}
            >
              <IndexRoute
                getComponent={
                  (location, cb) => {
                    System.import('modules/core/pages/Home')
                      .then(loadRoute(cb))
                      .catch((err) => {
                        errorLoading(err);
                      });
                  }
                }
              />
              <Route
                path={'/login'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/sessions/pages/Login')
                    .then(loadRoute(cb))
                    .catch(err => errorLoading(err));
                  }
                }
              />

              <Route
                path={'/users/request_reset_password'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/sessions/pages/RequestResetPassword')
                    .then(loadRoute(cb))
                    .catch(err => errorLoading(err));
                  }
                }
              />

              <Route
                path={'/signup'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/signup/pages/Signup')
                    .then(loadRoute(cb))
                    .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/signup/success'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/signup/pages/SignupSuccess')
                    .then(loadRoute(cb))
                    .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/users/reset_password'}
                getComponent={
                (location, cb) => {
                  System.import('modules/signup/pages/ResetPassword')
                  .then(loadRoute(cb))
                  .catch(err => errorLoading(err));
                }
              }
              />
            </Route>
            <Route
              component={PrivateRoutes}
              authenticated={this.props.authenticated}
              logout={this.props.logout}
            >
              <Route
                path={'/settings'}
                logout={this.props.logout}
                getComponent={
                  (location, cb) => {
                    System.import('modules/core/pages/Settings')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/settings/delete_account'}
                logout={this.props.logout}
                getComponent={
                  (location, cb) => {
                    System.import('modules/core/pages/DeleteAccount')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/connect/providers'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/connect_bank/pages/SelectProvider')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/connect/providers/:saltedgeProviderId'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/connect_bank/pages/NewProviderLogin')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/connect/select_account'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/connect_bank/pages/SelectAccount')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/accounts'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/ListAccounts')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/accounts/new'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/NewAccount')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/accounts/:accountId'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/ShowAccount')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/transactions/new'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/NewTransaction')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/transactions/new/:accountId'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/NewTransactionStep2')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/accounts/:accountId/transactions/:transactionId'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/ShowTransaction')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/accounts/:accountId/transactions/:transactionId/category'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/EditTransactionCategory')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/insights'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/Insights')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
              <Route
                path={'/insights/categories/:category/:year/:month'}
                getComponent={
                  (location, cb) => {
                    System.import('modules/main/pages/CategoryInsights')
                      .then(loadRoute(cb))
                      .catch(err => errorLoading(err));
                  }
                }
              />
            </Route>
          </Route>
          <Route
            path="*"
            getComponent={
              (location, cb) => {
                System.import('modules/core/pages/NotFound')
                  .then(loadRoute(cb))
                  .catch(err => errorLoading(err));
              }
            }
          />
        </Router>
      </ApolloProvider>
    );
  }
}

AppRouter.propTypes = {
  logout: PropTypes.func.isRequired,
  authenticated: PropTypes.func.isRequired,
};

export default AppRouter;
