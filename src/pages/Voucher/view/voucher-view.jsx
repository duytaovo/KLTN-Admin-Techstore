import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import path from "src/constants/path";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import TableNoData from "../table-no-data";
import VoucherTableRow from "../voucher-table-row";
import VoucherTableHead from "../voucher-table-head";
import TableEmptyRows from "../table-empty-rows";
import VoucherTableToolbar from "../voucher-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getVouchers } from "src/store/voucher/voucherSlice";
import Skeleton from "src/components/Skeleton";

// ----------------------------------------------------------------------

export default function VoucherPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voucher } = useSelector((state) => state.voucher);
  const loading = useSelector((state) => state.loading.loading);

  useEffect(() => {
    dispatch(getVouchers({ pageNumber: page }));
  }, [page]);

  const vouchers = voucher?.data;
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const dataFiltered = applyFilter({
    inputData: vouchers,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Vouchers</Typography>

        <Button
          onClick={() => navigate(path.voucherNew)}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Thêm mới
        </Button>
      </Stack>

      <Card>
        <VoucherTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            {loading > 0 ? (
              <Skeleton
                styles={{ height: "50vh" }}
                children={undefined}
                className={undefined}
              />
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <VoucherTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={vouchers?.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "name", label: "Tên" },
                    { id: "code", label: "Mã" },
                    { id: "startDate", label: "Ngày bắt đầu" },
                    { id: "endDate", label: "Ngày kết thúc" },
                    { id: "price", label: "Giá" },
                    { id: "discount", label: "Giảm giá" },
                    { id: "gift", label: "Quà" },
                    { id: "" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => (
                      <VoucherTableRow
                        key={row.id}
                        id={row.id}
                        name={row.name}
                        code={row.code}
                        startDate={row.startDate}
                        endDate={row.endDate}
                        price={row.price}
                        discount={row.discount}
                        gift={row.gift}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, voucher?.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={voucher?.data?.totalElements || 1}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

