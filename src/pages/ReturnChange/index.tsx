import { Helmet } from "react-helmet-async";
import Order from "./unOrder";
import { useAppSelector } from "src/hooks/useRedux";
import { Link, useNavigate } from "react-router-dom";

const EmptyOrder = () => {

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

const ReturnChange = () => {
  const { unOrder } = useAppSelector((state) => state.unOrders);

  return (
    <div className="h-1/2 bg-white">
      <Helmet>
        <title>{"Trang quản lý đơn hàng yêu cầu đổi trả "}</title>
        <meta name="description" />
      </Helmet>
      <div>{unOrder.data.totalElements <= 0 ? <EmptyOrder /> : <Order />}</div>
    </div>
  );
};

export default ReturnChange;

