import { Link } from "react-router-dom";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  generateNameId,
  rateSale,
} from "src/utils/utils";
import { Listproduct } from "src/types/allProductsType.interface";
import styles from "./card.module.scss";
import { useState } from "react";
import { StarFill } from "react-bootstrap-icons";

interface Props {
  product: Listproduct;
  category?: string;
  docquyen?: boolean;
}

const ProductCard = ({ product, category, docquyen }: Props) => {
  const handleClickDisable = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  const [checked, setChecked] = useState(0);
  return (
    <Link
      to={`${`/${category}/detail`}/${generateNameId({
        name: product.name,
        slug: product.slug,
        idCategory: 1,
        id: product?.productId?.toString(),
      })}`}
    >
      <div className={styles.card}>
        <div className={styles.wrap}>
          <div className={styles.image}>
            <img
              src={product.lstImageUrl[0]}
              alt={product.name}
              className={styles.img}
            ></img>
            {docquyen && (
              <img
                className={styles.imgPolicy}
                src="https://cdn.tgdd.vn/ValueIcons/Label_01-05.png"
              ></img>
            )}
          </div>
          {/* {props.tag && <p className={styles.tag}>{props.tag}</p>} */}
          <p className={"text-black font-bold text-2xl"}>
            {product.name.substring(11)}
          </p>
          {/* {category === "product" || category === "tablet" ? (
            <div className={styles.cardCompare}>
              <p></p>
              {product?.lstProductTypeAndPrice.map((item, index) => (
                <span
                  key={index}
                  className={checked == index ? styles.selecttype : undefined}
                  onClick={(e) => {
                    handleClickDisable(e);
                    setChecked(index);
                  }}
                >
                  {item?.storageCapacity}
                </span>
              ))}
            </div>
          ) : (
            <div className={styles.cardCompare}>
              <span>{"RAM " + product?.lstProductTypeAndPrice[0]?.ram}</span>
              <span>
                {"SSD " + product?.lstProductTypeAndPrice[0]?.storageCapacity}
              </span>
            </div>
          )} */}
          {/* <p>{props.gift}</p> */}
          <strong className={styles.price}>
            {product?.lstProductTypeAndPrice[0]?.salePrice > 0 &&
            product?.lstProductTypeAndPrice[0]?.salePrice !==
              product?.lstProductTypeAndPrice[0]?.price ? (
              <div className="mt-3  items-center">
                <div className="max-w-[70%] truncate text-[#333333] flex items-center ">
                  <span className="text-[14px] leading-4  line-through">
                    đ{formatCurrency(product?.lstProductTypeAndPrice[0]?.price)}
                  </span>
                  <div className="ml-4 rounded-sm  py-[2px] text-lg font-semibold uppercase text-black">
                    {rateSale(
                      product?.lstProductTypeAndPrice[0]?.salePrice,
                      product?.lstProductTypeAndPrice[0]?.price,
                    )}{" "}
                    giảm
                  </div>
                </div>
                <div className=" truncate text-[#e83a45] font-bold">
                  <span className="text-2xl">
                    đ
                    {formatCurrency(
                      product?.lstProductTypeAndPrice[0]?.salePrice,
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3  items-center">
                <div className="truncate text-[#e83a45] font-bold">
                  <span className="text-2xl  ">
                    đ{formatCurrency(product?.lstProductTypeAndPrice[0]?.price)}
                  </span>
                </div>
              </div>
            )}
          </strong>
          {category === "laptop" && (
            <div className={styles.infoProduct}>
              {/* {props.parameter.map((object, index) => (
                                <p key={index}>
                                    <span>{Object.keys(object)}</span>
                                    <span>{Object.values(object)}</span>
                                </p>
                            ))} */}
            </div>
          )}
          <p>
            <span className="text-yellow-400 font-bold">
              {product.star}&ensp;
              <i>
                <StarFill />
              </i>
            </span>
            <span className="text-gray-400">
              &ensp;({product?.totalReview})
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

// const ProductCard = ({ product, category }: Props) => {
//   return (
//     <Link
//       to={`${`/${category}/detail`}/${generateNameId({
//         name: product.name,
//         id: product.id.toString(),
//       })}`}
//     >
//       <div className="overflow-hidden rounded-xl bg-white shadow transition-transform duration-100 hover:translate-y-[-0.1rem] hover:shadow-md">
//         <div className="relative w-full pt-[100%]">
//           <img
//             src={product.lstImageUrl[0]}
//             alt={product.name}
//             className="absolute top-0 left-0 h-full w-full bg-white object-cover"
//           />
//         </div>
//         <div className="overflow-hidden p-2">
//           <div className="min-h-[2rem] text-2xl line-clamp-2 text-black">
//             {product.name}
//           </div>
//           <div className="mt-3 flex items-center">
//             <div className="max-w-[50%] truncate text-blue-500 line-through">
//               <span className="text-xl">
//                 đ{formatCurrency(product.lstProductTypeAndPrice[0]?.price)}
//               </span>
//             </div>
//             <div className="ml-1 truncate text-orange-500">
//               <span className="text-2xl">
//                 đ{formatCurrency(product.lstProductTypeAndPrice[0]?.salePrice)}
//               </span>
//             </div>
//           </div>
//           <div className="mt-3 flex items-center justify-start">
//             <Rate
//               allowHalf
//               defaultValue={product.star}
//               style={{
//                 fontSize: "15px",
//               }}
//             />

//             <div className="ml-2 text-lg">
//               <span>
//                 {formatNumberToSocialStyle(product.totalReview)} Review
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

export default ProductCard;

