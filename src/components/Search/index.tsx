import React, { ChangeEvent, memo, useState } from "react";
import { Input } from "antd";
import { createSearchParams, useNavigate } from "react-router-dom";
import path from "src/constants/path";

interface Props {
  placeholder: string;
  onChange: (value: string) => void;
  width?: string;
  loading: boolean;
  handePopup: any;
}

const Search = ({
  placeholder,
  onChange,
  width,
  loading,
  handePopup,
}: Props) => {
  const navigate = useNavigate();
  const [valueSearch, setValueSearch] = useState("");
  const getValue = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    setValueSearch(value);
    onChange && onChange(value);
  };

  const config = {
    dienthoai: "dienthoai",
    điệnthoại: "dienthoai",
    maytinhbang: "tablet",
    máytínhbảng: "tablet",
    tablet: "tablet",
    phukien: "accessory",
    phụkiện: "accessory",
    accessory: "accessory",
    dongho: "watch",
    đồnghồ: "watch",
    watch: "watch",
    laptop: "laptop",
    donghothongminh: "smartwatch",
    đồnghồthôngminh: "smartwatch",
    smartwatch: "smartwatch",
  };

  const match = (input: any, obj: any) => {
    let matched: any = Object.keys(obj).find(
      (key) => input.toLowerCase().search(key) > -1,
    );
    return obj[matched] || null;
  };

  const hanleClickSearch = (_value: string, event: any) => {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value;
    let getValue = value.replace(/\s/g, "");
    let url = match(getValue, config);
    if (url === null) {
      navigate({
        pathname: path.search,
        search: createSearchParams({
          keyword: valueSearch,
        }).toString(),
      });
    }
    if (url !== null) {
      navigate(url);
      return;
    }
    handePopup(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // onChange && onChange(valueSearch)
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const value = target.value;
      let getValue = value.replace(/\s/g, "");
      let url = match(getValue, config);
      if (url === null) {
        navigate({
          pathname: path.search,
          search: createSearchParams({
            keyword: value,
          }).toString(),
        });
      }
      if (url !== null) {
        navigate(url);
        return;
      }
      handePopup(false);
    }
  };

  return (
    <div
      style={{ width: width }}
      className="flex  content-center border items-center  rounded-sm bg-white"
    >
      {/* <IconButton>
        <SearchOutlinedIcon
          sx={{
            fontSize: "20px",
            alignItems: "center",
            marginTop: "3px",
          }}
        />
      </IconButton> */}
      <Input.Search
        className=" text-2xl  text-black placeholder:text-2xl focus:outline-none"
        placeholder={`${placeholder}...`}
        loading={loading}
        onChange={getValue}
        onKeyDown={handleKeyDown}
        onSearch={hanleClickSearch}
      />
      {/* <input
        className="mr-5 text-2xl w-[90%] text-black placeholder:text-2xl focus:outline-none"
        type="search"
        placeholder={`${placeholder}...`}
        onChange={getValue}
        onKeyDown={handleKeyDown}
      /> */}
    </div>
  );
};

export default memo(Search);

