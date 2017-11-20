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

export const reconnectSaltedgeLogin = gql`
  mutation reconnectSaltedgeLogin($saltedgeLoginId: ID!, $credentials: String!) {
    reconnectSaltedgeLogin(saltedgeLoginId: $saltedgeLoginId, credentials: $credentials) {
       id
    }
  }
`;

export const querySaltedgeLogin = gql`
  query saltedgeLogin($id: ID!) {
    saltedge_login(id: $id) {
      id,
      active,
      finished_connecting,
      killed,
      error_message,
      saltedge_provider {
        id
      }
    }
  }
`;

export const queryAllSaltedgeLogins = gql`query allSaltedgeLogins{
  all_saltedge_logins {
    id,
    needs_reconnection
  }
}
`;

export const queryAllAccounts = gql`query allAccounts{
  all_accounts {
    id,
    name,
    balance,
    currency_code
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

export const createVirtualAccount = gql`
  mutation createVirtualAccount($name: String!) {
    createVirtualAccount(name: $name) {
      id,
      name,
      balance,
      currency_code
    }
  }
`;

export const queryUser = gql`
  query user {
    user {
      id,
      email,
      bank_connection_phase,
      saltedge_logins {
        id,
        active,
        finished_connecting,
        needs_reconnection,
        killed,
        saltedge_provider {
          id,
          name
        }
      },
      accounts {
        id,
        balance,
        name
      }
    }
  }
`;

export const createTransaction = gql`
  mutation createVirtualTransaction($originAccountId: ID!, $destinationAccountId: ID!, $amount: Float!) {
    createVirtualTransaction(origin_account_id: $originAccountId, destination_account_id: $destinationAccountId, amount: $amount)
  }
`;

export const queryTransaction = gql`
  query transaction($id: ID!) {
    transaction(id: $id) {
      id,
      amount,
      made_on,
      type,
      description,
      category,
      created_at,
      virtual_account {
        name,
        currency_code
      }
    }
  }
`;

export const queryInsights = gql`
  query insights($month: Int!, $year: Int!) {
     insights(month: $month, year: $year){
      total_income,
      total_expense,
      mirror_account {
        id,
        currency_code,
      },
      income_transactions {
        id,
        amount,
        description,
        made_on
      },
      category_insights {
        name,
        amount,
        percentage
      }
    }
  }
`;

export const queryAllInsights = gql`
  query allInsights {
     all_insights {
      start_date,
      end_date,
      total_income,
      total_expense,
      total_balance,
      mirror_account {
        currency_code
      }
    }
  }
`;

export const queryPercentageRule = gql`
  query percentageRule {
    percentage_rule {
      id,
      active,
      minimum_amount,
      percentage,
      destination_virtual_account {
        id,
        name
      }
    }
  }
`;

export const updatePercentageRule = gql`
  mutation updatePercentageRule($active: Boolean!, $minimumAmount: Float!, $percentage: Float!, $percentageRuleId: ID!) {
    updatePercentageRule(active: $active, minimum_amount: $minimumAmount, percentage: $percentage, percentage_rule_id: $percentageRuleId) {
      id
      percentage
      minimum_amount
      active
      destination_virtual_account {
        id,
        name
      }
    }
  }
`;

export const queryAllSaltedgeAccounts = gql`
  query allSaltedgeAccounts {
    all_saltedge_accounts {
      id,
      name,
      balance,
      currency_code,
      selected
    }
  }
`;

export const selectSaltedgeAccount = gql`
  mutation selectAccount($saltedgeAccountId: ID!) {
    selectSaltedgeAccount(saltedge_account_id: $saltedgeAccountId) {
      id,
      name,
      balance,
      currency_code
    }
  }
`;

export default queryAllSaltedgeProviders;
