import { http_auth } from "src/utils/http";

const statisticApi = {
  getStatic(data: any) {
    return http_auth.get("/manage/statistic", data);
  },
};

export default statisticApi;

