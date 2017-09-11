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
      field_options {
        name
        localized_name
        option_value
        selected
      }
    }
  }
}
`;

export const createSaltedgeLogin = gql`
  mutation createSaltedgeLogin($saltedgeProviderId: ID!, $credentials: String!) {
    createSaltedgeLogin(saltedgeProviderId: $saltedgeProviderId, credentials: $credentials) {
       id
    }
  }
`;

export const querySaltedgeLogin = gql`
  query saltedgeLogin($id: ID!) {
    saltedge_login(id: $id) {
      id,
      active,
      finished_connecting
    }
  }
`;

export const queryAllAccounts = gql`query allAccounts{
  all_accounts {
    id,
    name
  }
}
`;

export const queryAccount = gql`
  query account($id: ID!) {
    account(id: $id) {
      id,
      currency_code,
      name,
      balance,
      transactions {
        id,
        amount,
        made_on,
        type,
        description,
        category,
        created_at
      }
    }
  }
`;

export default queryAllSaltedgeProviders;
