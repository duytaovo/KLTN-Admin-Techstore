import { Helmet } from "react-helmet-async";
import Order from "./Order";
import { useAppSelector } from "src/hooks/useRedux";
import { Link, useNavigate } from "react-router-dom";
import path from "src/constants/path";

const EmptyOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <img
        src="https://www.thegioididong.com/lich-su-mua-hang/images/gio-hang-rong-desk.png"
        title="Tiếp tục mua sắm"
      ></img>

      <p>Bạn chưa có đơn hàng nào</p>
    </div>
  );
};

const Orders = () => {
  const { order } = useAppSelector((state) => state.orders);

  return (
    <div className="h-1/2 bg-white">
      <Helmet>
        <title>{"Trang quản lý đơn hàng "}</title>
        <meta name="description" />
      </Helmet>
      <div>{order.data.totalElements <= 0 ? <EmptyOrder /> : <Order />}</div>
    </div>
  );
};

export default Orders;

