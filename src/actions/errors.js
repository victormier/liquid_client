import viewStore from 'stores/ViewStore';

export const removeError = (message) => {
  viewStore.errors.remove(message);
};

export const addError = (message) => {
  viewStore.errors.push(message);
  setTimeout(() => {
    removeError(message);
  }, 6000);
};
