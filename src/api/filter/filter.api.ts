import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

export const filterApi = {
  getSort() {
    return http.get<SuccessResponse<any>>("/sort", {});
  },

  getFilter(params: string) {
    return http.get<SuccessResponse<any[]>>(`/filter`, { params });
  },

  getSeatch(params: string) {
    return http.get<SuccessResponse<any[]>>(`/search`, { params });
  },
  getProductsFilterAccess({ body, params }: any) {
    return http.post(`/search/filter`, body, { params: params });
  },
};

