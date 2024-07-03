import axios, { AxiosError, type AxiosInstance } from "axios";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import { AuthResponse, RefreshTokenReponse } from "src/types/auth.type";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
} from "./auth";
import { isAxiosUnauthorizedError } from "./utils";
import { ErrorResponse } from "src/types/utils.type";

export const URL_LOGIN = "/authenticate";
export const URL_REGISTER = "register";
export const URL_LOGOUT = "logout";
export const URL_REFRESH_TOKEN = "/refreshToken";

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  constructor(url: string) {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: url,
      // timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        // "expire-access-token": 60 * 60 * 24, // 1 ngày
        // "expire-refresh-token": 60 * 60 * 24 * 160, // 160 ngày
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN) {
          const data = response.data as AuthResponse;
          this.accessToken = data.data.accessToken;
          this.refreshToken = data.data.token;
          setAccessTokenToLS(this.accessToken);
          setRefreshTokenToLS(this.refreshToken);
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLS();
        }
        return response;
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
            HttpStatusCode.Forbidden,
          ].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }
        if (
          isAxiosUnauthorizedError<
            ErrorResponse<{ name: string; message: string }>
          >(error)
        ) {
          const config: any = error.response?.config || {};
          const { url } = config;

          if (
            url !== URL_REFRESH_TOKEN &&
            error.response?.status == HttpStatusCode.Forbidden
          ) {
            // Hạn chế gọi 2 lần handleRefreshToken
            this.accessToken = "";
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((accessToken) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: accessToken },
              });
            });
          }

          clearLS();
          this.accessToken = "";
          this.refreshToken = "";
          toast.error(
            error.response?.data.data?.message || error.response?.data.message,
          );
          // window.location.reload();
        }
        return Promise.reject(error);
      },
    );
  }
  private handleRefreshToken() {
    console.log(this.refreshToken)
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        token: this.refreshToken,
      })
      .then((res) => {
        const { accessToken } = res.data.data;
        setAccessTokenToLS(accessToken);
        this.accessToken = accessToken;
        return accessToken;
      })
      .catch((error) => {
        clearLS();
        this.accessToken = "";
        this.refreshToken = "";
        throw error;
      });
  }
}
const http = new Http("http://localhost:8081/api").instance;
// const http = new Http("http://54.255.223.29/api").instance;
// export const http_auth = new Http("http://54.255.223.29/api").instance;
export const http_auth = new Http("http://localhost:8081/api").instance;
export default http;

