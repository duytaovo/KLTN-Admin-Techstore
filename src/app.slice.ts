// import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "./store/store";

// export interface LoadingState {
//   value: number;
//   status: "idle" | "loading" | "failed";
// }

// const initialState: LoadingState = {
//   value: 0,
//   status: "idle",
// };

// export const app = createSlice({
//   name: "loading",
//   initialState,
//   reducers: {
//     changePercentLoading: (state, actions: { payload: number }) => {
//       state.value = actions.payload;
//     },
//   },
// });

// export const selectValue = (state: RootState) => state.loading.value;

// export const { changePercentLoading } = app.actions;
// const appReducer = app.reducer;
// export default appReducer;

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store/store";

interface Status {
  status: number | "idle" | "loading" | "failed";
  loading: number;
  value: number;
}

const initialState: Status = {
  status: 200,
  loading: 0,
  value: 0,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    changePercentLoading: (state, actions: { payload: number }) => {
      state.value = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = state.loading + 1;
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = action.payload.status;
          state.loading = state.loading - 1;
        },
      );
  },
});


export const { changePercentLoading } = app.actions;
const appReducer = app.reducer;
export default appReducer;

