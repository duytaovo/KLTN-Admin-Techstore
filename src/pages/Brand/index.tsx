import { Helmet } from "react-helmet-async";
import ListBrand from "./ListBrand";

type Props = {};

const Brands = (props: Props) => {
  return (
    <div>
      <Helmet>
        <title>{"Trang thương hiệu"}</title>
        <meta name="description" />
      </Helmet>
      <ListBrand />
    </div>
  );
};

export default Brands;
