import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AppCurrentVisits from "../app-current-visits";
import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import { LatestOrders } from "src/components/overview/latest-orders";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { getStatistic } from "src/store/statistic/statisticSlice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import { Button, DatePicker } from "antd";
import { StatisticBestSeller } from "src/components/statistic";
// ----------------------------------------------------------------------
interface ProfitData {
  year: number;
  dayQuantity: number[];
}

const _statistic = {
  totalProfits: 0,
  totalNewUsers: 0,
  totalItemOrders: 0,
  totalItemOrdersPaid: 0,
  //3 năm gần nhất
  sales: {
    years: [
      { name: 2022, data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 22] },
      { name: 2023, data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 22] },
      { name: 2024, data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 22] },
    ],
  },
  //phone,laptop,tablet,phukien this year
  totalProducts: {
    years: [
      {
        typeName: "Smartphone",
        quantity: 6,
      },
    ],
  },
  productsBestSeller: [
    {
      yearMonth: "202404",
      product: [
        {
          productId: 3,
          productCode: "20247DSO0B7ZDNBE",
          name: "Điện thoại iPhone 15 Pro 128GBb",
          imageUrl:
            "https://techstore2023.s3.ap-southeast-1.amazonaws.com/images/170934521615268aadee5-0970-472a-83bc-b363992e88c3-logonew.jpg",
          totalOrder: 4,
        },
      ],
    },
  ],
  lastOrders: [{}],
};
export default function AppView() {
  const [valueYear, setValueYear] = useState("2024");
  const refButton: any = useRef(null);
  const _index: number =
    Number(valueYear) === 2024
      ? 0
      : Number(valueYear) === 2023
      ? 1
      : Number(valueYear) === 2022
      ? 2
      : Number(valueYear) === 2020
      ? 3
      : Number(valueYear) === 2021
      ? 4
      : Number(valueYear) == 2020
      ? 5
      : 0;
  const { statistic } = useAppSelector((state) => state.statistic);
  const [statisticLocal, setStatisticLocal] = useState(_statistic);
  const dispatch = useAppDispatch();

  const [startDate, setStartDate] = useState(new Date("2024-06-01T00:00:00"));
  const [endDate, setEndDate] = useState(new Date(new Date()));
  // new Date(`${valueYear}-05-09T00:00:00`),
  const calculateMonthlyProfits = (dailyProfits: number[], year: number) => {
    const monthlyProfitsArray: number[] = new Array(12).fill(0); // Tạo mảng 12 tháng với giá trị ban đầu là 0

    let currentMonth = -1; // Khởi tạo biến để lưu trữ tháng hiện tại

    // Duyệt qua từng ngày và tính tổng lợi nhuận của mỗi tháng
    for (let i = 0; i < dailyProfits.length; i++) {
      const newMonth = new Date(2024, 0, i + 1).getMonth(); // Lấy tháng từ Date object
      // Kiểm tra nếu đã qua tháng mới
      if (newMonth !== currentMonth) {
        currentMonth = newMonth; // Cập nhật tháng hiện tại
      }

      // Cộng lợi nhuận của ngày vào tháng tương ứng
      monthlyProfitsArray[currentMonth] += dailyProfits[i];
    }
    return monthlyProfitsArray;
  };

  const yearlyProfits = statistic?.profits?.map((yearProfit: any) => {
    const { dayQuantity, year } = yearProfit;

    return calculateMonthlyProfits(dayQuantity, year);
  });

  const changeFormatSales = (yearlyProfits: any[]) => {
    const res = yearlyProfits.map((yearlyProfit, index) => ({
      name: 2024 - index, // Giả sử năm bắt đầu là 2022 và tăng dần
      data: yearlyProfit,
    }));

    return res;
  };

  useEffect(() => {
    setStatisticLocal((prevState) => ({
      ...prevState,
      sales: { years: changeFormatSales(yearlyProfits) },
      totalProducts: { years: statistic.productTypes },
      lastOrders: statistic.lastOrders,
      productBestSellers: statistic.productsBestSeller,
    }));
  }, [statistic]);
  const calculateInRange = (
    data: ProfitData,
    startDate: Date,
    endDate: Date,
  ): number => {
    if (!startDate || !endDate) return 0;
    const startDay = Math.floor(
      (startDate.getTime() -
        new Date(startDate.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const endDay = Math.floor(
      (endDate.getTime() - new Date(endDate.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    let totalProfit = 0;
    for (let i = startDay - 1; i <= endDay - 1; i++) {
      totalProfit += data?.dayQuantity[i];
    }

    return totalProfit;
  };
  useEffect(() => {
    dispatch(getStatistic(""));
    handleCalculateClick();
  }, []);

  useEffect(() => {
    handleCalculateClick();
  }, [statistic]);

  const handleCalculateClick = () => {
    const profitInRange = calculateInRange(
      statistic.profits[_index],
      startDate!,
      endDate!,
    );
    const userInRange = calculateInRange(
      statistic.users[_index],
      startDate!,
      endDate!,
    );
    const orderInRange = calculateInRange(
      statistic.orders[_index],
      startDate!,
      endDate!,
    );
    const orderPaidInRange = calculateInRange(
      statistic.ordersPaid[_index],
      startDate!,
      endDate!,
    );

    setStatisticLocal((prevState) => ({
      ...prevState,
      totalProfits: profitInRange,
      totalNewUsers: userInRange,
      totalItemOrders: orderInRange,
      totalItemOrdersPaid: orderPaidInRange,
    }));
  };

  const onChangeDayStart: DatePickerProps["onChange"] = (date, dateString) => {
    const _date = new Date(dateString + "T00:00:00");
    setStartDate(_date);
  };

  const onChangeDayEnd: DatePickerProps["onChange"] = (date, dateString) => {
    const _date = new Date(dateString);
    setEndDate(_date);
  };

  const handleChange = (event: any) => {
    setValueYear(event.target.value);
    onChangeDayStart(null, `${event.target.value}-04-01T00:00:00`);
    onChangeDayEnd(null, `${event.target.value}-04-30T00:00:00`);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>
        <FormControl sx={{}}>
          <div className="space-x-5 ml-5 mb-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <InputLabel id="demo-simple-select-label">
                Chọn năm thống kê
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valueYear}
                label="Năm"
                // defaultValue={2024}
                onChange={handleChange}
              >
                <MenuItem value={2026}>2026</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2020}>2020</MenuItem>
              </Select>

              <DatePicker
                disabledDate={(current) =>
                  current &&
                  (current <= dayjs(`${valueYear}/01/01T00:00:00`) ||
                    current >= dayjs(`${valueYear + 1}/1/1T00:00:00`))
                }
                onChange={onChangeDayStart}
                defaultValue={dayjs(startDate)}
              />

              <DatePicker
                disabledDate={(current) =>
                  current &&
                  (current <= dayjs(`${valueYear}/01/01T00:00:00`) ||
                    current >= dayjs(`${valueYear + 1}/12/1T00:00:00`))
                }
                onChange={onChangeDayEnd}
                defaultValue={dayjs(endDate)}
              />
              <Button ref={refButton} onClick={handleCalculateClick}>
                Lọc
              </Button>
            </LocalizationProvider>
          </div>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tổng lợi nhuận"
            total={statisticLocal?.totalProfits}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tổng số khách hàng (đã đăng ký)"
            total={statisticLocal?.totalNewUsers}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Số đơn hàng"
            total={statisticLocal?.totalItemOrders}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Số đơn hàng đã thanh toán "
            total={statisticLocal?.totalItemOrdersPaid}
            color="error"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />
            }
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Sales"
            chart={{
              series: [
                {
                  name: statisticLocal?.sales.years[2]?.name,
                  type: "column",
                  fill: "solid",
                  data: statisticLocal?.sales.years[2]?.data,
                },
                {
                  name: statisticLocal?.sales.years[1]?.name,
                  type: "column",
                  fill: "gradient",
                  data: statisticLocal?.sales.years[1]?.data,
                },
                {
                  name: statisticLocal?.sales.years[0]?.name,
                  type: "column",
                  fill: "solid",
                  data: statisticLocal?.sales.years[0]?.data,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Product"
            chart={{
              series: statisticLocal?.totalProducts.years,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <StatisticBestSeller dataBestSeller={statistic.productsBestSeller} />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <LatestOrders
            orders={statisticLocal?.lastOrders}
            sx={{ height: "100%" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

