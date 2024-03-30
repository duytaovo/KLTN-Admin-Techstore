import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { filterApi } from "src/api/filter/filter.api";
import { payloadCreator } from "src/utils/utils";

export const getSort = createAsyncThunk(
  "filter/getSort",
  payloadCreator(filterApi.getSort),
);

export const getFilter = createAsyncThunk(
  "filter/getFilter",
  payloadCreator(filterApi.getFilter),
);

const data = {
  id: 2,
  gateway: "",
  operatingSystem: "",
  monitor: "",
  special: "",
  maximumRam: 0,
  maximumRom: 0,
  processorId: 1,
  processorName: "",
  ramId: 1,
  ramName: "",
  romId: 1,
  romName: "",
  graphicsCardId: 1,
  graphicsCardName: "",
  productInfo: {
    brandId: 1,
    categoryId: 2,
    productId: 16,
    characteristicId: 3,
    productCode: "",
    name: "",
    description: "",
    design: "",
    dimension: "",
    mass: 1.51,
    launchTime: 2028,
    accessories: "",
    productStatus: 100,
    lstProductTypeAndPrice: [
      {
        typeId: 6,
        ram: "",
        storageCapacity: "",
        color: "",
        price: 0.0,
        salePrice: 0.0,
        depotId: 0,
        quantity: 0,
      },
    ],
    lstProductImageUrl: [],
    totalReview: 0,
    star: 0,
    slug: "",
  },
};
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
  sort: [],
  filter: [],
  filterDetail: data,
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSort.fulfilled, (state, { payload }) => {
      state.sort = payload.data;
    });
    builder.addCase(getFilter.fulfilled, (state, { payload }) => {
      state.filter = payload.data;
    });
  },
});

const filterReducer = filterSlice.reducer;
export default filterReducer;

