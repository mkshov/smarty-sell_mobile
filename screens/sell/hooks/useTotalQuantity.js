import { useMemo } from "react";

const useTotalQuantity = (sellCart) => {
  return useMemo(() => {
    return sellCart.reduce((sum, item) => sum + item.newQuantity, 0);
  }, [sellCart]);
};

export default useTotalQuantity;
