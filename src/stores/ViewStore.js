import { observable, computed } from 'mobx';

class ViewStore {
  @observable language = 'en_US';
  @observable pendingRequestCount = 0;
  @observable errors = [];

  constructor() {
    this.errors = [];
  }

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }

  resetErrors() {
    this.errors = [];
  }

  resetSession() {
    this.page = null;
    this.errors = [];
    this.showTransferModal = false;
  }
}
export default new ViewStore();
