/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import { createSlice } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  getMeAPI,
  updateUserInfoAPI,
  updateUserPasswordAPI,
} from "../../WebApi";
import { getCartList, setCartList } from "./cartReducer";

export const userSlice = createSlice({
  name: "user",
  initialState: { user: null, errorMessage: "" },
  reducers: {
    setUser: (state, action) => {
      console.log("payload", action.payload);
      state.user = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
});

// action
export const { setUser, setErrorMessage } = userSlice.actions;

// redux thunk function
export const getMe = () => (dispatch) => {
  dispatch(setUser(null));
  dispatch(setErrorMessage(""));
  getMeAPI().then((res) => {
    if (!res || res.ok === 0)
      return dispatch(
        setErrorMessage(res ? res.errorMessage : "something wrong")
      );
    dispatch(setUser(res.data.user));
  });
};

export const login = (email, password) => (dispatch) => {
  dispatch(setErrorMessage(""));
  if (!email || !password) return dispatch(setErrorMessage("missing field"));
  loginAPI(email, password).then((res) => {
    if (res.ok === 0) return dispatch(setErrorMessage(res.errorMessage));
    const token = res.data.user.token;
    localStorage.setItem("token", token);
    dispatch(getCartList());
    dispatch(setUser(res.data.user));
  });
};
export const register = (email, password, confirm, nickname) => (dispatch) => {
  dispatch(setErrorMessage(""));
  if (!email || !password || !confirm || !nickname)
    return console.log("missing field");
  registerAPI(email, password, confirm, nickname).then((res) => {
    if (res.ok === 0) return console.log(res.errorMessage);
    const token = res.data.user.token;
    dispatch(setUser(res.data.user));
    localStorage.setItem("token", token);
  });
};
export const logout = () => (dispatch) => {
  dispatch(setUser(null));
  dispatch(setCartList([]));
  localStorage.setItem("token", null);
};
export const updateUserInfo = (id, email, nickname, authType) => (dispatch) => {
  dispatch(setErrorMessage(""));
  updateUserInfoAPI(id, email, nickname, authType).then((res) => {
    if (res.ok === 0) return dispatch(setErrorMessage(res.errorMessage));
    dispatch(setUser(res.data.user));
  });
};
export const updateUserPassword = (id, password, confirm) => (dispatch) => {
  dispatch(setErrorMessage(""));
  if (password !== confirm)
    return dispatch(setErrorMessage("密碼和確認密碼不同"));
  updateUserPasswordAPI(id, password).then((res) => {
    if (res.ok === 0) return dispatch(setErrorMessage(res.errorMessage));
    dispatch(setUser(res.data.user));
  });
};
// selector
export const selectUser = (store) => store.user.user;
export const selectErrorMessage = (store) => store.user.errorMessage;

export default userSlice.reducer;
