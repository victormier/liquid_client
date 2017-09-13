import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { ApolloProvider } from 'react-apollo';
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

const AppRouter = props => (
  <ApolloProvider {...props} store={store} client={client}>
    <Router history={history}>
      <Route path={'/'} component={App}>
        <Route component={PublicRoutes}>
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
        <Route component={PrivateRoutes}>
          <Route
            path={'/settings'}
            getComponent={
              (location, cb) => {
                System.import('modules/core/pages/Settings')
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
            path={'/accounts/:accountId'}
            getComponent={
              (location, cb) => {
                System.import('modules/main/pages/ShowAccount')
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

export default AppRouter;
