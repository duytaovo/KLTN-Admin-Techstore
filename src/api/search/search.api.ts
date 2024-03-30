import http from "src/utils/http";

export const searchApi = {
  getResultSearchApi(params: any) {
    return http.get(`/search`, { params });
  },
};

