import gql from 'graphql-tag';

export const queryAllSaltedgeProviders = gql`query allSaltedgeProviders{
  all_saltedge_providers {
    id
    country_code
    name
  }
}
`;

export const querySaltedgeProvider = gql`query saltedgeProvider($id: ID!){
  saltedge_provider(id: $id){
    id
    country_code
    name
    required_fields {
      localized_name
      name
      nature
      optional
      position
    }
  }
}
`;

export default queryAllSaltedgeProviders;
