export const exchangeRates = {
  USD: 1, // Базовая валюта (например, доллар США)
  KGS: 87.5, // Курс сома относительно доллара
  // добавьте другие валюты, если необходимо
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rateFromBase = exchangeRates[fromCurrency];
  const rateToBase = exchangeRates[toCurrency];

  return (amount / rateFromBase) * rateToBase;
};
