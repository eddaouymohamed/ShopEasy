import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { act } from "react";
const initialState = {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultsPerPage: 4,
    totalPages: 0,
    // currentPage:page,
    // productCount,
    reviewSuccess: false,
    reviewLoading: false
}
export const getProduct = createAsyncThunk('product/getProduct', async ({ keyword, page = 1, category }, {
    rejectWithValue
}) => {
    try {
        let link = '/api/v1/products?page=' + page;
        if (category) {
            link += `&category=${category}`
        }
        if (keyword) {
            link += `&keyword=${keyword}`
        }
        const { data } = await axios.get(link)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An Error Occured While Fetching Products');
    }
})
export const getProductDetails = createAsyncThunk('product/getProductDetails', async (id, {
    rejectWithValue
}) => {
    try {
        const link = `/api/v1/product/${id}`;
        const { data } = await axios.get(link)
        console.log('product deteails', data)
        console.log(data)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occured');
    }
})

export const createReview = createAsyncThunk('product/createReview', async ({ rating, comment, productId }, {
    rejectWithValue
}) => {
    try {
        const config = {
            'Content-Type': 'application/json'
        }
        const link = `/api/v1/review`;
        const { data } = await axios.put(link, { rating, comment, productId }, config)
        console.log('product reviews', data)
        // console.log(data)
        return data

    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occured while creating review');
    }
})
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        removeErrors: (state, _action) => {
            state.error = null;
        },
        removeSuccess: (state, _) => {
            state.reviewSuccess = false
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(getProduct.pending, (state, _action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.null=null
                state.products = action.payload.products || [];
                state.productCount = action.payload.productCount || 0;
                state.resultsPerPage = action.payload.resultsPerPage || 4;
                state.totalPages = action.payload.totalPages || Math.ceil(state.products.length / resultsPerPage);
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'SomeThing went wrong';
                state.products = [];

            })
            .addCase(getProductDetails.pending, (state, _action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log('fullfiled res ofproduct', action.payload.product)
                state.product = action.payload?.product || [];

            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'SomeThing went wrong';

            })
            // submit reviewss
            .addCase(createReview.pending, (state, _action) => {
                state.reviewLoading = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.reviewLoading = false;
                state.error = null;
                console.log('fullfiled res of creting product review', action.payload.product);
                state.reviewSuccess = true

            })
            .addCase(createReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.error = action.payload || 'SomeThing went wrong';

            })


    }
})

export default productSlice.reducer;
export const { removeErrors, removeSuccess } = productSlice.actions
