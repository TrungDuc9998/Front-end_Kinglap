import { ADD_TO_CART, ADD_TO_CART_BY_VIEW, CHECK_OUT_CART, VIEW_PRODUCT } from './constants';

export const addToCart = payload => ({
    type: ADD_TO_CART,
    payload
})
export const addToCartByView = payload => ({
    type: ADD_TO_CART_BY_VIEW,
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