import { SuccessResponse } from "src/types/utils.type";
import http from "src/utils/http";

const productApi = {
  addProduct(data: any) {
    return http.post("/manage/product/create", data);
  },
  getProducts({ body, params }: any) {
    return http.post<SuccessResponse<any>>("/manage/product", body, {
      params,
    });
  },
  exportProducts(params: any) {
    return http.get<SuccessResponse<any>>(
      `/manage/product/export?slug=${params}`,
    );
  },

  importProduct({ body, params }: any) {
    return http.post<SuccessResponse<string>>(
      `/manage/product/import?slug=${params}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
  downloadProduct(params: any) {
    return http.get<SuccessResponse<any>>("/manage/product/download-template", {
      params,
    });
  },

  getDetailProduct(params: any) {
    return http.get<SuccessResponse<any[]>>(`/manage/product/${params}`);
  },
  updateProduct({ id, body }: any) {
    return http.put<SuccessResponse<any>>(`/manage/product/update/${id}`, body);
  },
  deleteProduct(idProduct: string[]) {
    return http.put<SuccessResponse<any>>(
      `/manage/product/delete/${idProduct}`,
    );
  },
  uploadImageProduct(body: FormData) {
    return http.post<SuccessResponse<string>>("/file/system/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadManyImagesProduct(body: any) {
    return http.post<SuccessResponse<string>>("/file/s3/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProductByProductSlugId({ slug, id }: { slug: string; id: string }) {
    return http.get(`/product/${slug}/${id}`);
  },
};

export default productApi;

