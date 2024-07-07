import React, { useEffect, useState } from "react";

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
import UserTableRow from "../user-table-row";
import UserTableHead from "../user-table-head";
import TableEmptyRows from "../table-empty-rows";
import UserTableToolbar from "../user-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, getUsers, updateUser } from "src/store/user/userSlice";
import { useNavigate } from "react-router-dom";
import Skeleton from "src/components/Skeleton";

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const loading = useSelector((state) => state.loading.loading);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers({ pageNumber: page }));
  }, [page]);
  const users = user?.data?.data;
  console.log(users);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.phoneNumber);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, phoneNumber) => {
    const selectedIndex = selected.indexOf(phoneNumber);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, phoneNumber);
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  //console.log(users);
  const notFound = !dataFiltered?.length && !!filterName;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Người dùng</Typography>

        <Button
          onClick={() => navigate(path.usersNew)}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Thêm người dùng
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
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
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={users?.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "name", label: "Tên" },
                    { id: "phoneNumber", label: "Số điện thoại" },
                    // { id: "email", label: "Email" },
                    { id: "gender", label: "Giới tính" },
                    { id: "role", label: "Vai trò" },
                    // { id: "isVerified", label: "Verified", align: "center" },
                    { id: "status", label: "Status" },
                    { id: "" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                    ?.map((row) => (
                      <UserTableRow
                        key={row.id}
                        page={page}
                        id={row.id}
                        name={row.fullName}
                        phoneNumber={row.phoneNumber}
                        role={row.level}
                        email={row.email}
                        gender={row.gender}
                        status={row.isEnable}
                        avatarUrl={row.imageUrl}
                        isVerified={row.isVerified}
                        selected={selected.indexOf(row.phoneNumber) !== -1}
                        handleClick={(event) =>
                          handleClick(event, row.phoneNumber)
                        }
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, users?.length)}
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
          count={user?.data?.totalElements || 1}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

