import { SuccessResponse } from "src/types/utils.type";
import http, { http_auth } from "src/utils/http";

const authApi = {
  login(data: any) {
    return http_auth.post("/authenticate", data);
  },
  register(data: any) {
    return http.post("/manage/register", data);
  },
  logout() {
    return http.post("/manage/logout-user", {});
  },
  addUser(data: any) {
    return http.post("/manage/user/create", data);
  },
  getUsers(params: any) {
    return http.get<SuccessResponse<any>>("/manage/user", { params });
  },
  getDetailUser(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/user/${params}`);
  },
  updateUser({ id, body }: any) {
    return http.put<SuccessResponse<any>>(`/manage/user/update/${id}`, body);
  },
  deleteUser(idUser: string) {
    return http.put<SuccessResponse<any>>(`/manage/user/delete/${idUser}`);
  },
};

export default authApi;
