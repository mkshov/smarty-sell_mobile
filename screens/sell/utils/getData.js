const getData = ({ sellPlaces, sellCurrencies, sellCustomers, savedPlace }) => ({
  places: sellPlaces?.map((place) => ({
    key: [place.type.id, place.name],
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
    key: savedPlace?.type.id,
    value: savedPlace?.name,
  },
  baseCurrency: {
    key: sellCurrencies?.find((currency) => currency.is_base_currency),
    value: sellCurrencies?.find((currency) => currency.is_base_currency).currency.name,
  },
});

export default getData;
