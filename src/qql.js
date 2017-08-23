import gql from 'graphql-tag';

export const queryAllSaltedgeProviders = gql`query allSaltedgeProviders{
  all_saltedge_providers {
    id
    country_code
    name
  }
}
`;

export default queryAllSaltedgeProviders;
