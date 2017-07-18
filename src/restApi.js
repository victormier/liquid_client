import { API_URL } from 'config';

const restFetch = (url, params) => {
  const opts = Object.assign(params);
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  return fetch(API_URL + url, params);
};

export default restFetch;
