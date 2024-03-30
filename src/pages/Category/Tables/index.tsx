import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Button, Pagination, Space, Table, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCategorys } from "src/store/category/categorySlice";
import type { TableRowSelection } from "antd/es/table/interface";
interface DataType {
  key: React.Key;
  name: string;
  slug?: string;
  status?: any;
  action?: any;
  childCategories: DataType[];
}

const TableProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((state) => state.category);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang
  const columns = [{ title: "Tên danh mục", dataIndex: "name", key: "name" }];

  const data = [
    {
      key: 1,
      id: 1,
      name: "product",
      slug: "product",
      children: [],
      parentCategory: null,
    },
    {
      key: 2,
      id: 2,
      name: "Laptop",
      slug: "laptop",
      children: [],
      parentCategory: null,
    },
    {
      key: 3,
      id: 3,
      name: "Computer",
      slug: "computer",
      children: [],
      parentCategory: null,
    },
    {
      key: 4,
      id: 4,
      name: "Tablet",
      slug: "tablet",
      children: [],
      parentCategory: null,
    },
    {
      key: 5,
      id: 6,
      name: "Phụ kiện di động",
      slug: "product-accessories",
      children: [
        {
          id: 20,
          name: "Thiết bị sạc",
          slug: "adapter",
          children: [],
          parentCategory: null,
        },
        {
          id: 21,
          name: "Sạc dự phòng",
          slug: "backup-charger",
          children: [],
          parentCategory: null,
        },
      ],
      parentCategory: null,
    },
    {
      key: 6,
      id: 7,
      name: "Phụ kiện laptop",
      slug: "laptop-accessories",
      children: [
        {
          id: 23,
          name: "Bàn phím",
          slug: "keyboard",
          children: [],
          parentCategory: null,
        },
        {
          id: 24,
          name: "Chuột",
          slug: "mouse",
          children: [],
          parentCategory: null,
        },
      ],
      parentCategory: null,
    },
    {
      key: 7,
      id: 8,
      name: "Thiết bị âm thanh",
      slug: "sound",
      children: [
        {
          id: 22,
          name: "Tai nghe",
          slug: "earphone",
          children: [],
          parentCategory: null,
        },
        {
          id: 25,
          name: "Loa",
          slug: "loudspeaker",
          children: [],
          parentCategory: null,
        },
        {
          id: 26,
          name: "Microphone",
          slug: "microphone",
          children: [],
          parentCategory: null,
        },
      ],
      parentCategory: null,
    },
    {
      key: 9,
      id: 10,
      name: "Thiết bị mạng",
      slug: "network-equipment",
      children: [],
      parentCategory: null,
    },
    {
      key: 10,
      id: 11,
      name: "Linh kiện máy tính",
      slug: "computer-components",
      children: [
        {
          id: 12,
          name: "Ram",
          slug: "ram",
          children: [],
          parentCategory: null,
        },
        {
          id: 13,
          name: "Rom",
          slug: "rom",
          children: [],
          parentCategory: null,
        },
        {
          id: 14,
          name: "Processor",
          slug: "processor",
          children: [],
          parentCategory: null,
        },
        {
          id: 15,
          name: "Card đồ họa",
          slug: "graphics-card",
          children: [],
          parentCategory: null,
        },
        {
          id: 16,
          name: "Bộ tản nhiệt",
          slug: "radiator",
          children: [],
          parentCategory: null,
        },
        {
          id: 17,
          name: "Bộ xử lý",
          slug: "mainboard",
          children: [],
          parentCategory: null,
        },
        {
          id: 18,
          name: "Vỏ máy tính",
          slug: "computer-case",
          children: [],
          parentCategory: null,
        },
        {
          id: 19,
          name: "Nguồn máy tính",
          slug: "computer-power",
          children: [],
          parentCategory: null,
        },
        {
          id: 27,
          name: "Màn hình",
          slug: "monitor",
          children: [],
          parentCategory: null,
        },
      ],
      parentCategory: null,
    },
    {
      id: 28,
      name: "Smartwatch",
      slug: "smartwatch",
      children: [],
      parentCategory: null,
    },
  ];

  let originData: DataType[] = [];

  useEffect(() => {
    const updatedData = category?.data?.map((item: any, index: number) => ({
      key: index.toString(),
      name: item.name,
      children: item.childCategories,
    }));
    originData = updatedData;
    // for (let i = 0; i < category?.data?.length; i++) {
    //   originData.push({
    //     key: i.toString(),
    //     name: category?.data[i].name,
    //     childCategories: category?.data[i].childCategories,
    //   });
    // }
  }, [category?.data]);

  useEffect(() => {
    dispatch(getCategorys({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        Quản lý danh mục
        <Link
          to={path.categoryNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        // rowSelection={{ ...rowSelection }}
        pagination={false}
        // expandable={{
        //   indentSize: 20, // Kích thước giảm lùi của dữ liệu con
        //   defaultExpandAllRows: true, // Mở tất cả các dòng mặc định
        // }}
      />
      <div className="bottom-14 fixed">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={category?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableProduct;

