import React from "react";
import ListUser from "./ListUser";
import { Helmet } from "react-helmet-async";

type Props = {};

const Users = () => {
  return (
    <div className="">
      <Helmet>
        <title>{"Trang quản lý người dùng "}</title>
        <meta name="description" />
      </Helmet>
      <ListUser />
    </div>
  );
};

export default Users;
