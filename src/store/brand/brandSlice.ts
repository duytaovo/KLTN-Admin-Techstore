import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import brandApi from "src/api/brand/brand.api";
import { payloadCreator } from "src/utils/utils";

export const getBrands = createAsyncThunk(
  "brand/getBrands",
  payloadCreator(brandApi.getBrands),
);

export const getDetailbrand = createAsyncThunk(
  "brand/getDetailBrand",
  payloadCreator(brandApi.getDetailBrand),
);
export const addBrand = createAsyncThunk(
  "brand/addBrand",
  payloadCreator(brandApi.addBrand),
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  payloadCreator(brandApi.updateBrand),
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  payloadCreator(brandApi.deleteBrand),
);

interface IProudct {
  brand: any;
  brandDetail: any;
}

const initialState: IProudct = {
  brand: [],
  brandDetail: {},
};
const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBrands.fulfilled, (state, { payload }) => {
      state.brand = payload.data;
    });
    builder.addCase(getDetailbrand.fulfilled, (state, { payload }) => {
      state.brandDetail = payload.data?.data;
    });
  },
});

const brandReducer = brandSlice.reducer;
export default brandReducer;

