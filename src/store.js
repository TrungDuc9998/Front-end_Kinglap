import { createContext, useContext } from "react";
import DiscountStore from "./pages/Tag/DiscountStore";

export const store = {
  discountStore: new DiscountStore(),
}; 

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

