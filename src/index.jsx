import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import mixpanel from 'mixpanel-browser';
import ViewStore from 'stores/ViewStore';
import UserStore from 'stores/UserStore';
import { MIXPANEL_TOKEN } from 'config';

// Makes hot module replacement possible
import { AppContainer } from 'react-hot-loader';

// This is our App with ApolloProvider and Router
import AppRouter from 'routes';

// Init mixpanel
mixpanel.init(MIXPANEL_TOKEN);

// Mobx stores (everything not held by Apollo)
// such as view state
const stores = {
  viewStore: new ViewStore(),
  userStore: new UserStore(),
};

const logout = () => {
  window.localStorage.removeItem('auth_token');
  // TO DO: force rerender
};

const authenticated = () => window.localStorage.auth_token;

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...stores} mixpanel={mixpanel} >
        <Component authenticated={authenticated} logout={logout} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

// Render App
render(AppRouter);

// Render App with hot module replacements
if (module.hot) {
  module.hot.accept('routes', () => {
    const NewApp = require('./routes').default;
    render(NewApp);
  });
}
