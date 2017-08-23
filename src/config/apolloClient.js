import ApolloClient, {
  createNetworkInterface,
  addTypeName,
} from 'apollo-client';
import { API_URL } from './index';

const networkInterface = createNetworkInterface({
  uri: `${API_URL}/graphql`,
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    const token = window.localStorage.getItem('auth_token');
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  },
}]);

const client = new ApolloClient({
  networkInterface,
  queryTransformer: addTypeName,
  dataIdFromObject: o => o.id,
});

export default client;
