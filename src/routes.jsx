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
        </Route>

        <Route
          path={'/counter'}
          getComponent={
            (location, cb) => {
              System.import('modules/counter/containers/Base')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
        <Route
          path={'/posts'}
          getComponent={
            (location, cb) => {
              System.import('modules/blog/pages/ListPosts')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
        <Route
          path={'/posts/create'}
          getComponent={
            (location, cb) => {
              System.import('modules/blog/pages/PostCreate')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
        <Route
          path={'/posts/:postId'}
          getComponent={
            (location, cb) => {
              System.import('modules/blog/pages/PostDetail')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
        <Route
          path={'/posts/:postId/edit'}
          getComponent={
            (location, cb) => {
              System.import('modules/blog/pages/PostEdit')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
        <Route
          path={'/about'}
          getComponent={
            (location, cb) => {
              System.import('modules/core/pages/About')
                .then(loadRoute(cb))
                .catch(err => errorLoading(err));
            }
          }
        />
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
