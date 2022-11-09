import { ADD_TO_CART, CHECK_OUT_CART, CHANGE_CART_QTY, REMOVE_CART} from './constants'
const initState = {
    cartCheckout: [],
    cart: JSON.parse(localStorage.getItem('carts'))?JSON.parse(localStorage.getItem('carts')):[],
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
            let data_add_cart = action.payload
            const add_cart = state.cart
            let indexCart = -1;
            indexCart =(JSON.parse(localStorage.getItem('carts'))?JSON.parse(localStorage.getItem('carts')):add_cart).findIndex(value => {
                return value.id === data_add_cart.id
            })
            data_add_cart.quantity=1
            if (indexCart==-1){
                add_cart.push(data_add_cart)
                state = {
                    ...state.cartCheckout,
                    cart:add_cart
                }
            }else{
                add_cart[indexCart].quantity = parseInt(add_cart[indexCart].quantity) + 1
                console.log("Update")
            }
            localStorage.setItem('carts',JSON.stringify(state.cart));
            return state
            
        }
        case CHANGE_CART_QTY:{
            state= {
                ...state,
                cart:state.cart.filter(c=>c.id===action.payload.id?c.quantity=action.payload.quantity:c.quantity),
            }
            localStorage.setItem('carts',JSON.stringify(state.cart));
            return state;
        }
        case REMOVE_CART:{
            state=  {
                ...state,
                cart:state.cart.filter(c=>c.id!==action.payload.id),
            }
            localStorage.setItem('carts',JSON.stringify(state.cart));
            return state;
        }
        default:
            throw new Error('Invalid action!')
    }
}
export { initState }
export default reducer;