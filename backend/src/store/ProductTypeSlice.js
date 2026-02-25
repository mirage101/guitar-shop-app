import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const productTypeSlice = createSlice({
  name: "product-type",
  initialState: {
    isLoading: false,
    errorMsg: null,
    successMsg: null,
    productTypes: [],
  },
  reducers: {
    initiateCreateProductType: (state) => {
      state.isLoading = true;
    },
    createProductTypeSuccess: (state, action) => {
      state.isLoading = false;
      state.successMsg = action.payload;
      toast.success(action.payload);
    },
    createProductTypeFailure: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
      toast.error(action.payload);
    },
    initiateGetProductTypes: (state) => {
      state.isLoading = true;
    },
    getProductTypesSuccess: (state, action) => {
      state.isLoading = false;
      state.productTypes = action.payload;
    },
    getProductTypesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
  },
});

export const {
  initiateCreateProductType,
  createProductTypeSuccess,
  createProductTypeFailure,
  initiateGetProductTypes,
  getProductTypesSuccess,
  getProductTypesFailure,
} = productTypeSlice.actions;

export default productTypeSlice.reducer;
