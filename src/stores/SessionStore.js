import { computed, extendObservable, action } from 'mobx';

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

  // Whenever we get a new auth token, the auth action tries to load the user
  // to make sure token is valid, and saves currentUserId on sessionStore.
  // If authToken changes, we reset currentUserId
  @computed get authenticated() {
    if (this.currentSession.authToken) {
      return true;
    }
    return false;
  }

}
export default new SessionStore();
