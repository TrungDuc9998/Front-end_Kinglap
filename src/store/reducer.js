import { ADD_TO_CART, CHECK_OUT_CART } from './constants'
const initState = {
    cartCheckout: [],
    cart: {
        products: []
    }
}

function reducer(state, action) {
    switch (action.type) {
        case CHECK_OUT_CART: {
            return {
                cartCheckout: action.payload
            }
        }
        case ADD_TO_CART: {
            // chức năng
        }
        default:
            throw new Error('Invalid action!')
    }
}
export { initState }
export default reducer;