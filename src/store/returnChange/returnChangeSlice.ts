import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { unOrderApi } from "src/api/unOrder/orderApi.api";
import { payloadCreator } from "src/utils/utils";

export const getUnOrders = createAsyncThunk(
  "unOrders/getUnOrders",
  payloadCreator(unOrderApi.getPurchases),
);

export const getPurchasesById = createAsyncThunk(
  "unOrders/getPurchasesById",
  payloadCreator(unOrderApi.getPurchaseById),
);

export const putOrderSuccess = createAsyncThunk(
  "unOrders/putOrderSuccess",
  payloadCreator(unOrderApi.putOrderSuccess),
);

export const putOrderDelivery = createAsyncThunk(
  "unOrders/putOrderDelivery",
  payloadCreator(unOrderApi.putOrderDelivery),
);

export const putOrderConfirm = createAsyncThunk(
  "unOrders/putOrderConfirm",
  payloadCreator(unOrderApi.putOrderConfirm),
);

export const putOrderAssign = createAsyncThunk(
  "unOrders/putOrderAssign",
  payloadCreator(unOrderApi.putOrderAssign),
);

export const putUnOrderApprove = createAsyncThunk(
  "unOrders/putUnOrderApprove",
  payloadCreator(unOrderApi.putUnOrderApprove),
);

export const putOrderReject = createAsyncThunk(
  "unOrders/putOrderReject",
  payloadCreator(unOrderApi.putOrderReject),
);

export const putOrderReceive = createAsyncThunk(
  "unOrders/putOrderReceive",
  payloadCreator(unOrderApi.putOrderReceive),
);

export const putOrderCancel = createAsyncThunk(
  "unOrders/putOrderCancel",
  payloadCreator(unOrderApi.putOrderCancel),
);
const datamau = {
  code: 0,
  message: "",
  data: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 2,
    data: {
      content: [],
    },
  },
};
const initialState = {
  unOrder: datamau,
  orderDetail: {},
};

export const unOrders = createSlice({
  name: "unOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnOrders.fulfilled, (state, { payload }) => {
      state.unOrder = payload.data;
    });
    builder.addCase(getPurchasesById.fulfilled, (state, { payload }) => {
      state.orderDetail = payload.data.data;
    });
  },
});

const unOrderReducer = unOrders.reducer;
export default unOrderReducer;

