import ApolloClient, {
  createNetworkInterface,
  addTypeName,
} from 'apollo-client';
import { API_URL } from './index';


const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `${API_URL}/graphql`,
  }),
  queryTransformer: addTypeName,
  dataIdFromObject: o => o.id,
});

export default client;
