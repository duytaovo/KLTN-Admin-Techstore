import Widget from "src/components/widget/Widget";
import Featured from "./components/Featured";
import ChartComponent from "./components/Chart";
import CustomTable from "./components/Table";
import path from "src/constants/path";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>{"Trang chủ"}</title>
        <meta name="description" />
      </Helmet>
      <div className="flex p-5 gap-5">
        <Widget type="user" path={path.users} />
        <Widget type="order" path={path.orders} />
        <Widget type="earning" path={path.home} />
        <Widget type="balance" path={path.home} />
      </div>
      <div className=" flex p-5 gap-5">
        <div className="">
          <Featured />
        </div>
        <ChartComponent title="Last 6 Months (Revenue)" />
        {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
      </div>
      <div className="shadow-[2px_4px_10px_1px_rgba(201,201,201,0.47)]">
        <div className="font-medium text-gray-500 mb-[15px]">
          Latest Transactions
        </div>
        <div className=" overflow-auto h-[180px]">
          <CustomTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
