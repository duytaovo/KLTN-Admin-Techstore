import { Helmet } from "react-helmet-async";
import TableUser from "./TablesMui";

const ListUser = () => {
  return (
    <div className="">
      <Helmet>
        <title>{"Trang quản lý người dùng "}</title>
        <meta name="description" />
      </Helmet>
      <TableUser />
    </div>
  );
};

export default ListUser;

