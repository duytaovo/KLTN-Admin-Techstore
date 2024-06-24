import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { payloadCreator } from "src/utils/utils";
import authApi from "src/api/auth/auth.api";
import statisticApi from "src/api/statistic/statistic.api";

export const getStatistic = createAsyncThunk(
  "statistic/getStatistic",
  payloadCreator(statisticApi.getStatic),
);

const statistic = {
  profits: [],
  users: [],
  orders: [],
  ordersPaid: [],
  productTypes: [],
  productsBestSeller: [],
  lastOrders: [],
};

const initialState = {
  statistic,
};
const statisticSlice = createSlice({
  name: "statistic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatistic.fulfilled, (state, { payload }) => {
      state.statistic = payload.data.data;
    });
  },
});

const statisticReducer = statisticSlice.reducer;
export default statisticReducer;

