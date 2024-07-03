import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "src/api/auth/auth.api";
import { payloadCreator } from "src/utils/utils";

export const getShippers = createAsyncThunk(
  "manageShipper/getShippers",
  payloadCreator(authApi.getShippers),
);

const initialState = {
  shippers: {
    code: 200,
    message: "Requested completed!",
    data: {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      data: [
        {
          id: 1,
          fullName: "",
          phoneNumber: "",
          email: "",
          gender: 1,
          address: "",
          imageUrl: "",
          level: 1,
          levelString: "Bronze",
          isEnable: true,
          areaSign: "",
        },
      ],
    },
  },
};

export const manageShipper = createSlice({
  name: "manageShipper",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getShippers.fulfilled, (state, { payload }) => {
      state.shippers = payload.data;
    });
  },
});

const manageShipperReducer = manageShipper.reducer;
export default manageShipperReducer;

