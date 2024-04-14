import { useEffect } from "react";
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
  putOrderReject,
  putOrderSuccess,
} from "src/store/order/orderSlice";
import { Button, Pagination } from "antd";
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
const data = [
  {
    id: 1,
    title: "Trạng thái đơn hàng",
    detail: [
      {
        id: 1,
        name: "Đã đặt",
      },
      {
        id: 2,
        name: "Đã xác nhận",
      },
      {
        id: 3,
        name: "Đang được yêu cầu",
      },
      {
        id: 4,
        name: "Đã phân công shipper",
      },
      {
        id: 5,
        name: "Đang được vận chuyển",
      },
      {
        id: 6,
        name: "Đã được shipper giao thành công",
      },
      {
        id: 7,
        name: "Đã hoàn thành",
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

const Order = ({ title }: { title?: string }) => {
  const style = (text: string) => {
    switch (text) {
      case "Ordered":
        return "text-blue-400 uppercase text-xl font-bold";
      case "Delivering":
        return "text-blue-400 uppercase text-xl font-bold";
      case "Cancelled":
        return "text-red-400 uppercase text-xl font-bold";
      case "Confirmed":
        return "text-green-400 font-bold uppercase text-xl";
      case "Delivered":
        return "text-yellow-400 font-bold uppercase text-xl";
    }
  };
  const loading = useAppSelector((state) => state.loading.loading);

  const [orderDetail, setOrderDetail] = useState({ index: -1, id: null });
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const { order } = useAppSelector((state) => state.orders);
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs("2023-01-01"),
    dayjs(),
  ]);

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

  // Kết quả
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
  useEffect(() => {
    const body = {
      orderStatus: TrangthaidonhangNumber ? TrangthaidonhangNumber : [],
      buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
      buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
      paymentStatus: PhuongthucthanhtoanNumber ? PhuongthucthanhtoanNumber : [],
    };
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
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
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
      const res: any = await dispatch(putOrderAssign(id));
      const data = res.payload;

      if (data?.data?.code === 200) {
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
        await dispatch(
          getOrders({
            body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Gán thành công");
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("Bạn có muốn Gán đơn hàng cho shipper không?")) {
      const res: any = await dispatch(putOrderApprove(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
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

  const handleReject = async (id: number) => {
    if (confirm("Bạn có muốn từ chối không?")) {
      const res: any = await dispatch(putOrderReject(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
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
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
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
    if (confirm("Bạn có muốn Hủy đơn hàng không?")) {
      const res: any = await dispatch(putOrderCancel(id));
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = {
          orderStatus: Trangthaidonhang ? Trangthaidonhang : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: Phuongthucthanhtoan ? Phuongthucthanhtoan : [],
        };
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
        type="primary"
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
                        {_order.paymentStatusString === "Payment success" ? (
                          <span className="text-white uppercase font-bold text-xl bg-green-500 p-2 rounded-lg">
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="text-white uppercase font-bold text-xl bg-gray-500 p-2 rounded-lg">
                            Chưa thanh toán
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
                      ) : _order.orderStatus === 6 ? (
                        <Button
                          type="link"
                          disabled={displayButtonDelivered}
                          id={_order.id}
                          onClick={() => handleAcceptSuccess(_order.id)}
                          className={clsx(
                            "bg-blue-500 text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đã giao
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
                            onClick={() => handleAsign(_order.id)}
                            className={clsx(
                              "bg-green-500 text-xl font-medium rounded-lg  text-white m-2",
                              displayCancelBtn && "!bg-gray-100 !text-gray-700",
                            )}
                          >
                            Gán cho shipper
                          </Button>
                        </div>
                      ) : _order.orderStatus === 5 ? (
                        <Button
                          type="link"
                          disabled={true}
                          id={_order.id}
                          // onClick={() => handleAccept(_order.id)}
                          className={clsx(
                            "text-xl font-medium rounded-lg  text-white m-2",
                          )}
                        >
                          Đang giao hàng
                        </Button>
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
                          Đã giao thành công
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

