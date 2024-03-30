import { SuccessResponse } from "./utils.type";

export type AuthResponse = SuccessResponse<{
  accessToken: string;
  token: string;
}>;

export type RefreshTokenReponse = SuccessResponse<{ accessToken: string }>;
