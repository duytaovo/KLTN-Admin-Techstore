import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Filter from "src/components/Filter/Filter";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";

export interface DataPropsPhone {
  id: number;
  title: string;
  detail: any[];
  img?: string[];
}

interface Props {
  handle: (boolean: boolean) => void;
  brand: any;
  characteristic: any;
}

const FilterPhone = ({ handle, brand, characteristic }: Props) => {
  interface DataPropsPhone {
    id: number;
    title: string;
    detail: string[] | { name: string; image: string }[];
  }

  const jsonString =
    '{ "brand": null, "price": ["Dưới 2 triệu", "Từ 2 - 4 triệu", "Từ 4 - 7 triệu", "Từ 7 - 13 triệu", "Từ 13 - 20 triệu", "Trên 20 triệu"], "characteristic": null }';

  const filterData = JSON.parse(jsonString);
  const data: DataPropsPhone[] = [
    {
      id: 0,
      title: "Hãng",
      detail: brand?.data?.data,
    },
    {
      id: 1,
      title: "Giá",
      detail: filterData.price,
    },

    {
      id: 3,
      title: "Nhu cầu",
      detail: characteristic?.data,
    },
  ];

  return (
    <div className="text-mainColor max-w-[1200px] m-auto">
      <Filter handle={handle} data={data} />
    </div>
  );
};

export default FilterPhone;

