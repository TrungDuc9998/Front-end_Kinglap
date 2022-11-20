import { ADD_TO_CART, CHECK_OUT_CART, CHANGE_CART_QTY, REMOVE_CART, VIEW_PRODUCT } from './constants'
const initState = {
    cartCheckout: [],
    cart: JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : [],
    product_view: {}
}
function reducer(state, action) {

    switch (action.type) {
        case CHECK_OUT_CART: {
            return {
                ...state,
                cartCheckout: action.payload,
            }
        }
        case ADD_TO_CART: {
            state = {
                ...state.cartCheckout,
                cart: [...state.cart, { ...action.payload, quantity: 1, total: 0 }],
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
            let data_add_cart = action.payload
            let add_cart = JSON.parse(localStorage.getItem('carts')) ? JSON.parse(localStorage.getItem('carts')) : []
            let indexCart = -1;
            if (add_cart) {
                indexCart = add_cart.findIndex(value => {
                    return value.id === data_add_cart.id
                })
            }
            data_add_cart.quantity = 1
            if (indexCart === -1) {
                add_cart.push(data_add_cart)
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
            } else {
                add_cart[indexCart].quantity += 1
                state = {
                    ...state.cartCheckout,
                    cart: add_cart
                }
                console.log("Update")
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state

        }
        case CHANGE_CART_QTY: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id === action.payload.id ? c.quantity = action.payload.quantity : c.quantity),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
        }
        case REMOVE_CART: {
            state = {
                ...state,
                cart: state.cart.filter(c => c.id !== action.payload.id),
            }
            localStorage.setItem('carts', JSON.stringify(state.cart));
            return state;
        }

        case VIEW_PRODUCT: {
            state = {
                ...state,
                product_view: action.payload
            }
            localStorage.setItem('product_view', JSON.stringify(state.product_view));
            return state;
        }
        default:
            throw new Error('Invalid action!')
    }
}
export { initState }
export default reducer;