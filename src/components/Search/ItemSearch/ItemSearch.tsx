import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import numberWithCommas from "src/utils/numberWithCommas";
import { formatCurrency, generateNameId, rateSale } from "src/utils/utils";
// import { changeIconPlay, setAutoPlay, setSongId } from "src/store/slices/audio";

interface PropsSong {}
const ItemSearch = ({ item, handePopup }: any) => {
  const hande = () => {
    handePopup(false);
  };
  return (
    <div>
      {item && (
        <Link
          onClick={hande}
          className="flex items-center justify-between gap-5 p-3"
          to={`${`/${item.slug}/detail`}/${generateNameId({
            name: item.name,
            id: item.id.toString(),
          })}`}
        >
          <div className="w-[55px] h-[55px] rounded-lg">
            <img src={item.lstImageUrl[0]}></img>
          </div>

          <div className="flex flex-col w-full">
            <div className="text-[13px] font-semibold align-middle text-black">
              {item.name}
            </div>
            <div className="flex gap-3 items-end">
              {item && (
                <div className="text-[14px] text-red-400">
                  đ{formatCurrency(item?.lstProductTypeAndPrice[0]?.salePrice)}
                </div>
              )}
              {item && (
                <span className="line-through text-[12px] ">
                  ₫{formatCurrency(item?.lstProductTypeAndPrice[0]?.price)}
                </span>
              )}
              {item && (
                <div className="ml-4 rounded-sm bg-orange-300 px-1 py-[2px] text-lg font-semibold uppercase text-black">
                  {rateSale(
                    item?.lstProductTypeAndPrice[0]?.salePrice,
                    item?.lstProductTypeAndPrice[0]?.price,
                  )}{" "}
                  giảm
                </div>
              )}
            </div>
            <div className="text-[11px] text-gray-500">Quà 100.000đ</div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default ItemSearch;

