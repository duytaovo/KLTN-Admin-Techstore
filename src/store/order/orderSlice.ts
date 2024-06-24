import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderApi } from "src/api/order/orderApi.api";
import { payloadCreator } from "src/utils/utils";

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  payloadCreator(orderApi.getPurchases),
);

export const getPurchasesById = createAsyncThunk(
  "orders/getPurchasesById",
  payloadCreator(orderApi.getPurchaseById),
);

export const putOrderSuccess = createAsyncThunk(
  "orders/putOrderSuccess",
  payloadCreator(orderApi.putOrderSuccess),
);

export const putOrderFailed = createAsyncThunk(
  "orders/putOrderFailed",
  payloadCreator(orderApi.putOrderFailed),
);

export const putOrderDelivery = createAsyncThunk(
  "orders/putOrderDelivery",
  payloadCreator(orderApi.putOrderDelivery),
);

export const putOrderConfirm = createAsyncThunk(
  "orders/putOrderConfirm",
  payloadCreator(orderApi.putOrderConfirm),
);

export const putOrderAssign = createAsyncThunk(
  "orders/putOrderAssign",
  payloadCreator(orderApi.putOrderAssign),
);

export const putOrderApprove = createAsyncThunk(
  "orders/putOrderApprove",
  payloadCreator(orderApi.putOrderApprove),
);

export const putOrderReject = createAsyncThunk(
  "orders/putOrderReject",
  payloadCreator(orderApi.putOrderReject),
);

export const putOrderReceive = createAsyncThunk(
  "orders/putOrderReceive",
  payloadCreator(orderApi.putOrderReceive),
);

export const putOrderCancel = createAsyncThunk(
  "orders/putOrderCancel",
  payloadCreator(orderApi.putOrderCancel),
);
const datamau = {
  code: 0,
  message: "",
  data: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 2,
    data: [],
  },
};
const initialState = {
  order: datamau,
  orderDetail: {},
};

export const orders = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrders.fulfilled, (state, { payload }) => {
      state.order = payload.data;
    });
    builder.addCase(getPurchasesById.fulfilled, (state, { payload }) => {
      state.orderDetail = payload.data.data;
    });
  },
});

const orderReducer = orders.reducer;
export default orderReducer;

