import { Pagination, Stack } from "@mui/material";
import "./styles.scss";

const PaginationCustom = ({
  totalPages,
  page,
  handleOnChange,
  variant = "outlined",
  shape,
}: any) => {
  return (
    <Stack className="pagination__wrapper" spacing={2}>
      <Pagination
        page={page}
        onChange={handleOnChange}
        count={totalPages}
        variant={variant}
        shape={shape}
      />
    </Stack>
  );
};

export default PaginationCustom;

