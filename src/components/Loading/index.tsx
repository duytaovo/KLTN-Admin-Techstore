import { useSelector } from "react-redux";
import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { RootState } from "src/store/store";

const Loading = () => {
  const loading = useSelector((state: RootState) => state.loading.loading);
  const [progress, setProgress] = React.useState(0);

  if (loading > 0) {
    return (
      <div>
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 1000,
          }}
          color="error"
        />
      </div>
    );
  }
  return null;
};
export default Loading;
