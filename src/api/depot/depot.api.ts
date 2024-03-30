import { SuccessResponse } from "src/types/utils.type";
import http, { http_auth } from "src/utils/http";

const depotApi = {
  getdepots() {
    return http_auth.get<SuccessResponse<any>>("/depot");
  },
  getDetailDepot(params: any) {
    return http_auth.get<SuccessResponse<any[]>>(`/depot/${params}`, {
      params,
    });
  },
};

export default depotApi;
