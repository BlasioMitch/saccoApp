/**
 * Formats a number as UGX currency without decimal places
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatUGX = (amount) => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Parses a currency string back to a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} The parsed number
 */
export const parseUGX = (currencyString) => {
  if (!currencyString) return 0;
  // Remove currency symbol, commas and any whitespace
  const numericString = currencyString.replace(/[^0-9]/g, '');
  return parseInt(numericString, 10);
}; 