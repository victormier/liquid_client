import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import client from 'config/apolloClient';
import { reducer as reduxForm } from 'redux-form';


const rootReducer = combineReducers({
  routing: routerReducer,
  form: reduxForm,
  apollo: client.reducer(),
});

export default rootReducer;
