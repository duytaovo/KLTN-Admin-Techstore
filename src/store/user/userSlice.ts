import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { payloadCreator } from "src/utils/utils";
import authApi from "src/api/auth/auth.api";

export const login = createAsyncThunk(
  "auth/login",
  payloadCreator(authApi.login),
);
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  payloadCreator(authApi.register),
);
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  payloadCreator(authApi.logout),
);
export const getUsers = createAsyncThunk(
  "auth/getUsers",
  payloadCreator(authApi.getUsers),
);

export const getDetailUser = createAsyncThunk(
  "auth/getDetailUser",
  payloadCreator(authApi.getDetailUser),
);
export const addUser = createAsyncThunk(
  "auth/addUser",
  payloadCreator(authApi.addUser),
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  payloadCreator(authApi.updateUser),
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  payloadCreator(authApi.deleteUser),
);

interface DecodedToken {
  userId: number;
  permissions: number;
  username: string;
  userUuid: string;
}

type User = {
  id: number;
  fullName: null;
  phoneNumber: string;
  password: string;
  email: string;
  gender: null;
  address: string;
  imageUrl: null;
  level: number;
  levelString: string;
};

interface IUser {
  name: string;
  accessToken: string;
  token: string;
  user: any;
  userWithId: any;
}

const initialState: IUser = {
  name: "admin",
  accessToken: "123",
  token: "",
  user: [],
  userWithId: {},
};
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.accessToken = payload.data.data.accessToken;
      state.token = payload.data.data.token;
    });

    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.user = payload.data;
    });
    builder.addCase(getDetailUser.fulfilled, (state, { payload }) => {
      state.userWithId = payload.data?.data;
    });
  },
});

const userReducer = userSlice.reducer;
export default userReducer;

