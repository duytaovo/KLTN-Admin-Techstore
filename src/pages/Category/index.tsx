import React from "react";
import ListCategory from "./ListCategory";
import { Helmet } from "react-helmet-async";
import Skeleton from "src/components/Skeleton";
import { useAppSelector } from "src/hooks/useRedux";

type Props = {};

const Categorys = (props: Props) => {
  const loading = useAppSelector((state) => state.loading.loading);

  return (
    <div>
      <Helmet>
        <title>{"Trang danh mục"}</title>
        <meta name="description" />
      </Helmet>
      {loading > 0 ? (
        <Skeleton
          styles={{ height: "50vh" }}
          children={undefined}
          className={undefined}
        />
      ) : (
        <ListCategory />
      )}
    </div>
  );
};

export default Categorys;

