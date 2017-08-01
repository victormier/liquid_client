import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import ViewStore from 'stores/ViewStore';
import SessionStore from 'stores/SessionStore';
import UserStore from 'stores/UserStore';

// Makes hot module replacement possible
import { AppContainer } from 'react-hot-loader';

// This is our App with ApolloProvider and Router
import AppRouter from 'routes';

// Mobx stores (everything not held by Apollo)
// such as view state
const stores = {
  viewStore: new ViewStore(),
  sessionStore: new SessionStore(),
  userStore: new UserStore(),
};

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...stores} >
        <Component />
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
