import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commentService } from "src/api/comment/commentApi.api";
import { payloadCreator } from "src/utils/utils";

export const getComments = createAsyncThunk(
  "comments/getComments",
  payloadCreator(commentService.getComment)
);

export const getCommentById = createAsyncThunk(
  "comments/getCommentById",
  payloadCreator(commentService.getCommentById)
);
export const getCommentByProductId = createAsyncThunk(
  "comments/getCommentByProductId",
  payloadCreator(commentService.getCommentByProductId)
);
export const putComments = createAsyncThunk(
  "comments/putComments",
  payloadCreator(commentService.putComment)
);

const CommentDetail = {
  code: 200,
  message: "",
  data: {
    id: 12,
    userId: 2,
    username: "",
    userAvatar: "",
    star: 3,
    comment: "",
    feedbackFilesUrl: [],
  },
};

const initialState = {
  comment: {
    code: 200,
    message: "",
    data: {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      data: [
        {
          id: 12,
          userId: 2,
          username: "",
          userAvatar: "",
          star: 3,
          comment: "",
          feedbackFilesUrl: [],
        },
      ],
    },
  },
  commentByProduct: {
    code: 200,
    data: [
      {
        id: 12,
        userId: 2,
        username: "",
        userAvatar: "",
        star: 3,
        comment: "",
        feedbackFilesUrl: [],
      },
    ],
    message: "",
  },
  commentById: CommentDetail,
};
export const comments = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getComments.fulfilled, (state, { payload }) => {
      state.comment = payload.data;
    });
    builder.addCase(getCommentById.fulfilled, (state, { payload }) => {
      state.commentById = payload.data;
    });
  },
});
const commentsReducer = comments.reducer;
export default commentsReducer;
