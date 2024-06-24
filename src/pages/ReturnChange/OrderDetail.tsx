import { CheckCircleFill } from "react-bootstrap-icons";

import "./table.scss";
import numberWithCommas from "src/utils/numberWithCommas";
import { convert } from "html-to-text";
import Parser from "html-react-parser";
import { Button } from "antd";
interface Props {
  order: any;
  displayDetail: any;
  setOrderDetail: any;
  index: number;
}

const data = {
  ubOrderId: 1,
  orderId: 1,
  orderStatus: 3,
  orderStatusName: "Requesting",
  orderStatusNameVn: "Đơn hàng đang được shipper yêu cầu",
  productId: 17,
  productName: "Điện thoại iPhone 15 Plus 128GB",
  productImageUrl:
    "https://techstore2023.s3.ap-southeast-1.amazonaws.com/images/171223877527648ba543c-b605-4942-97b8-5b5732469bda-iphone-15-plus-128gb-xanh-la-3.jpg",
  type: 1,
  typeString: "Return",
  mainCause: 1,
  mainCauseString: "Sản phẩm ",
  quantity: 1,
  customerDescription: "<p>test</p>",
  shipperDescription: null,
  createdBy: "2",
  createdTime: "2024-06-11 14:30:35.292962",
  shipperId: 21,
  shipperName: "shipper2",
  completed: false,
};
const OrderDetail = ({ order, index, setOrderDetail }: Props) => {
  const surcharge = 20000;
  const style = (text: string) => {
    switch (text) {
      case "Return":
        return "text-red-400";
      case "Change":
        return "text-blue-400";
    }
  };
  const checkPayment = order?.paymentStatusString === "Unpaid" ? false : true;
  return (
    <div>
      <div className="py-8 border-b">
        <div className="flex justify-start  ">
          <h2 className="font-bold text-3xl">
            Chi tiết đơn hàng: #{order.orderId}
          </h2>
          <p className="text-2xl mx-2">
            Loại yêu cầu:{" "}
            <span className={style(order.typeString)}>
              {order.typeString === "Return" ? "Trả hàng" : "Đổi hàng"}{" "}
            </span>
          </p>
        </div>
        <p className="text-2xl">Mua tại docongnghe.com</p>
      </div>

      <div className="flex justify-between py-4 border-b" key={index}>
        <div className="flex space-x-5">
          <div className="w-28 h-20">
            <img
              className="object-contain"
              src={order.productImageUrl}
              alt={order.productName}
            />
          </div>
          <div>
            <p className="font-medium text-3xl">{order.productName}</p>

            <p className="font-medium text-xl">Số lượng: {order.quantity}</p>
          </div>
        </div>
      </div>
      <p className="font-medium text-2xl my-2">
        Lý do chính : {order.mainCauseString}
      </p>
      <p className="font-medium text-2xl my-2">
        Mô tả của khách hàng:
        <div className="w-10 h-20">{Parser(order?.customerDescription)}</div>
      </p>
      <p className="font-medium text-2xl my-2">
        Mô tả của shipper: {convert(order.shipperDescription)}
      </p>
      <div className="border-b  text-2xl leading-[30px]">
        <p>Mã shipper: {order?.shipperId}</p>
        <p>Tên shipper: {order?.shipperName}</p>
      </div>
      <p className="font-bold text-2xl">
        Ngày đặt: {order?.createdTime.substring(0, 10)}
      </p>

      <div className="flex justify-center py-4">
        <Button
          type="link"
          onClick={() =>
            setOrderDetail((current: any) => {
              return current.index === index
                ? {
                    index: -1,
                    id: order.id,
                  }
                : {
                    index: index,
                    id: order.id,
                  };
            })
          }
        >
          Ẩn xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;

