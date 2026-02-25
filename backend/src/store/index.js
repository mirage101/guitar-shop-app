import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./AdminUserSlice";
import productSliceReducer from "./ProductSlice";
import productTypeSliceReducer from "./ProductTypeSlice";

export const store = configureStore({
  reducer: {
    product: productSliceReducer,
    productType: productTypeSliceReducer,
    user: userSliceReducer,
  },
});
