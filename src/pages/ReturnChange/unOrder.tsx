import { useEffect } from "react";
import { Table } from "flowbite-react";
import OrderDetail from "./OrderDetail";
import "./table.scss";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
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
import {
  getUnOrders,
  putUnOrderApprove,
} from "src/store/returnChange/returnChangeSlice";
import numberWithCommas from "src/utils/numberWithCommas";
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

const ReturnChange = ({ title }: { title?: string }) => {
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
  const [chooseShipper, setChooseShipper] = useState("");
  const { shippers } = useAppSelector((state) => state.manageShipper);

  const [orderDetail, setOrderDetail] = useState({ index: -1, id: null });
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const { unOrder } = useAppSelector((state) => state.unOrders);
  console.log(unOrder);
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs("2023-01-01"),
    dayjs(),
  ]);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Chọn shipper giao hàng");

  const showModal = () => {
    setOpen(true);
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
    console.log("Clicked cancel button");
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
      shippingId: null,
      completeDateFrom: null,
      completeDateTo: null,
      productName: null,
      customerName: null,
      customerAddress: null,
      orderStatus: TrangthaidonhangNumber ? TrangthaidonhangNumber : [],
      buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
      buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
      paymentStatus: PhuongthucthanhtoanNumber ? PhuongthucthanhtoanNumber : [],
    };
    dispatch(
      getShippers({
        params: { pageNumber: currentPage, pageSize: 100 },
      }),
    );
    dispatch(
      getUnOrders({
        // body: body,
        params: { pageNumber: currentPage, pageSize: 100 },
      }),
    );
  }, [currentPage, value, Trangthaidonhang, Phuongthucthanhtoan, dispatch]);

  const handleApprove = async (id: number) => {
    console.log(id);
    setOpen(false);
    if (confirm("Bạn có muốn cho đổi/trả hàng không ?")) {
      const res: any = await dispatch(
        putUnOrderApprove({ id, shipperId: chooseShipper }),
      );
      const data = res.payload;
      if (data?.data?.code === 200) {
        const body = {
          shippingId: null,
          completeDateFrom: null,
          completeDateTo: null,
          productName: null,
          customerName: null,
          customerAddress: null,
          orderStatus: TrangthaidonhangNumber ? TrangthaidonhangNumber : [],
          buyDateFrom: value[0]?.format("YYYY-MM-DD") || null,
          buyDateTo: value[1]?.format("YYYY-MM-DD") || null,
          paymentStatus: PhuongthucthanhtoanNumber
            ? PhuongthucthanhtoanNumber
            : [],
        };
        await dispatch(
          getUnOrders({
            // body: body,
            params: { pageNumber: currentPage, pageSize: 10 },
          }),
        );
        toast.success("Xác nhận thành công");
        window.location.reload();
      } else {
        return null;
        // toast.error(data.data.message);
      }
    }
  };

  const handlePageChange = (page: number) => {
    console.log(page);
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
        onClick={() => exportToExcel(unOrder?.data?.data)}
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
            <Table.HeadCell>Lý do</Table.HeadCell>
            <Table.HeadCell> Ngày đặt mua</Table.HeadCell>
            <Table.HeadCell>Loại yêu cầu</Table.HeadCell>
            <Table.HeadCell>
              <span className="">Chỉnh sửa</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className=" ">
            {[...unOrder?.data?.data?.content]
              .reverse()
              ?.map((_order: any, index) => {
                const displayDetail = index === orderDetail.index;
                const styleStatus = style(_order.orderStatusString);

                return (
                  <>
                    <Table.Row
                      key={_order.ubOrderId}
                      className=" dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
                    >
                      <Table.Cell className="text-blue-400 text-2xl">
                        #{_order.ubOrderId}
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
                                    id: _order.orderId,
                                  }
                                : {
                                    index,
                                    id: _order.orderId,
                                  };
                            })
                          }
                        >
                          Xem chi tiết
                        </Button>
                      </Table.Cell>
                      <Table.Cell className="text-2xl">
                        {_order?.quantity}
                      </Table.Cell>
                      <Table.Cell className="text-red-400 text-2xl">
                        {_order?.mainCauseString}
                      </Table.Cell>
                      <Table.Cell className="text-2xl">
                        {" "}
                        <p className="">
                          {_order?.createdTime.substring(0, 10)}
                        </p>
                      </Table.Cell>

                      <Table.Cell className={styleStatus}>
                        <div className="flex flex-grow justify-between text-xl font-bold">
                          {/* {stringStatus(_order.orderStatusString)} */}
                          {_order.typeString === "Return" ? (
                            <span className="text-white uppercase font-bold text-xl bg-green-500 p-2 rounded-lg">
                              Yêu cầu trả hàng
                            </span>
                          ) : (
                            <span className="text-white uppercase font-bold text-xl bg-gray-500 p-2 rounded-lg">
                              Yêu cầu đổi hàng
                            </span>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="space-x-3">
                        {_order.orderStatus === 12 ||
                        _order.orderStatus === 15 ||
                        _order.orderStatus === 18 ? (
                          <div>
                            <Button
                              type="link"
                              // disabled={displayCancelBtn}
                              id={_order.id}
                              onClick={() => {
                                setOpen(true);
                              }}
                              className={clsx(
                                "bg-green-500 text-xl font-medium rounded-lg  text-white m-2",
                              )}
                            >
                              Chấp nhận yêu cầu
                            </Button>
                            <Modal
                              title="Chọn shipper giao hàng"
                              open={open}
                              onOk={() => {
                                handleApprove(_order.orderId);
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
                                options={shippers.data.data.map((shipper) => ({
                                  value: shipper.id.toString(),
                                  label: shipper.fullName,
                                }))}
                              />
                            </Modal>
                          </div>
                        ) : null}
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
          total={unOrder?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ReturnChange;

