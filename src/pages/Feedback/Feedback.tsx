import { useEffect } from "react";
import { Table } from "flowbite-react";
import "./table.scss";
import clsx from "clsx";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";

import { Avatar, Button, Pagination } from "antd";
import { getComments, putComments } from "src/store/comment/commentsSlice";
import { toast } from "react-toastify";
import FeedbackDetail from "./FeedbackDetail";
import { Helmet } from "react-helmet-async";
import Skeleton from "src/components/Skeleton";

const Feedback = ({ title }: { title?: string }) => {
  const [orderDetail, setOrderDetail] = useState({ index: -1, id: null });
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.loading.loading);

  const { comment } = useAppSelector((state) => state.comment);

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const pageSize = 10; // Số phần tử trên mỗi trang

  const handleCancel = async (id: number) => {
    if (confirm("Bạn có muốn xóa bình luận không?")) {
      const res = await dispatch(putComments(id));
      if (res) {
        toast.success("Xóa thành công");
      }
      dispatch(getComments({ pageNumber: currentPage }));
    }
  };
  useEffect(() => {
    dispatch(getComments({ pageNumber: currentPage }));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    document.title = title || "";
  }, [title]);
  return (
    <div className="h-1/2">
      {loading > 0 ? (
        <Skeleton
          styles={{ height: "50vh" }}
          children={undefined}
          className={undefined}
        />
      ) : (
        <Table hoverable={true} className="bg-transparent">
          <Table.Head>
            <Table.HeadCell>Ảnh đại diện</Table.HeadCell>
            <Table.HeadCell> Tên người dùng </Table.HeadCell>
            <Table.HeadCell> Tên sản phẩm </Table.HeadCell>
            <Table.HeadCell>Đánh giá</Table.HeadCell>
            <Table.HeadCell>
              <span className="">Chỉnh sửa</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className=" ">
            {comment?.data?.data?.map((_comment: any, index) => {
              const displayDetail = index === orderDetail.index;
              return (
                <>
                  <Table.Row
                    key={_comment.id}
                    className=" dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
                  >
                    <Table.Cell className="text-blue-400 text-2xl">
                      <div className="w-10 h-10 rounded-full">
                        <Avatar style={{ backgroundColor: "#f56a00" }}>
                          {_comment.username.substring(0, 1)}
                        </Avatar>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-2xl">
                      {_comment?.username}
                    </Table.Cell>
                    <Table.Cell className="text-2xl">
                      {_comment?.productName}
                    </Table.Cell>
                    <Table.Cell className="text-blue-400 hover:text-blue-700 select-none text-2xl">
                      <Button
                        type="link"
                        className="p-0"
                        onClick={() =>
                          setOrderDetail((current) => {
                            return current.index === index
                              ? {
                                  index: -1,
                                  id: _comment.id,
                                }
                              : {
                                  index,
                                  id: _comment.id,
                                };
                          })
                        }
                      >
                        Xem chi tiết
                      </Button>
                    </Table.Cell>

                    <Table.Cell className="space-x-3">
                      <Button
                        type="link"
                        id={_comment.feedbackId}
                        onClick={() => handleCancel(_comment.feedbackId)}
                        className={clsx(
                          "bg-red-500 text-xl font-medium rounded-lg  text-white",
                        )}
                      >
                        Xóa
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                  {displayDetail && (
                    <Table.Row>
                      <Table.Cell className="" colSpan={7}>
                        <FeedbackDetail
                          order={_comment}
                          displayDetail={displayDetail}
                          setOrderDetail={setOrderDetail}
                          index={index}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )}
                </>
              );
            })}
          </Table.Body>
        </Table>
      )}
      <div className="fixed bottom-12 left-auto">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={comment?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Feedback;

