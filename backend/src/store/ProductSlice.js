import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    isLoading: false,
    errorMsg: null,
    successMsg: null,
    products: [],
  },
  reducers: {
    initiateCreateProduct: (state) => {
      state.isLoading = true;
    },
    createProductSuccess: (state, action) => {
      state.isLoading = false;
      state.successMsg = action.payload;
    },
    createProductFailure: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
    },
    initiateGetProducts: (state) => {
      state.isLoading = true;
    },
    getProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    },
    getProductsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  initiateCreateProduct,
  createProductSuccess,
  createProductFailure,
  initiateGetProducts,
  getProductsSuccess,
  getProductsFailure,
} = productSlice.actions;

export default productSlice.reducer;
