import { observable } from 'mobx';

class SessionStore {

  @observable authToken;

  constructor() {
    this.authToken = localStorage.getItem('authToken');
  }

  reset() {
    this.authToken = null;
  }

}

const sessionStore = new SessionStore();
export default sessionStore;
