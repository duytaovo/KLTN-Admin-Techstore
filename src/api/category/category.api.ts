import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const categoryApi = {
  addCategory(data: any) {
    return http.post("/manage/category/create", data);
  },
  getCategorys(params: any) {
    return http.get<SuccessResponse<any>>("/manage/category", { params });
  },
  getCategorysSlug(params: any) {
    return http.get<SuccessResponse<any>>("/manage/category/slug", { params });
  },
  getDetailCategory(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/category/${params}`, {
      params,
    });
  },
  updateCategory({ _id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/category/update/${_id}`,
      body,
    );
  },
  deleteCategory(idcategory: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/category/delete/${idcategory}`,
    );
  },
};

export default categoryApi;

