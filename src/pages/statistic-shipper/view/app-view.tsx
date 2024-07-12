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
import { Button, DatePicker, Modal } from "antd";
import { StatisticBestSeller } from "src/components/statistic";
import { format } from "date-fns";
import { getOrders } from "src/store/order/orderSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { getShippers } from "src/store/managerShipper/orderSlice";
import { toast } from "react-toastify";

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

export default function StatisticShipperView() {
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
  const dispatch = useAppDispatch();
  const [chooseShipper, setChooseShipper] = useState("21");
  const { shippers } = useAppSelector((state) => state.manageShipper);
  const [dataOrders, setShowDataOrders] = useState<any>();
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date("2024-06-01T00:00:00"));
  const [endDate, setEndDate] = useState(new Date(new Date()));

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

  const bodyOrders = {
    shippingId: null,
    shipperId: Number(chooseShipper),
    completeDateFrom: null,
    completeDateTo: null,
    orderStatus: [0, -1, 4, 5, 22, 11],
    receiveDateFrom: startDate ? format(startDate, "yyyy-MM-dd") : null,
    receiveDateTo: endDate ? format(endDate, "yyyy-MM-dd") : null,
    buyDateFrom: null,
    buyDateTo: null,
    deliveryDateFrom: null,
    deliveryDateTo: null,
    shipDateFrom: null,
    shipDateTo: null,
    paymentStatus: [],
    productName: null,
    customerName: null,
    customerAddress: null,
  };

  const _getData = async () => {
    const orders = await dispatch(
      getOrders({
        body: bodyOrders,
        params: { pageNumber: 0, pageSize: 100 },
      }),
    );

    unwrapResult(orders);
    setShowDataOrders(orders.payload.data);
  };

  useEffect(() => {
    dispatch(
      getShippers({
        params: { pageNumber: 0, pageSize: 100 },
      }),
    );
  }, [chooseShipper]);

  useEffect(() => {
    const getData = async () => {
      setIsGettingData(true);
      await _getData();
      setIsGettingData(false);
    };
    getData();
  }, [dispatch, startDate, endDate, chooseShipper]);

  const calculateStats = () => {
    if (startDate > endDate) {
      toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
      return;
    } else {
      // Tính tổng số đơn hàng đã giao thành công
      const totalSuccessfulOrders = dataOrders?.data?.data?.filter(
        (order: any) => order.orderStatus === 22,
      );
      const totalRejectOrders = dataOrders?.data?.data?.filter(
        (order: any) => order.orderStatus === 0,
      ).length;

      const totalFailedOrders = dataOrders?.data?.data?.filter(
        (order: any) => order.orderStatus === -1,
      ).length;

      // Tính tổng số tiền gửi lại cho cửa hàng
      const totalRefundToShop = totalSuccessfulOrders?.reduce(
        (total: any, order: any) => total + order.orderPrice,
        0,
      );

      // Tính tổng doanh thu của shipper
      const totalShippingRevenue = totalSuccessfulOrders?.reduce(
        (total: any, order: any) => total + order.deliveryPrice,
        0,
      );

      return {
        totalSuccessfulOrders,
        totalRefundToShop,
        totalShippingRevenue,
        totalRejectOrders,
        totalFailedOrders,
      };
    }
  };

  const stats = calculateStats();
  const totalSuccessfulOrders = stats?.totalSuccessfulOrders?.length || 0;
  const totalRejectOrders = stats?.totalRejectOrders || 0;
  const totalRefundToShop = stats?.totalRefundToShop || 0;
  const totalShippingRevenue = stats?.totalShippingRevenue || 0;
  const totalFailedOrders = stats?.totalFailedOrders || 0;

  const onChangeDayStart: DatePickerProps["onChange"] = (date, dateString) => {
    const _date = new Date(dateString + "T00:00:00");
    setStartDate(_date);
  };

  const onChangeDayEnd: DatePickerProps["onChange"] = (date, dateString) => {
    const _date = new Date(dateString);
    setEndDate(_date);
  };

  const handleChange = (event: any) => {
    setChooseShipper(event.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <InputLabel id="demo-simple-select-label">Chọn shipper</InputLabel>
          <Select
            placeholder="Chọn shipper"
            defaultValue={chooseShipper}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            {shippers?.data?.data?.map((shipper) => {
              return (
                <MenuItem value={shipper.id.toString()}>
                  {shipper.fullName}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <FormControl sx={{}}>
          <div className="space-x-5  mb-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                allowClear={false}
                disabledDate={(current) =>
                  current &&
                  (current <= dayjs(`${valueYear}/01/01T00:00:00`) ||
                    current >= dayjs(`${valueYear + 1}/1/1T00:00:00`))
                }
                onChange={onChangeDayStart}
                defaultValue={dayjs(startDate)}
              />

              <DatePicker
                allowClear={false}
                disabledDate={(current) =>
                  current &&
                  (current <= dayjs(`${valueYear}/01/01T00:00:00`) ||
                    current >= dayjs(`${valueYear + 1}/12/1T00:00:00`))
                }
                onChange={onChangeDayEnd}
                defaultValue={dayjs(endDate)}
              />
              <Button ref={refButton} onClick={calculateStats}>
                Lọc
              </Button>
            </LocalizationProvider>
          </div>
        </FormControl>
      </Box>
      <Grid container spacing={3} marginTop={2}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Thu nhập"}
            total={totalShippingRevenue.toString()}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Số tiền đã giao"}
            total={totalRefundToShop.toString()}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Đơn đã nhận"}
            total={dataOrders?.data?.data?.length.toString()}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Đơn đã giao"}
            total={totalSuccessfulOrders.toString()}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Đơn đã bị huỷ"}
            total={totalRejectOrders.toString()}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={"Đơn giao thất bại"}
            total={totalFailedOrders.toString()}
            color="error"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />
            }
          />
        </Grid>
        {/* <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Doanh thu"
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
        </Grid> */}
        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Sản phẩm"
            chart={{
              series: statisticLocal?.totalProducts.years,
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={6}>
          <StatisticBestSeller dataBestSeller={statistic.productsBestSeller} />
        </Grid> */}
        {/* <Grid xs={12} md={6} lg={6}>
          <LatestOrders
            orders={statisticLocal?.lastOrders}
            sx={{ height: "100%" }}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}

