import { CheckCircleFill } from "react-bootstrap-icons";

import "./table.scss";
import numberWithCommas from "src/utils/numberWithCommas";
import { Button, Rate } from "antd";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useEffect, useState } from "react";
// import { getProductWithSlug } from "src/store/product/productSlice";
import { useNavigate } from "react-router-dom";
import { generateNameId } from "src/utils/utils";

interface Props {
  order: any;
  displayDetail: any;
  setOrderDetail: any;
  index: number;
}
const FeedbackDetail = ({ order, index, setOrderDetail }: Props) => {
  const dispatch = useAppDispatch();
  const { productDetail } = useAppSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang
  const navigate = useNavigate();
  useEffect(() => {
    // dispatch(getProductWithSlug({ id: order.id, slug: order.slug }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  return (
    <div>
      <div className="py-8 border-b">
        <div className="flex justify-between">
          <h2 className="font-bold text-3xl">Chi tiết phản hồi: #{order.id}</h2>
        </div>
        <p className="text-2xl">Mua tại docongnghe.com</p>
      </div>
      <div className="border-b p-4 text-2xl leading-[40px]">
        <div className="flex space-x-5">
          <div className="w-28 h-20">
            <img
              className="object-contain"
              src={order?.productImage}
              alt={order?.productName}
            />
          </div>
          <div>
            <Button
              type="link"
              className="p-0"
              onClick={() =>
                navigate(
                  `${`/${order.slug}/detail`}/${generateNameId({
                    name: order.name,
                    slug: order.slug,
                    idCategory: 1,
                    id: order?.productId?.toString(),
                  })}`,
                )
              }
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
        <div className="">
          <p>
            Đánh giá: <Rate disabled defaultValue={order?.star} />
          </p>
          <p>
            <span className="">Bình luận: </span>{" "}
            <span>{numberWithCommas(order?.comment)}</span>
          </p>
        </div>
        <div className="my-0 w-24 space-y-5 justify-between items-center">
          Hình ảnh:
          {order?.feedbackFilesUrl?.map((imageUrl: string, index: number) => {
            return (
              <img
                key={index}
                src={imageUrl}
                className="h-full rounded-md w-full  object-cover"
                alt="avatar"
              />
            );
          })}
        </div>
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

export default FeedbackDetail;

