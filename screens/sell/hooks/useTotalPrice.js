import { useMemo } from "react";

const useTotalPrice = (sellCart, selectedSellPlace) => {
  return useMemo(() => {
    const currency = selectedSellPlace.selectedCurency || {};
    return () => {
      return sellCart
        .reduce((sum, item) => {
          if (item.product.price_rule) {
            return sum + item.product.price_rule.price * item.newQuantity * (currency.rate || 1);
          }
          return sum;
        }, 0)
        .toFixed(2);
    };
  }, [sellCart, selectedSellPlace]);
};

export default useTotalPrice;
