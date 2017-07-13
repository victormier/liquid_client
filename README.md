# Liquid Client

![CircleCI](https://circleci.com/gh/helloliquid/liquid_client.svg?style=svg&circle-token=a2da33263ba777c1f69feba78c8884d6c9186dce)

Based on [this boilerplate](https://github.com/developer239/ReactReduxApolloGraphQLHotBoilerplate/).

## Docker dev enviornment installation

```bash
docker-compose up
```

---

## Getting started

## About

Backend is provided by **[graph.cool](https://www.graph.cool/)**.

* Hot reloading
* [Webpack2](https://github.com/webpack/webpack)
* [React Apollo](https://github.com/apollographql/react-apollo)
* [React](https://github.com/facebook/react)
* [React Router](https://github.com/rackt/react-router)
* [Redux](https://github.com/rackt/redux)
* [React Router Redux](https://github.com/reactjs/react-router-redux)
* [Redux-form](https://github.com/erikras/redux-form)
* [Jest](https://github.com/facebook/jest)
* [Enzyme](https://github.com/airbnb/enzyme)
* [Redux Dev Tools](https://github.com/gaearon/redux-devtools)
* Docker with hot reloading

## Installation

```bash
npm install
```

## Running dev server

You do **NOT** need to run your own GraphQL server. Simply run the `npm run dev` command. If you want to work with your own backend change the `API_URL` value in `src/config/index.js`.

## Production

If you want to run production with `webpack-dev-server`.

```bash
production:webpack
```

If you would rather use static files use the build command.

```bash
production:build
```

## Running tests

```bash
docker-compose run web test
```

## To do

- [x] Add support for continuous integration with [jenkins](https://github.com/jenkinsci)  or [travis](https://github.com/travis-ci/travis-ci)
- [ ] Add [nightwatch](https://github.com/nightwatchjs/nightwatch) in order to support E2E testing
- [ ] Create separate branch with [immutable](https://github.com/facebook/immutable-js)
- [ ] Create separate branch with [flow](https://github.com/facebook/flow)
- [ ] Add [stylelint](https://github.com/stylelint/stylelint)
- [ ] Write tests for blog/pages
- [ ] Add form validation
- [x] Optimize production build
