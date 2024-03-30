import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import path from "src/constants/path";
import React, { useEffect, useState } from "react";
import { Pagination, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { deleteUser, getUsers } from "src/store/user/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface DataType {
  key: number;
  id?: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  email: string;
  gender: string;
  address: string;
  imageUrl?: string;
  level?: number;
  levelString?: string;
}

const TableUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang
  const columns: ColumnsType<DataType> = [
    // { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Họ Tên", dataIndex: "fullName", key: "fullName" },
    { title: "Giới tính", dataIndex: "gender", key: "gender" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (params) => {
        const { key, id } = params;
        const handleDelete = async () => {
          const res = await dispatch(deleteUser(id));
          unwrapResult(res);
          const d = res?.payload;
          if (d?.code !== 200) return toast.error(d?.message);
          await toast.success("Xóa người dùng thành công ");
          await dispatch(getUsers(""));
        };
        return (
          <Space>
            <Link to={`/user/detail/${id}`}>
              {" "}
              <IconButton className="text-mainColor">
                <EditIcon
                  className="text-mainColor"
                  sx={{
                    color: "",
                  }}
                />
              </IconButton>
            </Link>
            {/* <Link to={path.users}> */}
            <Tooltip title="Thay đổi trạng thái" className="disabled:bg-white">
              <IconButton onClick={handleDelete}>
                <DeleteIcon className="text-red-700" />
              </IconButton>
            </Tooltip>
            {/* </Link> */}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getUsers({ pageNumber: currentPage }));
  }, [currentPage]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  const originData: DataType[] = [];
  for (let i = 0; i < user?.data?.data.length; i++) {
    originData.push({
      key: user?.data?.data[i].id,
      id: user?.data?.data[i].id.toString(),
      address: user?.data?.data[i].address,
      email: user?.data?.data[i].email,
      fullName: user?.data?.data[i].fullName || "",
      gender: user?.data?.data[i].gender === 1 ? "Nam" : "Nữ",
      phoneNumber: user?.data?.data[i].phoneNumber,
    });
  }

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        Quản lý người dùng
        <Link
          to={path.usersNew}
          className="no-underline text-green-500 text-lg font-medium border-[1px] border-solid border-[green] p-3 rounded cursor-pointer"
        >
          Thêm mới
        </Link>
      </div>

      <Table columns={columns} dataSource={originData} pagination={false} />
      <div className="bottom-14 fixed">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={user?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableUser;

