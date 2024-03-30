import { CheckCircleFill } from "react-bootstrap-icons";

import "./table.scss";
import numberWithCommas from "src/utils/numberWithCommas";
import { Button } from "antd";
interface Props {
  order: any;
  displayDetail: any;
  setOrderDetail: any;
  index: number;
}
const OrderDetail = ({ order, index, setOrderDetail }: Props) => {
  const surcharge = 20000;
  const style = (text: string) => {
    switch (text) {
      case "Đã đặt hàng":
      case "Đặt hàng":
        return "text-green-400";
      case "Đang giao hàng":
        return "text-blue-400";
      case "Đã hủy":
        return "text-red-400";
      case "Đã nhận":
        return "text-gray-400";
    }
  };
  const checkPayment = order?.paymentStatusString === "Unpaid" ? false : true;
  return (
    <div>
      <div className="py-8 border-b">
        <div className="flex justify-between">
          <h2 className="font-bold text-3xl">Chi tiết đơn hàng: #{order.id}</h2>
          <p className="text-2xl">
            Trạng thái:{" "}
            <span className={style(order.orderStatusString)}>{"Đã đặt"}</span>
          </p>
        </div>
        <p className="text-2xl">Mua tại docongnghe.com</p>
      </div>
      {order?.orderDetails?.map((item: any, index: number) => {
        return (
          <div className="flex justify-between py-4 border-b" key={index}>
            <div className="flex space-x-5">
              <div className="w-28 h-20">
                <img
                  className="object-contain"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div>
                <p className="font-medium text-3xl">{item.name}</p>
                <p className="font-medium text-xl">Màu: {item.color}</p>
                <p className="font-medium text-xl">Ram: {item.ram}</p>
                <p className="font-medium text-xl">
                  Bộ nhớ trong: {item.storageCapacity}
                </p>
                <p className="font-medium text-xl">Số lượng: {item.quantity}</p>
              </div>
            </div>

            <div className="font-medium text-3xl">
              <p className="text-red-400">
                {numberWithCommas(item.salePrice)}đ
              </p>
              <p className="line-through">{numberWithCommas(item.price)}₫</p>
            </div>
          </div>
        );
      })}
      <div className="border-b p-4 text-2xl leading-[40px]">
        <p>Giá tạm tính: {numberWithCommas(order?.orderPrice)}₫</p>
        <p>
          <span className="">Phí giao hàng: </span>{" "}
          <span>{numberWithCommas(order?.deliveryPrice)}₫</span>
        </p>
        <p>
          <span className="">Giảm giá: </span>{" "}
          <span>{numberWithCommas(order?.discount)}₫</span>
        </p>
        <p>
          <span className="font-bold">Tổng tiền: </span>
          <span className="text-red-500">
            {numberWithCommas(order?.finalPrice)}₫
          </span>
        </p>
        <p>
          <CheckCircleFill className="text-blue-500" />
          <span className="font-bold"> Số tiền đã thanh toán: </span>
          {checkPayment && (
            <span className="text-red-400">
              {numberWithCommas(order?.finalPrice)}₫
            </span>
          )}
          {checkPayment === false && (
            <>
              <span className="text-red-400">Chưa thanh toán</span>{" "}
            </>
          )}
        </p>
      </div>
      <div className="border-b p-4 text-2xl leading-[40px]">
        <p className="font-bold text-2xl">
          Địa chỉ và thông tin người nhận hàng
        </p>
        <ul>
          <li>
            {order?.nameReceiver} - {order?.phoneReceiver}
          </li>
          <li>Địa chỉ nhận hàng {order.addressReceiver}</li>
        </ul>
      </div>

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

