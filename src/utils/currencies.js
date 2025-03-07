export const toCurrency = (amount, currencyCode, fractionDigits = 2) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).replace('-', '\u2011');

export default {
  toCurrency,
};
