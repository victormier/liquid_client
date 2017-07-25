import restFetch from 'restApi';
import { addError } from 'actions/Errors';

export function auth(email, password) {
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
              addError(message);
            });
          } else {
            addError("We couldn't log you in");
          }
        });
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      window.localStorage.setItem('auth_token', data.auth_token);
    });
}

export function logout() {
  window.localStorage.removeItem('auth_token');
}
