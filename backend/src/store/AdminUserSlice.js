import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    errorMsg: null,
    successMsg: null,
    users: [],
    user: {},
    isDeleting: false,
  },
  reducers: {
    initiateCreateUser: (state) => {
      state.isLoading = true;
    },
    createUserSuccess: (state, action) => {
      state.isLoading = false;
      state.successMsg = action.payload;
      toast.success(action.payload);
    },
    createUserFailure: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
      toast.error(action.payload);
    },
    initiateGetUsers: (state) => {
      state.isLoading = true;
    },
    getUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    initiateGetSingleUser: (state) => {
      state.isLoading = true;
    },
    getSingleUserSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    getSingleUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    initiateUpdateUser: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state, action) => {
      state.isLoading = false;
      state.successMsg = action.payload;
      toast.success(action.payload);
    },
    updateUserFailure: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
      toast.error(action.payload);
    },
    initiateDeleteUser: (state) => {
      state.isDeleting = true;
    },
    deleteUserSuccess: (state, action) => {
      state.isDeleting = false;
      state.successMsg = action.payload;
      toast.success(action.payload);
    },
    deleteUserFailure: (state, action) => {
      state.isDeleting = false;
      state.errorMsg = action.payload;
      toast.error(action.payload);
    },
  },
});

export const {
  initiateCreateUser,
  createUserSuccess,
  createUserFailure,
  initiateGetUsers,
  getUsersSuccess,
  getUsersFailure,
  initiateGetSingleUser,
  getSingleUserSuccess,
  getSingleUserFailure,
  initiateUpdateUser,
  updateUserSuccess,
  updateUserFailure,
  initiateDeleteUser,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
