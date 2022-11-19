import { ADD_TO_CART, CHECK_OUT_CART, VIEW_PRODUCT } from './constants';

export const addToCart = payload => ({
    type: ADD_TO_CART,
    payload
})
export const setCheckoutCart = payload => ({
    type: CHECK_OUT_CART,
    payload
})
export const viewProduct = payload => ({
    type: VIEW_PRODUCT,
    payload
})