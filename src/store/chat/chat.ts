import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { chatApi } from "src/api/chat/chat.api";
import { payloadCreator } from "src/utils/utils";

export const getChatUsers = createAsyncThunk(
  "chat/getChatUsers",
  payloadCreator(chatApi.getChatUsers),
);

export const getChatUserById = createAsyncThunk(
  "chat/getChatUserById",
  payloadCreator(chatApi.getChatUserById),
);

export const uploadImage = createAsyncThunk(
  "chat/uploadImage",
  payloadCreator(chatApi.uploadImage),
);

export const uploadManyImages = createAsyncThunk(
  "chat/uploadManyImages",
  payloadCreator(chatApi.uploadManyImages),
);

const initialState = {
  chats: {
    code: 0,
    message: "",
    data: [
      {
        id: 0,
        fullName: "",
        phoneNumber: "",
        password: "",
        email: "",
        gender: 0,
        address: "",
        imageUrl: "",
        level: 0,
        levelString: "",
        isEnable: true,
      },
    ],
  },
  chatByUser: {
    code: 0,
    message: "",
    data: [
      // {
      //   // senderId: 0,
      //   // senderName: "Duy Tạo",
      //   // receiverId: 1,
      //   // receiverName: "Anh Tài",
      //   // message: "test",
      //   // date: "2024-03-20T13:05:55.878566",
      //   // status: "JOIN",
      // },
    ],
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatByUser: (state: any, action: PayloadAction<any>) => {
      state.chatByUser.data = [action.payload, ...state.chatByUser.data];
    },
    resetChatByUser: (state) => {
      state.chatByUser.data = [...state.chatByUser.data];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatUsers.fulfilled, (state, { payload }) => {
      state.chats = payload.data;
    });
    builder.addCase(getChatUserById.fulfilled, (state, { payload }) => {
      state.chatByUser = payload.data;
    });
  },
});
export const { setChatByUser, resetChatByUser } = chatSlice.actions;

const chatReducer = chatSlice.reducer;
export default chatReducer;

