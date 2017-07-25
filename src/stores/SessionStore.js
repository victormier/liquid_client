import { computed, extendObservable, action } from 'mobx';
import restFetch from 'restApi';

class SessionStore {
  constructor() {
    this.reset();
  }

  @action reset() {
    extendObservable(this, {
      currentSession: {
        authToken: window.localStorage.getItem('auth_token'),
        userId: null,
      },
    });
  }

  @computed get authenticated() {
    if (this.currentSession.authToken) {
      return true;
    }
    return false;
  }

  @action auth(email, password, viewStore) {
    return restFetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // try to parse errors
          response.json().then((data) => {
            if (data.errors.length) {
              data.errors.forEach((message) => {
                viewStore.addError(message);
              });
            } else {
              viewStore.addError("We couldn't log you in");
            }
          });
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(action('setCurrentSession', (data) => {
        window.localStorage.setItem('auth_token', data.auth_token);
        this.currentSession = {
          authToken: data.auth_token,
          userId: data.user_id,
        };
      }));
  }

  @action logout() {
    window.localStorage.removeItem('auth_token');
    this.reset();
  }

}
export default SessionStore;
