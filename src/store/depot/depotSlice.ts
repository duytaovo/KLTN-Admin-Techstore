import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import depotApi from "src/api/depot/depot.api";
import { payloadCreator } from "src/utils/utils";

export const getdepots = createAsyncThunk(
  "depot/getdepots",
  payloadCreator(depotApi.getdepots),
);

export const getDetailDepot = createAsyncThunk(
  "depot/getDetailDepot",
  payloadCreator(depotApi.getDetailDepot),
);

interface IProudct {
  depot: any;
  depotDetail: any;
}

const initialState: IProudct = {
  depot: [],
  depotDetail: {},
};
const depotSlice = createSlice({
  name: "depot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getdepots.fulfilled, (state, { payload }) => {
      state.depot = payload.data;
    });
    builder.addCase(getDetailDepot.fulfilled, (state, { payload }) => {
      state.depotDetail = payload.data?.data;
    });
  },
});

const depotReducer = depotSlice.reducer;
export default depotReducer;

