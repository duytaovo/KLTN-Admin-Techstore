import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import entityApi from "src/api/entity/entity.api";
import { payloadCreator } from "src/utils/utils";

export const getEntitys = createAsyncThunk(
  "entity/getEntitys",
  payloadCreator(entityApi.getEntitys),
);

export const getDetailEntity = createAsyncThunk(
  "entity/getDetailEntity",
  payloadCreator(entityApi.getDetailEntity),
);
export const addEntity = createAsyncThunk(
  "entity/addEntity",
  payloadCreator(entityApi.addEntity),
);

export const updateEntity = createAsyncThunk(
  "entity/updateEntity",
  payloadCreator(entityApi.updateEntity),
);

export const deleteEntity = createAsyncThunk(
  "entity/deleteEntity",
  payloadCreator(entityApi.deleteEntity),
);

interface IProudct {
  entity: any;
  entityDetail: any;
}

const initialState: IProudct = {
  entity: [],
  entityDetail: {},
};
const entitySlice = createSlice({
  name: "entity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEntitys.fulfilled, (state, { payload }) => {
      state.entity = payload.data;
    });
    builder.addCase(getDetailEntity.fulfilled, (state, { payload }) => {
      state.entityDetail = payload.data?.data;
    });
  },
});

const entityReducer = entitySlice.reducer;
export default entityReducer;

