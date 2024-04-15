import { sentenceCase } from "change-case";
// material
import { useTheme } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
// utils
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CardHeader } from "@mui/material";
import Scrollbar from "../scrollbar";
import Label from "../label";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
//
// import { getFullAllProducts } from "../../redux/slices/productSlice";
// import * as api from "../../api";

// ----------------------------------------------------------------------

interface Product {
  productId: number;
  productCode: string;
  name: string;
  imageUrl: string;
  totalOrder: number;
}

export interface DataEntry {
  yearMonth: string;
  product: Product[];
}

interface Props {
  dataBestSeller: DataEntry[]; // Đảm bảo rằng props nhận được có đúng kiểu dữ liệu
}
export default function StatisticBestSeller({ dataBestSeller }: Props) {
  const [valueYear, setValueYear] = useState("2024");
  const [valueMonth, setValueMonth] = useState("1");
  const dispatch = useDispatch();
  const productsList: [] = [];
  //
  // const { listFull: productsList } = useSelector((state) => state.product);
  const theme = useTheme();
  const [listProductBestSeller, setListProductBestSeller] = useState([]);

  useEffect(() => {
    // dispatch(getFullAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const getData = async () => {};
  }, []);
  const handleChangeYear = (event: any) => {
    setValueYear(event.target.value);
  };
  const handleChangeMonth = (event: any) => {
    setValueMonth(event.target.value);
  };
  console.log(valueYear + valueMonth);

  const filteredData = dataBestSeller.filter((entry) =>
    entry.yearMonth.startsWith(valueYear + "0" + valueMonth),
  );
  console.log(filteredData);
  return (
    <Card sx={{ pb: 3 }}>
      <CardHeader title={"Sản phẩm bán chạy"} sx={{ mb: 3 }}></CardHeader>
      <div className="flex flex-row space-x-3 m-4">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={valueYear}
          label="Năm"
          // defaultValue={2024}
          onChange={handleChangeYear}
        >
          <MenuItem value={2026}>2026</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2021}>2021</MenuItem>
          <MenuItem value={2020}>2020</MenuItem>
        </Select>
        <Select
          className="h-1/4 overflow-auto"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={valueMonth}
          label="Tháng"
          // defaultValue={2024}
          onChange={handleChangeMonth}
        >
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={9}>09</MenuItem>
          <MenuItem value={8}>08</MenuItem>
          <MenuItem value={7}>07</MenuItem>
          <MenuItem value={6}>06</MenuItem>
          <MenuItem value={5}>05</MenuItem>
          <MenuItem value={4}>04</MenuItem>
          <MenuItem value={3}>03</MenuItem>
          <MenuItem value={2}>02</MenuItem>
          <MenuItem value={1}>01</MenuItem>
        </Select>
      </div>
      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Tổng số đặt hàng</TableCell>
                <TableCell align="right">Top</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        alt={row.product[index]?.name}
                        src={row.product[index]?.imageUrl}
                      />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">
                          {row.product[index]?.name}
                        </Typography>
                        {/* Đảm bảo rằng bạn hiển thị thông tin phù hợp ở đây */}
                        {/* Ví dụ: row.product[index]?.description */}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.product[index]?.totalOrder}</TableCell>
                  <TableCell align="right">
                    <Label
                      // variant={
                      //   theme.palette.mode === "light" ? "ghost" : "filled"
                      // }
                      color={row.product[index]?.totalOrder && "primary"}
                    >
                      {row.product[index]?.totalOrder}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

