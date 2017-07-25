import restFetch from 'restApi';

export function auth(email, password, sessionStore, viewStore) {
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
              viewStore.addError(message);
            });
          } else {
            viewStore.addError("We couldn't log you in");
          }
        });
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      window.localStorage.setItem('auth_token', data.auth_token);
      sessionStore.currentSession = {  // should this be in an action??
        authToken: data.auth_token,
        userId: data.user_id,
      };
    });
}

export function logout() {
  window.localStorage.removeItem('auth_token');
}
