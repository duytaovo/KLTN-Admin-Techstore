import { Helmet } from "react-helmet-async";
import Feedback from "./Feedback";

const Feedbacks = () => {
  return (
    <div className="h-1/2 bg-white">
      <Helmet>
        <title>{"Trang bình luận "}</title>
        <meta name="description" />
      </Helmet>
      <Feedback />
    </div>
  );
};

export default Feedbacks;
