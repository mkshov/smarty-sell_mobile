const getData = ({ sellPlaces, sellCurrencies, sellCustomers, savedPlace }) => {
  // Найти базовую валюту
  const baseCurrency = sellCurrencies?.find((currency) => currency.is_base_currency) || sellCurrencies?.[0];

  return {
    places: sellPlaces?.map((place) => ({
      key: { id: place.id, name: place.name },
      value: place.name,
    })),
    currencies: sellCurrencies?.map((currency) => ({
      key: { id: currency.currency.id, name: currency.currency.name, rate: currency.rate },
      value: currency.currency.name,
    })),
    customers: sellCustomers?.map((customer) => ({
      key: { id: customer.id, discount: customer.percentage_discount },
      value: `${customer.name} - Скидка ${customer.percentage_discount}%`,
    })),
    basePlace: {
      key: { id: savedPlace?.id, name: savedPlace?.name },
      value: savedPlace?.name,
    },
    baseCurrency: {
      key: {
        id: baseCurrency.currency.id,
        name: baseCurrency.currency.name,
        rate: baseCurrency.rate,
      },
      value: baseCurrency.currency.name,
    },
  };
};

export default getData;
