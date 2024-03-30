import Filter from "src/components/Filter/Filter";

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

const FilterPhuKien = ({ handle, brand, characteristic }: Props) => {
  interface DataPropsPhone {
    id: number;
    title: string;
    detail: string[] | { name: string; image: string }[];
  }

  const jsonString =
    '{"ram": ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB"], "brand": null, "price": ["Dưới 2 triệu", "Từ 2 - 4 triệu", "Từ 4 - 7 triệu", "Từ 7 - 13 triệu", "Từ 13 - 20 triệu", "Trên 20 triệu"], "screen": ["OLED", "LCD", "Amoled"], "special": ["Kháng nước, kháng bụi", "Hỗ trợ 5G", "Bảo mật khuôn mặt 3D"], "charging": ["Sạc nhanh 20W", "Sạc siêu nhanh 60W", "Sạc không dây"], "characteristic": null, "productType": [{"name": "Android", "image": "https://cdn.tgdd.vn/ValueIcons/android.jpg"}, {"name": "IOS", "image": "https://cdn.tgdd.vn/ValueIcons/iphone.jpg"}], "storageCapacity": ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]}';

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

    // {
    //   id: 3,
    //   title: "Nhu cầu",
    //   detail: characteristic?.data,
    // },

    // {
    //   id: 7,
    //   title: "Tính năng đặc biệt",
    //   detail: filterData.special,
    // },
  ];

  return (
    <div className="text-black max-w-[1200px] m-auto">
      <Filter handle={handle} data={data} />
    </div>
  );
};

export default FilterPhuKien;

