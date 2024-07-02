import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

export const chatApi = {
  getChatUserById(id: number) {
    return http.get(`/user/chat-user/${id}`);
  },
  getChatUsers() {
    return http.get(`/user/chat-user`);
  },
  uploadImage(body: any) {
    console.log("object" + JSON.stringify(body));
    return http.post<SuccessResponse<string>>(
      "/file/system/upload",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => {
          return body;
        },
      },
    );
  },
  uploadManyImages(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

