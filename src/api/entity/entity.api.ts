import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const entityApi = {
  addEntity(data: any) {
    return http.post("/manage/master-entity-param/create", data);
  },
  getEntitys(params: any) {
    return http.get<SuccessResponse<any>>("/manage/master-entity-param", {
      params,
    });
  },
  getDetailEntity(params: any) {
    return http.get<SuccessResponse<any[]>>(
      `/manage/master-entity-param/${params}`,
    );
  },
  updateEntity({ id, body }: any) {
    return http.put<SuccessResponse<any>>(
      `/manage/master-entity-param/update/${id}`,
      body,
    );
  },
  deleteEntity(idEntity: string[]) {
    return http.delete<SuccessResponse<any>>(
      `/manage/master-entity-param/delete/${idEntity}`,
    );
  },
  getEntityWithPageNumber(pageNumber: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/master-entity-param/${pageNumber}`,
    );
  },
  getEntityWithPageNumberSize(pageNumber: number, pageSize: number) {
    return http.get<SuccessResponse<any>>(
      `/manage/master-entity-param/${pageNumber}/${pageSize}`,
    );
  },
};

export default entityApi;

