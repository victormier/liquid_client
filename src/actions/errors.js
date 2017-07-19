import uuid from 'uuid/v4';
import _ from 'lodash';
import viewStore from 'stores/ViewStore';

class ErrorMessage {
  constructor(message) {
    this.message = message;
    this.id = ErrorMessage.generateId();
  }

  static generateId() {
    let id = uuid();
    while (_.find(viewStore.errors, { id })) {
      id = uuid();
    }
    return id;
  }
}

export const removeError = (errorMessageId) => {
  const errorMessage = _.find(viewStore.errors, { id: errorMessageId });
  viewStore.errors.remove(errorMessage);
};

export const addError = (message) => {
  const errorMessage = new ErrorMessage(message);
  viewStore.errors.push(errorMessage);
  setTimeout(() => {
    removeError(errorMessage.id);
  }, 6000);
};
