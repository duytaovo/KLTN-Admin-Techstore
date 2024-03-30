import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const voucherApi = {
  addVoucher(data: any) {
    return http.post("/manage/voucher/create", data);
  },
  getVouchers(params: any) {
    return http.get<SuccessResponse<any>>("/manage/voucher", { params });
  },
  getDetailVoucher(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/voucher/${params}`);
  },
  updateVoucher({ id, body }: any) {
    return http.put<SuccessResponse<any>>(`/manage/voucher/update/${id}`, body);
  },
  deleteVoucher(idVoucher: string[]) {
    return http.delete<SuccessResponse<any>>(
      `/manage/voucher/delete/${idVoucher}`,
    );
  },
  getVoucherWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(`/manage/voucher/${pageNumber}`);
  },
  getVoucherWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/voucher/${pageNumber}/${pageSize}`,
    );
  },
};

export default voucherApi;

