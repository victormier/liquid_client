import { observable, computed, extendObservable, action } from 'mobx';
import uuid from 'uuid/v4';
import _ from 'lodash';

class ErrorMessage {
  constructor(message, id) {
    this.message = message;
    this.id = id;
  }
}

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

  @action removeError(errorMessageId) {
    const errorMessage = _.find(this.errors, { id: errorMessageId });
    this.errors.remove(errorMessage);
  }

  @action addError(message) {
    const errorMessage = new ErrorMessage(message, this.generateErrorId());
    this.errors.push(errorMessage);

    const that = this;
    setTimeout(() => {
      that.removeError(errorMessage.id);
    }, 6000);
  }

  generateErrorId() {
    let id = uuid();
    while (_.find(this.errors, { id })) {
      id = uuid();
    }
    return id;
  }
}
export default ViewStore;
