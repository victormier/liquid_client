export const toCurrency = (amount, currencyCode) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
  });

export default {
  toCurrency,
};
