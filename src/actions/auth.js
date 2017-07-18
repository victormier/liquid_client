import restFetch from 'restApi';
import sessionStore from 'stores/SessionStore';
import { addError } from 'actions/Errors';

export function auth(email, password) {
  restFetch('/login', {
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
      localStorage.setItem('auth_token', data.auth_token);
      sessionStore.auth_token = data.auth_token;
    });
}

export function logout() {
  sessionStore.reset();
  localStorage.removeItem('auth_token');
}
