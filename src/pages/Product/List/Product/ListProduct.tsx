import { Helmet } from "react-helmet-async";
import TableProduct from "./TablesProduct";

export default function ListPhone() {
  return (
    <div>
      <Helmet>
        <title>{"Trang quản lý sản phẩm"}</title>
        <meta name="description" />
      </Helmet>
      <TableProduct />
    </div>
  );
}

