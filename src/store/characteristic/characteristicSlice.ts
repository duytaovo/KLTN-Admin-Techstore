import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import characterApi from "src/api/characteristic/characteristic.api";
import { payloadCreator } from "src/utils/utils";

export const getCharacters = createAsyncThunk(
  "character/getCharacters",
  payloadCreator(characterApi.getCharacters),
);

export const getDetailCharacter = createAsyncThunk(
  "character/getDetailCharacter",
  payloadCreator(characterApi.getDetailCharacter),
);
export const addCharacter = createAsyncThunk(
  "character/addCharacter",
  payloadCreator(characterApi.addCharacter),
);

export const updateCharacter = createAsyncThunk(
  "character/updateCharacter",
  payloadCreator(characterApi.updateCharacter),
);

export const deleteCharacter = createAsyncThunk(
  "character/deleteCharacter",
  payloadCreator(characterApi.deleteCharacter),
);

interface IProudct {
  character: any;
  characterDetail: any;
}

const initialState: IProudct = {
  character: [],
  characterDetail: {},
};
const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCharacter.fulfilled, (state, { payload }) => {
      state.character = payload.data;
    });
    builder.addCase(getCharacters.fulfilled, (state, { payload }) => {
      state.character = payload.data;
    });
    builder.addCase(getDetailCharacter.fulfilled, (state, { payload }) => {
      state.characterDetail = payload.data?.data;
    });
  },
});

const characterReducer = characterSlice.reducer;
export default characterReducer;

