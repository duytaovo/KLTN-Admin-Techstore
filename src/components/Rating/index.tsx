import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Rate, Skeleton } from "antd";
import { useAppSelector } from "src/hooks/useRedux";

interface DataType {
  comment: string;
  feedbackFilesUrl?: string[];
  id?: number;
  star?: number;
  userAvatar?: string;
  userId?: number;
  username?: string;
  loading?: boolean;
}

const count = 3;
const RatingFeedback: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);
  const { commentByProduct } = useAppSelector((state) => state.comment);

  useEffect(() => {
    setList(commentByProduct?.data);
    setData(commentByProduct?.data);
    setInitLoading(false);
  }, [commentByProduct]);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          comment: "",
        }))
      )
    );

    setList(commentByProduct?.data);
    setData(commentByProduct?.data);
    setLoading(false);
    window.dispatchEvent(new Event("resize"));
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Xem thêm</Button>
      </div>
    ) : null;

  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={loadMore}
      dataSource={list}
      renderItem={(item) => (
        <List.Item actions={[<Rate value={item?.star} disabled />]}>
          <Skeleton avatar title={false} loading={item?.loading} active>
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: "#f56a00" }}>
                  {item?.username?.substring(0, 1)}
                </Avatar>
              }
              title={<a href="https://ant.design">{item?.username}</a>}
              description={item?.comment}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default RatingFeedback;
