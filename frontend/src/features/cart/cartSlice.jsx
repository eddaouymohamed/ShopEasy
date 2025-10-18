import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) ||[],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId:null,
    shippingInfo:JSON.parse(localStorage.getItem('shippingInfo')) ||{}

}
export const addItemsToCart = createAsyncThunk('cart/addItemsToCart', async ({ id, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        return {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.image[0].url,
            stock: data.product.stock,
            quantity

        }

    }
    catch (error) {
        return rejectWithValue(error.response?.data || 'An Error Occured');
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        removeErrors: (state) => {
            state.error = null
        },
        removeSuccess:(state)=>{
            state.success=null;
        },

        removeMessage: (state) => {
            state.message = null
        },
        removeItemFromCart: (state,action) => {
            state.removingId=action.payload
            state.cartItems=state.cartItems.filter(item=>item.product!==state.removingId);
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
            state.removingId=null
        },

        saveShipingInfo: (state,action) => {
            state.shippingInfo=action.payload;
            localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
        },
        clearCart:(state,_action)=>{
    state.cartItems=[]
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingInfo');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemsToCart.pending, (state) => {
                state.loading = true
                state.error = null

            })
            .addCase(addItemsToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const item = action.payload;
                // console.log(item)
                const existingItem=state.cartItems.find(i=>i.product===item.product);
                if(existingItem){
                    existingItem.quantity=item.quantity
                    state.message=`updated ${item.name} quantity`;
                }
                else{
                    state.cartItems.push(item);
                    state.message = `${item.name} successfully added to cart`;
                }
                console.log(current(state.cartItems));
                localStorage.setItem('cartItems',JSON.stringify(state.cartItems));
                // console.log(state.message)
                state.success = true

            })
            .addCase(addItemsToCart.rejected, (state, action) => {
                state.loading=false
                state.error=action.payload?.message
                // console.log(current(state.error))

            })
    }
})
export default cartSlice.reducer;
export const { removeErrors, removeMessage ,clearCart,removeItemFromCart,saveShipingInfo,removeSuccess} = cartSlice.actions;