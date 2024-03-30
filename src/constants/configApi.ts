const apiProduction = "http://localhost:8081/api/manage/";
const apiDev = "http://localhost:8081/api/manage/";
const config = {
  baseUrl: import.meta.env.MODE === "production" ? apiProduction : apiDev,
  maxSizeUploadImage: 2048576, // bytes
  shopId: 4716813,
  tokenStore: "9c800251-8994-11ee-b394-8ac29577e80e",
};
export default config;

