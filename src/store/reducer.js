import { ADD_TO_CART, CHECK_OUT_CART, CHANGE_CART_QTY, REMOVE_CART} from './constants'
const initState = {
    cartCheckout: [],
    cart: []
}

function reducer(state, action) {
    switch (action.type) {
        case CHECK_OUT_CART: {
            return {
                
                // cart:state.cart.filter(c=>c.id!==action.payload.id),
                cartCheckout: action.payload,
            }
        }
        case ADD_TO_CART: {
            return {
                ...state,
                cart:  [...state.cart, { ...action.payload, quantity:1, total:0}],
            }
        }
        case CHANGE_CART_QTY:{
            return {
                ...state,
                cart:state.cart.filter(c=>c.id===action.payload.id?c.quantity=action.payload.quantity:c.quantity),
            }
        }
        case REMOVE_CART:{
            return {
                ...state,
                cart:state.cart.filter(c=>c.id!==action.payload.id),
            }
        }
        default:
            throw new Error('Invalid action!')
    }
}
export { initState }
export default reducer;