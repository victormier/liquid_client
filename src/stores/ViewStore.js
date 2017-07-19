import { observable, computed, extendObservable, action } from 'mobx';

class ViewStore {
  @observable language = 'en_US';
  @observable pendingRequestCount = 0;
  @observable errors = [];

  constructor() {
    this.reset();
  }

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }

  resetErrors() {
    this.errors = [];
  }

  @action reset() {
    extendObservable(this, {
      errors: [],
    });
  }
}
export default new ViewStore();
