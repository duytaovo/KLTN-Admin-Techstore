import { useCallback, useEffect } from "react";
import { Table } from "flowbite-react";
import OrderDetail from "./OrderDetail";
import "./table.scss";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import numberWithCommas from "src/utils/numberWithCommas";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  getOrders,
  putOrderApprove,
  putOrderAssign,
  putOrderCancel,
  putOrderConfirm,
  putOrderFailed,
  putOrderReject,
  putOrderSuccess,
} from "src/store/order/orderSlice";
import { Button, Modal, Pagination, Select } from "antd";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { DownloadOutlined } from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Filter from "src/components/Filter/Filter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRange } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import Skeleton from "src/components/Skeleton";
import { getShippers } from "src/store/managerShipper/orderSlice";
import { orderApi } from "src/api/order/orderApi.api";
import { putChangeDelivering } from "src/store/returnChange/returnChangeSlice";
import { Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const data = [
  {
    id: 1,
    title: "Trạng thái đơn hàng",
    detail: [
      {
        id: 1,
        name: "Đơn  đã được đặt",
      },
      {
        id: 2,
        name: "Đơn  đã xác nhận",
      },
      {
        id: 3,
        name: "Đơn  đang được shipper yêu cầu",
      },
      {
        id: 4,
        name: "Đơn  đang chờ shipper lấy",
      },
      {
        id: 5,
        name: "Đơn  đang trên đường giao",
      },
      {
        id: 6,
        name: "Đơn đang được chuyển shipper khác",
      },
      {
        id: 7,
        name: "Đơn đã chuyển cho shipper khác",
      },
      {
        id: 8,
        name: "Đơn vận chuyển thất bại lần 1",
      },
      {
        id: 9,
        name: "Đơn vận chuyển thất bại lần 2",
      },
      {
        id: 10,
        name: "Đơn vận chuyển thất bại lần 3",
      },
      {
        id: 11,
        name: "Đơn  đã giao thành công",
      },
      {
        id: 12,
        name: "Yêu cầu đổi hàng",
      },
      {
        id: 13,
        name: "Đơn hàng đang đổi",
      },
      {
        id: 14,
        name: "Đã đổi hàng",
      },
      {
        id: 15,
        name: "Yêu cầu trả và đổi hàng",
      },
      {
        id: 16,
        name: "Đang đổi và trả hàng",
      },
      {
        id: 17,
        name: "Đã đổi và trả hàng thành công",
      },
      {
        id: 18,
        name: "Yêu cầu trả hàng",
      },
      {
        id: 19,
        name: "Đơn hàng đang trả lại",
      },
      {
        id: 20,
        name: "Đơn trả lại shop thành công",
      },
      {
        id: 21,
        name: "Đơn đã được nhận",
      },
      {
        id: 22,
        name: "Đơn thành công",
      },
      {
        id: 0,
        name: "Đơn đã bị huỷ",
      },
      {
        id: -1,
        name: "Đơn thất bại",
      },
    ],
  },
  {
    id: 2,
    title: "Trạng thái thanh toán",
    detail: [
      {
        id: 0,
        name: "Chưa thanh toán",
      },
      {
        id: 1,
        name: "Đang chờ thanh toán",
      },
      {
        id: 2,
        name: "Thanh toán thành công",
      },
      {
        id: 3,
        name: "Thanh toán thất bại",
      },
    ],
  },
];
interface Shipper {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: number;
  address: string;
  imageUrl: string;
  level: number;
  levelString: string;
  isEnable: boolean;
  areaSign: string;
}
const Order = ({ title }: { title?: string }) => {
  const style = (text: string) => {
    switch (text) {
      case "Ordered":
      case "Delivering":
        return "text-blue-400 uppercase text-xl font-bold";
      case "Cancelled":
        return "text-red-400 uppercase text-xl font-bold";
      case "Confirmed":
        return "text-green-400 font-bold uppercase text-xl";
      case "Delivered":
        return "text-yellow-400 font-bold uppercase text-xl";
      case "Requesting":
      case "Working":
      case "Change_Delivering":
      case "Changed_Delivering":
      case "Delivering_Fail_1":
      case "Delivering_Fail_2":
      case "Delivering_Fail_3":
      case "Changed":
      case "RequestChangeAndReturn":
      case "ChangingAndReturning":
      case "ChangedAndReturned":
      case "RequestReturn":
      case "Returning":
      case "Returned":
      case "Received":
      case "Success":
        return "text-blue-400 uppercase text-xl font-bold"; // Example class, replace with appropriate ones
      case "Failed":
        return "text-red-400 uppercase text-xl font-bold"; // Example class, replace with appropriate ones
      default:
        return "";
    }
  };

  const [methodSearch, setMethodSearch] = useState<string>("customerAddress");
  const [searchValueIdShipping, setSearchValueIdShipping] =
    useState<string>("");
  const [searchValueName, setSearchValueName] = useState<string>("");
  const [searchValueAddress, setSearchValueAddress] = useState<string>("");
  const [searchValueProduct, setSearchValueProduct] = useState<string>("");

  const loading = useAppSelector((state) => state.loading.loading);
  const [chooseShipper, setChooseShipper] = useState("");
  const { shippers } = useAppSelector((state) => state.manageShipper);
  const [orderDetail, setOrderDetail] = useState({ index: -1, id: null });
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const { order } = useAppSelector((state) => state.orders);
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs("2023-01-01"),
    dayjs(),
  ]);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Chọn shipper giao hàng");
  const [area, setArea] = useState("");
  const [filteredShippers, setFilteredShippers] = useState<Shipper[]>([]);
  const [orderCounts, setOrderCounts] = useState<Record<number, number>>({});
  console.log(area);
  useEffect(() => {
    const filterShippers = () => {
      const keywords = area.split(/,?\s+/);
      const matchingShippers = shippers?.data?.data?.filter(
        (shipper) =>
          keywords?.some((keyword) => shipper?.areaSign?.includes(keyword)),
      );
      setFilteredShippers(matchingShippers);
    };

    filterShippers();
  }, [shippers, area]);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      const counts: Record<number, number> = {};

      const fetchOrdersForShipper = async (shipperId: number) => {
        try {
          const response: any = await orderApi.getPurchases({
            body: {
              shippingId: null,
              shipperId: shipperId,
              completeDateFrom: null,
              completeDateTo: null,
              orderStatus: [0, -1, 4, 5, 22, 11],
              receiveDateFrom: null,
              receiveDateTo: null,
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
            },
            params: { pageNumber: 0, pageSize: 100 },
          });
          return response.data.data?.totalElements;
        } catch (error) {
          console.error(
            `Error fetching orders for shipper ${shipperId}:`,
            error,
          );
          return 0;
        }
      };

      const promises = filteredShippers.map(async (shipper) => {
        const orderCount = await fetchOrdersForShipper(shipper.id);
        counts[shipper.id] = orderCount;
      });

      await Promise.all(promises);
      setOrderCounts(counts);
    };

    if (filteredShippers.length > 0) {
      fetchOrderCounts();
    }
  }, [filteredShippers]);

  const sortedShippers = [...filteredShippers].sort(
    (a, b) => (orderCounts[a.id] || 0) - (orderCounts[b.id] || 0),
  );

  const showModalChooShipper = (order: any) => {
    setOpen(true);
    setArea(order.addressReceiver);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancelModal = () => {
    setOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang
  useEffect(() => {
    const separateArrays = (data: any) => {
      const result: any = {};

      data.forEach((item: any) => {
        const key = Object.keys(item)[0]; // Lấy tên thuộc tính (ví dụ: 'Hãng', 'Giá', ...)

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(item[key]);
      });

      return result;
    };
    // Gọi hàm tách mảng
    const separatedArrays = separateArrays(filter);
    setDataFilterLocal(separatedArrays);
  }, [filter]);

  const handleSearchValueIdShipping = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValueIdShipping(e.target.value);
  };
  if (dataFilterLocal) {
    var {
      "Trạng thái đơn hàng": Trangthaidonhang,
      "Trạng thái thanh toán": Phuongthucthanhtoan,
    } = dataFilterLocal;
  }
  const PhuongthucthanhtoanNumber: number[] = Phuongthucthanhtoan?.map(
    (str: string) => parseInt(str, 10),
  );
  const TrangthaidonhangNumber: number[] = Trangthaidonhang?.map(
    (str: string) => parseInt(str, 10),
  );
  const bodyGetData = {
    shippingId: searchValueIdShipping || null,
    completeDateFrom: null,
    completeDateTo: null,
    orderStatus: TrangthaidonhangNumber ? TrangthaidonhangNumber : [],
    buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
    buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
    paymentStatus: PhuongthucthanhtoanNumber ? PhuongthucthanhtoanNumber : [],
    productName: searchValueProduct || null,
    customerName: searchValueName || null,
    customerAddress: searchValueAddress || null,
  };
  const handleSearchValueName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValueName(e.target.value);
  };

  const handleSearchValueAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValueAddress(e.target.value);
  };

  const handleSearchValueProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValueProduct(e.target.value);
  };

  const handleNavigationToSearchResult = useCallback(() => {
    // Implement the navigation to search results
    dispatch(
      getOrders({
        body: bodyGetData,
        params: { pageNumber: currentPage, pageSize: 10 },
      }),
    );
  }, [
    searchValueAddress,
    searchValueIdShipping,
    searchValueName,
    searchValueProduct,
  ]);
  console.log(methodSearch);

  const clearAllSearchValues = () => {
    setSearchValueAddress("");
    setSearchValueName("");
    setSearchValueProduct("");
    setSearchValueIdShipping("");
  };

  const getInputField = () => {
    switch (methodSearch) {
      case "customerIdShipping":
        return (
          <Input
            size="middle"
            value={searchValueIdShipping}
            onChange={handleSearchValueIdShipping}
            placeholder="Tìm kiếm..."
            suffix={
              <Button
                type="link"
                onClick={handleNavigationToSearchResult}
                icon={<SearchOutlined />}
              />
            }
          />
        );
      case "customerName":
        return (
          <Input
            size="middle"
            value={searchValueName}
            onChange={handleSearchValueName}
            placeholder="Tìm kiếm..."
            suffix={
              <Button
                type="link"
                onClick={handleNavigationToSearchResult}
                icon={<SearchOutlined />}
              />
            }
          />
        );
      case "customerAddress":
        return (
          <Input
            height={10}
            size="middle"
            value={searchValueAddress}
            onChange={handleSearchValueAddress}
            placeholder="Tìm kiếm..."
            suffix={
              <Button
                type="link"
                onClick={handleNavigationToSearchResult}
                icon={<SearchOutlined />}
              />
            }
          />
        );
      default:
        return (
          <Input
            size="middle"
            value={searchValueProduct}
            onChange={handleSearchValueProduct}
            placeholder="Tìm kiếm..."
            suffix={
              <Button
                type="link"
                onClick={handleNavigationToSearchResult}
                icon={<SearchOutlined />}
              />
            }
          />
        );
    }
  };

  // Kết quả

  useEffect(() => {
    const body = bodyGetData;
    dispatch(
      getShippers({
        params: { pageNumber: currentPage, pageSize: 100 },
      }),
    );
    dispatch(
      getOrders({
        body: body,
        params: { pageNumber: currentPage, pageSize: 10 },
      }),
    );
  }, [currentPage, value, Trangthaidonhang, Phuongthucthanhtoan, dispatch]);

  const handleAccept = async (id: number) => {
    if (confirm("Bạn có muốn Xác nhận đơn hàng không?")) {
      const res = await dispatch(putOrderConfirm(id));
      const data = await res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Xác nhận thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleAsign = async (id: number) => {
    if (confirm("Bạn có muốn Gán đơn hàng cho shipper không?")) {
      const res = await dispatch(
        putOrderAssign({ id: id, shipperId: chooseShipper }),
      );
      const data = res.payload;

      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Gán thành công");
        setOpen(false);
      } else {
        setOpen(false);
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("Bạn có muốn gán đơn hàng cho shipper không?")) {
      const res: any = await dispatch(putOrderApprove(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Xác nhận thành công");
        setOpen(false);
      } else {
        setOpen(false);
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleChangeDelivering = async (id: number) => {
    if (confirm("Bạn có muốn chuyển đơn hàng cho shipper khác không?")) {
      const res = await dispatch(
        putChangeDelivering({ orderId: id, shipperId: chooseShipper }),
      );
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Chuyển thành công");
        setOpen(false);
      } else {
        setOpen(false);
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Bạn có muốn từ chối không?")) {
      const res: any = await dispatch(putOrderReject(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Xác nhận thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleAcceptSuccess = async (id: number) => {
    if (confirm("Bạn có muốn xác nhận đơn hàng thành công không?")) {
      const res: any = await dispatch(putOrderSuccess(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Giao hàng thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Bạn có muốn hủy đơn hàng không?")) {
      const res: any = await dispatch(putOrderCancel(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Hủy đơn thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleFailed = async (id: number) => {
    if (confirm("Bạn có muốn xác nhận đơn hàng giao thất bại không?")) {
      const res: any = await dispatch(putOrderFailed(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = bodyGetData;
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Xác nhận thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    document.title = title || "";
  }, [title]);
  const exportToExcel = async (order: any) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Add header row
    worksheet.addRow([
      // "ID",
      "Name Product",
      "Quantity",
      "Ram",
      "Storage Capacity",
      "Color",
      "Price",
      "Sale Price",
      "Name Receiver",
      "Phone Receiver",
      "Address Receiver",
      "Order Price",
      "Delivery Price",
      "Discount",
      "Final Price",
      "Buy Date",
      "Payment Method",
    ]);

    order.forEach((order: any, index: number) => {
      order.orderDetails.forEach((orderDetail: any) => {
        worksheet.addRow([
          orderDetail.name,
          orderDetail.quantity,
          orderDetail.ram,
          orderDetail.storageCapacity,
          orderDetail.color,
          orderDetail.price,
          orderDetail.salePrice,
          order.nameReceiver,
          order.phoneReceiver,
          order.addressReceiver,
          order.orderPrice,
          order.deliveryPrice,
          order.discount,
          order.finalPrice,
          order.buyDate,
          order.paymentMethod,
        ]);
      });
      worksheet.addRow([]);
    });
    // Create a blob from the Excel workbook
    const blob = await workbook.xlsx.writeBuffer();

    // Save the blob as a file using file-saver
    saveAs(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "orders.xlsx",
    );
  };
  const [isOpen, setisOpen] = useState<boolean>(false);

  const handle = (boolean: boolean) => {
    setisOpen(boolean);
  };
  return (
    <div className="h-1/2">
      <Helmet>
        <title>{"Trang quản lý đơn hàng "}</title>
        <meta name="description" />
      </Helmet>
      <Button
        onClick={() => exportToExcel(order?.data?.data)}
        type="link"
        icon={<DownloadOutlined />}
        size="small"
        className="text-blue-500 mb-2"
      >
        Xuất file excel
      </Button>
      <div className="text-mainColor max-w-[1200px] ml-5 mb-5 m-auto">
        <Filter handle={handle} data={data} />
      </div>
      <div className="space-x-5 ml-5 mb-5">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            className="w-1/3"
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
      </div>
      <div className="ml-5 mb-5">
        <Row gutter={16}>
          <Col span={4}>
            <Select
              value={methodSearch}
              onChange={(value) => setMethodSearch(value)}
              // style={{ width: 160 }}
            >
              <Option value="customerIdShipping">Tìm kiếm theo mã đơn</Option>
              <Option value="customerName">Tìm kiếm theo tên</Option>
              <Option value="customerAddress">Tìm kiếm theo địa chỉ</Option>
              <Option value="productName">Tìm kiếm theo sản phẩm</Option>
            </Select>
          </Col>
          <Col span={8}>{getInputField()}</Col>
          <Col span={4}>
            <Button
              type="link"
              // style={{ marginTop: 10 }}
              onClick={clearAllSearchValues}
            >
              Xoá
            </Button>
          </Col>
        </Row>
      </div>
      {loading > 0 ? (
        <Skeleton
          styles={{ height: "50vh" }}
          children={undefined}
          className={undefined}
        />
      ) : (
        <Table hoverable={true} className="bg-transparent">
          <Table.Head>
            <Table.HeadCell>STT</Table.HeadCell>
            <Table.HeadCell>Sản phẩm</Table.HeadCell>
            <Table.HeadCell>Số lượng</Table.HeadCell>
            <Table.HeadCell>Giá</Table.HeadCell>
            <Table.HeadCell> Ngày đặt mua</Table.HeadCell>
            <Table.HeadCell>Trạng thái</Table.HeadCell>
            <Table.HeadCell>
              <span className="">Chỉnh sửa</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className=" ">
            {order?.data?.data.map((_order: any, index) => {
              const styleStatus = style(_order.orderStatusString);
              const displayDetail = index === orderDetail.index;
              const displayCancelBtn = _order.orderStatusString != "Confirmed";
              const displayButtonDelivered = _order.orderStatus === 7;

              return (
                <>
                  <Table.Row
                    key={_order.id}
                    className=" dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
                  >
                    <Table.Cell className="text-blue-400 text-2xl">
                      #{_order.id}
                    </Table.Cell>
                    <Table.Cell className="text-blue-400 hover:text-blue-700 select-none text-2xl">
                      <Button
                        type="link"
                        className="p-0"
                        onClick={() =>
                          setOrderDetail((current) => {
                            return current.index === index
                              ? {
                                  index: -1,
                                  id: _order.id,
                                }
                              : {
                                  index,
                                  id: _order.id,
                                };
                          })
                        }
                      >
                        Xem chi tiết
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="text-2xl">
                      {_order?.orderDetails?.length}
                    </Table.Cell>
                    <Table.Cell className="text-red-400 text-2xl">
                      {numberWithCommas(_order?.finalPrice)}₫
                    </Table.Cell>
                    <Table.Cell className="text-2xl">
                      {" "}
                      <p className="">{_order?.buyDate.substring(0, 10)}</p>
                    </Table.Cell>

                    <Table.Cell className={styleStatus}>
                      <div className="flex flex-grow justify-between text-xl font-bold">
                        {/* {stringStatus(_order.orderStatusString)} */}
                        {(_order.paymentStatusString === "Payment success" &&
                          _order.orderStatus === 11) ||
                        (_order.paymentStatusString === "Payment success" &&
                          _order.orderStatus === 21) ||
                        (_order.paymentStatusString === "Payment success" &&
                          _order.orderStatus === 22) ? (
                          <span className="text-white text-xl bg-green-500 p-2 rounded-lg">
                            ĐÃ THANH TOÁN
                          </span>
                        ) : (
                          <span className="text-white text-xl bg-gray-500 p-2 rounded-lg">
                            CHƯA THANH TOÁN
                          </span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="space-x-3">
                      {_order.orderStatus === 1 ? (
                        <div>
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => handleAccept(_order.id)}
                            className={clsx(
                              "bg-green-500 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Xác nhận
                          </Button>
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => handleCancel(_order.id)}
                            className={clsx(
                              "bg-red-500 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Hủy đơn
                          </Button>
                        </div>
                      ) : _order.orderStatus === 3 ? (
                        <div>
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => handleReject(_order.id)}
                            className={clsx(
                              "bg-red-500 mx-2 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Từ chối
                          </Button>
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => handleApprove(_order.id)}
                            className={clsx(
                              "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Giao cho shipper
                          </Button>
                        </div>
                      ) : _order.orderStatus === 21 ? (
                        <Button
                          type="link"
                          disabled={displayButtonDelivered}
                          id={_order.id}
                          onClick={() => handleAcceptSuccess(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đã giao thành công
                        </Button>
                      ) : _order.orderStatus === 6 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đang chuyển cho shipper khác
                        </Button>
                      ) : _order.orderStatus === 7 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đã chuyển cho shipper khác
                        </Button>
                      ) : _order.orderStatus === 8 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn giao thất bại lần 1
                        </Button>
                      ) : _order.orderStatus === 9 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn giao thất bại lần 2
                        </Button>
                      ) : _order.orderStatus === 10 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn giao thất bại lần 3
                        </Button>
                      ) : _order.orderStatus === 19 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            " text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đang được shipper trả lại
                        </Button>
                      ) : _order.orderStatus === -1 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-red-300 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn giao thất bại
                        </Button>
                      ) : _order.orderStatus === 20 ? (
                        <Button
                          type="link"
                          disabled={displayButtonDelivered}
                          id={_order.id}
                          onClick={() => handleFailed(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Xác nhận đã giao thất bại
                        </Button>
                      ) : _order.orderStatus === 2 ? (
                        <div>
                          {/* <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "text-xl font-bold rounded-lg  text-white m-2",
                          )}
                        >
                          Chờ shipper xác nhận
                        </Button> */}
                          <Button
                            type="link"
                            disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => showModalChooShipper(_order)}
                            className={clsx(
                              "bg-green-500 text-xl font-medium rounded-lg  text-white m-2",
                              displayCancelBtn && "!bg-gray-100 !text-gray-700",
                            )}
                          >
                            Gán cho shipper
                          </Button>
                          <Modal
                            title="Chọn shipper giao hàng"
                            open={open}
                            onOk={() => {
                              handleAsign(_order.id);
                            }}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancelModal}
                          >
                            <p>{modalText}</p>
                            <Select
                              defaultValue={chooseShipper}
                              style={{ width: 120 }}
                              onChange={(itemValue) =>
                                setChooseShipper(itemValue)
                              }
                              options={sortedShippers?.map((shipper) => ({
                                value: shipper.id.toString(),
                                label: shipper.fullName,
                              }))}
                            />
                          </Modal>
                          ;
                        </div>
                      ) : _order.orderStatus === 5 ? (
                        <>
                          {/* <Button
                            type="link"
                            disabled={true}
                            id={_order.id}
                            // onClick={() => handleAccept(_order.id)}
                            className={clsx(
                              "text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Đang giao hàng
                          </Button> */}
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => showModalChooShipper(_order)}
                            className={clsx(
                              "bg-pink-500 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Chuyển cho shipper khác
                          </Button>
                          <Button
                            type="link"
                            // disabled={displayCancelBtn}
                            id={_order.id}
                            onClick={() => handleCancel(_order.id)}
                            className={clsx(
                              "bg-red-500 text-xl font-medium rounded-lg  text-white m-2",
                            )}
                          >
                            Hủy đơn
                          </Button>
                          <Modal
                            title="Chọn shipper giao hàng"
                            open={open}
                            onOk={() => {
                              handleChangeDelivering(_order.id);
                            }}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancelModal}
                          >
                            <p>{modalText}</p>
                            <Select
                              defaultValue={chooseShipper}
                              style={{ width: 120 }}
                              onChange={(itemValue) =>
                                setChooseShipper(itemValue)
                              }
                              options={sortedShippers?.map((shipper) => ({
                                value: shipper.id.toString(),
                                label: shipper.fullName,
                              }))}
                            />
                          </Modal>
                        </>
                      ) : _order.orderStatus === 4 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đã giao cho shipper
                        </Button>
                      ) : _order.orderStatus === 0 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "bg-red-300 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đã huỷ đơn
                        </Button>
                      ) : _order.orderStatus === 21 ? (
                        <Button
                          type="link"
                          // disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "bg-green-300 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đã được khách hàng nhận
                        </Button>
                      ) : _order.orderStatus === 22 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "bg-green-300 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đã được khách hàng nhận
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đơn đã được shipper giao
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                  {displayDetail && (
                    <Table.Row>
                      <Table.Cell className="" colSpan={7}>
                        <OrderDetail
                          order={_order}
                          displayDetail={displayDetail}
                          setOrderDetail={setOrderDetail}
                          index={index}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </>
              );
            })}
          </Table.Body>
        </Table>
      )}

      <div className="fixed bottom-12 left-auto">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={order?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Order;

