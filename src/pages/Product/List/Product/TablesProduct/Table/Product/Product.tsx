import { Link, useNavigate } from "react-router-dom";
import path from "src/constants/path";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  generateNameId,
} from "src/utils/utils";
import { Rate } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useAppDispatch } from "src/hooks/useRedux";
import { deleteProduct, getProducts } from "src/store/product/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Listproduct } from "src/types/allProductsType.interface";

interface Props {
  product: Listproduct;
  slug: string | null;
  idCategory: number | string;
}
interface IBody {
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IiOffset {
  w: number;
  h: number;
}

interface IProps {
  children: ReactNode;
  onClick?: () => void;
}

const OptionWrapper: React.FC<IProps> = ({ children }) => {
  return <div className="flex h-17 items-end py-1">{children}</div>;
};
export default function Product({ product, slug, idCategory }: Props) {
  const cRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [iOffset, setIOffset] = useState<IiOffset>({
    w: 100,
    h: 100,
  });
  const dispatch = useAppDispatch();
  const [enable, setEnable] = useState<boolean>(false);
  const hidden = () => setEnable(false);
  useEffect(() => {
    const w = cRef?.current?.offsetWidth || 100;
    const h = cRef?.current?.offsetHeight || 100;
    setIOffset({ w, h });
  }, []);
  const editOptions = [
    {
      id: 1,
      title: "Sửa",
      callback: () => {
        if (idCategory === undefined) {
          toast.error("Vui lòng chọn sản phẩm");
        } else {
          navigate(
            `${"/product/detail/update"}/${generateNameId({
              name: product.name,
              slug: product.slug,
              idCategory,
              id: product?.productId?.toString(),
            })}`,
          );

          hidden();
        }
      },
      variant: "outlined",
    },
    {
      id: 3,
      title: "Xóa",
      callback: () => {
        if (confirm("Bạn có muốn disable sản phẩm không?")) {
          const body = {
            slug,
            brandId: null,
            characteristicId: null,
            priceFrom: null,
            priceTo: null,
            specialFeatures: [],
          };
          const handleDelete = async () => {
            const res = await dispatch(
              deleteProduct(product.productId.toString()),
            );
            unwrapResult(res);
            const d = res?.payload.data;
            // if (d?.code !== 200) return toast.error(d?.message);
            await toast.success("Xóa sản phẩm thành công ");

            dispatch(
              getProducts({
                body: body,
                // params: { pageNumber: 1, pageSize: 10 },
              }),
            );
          };
          handleDelete();
          hidden();
        }
      },
      variant: "contained",
    },
  ];
  const handleMouseEnter = () => {
    setEnable(true);
  };

  const handleMouseLeave = () => {
    setEnable(false);
  };
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        to={`${"/product/detail"}/${generateNameId({
          name: product.name,
          slug: product.slug,
          idCategory,
          id: product?.productId?.toString(),
        })}`}
      >
        <div className="overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md">
          <div className="relative w-full pt-[100%]">
            <img
              src={product.lstImageUrl[0]}
              alt={product.name}
              className="absolute top-0 left-0 h-full w-full bg-white object-cover"
            />
          </div>
          <div className="overflow-hidden p-2">
            <div className="min-h-[2rem] text-2xl line-clamp-2">
              {product.name}
            </div>
            <div className="mt-3 flex items-center">
              <div className="max-w-[50%] truncate text-blue-500 line-through">
                <span className="text-xl">
                  đ{formatCurrency(product.lstProductTypeAndPrice[0]?.price)}
                </span>
              </div>
              <div className="ml-1 truncate text-orange-500">
                <span className="text-2xl">
                  đ
                  {formatCurrency(product.lstProductTypeAndPrice[0]?.salePrice)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-start">
              <Rate
                allowHalf
                defaultValue={product.star}
                style={{
                  fontSize: "15px",
                }}
              />

              <div className="ml-2 text-lg">
                <span>
                  {formatNumberToSocialStyle(product.totalReview)} Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {enable ? (
        <OptionWrapper>
          {editOptions.map((option, index) => {
            const body: IBody = {
              setEnable,
            };

            return (
              <Button
                sx={{ marginLeft: "4px" }}
                variant={
                  option?.variant != "outlined" &&
                  option?.variant != "contained"
                    ? "outlined"
                    : option?.variant
                }
                key={index}
                onClick={() => option?.callback()}
              >
                {option?.title}
              </Button>
            );
          })}
        </OptionWrapper>
      ) : null}
    </div>
  );
}

