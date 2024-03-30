import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const URL = "/manage/order";

export const orderApi = {
  getPurchases({ body, params }: any) {
    return http.post<SuccessResponse<any[]>>(`${URL}`, body, {
      params,
    });
  },
  getPurchaseById(id: any) {
    return http.get<SuccessResponse<any[]>>(`${URL}/${id}`);
  },
  putOrderSuccess(id: any) {
    return http.put(`${URL}/success/${id}`);
  },
  putOrderDelivery(id: any) {
    return http.put(`${URL}/delivery/${id}`);
  },
  putOrderConfirm(id: any) {
    return http.put(`${URL}/confirm/${id}`);
  },
  putOrderCancel(id: any) {
    return http.put(`${URL}/cancel/${id}`);
  },
  putOrderApprove(id: any) {
    return http.put(`${URL}/approve/${id}`);
  },
  putOrderAssign(id: any) {
    return http.put(`${URL}/assign/${id}?shipperId=21`);
  },
  putOrderReceive(id: any) {
    return http.put(`${URL}/receive/${id}`);
  },
  putOrderReject(id: any) {
    return http.put(`${URL}/reject/${id}`);
  },
};

