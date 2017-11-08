import { mixpanelDateNow } from 'utils/dates';

export const VIEW_PAGE = 'View Page';
export const VIEW_BLOG = 'View blog';
export const INPUT_SIGNUP_EMAIL = 'Input signup email';
export const CLICK_SIGNUP_EMAIL = 'Click sign-up email';
export const VIEW_SIGNUP_PASSWORD_PAGE = 'View signup password page';
export const SETUP_SIGNUP_PASSWORD = 'Set-up signup password';
export const SEARCH_BANK = 'Search bank';
export const SELECT_BANK = 'Select bank';
export const CONNECT_BANK_FIRST_STEP = 'Connect bank first step';
export const CONNECT_BANK_INTERACTIVE = 'Connect bank interactive';
export const CONNECT_BANK = 'Connect bank';
export const VIEW_ACCOUNTS = 'View accounts';
export const VIEW_ACCOUNT_TRANSACTIONS = 'View account transactions';
export const VIEW_TRANSACTION_DETAILS = 'View transaction details';
export const VIEW_INSIGHTS = 'View insights';
export const INSIGHTS_SWITCH_MONTH = 'Insights switch month';
export const VIEW_SETTINGS = 'View settings';
export const START_TRANSFER = 'Start transfer';
export const SELECT_ORIGIN_ACCOUNT = 'Select origin account';
export const SELECT_DESTINATION_ACCOUNT = 'Select destination account';
export const TRANSFER_COMPLETE = 'Transfer complete';
export const END_SESSION = 'End session';
export const LOGOUT = 'Log-out';

export const mixpanelEventProps = eventName => ({
  [`Last ${eventName}`]: mixpanelDateNow(),
  'Previous Event Name': eventName,
});
