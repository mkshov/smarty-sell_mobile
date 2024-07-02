const getData = ({ sellPlaces, sellCurrencies, sellCustomers, savedPlace }) => ({
  places: sellPlaces?.map((place) => ({
    key: { id: place.type.id, name: place.name },
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
    key: { id: savedPlace?.type.id, name: savedPlace?.name },
    value: savedPlace?.name,
  },
  baseCurrency: {
    key: {
      id: sellCurrencies?.find((currency) => currency.is_base_currency).currency.id,
      name: sellCurrencies?.find((currency) => currency.is_base_currency).currency.name,
      rate: sellCurrencies?.find((currency) => currency.is_base_currency).rate,
    },
    value: sellCurrencies?.find((currency) => currency.is_base_currency).currency.name,
  },
});

export default getData;
