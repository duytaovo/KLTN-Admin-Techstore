import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import voucherApi from "src/api/voucher/voucher.api";
import { payloadCreator } from "src/utils/utils";

export const getVouchers = createAsyncThunk(
  "voucher/getVouchers",
  payloadCreator(voucherApi.getVouchers),
);

export const getDetailVoucher = createAsyncThunk(
  "voucher/getDetailVoucher",
  payloadCreator(voucherApi.getDetailVoucher),
);
export const addVoucher = createAsyncThunk(
  "voucher/addVoucher",
  payloadCreator(voucherApi.addVoucher),
);

export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  payloadCreator(voucherApi.updateVoucher),
);

export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  payloadCreator(voucherApi.deleteVoucher),
);

interface IProudct {
  voucher: any;
  voucherDetail: any;
}

const initialState: IProudct = {
  voucher: [],
  voucherDetail: {},
};
const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVouchers.fulfilled, (state, { payload }) => {
      state.voucher = payload.data;
    });
    builder.addCase(getDetailVoucher.fulfilled, (state, { payload }) => {
      state.voucherDetail = payload.data?.data;
    });
  },
});

const voucherReducer = voucherSlice.reducer;
export default voucherReducer;

