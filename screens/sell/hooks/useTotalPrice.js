import { useMemo } from "react";

const useTotalPrice = (sellCart, selectedSellPlace) => {
  return useMemo(() => {
    const currency = selectedSellPlace.selectedCurency || {};
    return () => {
      return sellCart
        .reduce((sum, item) => {
          if (item.product.price_rule) {
            const rate = currency.rate || 1;
            const priceInSelectedCurrency = item.product.price_rule.price * rate;
            const discountedPrice = priceInSelectedCurrency - (priceInSelectedCurrency * (selectedSellPlace.selectedCustomer?.discount || 0)) / 100;
            return sum + discountedPrice * (item.newQuantity || 0);
          }
          return sum;
        }, 0)
        .toFixed(2);
    };
  }, [sellCart, selectedSellPlace]);
};

export default useTotalPrice;
