import { ADD_TO_CART, CHECK_OUT_CART } from './constants';

export const setCheckoutCart = payload => ({
    type: CHECK_OUT_CART,
    payload
})
export const addToCart = payload => ({
    type: ADD_TO_CART,
    payload
})
