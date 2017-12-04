import { extendObservable, action, computed } from 'mobx';
import restFetch from 'restApi';

class UserStore {
  constructor() {
    this.reset();
  }

  @action reset() {
    extendObservable(this, {
      user: {
        id: null,
        email: null,
        bank_connection_phase: null,
      },
    });
  }

  @computed get isNewUser() {
    return (!this.user.bank_connection_phase || this.user.bank_connection_phase === 'new_login');
  }

  @action getUserFromResetPasswordToken(resetPasswordToken, viewStore) {
    const url = '/users/from_reset_password_token';
    return restFetch(`${url}?reset_password_token=${resetPasswordToken}`, {
      method: 'GET',
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
              viewStore.addError("We couldn't find that error token");
            }
          });
          throw Error(response.statusText);
        } else {
          return response.json();
        }
      })
      .then(action('setUser', (data) => {
        this.user = {
          id: data.user.id,
          email: data.user.email,
          bank_connection_phase: data.user.bank_connection_phase,
        };
      }))
      .catch((error) => {
        viewStore.addError('There was a problem fetching that error token');
        throw Error(error);
      });
  }
}
export default UserStore;
