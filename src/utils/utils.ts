import axios, { AxiosError } from "axios";
import config from "src/constants/configApi";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { ErrorResponse } from "src/types/utils.type";

export const payloadCreator =
  (asyncFunc: any) => async (arg: any, thunkAPI: any) => {
    try {
      const res = await asyncFunc(arg);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  };

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(
  error: unknown,
): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  );
}

export function isAxiosUnauthorizedError<UnauthorizedError>(
  error: unknown,
): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosError(error) && error.response?.status === HttpStatusCode.Forbidden
  );
}

export function isAxiosExpiredTokenError<UnauthorizedError>(
  error: unknown,
): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(
      error,
    ) && error.response?.data?.data?.name === "EXPIRED_TOKEN"
  );
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    "",
  );

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(Number(currency));
}
export const getIdFromNameId = (nameId: string) => {
  const idProduct = nameId?.split("-id-")[1];
  const slug = nameId?.split("-slug-")[1]?.split("-idCategory-")[0];
  const idCategory = nameId?.split("-idCategory-")[1]?.split("-id-")[0];
  return {
    slug,
    idCategory,
    idProduct,
  };
};

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

export const rateSale = (original: number, sale: number) =>
  Math.round(((original - sale) / original) * 100) + "%";

export const generateNameId = ({
  name,
  slug,
  idCategory,
  id,
}: {
  name: string;
  id: string;
  slug: string;
  idCategory: string | number;
}) => {
  return (
    removeSpecialCharacter(name).replace(/\s/g, "-") +
    `-slug-${slug}` +
    `-idCategory-${idCategory}` +
    `-id-${id}`
  );
};
export const getAvatarUrl = (avatarName?: string) =>
  avatarName ? `${avatarName}` : "";

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

